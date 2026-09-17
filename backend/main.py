import base64
import io
import os
import uuid
from datetime import datetime, timezone
from typing import Optional

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from huggingface_hub import InferenceClient
from PIL import Image
from pydantic import BaseModel, Field


# ============================================================
# LOAD ENVIRONMENT VARIABLES
# ============================================================

load_dotenv()


HF_TOKEN = os.getenv("HF_TOKEN")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")
SUPABASE_BUCKET = os.getenv("SUPABASE_BUCKET", "artworks")


# ============================================================
# APP
# ============================================================

app = FastAPI(
    title="ArtMotion AI",
    description="AI artwork generation backend",
    version="1.0.0",
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        # Local development
        "http://localhost:5173",
        "http://127.0.0.1:5173",

        # Production frontend
        "https://artmotion-ai.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# HUGGING FACE CLIENT
# ============================================================

if HF_TOKEN:
    hf_client = InferenceClient(
        provider="hf-inference",
        api_key=HF_TOKEN,
    )
else:
    hf_client = None


# ============================================================
# MODELS
# ============================================================


class GenerateArtRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=2000)
    style: str = "Digital Art"
    aspect_ratio: str = "1:1"
    project_name: Optional[str] = "My AI Artwork"


class RenameProjectRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)


# ============================================================
# HELPERS
# ============================================================


def require_huggingface():
    if not HF_TOKEN or not hf_client:
        raise HTTPException(
            status_code=500,
            detail="Hugging Face API is not configured on the backend.",
        )


def require_supabase():
    if not SUPABASE_URL or not SUPABASE_SECRET_KEY:
        raise HTTPException(
            status_code=500,
            detail="Supabase is not configured on the backend.",
        )


def get_supabase_headers() -> dict:
    require_supabase()

    return {
        "apikey": SUPABASE_SECRET_KEY,
        "Authorization": f"Bearer {SUPABASE_SECRET_KEY}",
        "Content-Type": "application/json",
    }


def get_image_dimensions(aspect_ratio: str) -> tuple[int, int]:
    """
    Convert the selected aspect ratio into dimensions.

    FLUX generation dimensions are kept reasonably sized
    so the free Hugging Face inference endpoint is practical.
    """

    ratio_map = {
        "1:1": (768, 768),
        "16:9": (1024, 576),
        "9:16": (576, 1024),
        "4:3": (896, 672),
    }

    return ratio_map.get(aspect_ratio, (768, 768))


def build_prompt(prompt: str, style: str) -> str:
    """
    Create the final image-generation prompt.
    """

    return (
        f"{prompt}. "
        f"Art style: {style}. "
        "High quality digital artwork, detailed composition, "
        "professional lighting, visually appealing, sharp details."
    )


def image_to_jpeg_bytes(image: Image.Image) -> bytes:
    """
    Convert generated image into JPEG bytes.
    """

    if image.mode not in ("RGB", "L"):
        image = image.convert("RGB")

    output = io.BytesIO()

    image.save(
        output,
        format="JPEG",
        quality=95,
        optimize=True,
    )

    return output.getvalue()


def upload_to_supabase(
    image_bytes: bytes,
    filename: str,
) -> str:
    """
    Upload artwork to Supabase Storage and return
    its public URL.
    """

    require_supabase()

    upload_url = (
        f"{SUPABASE_URL}/storage/v1/object/"
        f"{SUPABASE_BUCKET}/{filename}"
    )

    headers = {
        "apikey": SUPABASE_SECRET_KEY,
        "Authorization": f"Bearer {SUPABASE_SECRET_KEY}",
        "Content-Type": "image/jpeg",
        "x-upsert": "false",
    }

    try:
        response = httpx.post(
            upload_url,
            headers=headers,
            content=image_bytes,
            timeout=120.0,
        )
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Supabase storage connection failed: {exc}",
        ) from exc

    if response.status_code >= 400:
        try:
            error_data = response.json()
        except Exception:
            error_data = response.text

        raise HTTPException(
            status_code=500,
            detail=f"Supabase storage upload failed: {error_data}",
        )

    public_url = (
        f"{SUPABASE_URL}/storage/v1/object/public/"
        f"{SUPABASE_BUCKET}/{filename}"
    )

    return public_url


def create_project(
    name: str,
    filename: str,
    image_url: str,
    prompt: str,
    style: str,
    aspect_ratio: str,
) -> dict:
    """
    Save project metadata into Supabase.
    """

    require_supabase()

    project = {
        "name": name,
        "filename": filename,
        "image_url": image_url,
        "prompt": prompt,
        "style": style,
        "aspect_ratio": aspect_ratio,
    }

    url = f"{SUPABASE_URL}/rest/v1/projects"

    headers = get_supabase_headers()
    headers["Prefer"] = "return=representation"

    try:
        response = httpx.post(
            url,
            headers=headers,
            json=project,
            timeout=30.0,
        )
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Supabase database connection failed: {exc}",
        ) from exc

    if response.status_code >= 400:
        try:
            error_data = response.json()
        except Exception:
            error_data = response.text

        raise HTTPException(
            status_code=500,
            detail=f"Failed to save project: {error_data}",
        )

    data = response.json()

    if isinstance(data, list) and data:
        return data[0]

    return project


def delete_supabase_file(filename: str):
    """
    Delete artwork from Supabase Storage.
    """

    require_supabase()

    url = (
        f"{SUPABASE_URL}/storage/v1/object/"
        f"{SUPABASE_BUCKET}/{filename}"
    )

    headers = {
        "apikey": SUPABASE_SECRET_KEY,
        "Authorization": f"Bearer {SUPABASE_SECRET_KEY}",
        "Content-Type": "application/json",
    }

    try:
        response = httpx.delete(
            url,
            headers=headers,
            timeout=30.0,
        )
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Supabase storage connection failed: {exc}",
        ) from exc

    if response.status_code >= 400:
        try:
            error_data = response.json()
        except Exception:
            error_data = response.text

        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete artwork: {error_data}",
        )


# ============================================================
# ROOT
# ============================================================


@app.get("/")
def root():
    return {
        "message": "Welcome to ArtMotion AI!",
        "status": "backend is running",
    }


# ============================================================
# HEALTH
# ============================================================


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "ArtMotion AI backend",
        "huggingface_configured": bool(HF_TOKEN),
        "supabase_configured": bool(
            SUPABASE_URL and SUPABASE_SECRET_KEY
        ),
    }


# ============================================================
# GENERATE ART
# ============================================================


@app.post("/generate-art")
def generate_art(request: GenerateArtRequest):
    """
    Generate artwork using Hugging Face FLUX.1-schnell,
    upload it to Supabase Storage, and save project metadata.
    """

    require_huggingface()
    require_supabase()

    prompt = request.prompt.strip()

    if not prompt:
        raise HTTPException(
            status_code=400,
            detail="Prompt cannot be empty.",
        )

    width, height = get_image_dimensions(
        request.aspect_ratio
    )

    final_prompt = build_prompt(
        prompt,
        request.style,
    )

    # --------------------------------------------------------
    # GENERATE IMAGE
    # --------------------------------------------------------

    try:
        image = hf_client.text_to_image(
            prompt=final_prompt,
            model="black-forest-labs/FLUX.1-schnell",
            width=width,
            height=height,
        )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"AI image generation failed: {exc}",
        ) from exc

    if not isinstance(image, Image.Image):
        raise HTTPException(
            status_code=500,
            detail="Hugging Face returned an invalid image.",
        )

    # --------------------------------------------------------
    # CONVERT IMAGE
    # --------------------------------------------------------

    try:
        image_bytes = image_to_jpeg_bytes(image)
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process generated image: {exc}",
        ) from exc

    # --------------------------------------------------------
    # CREATE UNIQUE FILENAME
    # --------------------------------------------------------

    filename = f"{uuid.uuid4().hex}.jpg"

    # --------------------------------------------------------
    # UPLOAD TO SUPABASE STORAGE
    # --------------------------------------------------------

    image_url = upload_to_supabase(
        image_bytes=image_bytes,
        filename=filename,
    )

    # --------------------------------------------------------
    # SAVE PROJECT
    # --------------------------------------------------------

    project_name = (
        request.project_name.strip()
        if request.project_name
        else "My AI Artwork"
    )

    if not project_name:
        project_name = "My AI Artwork"

    project = create_project(
        name=project_name,
        filename=filename,
        image_url=image_url,
        prompt=prompt,
        style=request.style,
        aspect_ratio=request.aspect_ratio,
    )

    # --------------------------------------------------------
    # BASE64 IMAGE FOR FRONTEND
    # --------------------------------------------------------

    encoded_image = base64.b64encode(
        image_bytes
    ).decode("utf-8")

    return {
        "success": True,
        "image": encoded_image,
        "image_url": image_url,
        "prompt": prompt,
        "style": request.style,
        "aspect_ratio": request.aspect_ratio,
        "project": project,
    }


# ============================================================
# GET PROJECTS
# ============================================================


@app.get("/projects")
def get_projects():
    """
    Return all saved projects.
    """

    require_supabase()

    url = f"{SUPABASE_URL}/rest/v1/projects"

    params = {
        "select": "*",
        "order": "created_at.desc",
    }

    headers = get_supabase_headers()

    try:
        response = httpx.get(
            url,
            headers=headers,
            params=params,
            timeout=30.0,
        )
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Supabase connection failed: {exc}",
        ) from exc

    if response.status_code >= 400:
        try:
            error_data = response.json()
        except Exception:
            error_data = response.text

        raise HTTPException(
            status_code=500,
            detail=f"Failed to load projects: {error_data}",
        )

    projects = response.json()

    return {
        "success": True,
        "projects": projects,
    }


# ============================================================
# RENAME PROJECT
# ============================================================


@app.put("/projects/{filename}")
def rename_project(
    filename: str,
    request: RenameProjectRequest,
):
    """
    Rename a saved project.
    """

    require_supabase()

    new_name = request.name.strip()

    if not new_name:
        raise HTTPException(
            status_code=400,
            detail="Project name cannot be empty.",
        )

    url = f"{SUPABASE_URL}/rest/v1/projects"

    params = {
        "filename": f"eq.{filename}",
    }

    body = {
        "name": new_name,
    }

    headers = get_supabase_headers()
    headers["Prefer"] = "return=representation"

    try:
        response = httpx.patch(
            url,
            headers=headers,
            params=params,
            json=body,
            timeout=30.0,
        )
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Supabase connection failed: {exc}",
        ) from exc

    if response.status_code >= 400:
        try:
            error_data = response.json()
        except Exception:
            error_data = response.text

        raise HTTPException(
            status_code=500,
            detail=f"Failed to rename project: {error_data}",
        )

    data = response.json()

    if not data:
        raise HTTPException(
            status_code=404,
            detail="Project not found.",
        )

    return {
        "success": True,
        "project": data[0],
    }


# ============================================================
# DELETE PROJECT
# ============================================================


@app.delete("/projects/{filename}")
def delete_project(filename: str):
    """
    Delete project metadata and its artwork
    from Supabase Storage.
    """

    require_supabase()

    # --------------------------------------------------------
    # Delete database record
    # --------------------------------------------------------

    url = f"{SUPABASE_URL}/rest/v1/projects"

    params = {
        "filename": f"eq.{filename}",
    }

    headers = get_supabase_headers()

    try:
        response = httpx.delete(
            url,
            headers=headers,
            params=params,
            timeout=30.0,
        )
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Supabase connection failed: {exc}",
        ) from exc

    if response.status_code >= 400:
        try:
            error_data = response.json()
        except Exception:
            error_data = response.text

        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete project: {error_data}",
        )

    # --------------------------------------------------------
    # Delete image from Storage
    # --------------------------------------------------------

    try:
        delete_supabase_file(filename)
    except HTTPException:
        # Database record is already deleted.
        # Return success rather than making the UI fail because
        # of a storage cleanup issue.
        pass

    return {
        "success": True,
        "message": "Project deleted successfully.",
    }


# ============================================================
# ANALYZE ARTWORK
# ============================================================


@app.post("/analyze-artwork")
def analyze_artwork():
    """
    Placeholder endpoint for future artwork analysis.

    The current MVP does not require this endpoint for
    artwork generation.
    """

    return {
        "success": True,
        "message": "Artwork analysis endpoint is available.",
    }


# ============================================================
# RUN DIRECTLY
# ============================================================

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
    )