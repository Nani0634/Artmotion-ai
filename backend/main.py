import os
import io
import base64
import uuid
from urllib.parse import quote

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from huggingface_hub import InferenceClient


# ============================================================
# ENVIRONMENT
# ============================================================

load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")

# Backward compatibility if you still use the old key name.
if not SUPABASE_SECRET_KEY:
    SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

SUPABASE_BUCKET = os.getenv(
    "SUPABASE_BUCKET",
    "artworks",
)


# ============================================================
# VALIDATION
# ============================================================

if not HF_TOKEN:
    print("WARNING: HF_TOKEN is not configured.")

if not SUPABASE_URL:
    print("WARNING: SUPABASE_URL is not configured.")

if not SUPABASE_SECRET_KEY:
    print("WARNING: SUPABASE_SECRET_KEY is not configured.")


# ============================================================
# HUGGING FACE CLIENT
# ============================================================

hf_client = (
    InferenceClient(
        provider="auto",
        api_key=HF_TOKEN,
    )
    if HF_TOKEN
    else None
)


# ============================================================
# FASTAPI
# ============================================================

app = FastAPI(
    title="ArtMotion AI",
    version="1.0.0",
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# REQUEST MODELS
# ============================================================

class GenerateArtRequest(BaseModel):
    prompt: str
    style: str = "Digital Art"
    aspect_ratio: str = "1:1"
    project_name: str | None = None


class CreateProjectRequest(BaseModel):
    name: str
    image_url: str
    prompt: str | None = None
    style: str | None = None
    aspect_ratio: str | None = None


class RenameProjectRequest(BaseModel):
    name: str


# ============================================================
# HELPERS
# ============================================================

def check_supabase():
    if not SUPABASE_URL:
        raise HTTPException(
            status_code=500,
            detail="SUPABASE_URL is not configured in backend/.env",
        )

    if not SUPABASE_SECRET_KEY:
        raise HTTPException(
            status_code=500,
            detail=(
                "SUPABASE_SECRET_KEY is not configured "
                "in backend/.env"
            ),
        )


def supabase_headers():
    check_supabase()

    return {
        "apikey": SUPABASE_SECRET_KEY,
        "Authorization": f"Bearer {SUPABASE_SECRET_KEY}",
    }


def generate_project_name(prompt: str) -> str:
    """
    Creates a simple project name from the prompt.
    """

    cleaned = " ".join(prompt.strip().split())

    if not cleaned:
        return "Untitled Artwork"

    words = cleaned.split()

    name = " ".join(words[:5])

    if len(words) > 5:
        name += "..."

    return name


def get_public_image_url(filename: str) -> str:
    return (
        f"{SUPABASE_URL}/storage/v1/object/public/"
        f"{SUPABASE_BUCKET}/{quote(filename)}"
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
def health_check():
    return {
        "status": "healthy",
        "supabase_configured": bool(
            SUPABASE_URL and SUPABASE_SECRET_KEY
        ),
        "huggingface_configured": bool(HF_TOKEN),
    }


# ============================================================
# GENERATE ART
# ============================================================

@app.post("/generate-art")
def generate_art(request: GenerateArtRequest):

    if not hf_client:
        raise HTTPException(
            status_code=500,
            detail="HF_TOKEN is not configured in backend/.env",
        )

    check_supabase()

    if not request.prompt.strip():
        raise HTTPException(
            status_code=400,
            detail="Prompt cannot be empty.",
        )

    # --------------------------------------------------------
    # IMAGE SIZE
    # --------------------------------------------------------

    aspect_sizes = {
        "1:1": (1024, 1024),
        "16:9": (1152, 648),
        "9:16": (648, 1152),
        "4:3": (1024, 768),
    }

    width, height = aspect_sizes.get(
        request.aspect_ratio,
        (1024, 1024),
    )

    # --------------------------------------------------------
    # PROMPT
    # --------------------------------------------------------

    final_prompt = f"""
Create a high-quality artwork based on this description:

{request.prompt}

Art style:
{request.style}

Requirements:

- Professional artistic composition
- Strong lighting
- Beautiful colors
- High visual detail
- Cinematic quality where appropriate
- Clean composition
- Visually impressive
- No unnecessary text
- No watermark

Aspect ratio:
{request.aspect_ratio}
"""

    # --------------------------------------------------------
    # GENERATE IMAGE
    # --------------------------------------------------------

    try:

        print()
        print("=" * 60)
        print("GENERATING ARTWORK")
        print("=" * 60)
        print("Model: black-forest-labs/FLUX.1-schnell")
        print("Style:", request.style)
        print("Aspect ratio:", request.aspect_ratio)
        print("Prompt:", request.prompt)

        image = hf_client.text_to_image(
            prompt=final_prompt,
            model="black-forest-labs/FLUX.1-schnell",
            width=width,
            height=height,
        )

        if image is None:
            raise HTTPException(
                status_code=500,
                detail="Hugging Face did not return an image.",
            )

        # ----------------------------------------------------
        # CONVERT IMAGE TO JPEG
        # ----------------------------------------------------

        image_buffer = io.BytesIO()

        image.convert("RGB").save(
            image_buffer,
            format="JPEG",
            quality=92,
        )

        image_bytes = image_buffer.getvalue()

        # ----------------------------------------------------
        # CREATE UNIQUE FILE NAME
        # ----------------------------------------------------

        filename = (
            f"art_{uuid.uuid4().hex}.jpg"
        )

        print("Storage filename:", filename)

        # ----------------------------------------------------
        # UPLOAD TO SUPABASE STORAGE
        # ----------------------------------------------------

        storage_url = (
            f"{SUPABASE_URL}/storage/v1/object/"
            f"{SUPABASE_BUCKET}/{quote(filename)}"
        )

        storage_headers = {
            **supabase_headers(),
            "Content-Type": "image/jpeg",
            "x-upsert": "false",
        }

        print("Uploading image to Supabase...")

        with httpx.Client(timeout=120.0) as http_client:

            storage_response = http_client.post(
                storage_url,
                headers=storage_headers,
                content=image_bytes,
            )

        if storage_response.status_code not in (200, 201):

            print(
                "Supabase Storage error:",
                storage_response.text,
            )

            raise HTTPException(
                status_code=500,
                detail=(
                    "Failed to upload image to Supabase Storage: "
                    f"{storage_response.text}"
                ),
            )

        print("Image uploaded successfully.")

        # ----------------------------------------------------
        # PUBLIC IMAGE URL
        # ----------------------------------------------------

        image_url = get_public_image_url(
            filename
        )

        # ----------------------------------------------------
        # PROJECT NAME
        # ----------------------------------------------------

        project_name = (
            request.project_name.strip()
            if request.project_name
            and request.project_name.strip()
            else generate_project_name(
                request.prompt
            )
        )

        # ----------------------------------------------------
        # SAVE PROJECT TO SUPABASE DATABASE
        # ----------------------------------------------------

        project_data = {
            "name": project_name,
            "filename": filename,
            "image_url": image_url,
            "prompt": request.prompt,
            "style": request.style,
            "aspect_ratio": request.aspect_ratio,
        }

        database_url = (
            f"{SUPABASE_URL}/rest/v1/projects"
        )

        database_headers = {
            **supabase_headers(),
            "Content-Type": "application/json",
            "Prefer": "return=representation",
        }

        print("Saving project to Supabase database...")

        with httpx.Client(timeout=30.0) as http_client:

            database_response = http_client.post(
                database_url,
                headers=database_headers,
                json=project_data,
            )

        if database_response.status_code not in (
            200,
            201,
        ):

            print(
                "Supabase database error:",
                database_response.text,
            )

            # Try to remove uploaded image if DB save fails.
            try:

                with httpx.Client(timeout=30.0) as http_client:

                    http_client.delete(
                        storage_url,
                        headers=supabase_headers(),
                    )

            except Exception:
                pass

            raise HTTPException(
                status_code=500,
                detail=(
                    "Image uploaded, but project could not "
                    "be saved to Supabase database: "
                    f"{database_response.text}"
                ),
            )

        saved_project = database_response.json()

        print("Project saved successfully.")

        # ----------------------------------------------------
        # BASE64 FOR IMMEDIATE FRONTEND DISPLAY
        # ----------------------------------------------------

        image_base64 = base64.b64encode(
            image_bytes
        ).decode("utf-8")

        print("=" * 60)
        print("GENERATION COMPLETE")
        print("=" * 60)
        print()

        return {
            "success": True,

            "image": (
                "data:image/jpeg;base64,"
                f"{image_base64}"
            ),

            "image_url": image_url,

            "prompt": request.prompt,

            "style": request.style,

            "aspect_ratio": request.aspect_ratio,

            "project": (
                saved_project[0]
                if isinstance(saved_project, list)
                and saved_project
                else project_data
            ),
        }

    except HTTPException:
        raise

    except Exception as error:

        print()
        print("Hugging Face image generation error:")
        print(error)

        raise HTTPException(
            status_code=500,
            detail=f"Image generation failed: {str(error)}",
        )


# ============================================================
# CREATE PROJECT
# ============================================================

@app.post("/projects")
def create_project(
    request: CreateProjectRequest,
):

    check_supabase()

    if not request.name.strip():
        raise HTTPException(
            status_code=400,
            detail="Project name cannot be empty.",
        )

    if not request.image_url.strip():
        raise HTTPException(
            status_code=400,
            detail="Image URL cannot be empty.",
        )

    project_data = {
        "name": request.name.strip(),
        "filename": (
            request.image_url.rstrip("/")
            .split("/")
            [-1]
        ),
        "image_url": request.image_url,
        "prompt": request.prompt,
        "style": request.style,
        "aspect_ratio": request.aspect_ratio,
    }

    url = (
        f"{SUPABASE_URL}/rest/v1/projects"
    )

    headers = {
        **supabase_headers(),
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }

    try:

        with httpx.Client(timeout=30.0) as client:

            response = client.post(
                url,
                headers=headers,
                json=project_data,
            )

        if response.status_code not in (
            200,
            201,
        ):

            raise HTTPException(
                status_code=500,
                detail=(
                    "Failed to create project: "
                    f"{response.text}"
                ),
            )

        data = response.json()

        return {
            "success": True,
            "project": (
                data[0]
                if isinstance(data, list)
                and data
                else data
            ),
        }

    except HTTPException:
        raise

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Project creation failed: {error}",
        )


# ============================================================
# GET ALL PROJECTS
# ============================================================

@app.get("/projects")
def get_projects():

    check_supabase()

    url = (
        f"{SUPABASE_URL}/rest/v1/projects"
    )

    params = {
        "select": "*",
        "order": "created_at.desc",
    }

    try:

        with httpx.Client(timeout=30.0) as client:

            response = client.get(
                url,
                headers=supabase_headers(),
                params=params,
            )

        if response.status_code != 200:

            raise HTTPException(
                status_code=500,
                detail=(
                    "Failed to load projects: "
                    f"{response.text}"
                ),
            )

        projects = response.json()

        return {
            "success": True,
            "projects": projects,
        }

    except HTTPException:
        raise

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to load projects: {error}",
        )


# ============================================================
# RENAME PROJECT
# ============================================================

@app.put("/projects/{filename}")
def rename_project(
    filename: str,
    request: RenameProjectRequest,
):

    check_supabase()

    if not request.name.strip():
        raise HTTPException(
            status_code=400,
            detail="Project name cannot be empty.",
        )

    encoded_filename = quote(
        filename,
        safe="",
    )

    url = (
        f"{SUPABASE_URL}/rest/v1/projects"
    )

    params = {
        "filename": f"eq.{filename}",
    }

    update_data = {
        "name": request.name.strip(),
    }

    headers = {
        **supabase_headers(),
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }

    try:

        with httpx.Client(timeout=30.0) as client:

            response = client.patch(
                url,
                headers=headers,
                params=params,
                json=update_data,
            )

        if response.status_code != 200:

            raise HTTPException(
                status_code=500,
                detail=(
                    "Failed to rename project: "
                    f"{response.text}"
                ),
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

    except HTTPException:
        raise

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Project rename failed: {error}",
        )


# ============================================================
# DELETE PROJECT
# ============================================================

@app.delete("/projects/{filename}")
def delete_project(
    filename: str,
):

    check_supabase()

    url = (
        f"{SUPABASE_URL}/rest/v1/projects"
    )

    params = {
        "filename": f"eq.{filename}",
    }

    try:

        # ----------------------------------------------------
        # FIRST GET PROJECT
        # ----------------------------------------------------

        with httpx.Client(timeout=30.0) as client:

            get_response = client.get(
                url,
                headers=supabase_headers(),
                params=params,
            )

        if get_response.status_code != 200:

            raise HTTPException(
                status_code=500,
                detail=(
                    "Failed to find project: "
                    f"{get_response.text}"
                ),
            )

        projects = get_response.json()

        if not projects:

            raise HTTPException(
                status_code=404,
                detail="Project not found.",
            )

        project = projects[0]

        # ----------------------------------------------------
        # DELETE IMAGE FROM STORAGE
        # ----------------------------------------------------

        storage_url = (
            f"{SUPABASE_URL}/storage/v1/object/"
            f"{SUPABASE_BUCKET}/{quote(filename)}"
        )

        print(
            "Deleting image from Supabase Storage:",
            filename,
        )

        with httpx.Client(timeout=30.0) as client:

            storage_response = client.delete(
                storage_url,
                headers=supabase_headers(),
            )

        if storage_response.status_code not in (
            200,
            204,
        ):

            print(
                "Storage deletion warning:",
                storage_response.text,
            )

        # ----------------------------------------------------
        # DELETE DATABASE RECORD
        # ----------------------------------------------------

        print(
            "Deleting project from database:",
            filename,
        )

        with httpx.Client(timeout=30.0) as client:

            database_response = client.delete(
                url,
                headers=supabase_headers(),
                params=params,
            )

        if database_response.status_code not in (
            200,
            204,
        ):

            raise HTTPException(
                status_code=500,
                detail=(
                    "Image was deleted from Storage, "
                    "but database deletion failed: "
                    f"{database_response.text}"
                ),
            )

        print("Project deleted successfully.")

        return {
            "success": True,
            "message": "Project deleted successfully.",
            "filename": filename,
        }

    except HTTPException:
        raise

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Project deletion failed: {error}",
        )