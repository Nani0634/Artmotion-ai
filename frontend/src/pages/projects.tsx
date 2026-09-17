import { useEffect, useState } from "react";
import {
  deleteProject,
  getProjects,
  renameProject,
  type SavedProject,
} from "../services/api";

import "./projects.css";

export default function Projects() {
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedProject, setSelectedProject] =
    useState<SavedProject | null>(null);

  const [renamingProject, setRenamingProject] =
    useState<SavedProject | null>(null);

  const [newName, setNewName] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);

  const [deletingFilename, setDeletingFilename] =
    useState<string | null>(null);

  // ============================================================
  // LOAD PROJECTS
  // ============================================================

  async function loadProjects() {
    try {
      setLoading(true);
      setError("");

      const data = await getProjects();

      setProjects(data);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load projects.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  // ============================================================
  // RENAME
  // ============================================================

  function openRename(project: SavedProject) {
    setRenamingProject(project);
    setNewName(project.name);
  }

  function closeRename() {
    if (isRenaming) return;

    setRenamingProject(null);
    setNewName("");
  }

  async function handleRename() {
    if (!renamingProject) return;

    const trimmedName = newName.trim();

    if (!trimmedName) {
      alert("Please enter a project name.");
      return;
    }

    try {
      setIsRenaming(true);

      const updatedProject = await renameProject(
        renamingProject.filename,
        trimmedName,
      );

      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          project.filename === updatedProject.filename
            ? updatedProject
            : project,
        ),
      );

      if (
        selectedProject?.filename ===
        updatedProject.filename
      ) {
        setSelectedProject(updatedProject);
      }

      setRenamingProject(null);
      setNewName("");
    } catch (err) {
      console.error(err);

      alert(
        err instanceof Error
          ? err.message
          : "Failed to rename project.",
      );
    } finally {
      setIsRenaming(false);
    }
  }

  // ============================================================
  // DELETE
  // ============================================================

  async function handleDelete(
    project: SavedProject,
  ) {
    const confirmed = window.confirm(
      `Delete "${project.name}"?\n\nThis will permanently delete the artwork from Supabase.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingFilename(project.filename);

      await deleteProject(project.filename);

      setProjects((currentProjects) =>
        currentProjects.filter(
          (item) =>
            item.filename !== project.filename,
        ),
      );

      if (
        selectedProject?.filename ===
        project.filename
      ) {
        setSelectedProject(null);
      }
    } catch (err) {
      console.error(err);

      alert(
        err instanceof Error
          ? err.message
          : "Failed to delete project.",
      );
    } finally {
      setDeletingFilename(null);
    }
  }

  // ============================================================
  // DOWNLOAD
  // ============================================================

  async function handleDownload(
    project: SavedProject,
  ) {
    try {
      const response = await fetch(
        project.image_url,
      );

      if (!response.ok) {
        throw new Error(
          "Unable to download artwork.",
        );
      }

      const blob = await response.blob();

      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = blobUrl;
      link.download =
        `${project.name || "artwork"}.jpg`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error(err);

      // Fallback: open image directly.
      window.open(
        project.image_url,
        "_blank",
      );
    }
  }

  // ============================================================
  // FORMAT DATE
  // ============================================================

  function formatDate(
    dateString: string,
  ) {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleDateString(
      undefined,
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      },
    );
  }

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <section className="projects-page">
        <div className="projects-container">
          <div className="projects-header">
            <div>
              <p className="projects-eyebrow">
                ARTWORK LIBRARY
              </p>

              <h1>My Projects</h1>

              <p>
                Your generated artwork,
                saved in the cloud.
              </p>
            </div>
          </div>

          <div className="projects-loading">
            <div className="loading-spinner" />

            <p>
              Loading your projects...
            </p>
          </div>
        </div>
      </section>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <section className="projects-page">
        <div className="projects-container">
          <div className="projects-header">
            <div>
              <p className="projects-eyebrow">
                ARTWORK LIBRARY
              </p>

              <h1>My Projects</h1>

              <p>
                Your generated artwork,
                saved in the cloud.
              </p>
            </div>
          </div>

          <div className="projects-error">
            <div className="error-icon">
              !
            </div>

            <h2>
              Could not load projects
            </h2>

            <p>{error}</p>

            <button
              className="primary-button"
              onClick={loadProjects}
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ============================================================
  // EMPTY STATE
  // ============================================================

  if (projects.length === 0) {
    return (
      <section className="projects-page">
        <div className="projects-container">
          <div className="projects-header">
            <div>
              <p className="projects-eyebrow">
                ARTWORK LIBRARY
              </p>

              <h1>My Projects</h1>

              <p>
                Your generated artwork,
                saved in the cloud.
              </p>
            </div>
          </div>

          <div className="projects-empty">
            <div className="empty-icon">
              ✦
            </div>

            <h2>
              No projects yet
            </h2>

            <p>
              Generate your first artwork
              and it will appear here.
            </p>

            <a
              href="/#create"
              className="primary-button"
            >
              Create Artwork
            </a>
          </div>
        </div>
      </section>
    );
  }

  // ============================================================
  // PROJECT GALLERY
  // ============================================================

  return (
    <section className="projects-page">
      <div className="projects-container">

        {/* HEADER */}
        <header className="projects-header">

          <div>
            <p className="projects-eyebrow">
              ARTWORK LIBRARY
            </p>

            <h1>My Projects</h1>

            <p>
              Your generated artwork,
              saved securely in the cloud.
            </p>
          </div>

          <div className="projects-count">
            <span>
              {projects.length}
            </span>

            <small>
              {projects.length === 1
                ? "Project"
                : "Projects"}
            </small>
          </div>

        </header>

        {/* GALLERY */}
        <div className="projects-grid">

          {projects.map((project) => (

            <article
              className="project-card"
              key={project.id}
            >

              {/* IMAGE */}
              <button
                className="project-image-button"
                onClick={() =>
                  setSelectedProject(project)
                }
                aria-label={`Open ${project.name}`}
              >

                <img
                  src={project.image_url}
                  alt={project.name}
                  className="project-image"
                  loading="lazy"
                />

                <div className="project-image-overlay">
                  <span>
                    View Fullscreen
                  </span>
                </div>

              </button>

              {/* INFO */}
              <div className="project-info">

                <div className="project-title-row">

                  <div>
                    <h2>
                      {project.name}
                    </h2>

                    <p className="project-date">
                      {formatDate(
                        project.created_at,
                      )}
                    </p>
                  </div>

                </div>

                {project.style && (
                  <span className="project-style">
                    {project.style}
                  </span>
                )}

                {/* ACTIONS */}
                <div className="project-actions">

                  <button
                    className="project-action-button"
                    onClick={() =>
                      setSelectedProject(
                        project,
                      )
                    }
                  >
                    View
                  </button>

                  <button
                    className="project-action-button"
                    onClick={() =>
                      openRename(project)
                    }
                  >
                    Rename
                  </button>

                  <button
                    className="project-action-button"
                    onClick={() =>
                      handleDownload(project)
                    }
                  >
                    Download
                  </button>

                  <button
                    className="project-action-button danger"
                    disabled={
                      deletingFilename ===
                      project.filename
                    }
                    onClick={() =>
                      handleDelete(project)
                    }
                  >
                    {deletingFilename ===
                    project.filename
                      ? "Deleting..."
                      : "Delete"}
                  </button>

                </div>

              </div>

            </article>

          ))}

        </div>

      </div>

      {/* ========================================================
          FULLSCREEN PREVIEW
      ======================================================== */}

      {selectedProject && (

        <div
          className="fullscreen-modal"
          onClick={() =>
            setSelectedProject(null)
          }
        >

          <div
            className="fullscreen-content"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              className="modal-close"
              onClick={() =>
                setSelectedProject(null)
              }
              aria-label="Close preview"
            >
              ×
            </button>

            <img
              src={selectedProject.image_url}
              alt={selectedProject.name}
              className="fullscreen-image"
            />

            <div className="fullscreen-info">

              <div>
                <h2>
                  {selectedProject.name}
                </h2>

                {selectedProject.prompt && (
                  <p>
                    {selectedProject.prompt}
                  </p>
                )}
              </div>

              <div className="fullscreen-actions">

                <button
                  className="primary-button"
                  onClick={() =>
                    handleDownload(
                      selectedProject,
                    )
                  }
                >
                  Download
                </button>

                <button
                  className="secondary-button"
                  onClick={() => {
                    setSelectedProject(null);
                    openRename(
                      selectedProject,
                    );
                  }}
                >
                  Rename
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* ========================================================
          RENAME MODAL
      ======================================================== */}

      {renamingProject && (

        <div
          className="rename-modal"
          onClick={closeRename}
        >

          <div
            className="rename-modal-content"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <h2>
              Rename Project
            </h2>

            <p>
              Choose a new name for your
              artwork.
            </p>

            <input
              type="text"
              value={newName}
              onChange={(event) =>
                setNewName(
                  event.target.value,
                )
              }
              onKeyDown={(event) => {
                if (
                  event.key === "Enter"
                ) {
                  handleRename();
                }

                if (
                  event.key === "Escape"
                ) {
                  closeRename();
                }
              }}
              autoFocus
              disabled={isRenaming}
              placeholder="Project name"
            />

            <div className="rename-actions">

              <button
                className="secondary-button"
                onClick={closeRename}
                disabled={isRenaming}
              >
                Cancel
              </button>

              <button
                className="primary-button"
                onClick={handleRename}
                disabled={isRenaming}
              >
                {isRenaming
                  ? "Saving..."
                  : "Save Name"}
              </button>

            </div>

          </div>

        </div>

      )}

    </section>
  );
}