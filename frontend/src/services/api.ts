// ============================================================
// API CONFIGURATION
// ============================================================
//
// Development:
//   http://127.0.0.1:8000
//
// Production:
//   Set VITE_API_URL in your hosting environment.
//
// Example:
//   VITE_API_URL=https://your-artmotion-backend.onrender.com
//

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000"
).replace(/\/$/, "");

// ============================================================
// TYPES
// ============================================================

export type GenerateArtPayload = {
  prompt: string;
  style: string;
  aspect_ratio: string;
  project_name?: string;
};

export type SavedProject = {
  id: string;
  name: string;
  filename: string;
  image_url: string;
  prompt: string | null;
  style: string | null;
  aspect_ratio: string | null;
  created_at: string;
};

export type GenerateArtResponse = {
  success: boolean;
  image: string;
  image_url: string;
  prompt: string;
  style: string;
  aspect_ratio: string;
  project: SavedProject;
};

// ============================================================
// HELPER
// ============================================================

async function getErrorMessage(
  response: Response,
  fallback: string,
): Promise<string> {
  try {
    const data = await response.json();

    if (typeof data?.detail === "string") {
      return data.detail;
    }

    if (typeof data?.message === "string") {
      return data.message;
    }
  } catch {
    // Ignore invalid/non-JSON error responses.
  }

  return fallback;
}

// ============================================================
// BACKEND HEALTH
// ============================================================

export async function checkBackend() {
  const response = await fetch(`${API_URL}/health`);

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Backend request failed",
      ),
    );
  }

  return response.json();
}

// ============================================================
// GENERATE ARTWORK
// ============================================================

export async function generateArtwork(
  payload: GenerateArtPayload,
): Promise<GenerateArtResponse> {
  const response = await fetch(
    `${API_URL}/generate-art`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Artwork generation failed",
      ),
    );
  }

  return response.json();
}

// ============================================================
// GET PROJECTS
// ============================================================

export async function getProjects(): Promise<SavedProject[]> {
  const response = await fetch(
    `${API_URL}/projects`,
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Failed to load projects",
      ),
    );
  }

  const data = await response.json();

  return data.projects || [];
}

// ============================================================
// RENAME PROJECT
// ============================================================

export async function renameProject(
  filename: string,
  name: string,
): Promise<SavedProject> {
  const response = await fetch(
    `${API_URL}/projects/${encodeURIComponent(filename)}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Failed to rename project",
      ),
    );
  }

  const data = await response.json();

  return data.project;
}

// ============================================================
// DELETE PROJECT
// ============================================================

export async function deleteProject(
  filename: string,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/projects/${encodeURIComponent(filename)}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Failed to delete project",
      ),
    );
  }
}