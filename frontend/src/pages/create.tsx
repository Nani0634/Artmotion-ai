import { useState } from "react";
import { generateArtwork } from "../services/api";
import "./create.css";

type ArtStyle =
  | "Digital Art"
  | "3D Render"
  | "Anime"
  | "Fantasy"
  | "Cinematic"
  | "Watercolor";

type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3";

const styles: ArtStyle[] = [
  "Digital Art",
  "3D Render",
  "Anime",
  "Fantasy",
  "Cinematic",
  "Watercolor",
];

const ratios: AspectRatio[] = [
  "1:1",
  "16:9",
  "9:16",
  "4:3",
];

export default function Create() {
  const [prompt, setPrompt] = useState(
    "A futuristic city floating above the clouds"
  );

  const [style, setStyle] =
    useState<ArtStyle>("Digital Art");

  const [ratio, setRatio] =
    useState<AspectRatio>("1:1");

  const [isGenerating, setIsGenerating] =
    useState(false);

  const [image, setImage] =
    useState<string | null>(null);

  const [error, setError] =
    useState("");

  const [projectName, setProjectName] =
    useState("My AI Artwork");

  async function handleGenerate() {
    if (!prompt.trim() || isGenerating) {
      return;
    }

    setIsGenerating(true);
    setError("");
    setImage(null);

    try {
      console.log("Sending artwork request...");

      const response = await generateArtwork({
        prompt: prompt.trim(),
        style,
        aspect_ratio: ratio,
      });

      console.log("Artwork response:", response);

      if (!response.success || !response.image) {
        throw new Error(
          "The AI did not return an image."
        );
      }

      setImage(response.image);

      /*
       * Keep the latest generated artwork locally
       * so it can be reused by the Projects page.
       */
      localStorage.setItem(
        "artmotion-current-artwork",
        JSON.stringify({
          image: response.image,
          prompt: response.prompt,
          style: response.style,
          aspect_ratio: response.aspect_ratio,
          name: projectName.trim() || "My AI Artwork",
          created_at: new Date().toISOString(),
        })
      );
    } catch (err) {
      console.error(
        "Artwork generation failed:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Artwork generation failed."
      );
    } finally {
      setIsGenerating(false);
    }
  }

  function handleClear() {
    setPrompt("");
    setImage(null);
    setError("");

    localStorage.removeItem(
      "artmotion-current-artwork"
    );
  }

  function downloadArtwork() {
    if (!image) {
      return;
    }

    const link =
      document.createElement("a");

    link.href = image;
    link.download =
      `${projectName.trim() || "artmotion-artwork"}.jpg`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function openProjects() {
    window.location.hash = "projects";
  }

  function openTutorials() {
    window.location.hash = "tutorials";
  }

  function getStyleIcon(
    currentStyle: ArtStyle
  ) {
    switch (currentStyle) {
      case "Digital Art":
        return "◈";

      case "3D Render":
        return "◇";

      case "Anime":
        return "✧";

      case "Fantasy":
        return "♢";

      case "Cinematic":
        return "◉";

      case "Watercolor":
        return "◌";

      default:
        return "✦";
    }
  }

  return (
    <main className="create-page">
      {/* HEADER */}

      <header className="create-header">
        <div>
          <span className="create-eyebrow">
            AI CREATIVE STUDIO
          </span>

          <h1>Create Something Amazing</h1>

          <p>
            Turn your imagination into beautiful
            AI artwork.
          </p>
        </div>

        <div className="create-header-actions">
          <button
            type="button"
            className="create-top-button"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
      </header>

      {/* WORKSPACE */}

      <section className="create-workspace">
        {/* LEFT */}

        <div className="create-controls">
          <div className="create-panel-heading">
            <div>
              <span className="create-section-number">
                01
              </span>

              <div>
                <h2>
                  Describe your artwork
                </h2>

                <p>
                  Tell ArtMotion AI what you
                  want to create.
                </p>
              </div>
            </div>
          </div>

          {/* PROMPT */}

          <div className="create-field">
            <div className="create-field-label-row">
              <label htmlFor="art-prompt">
                Your prompt
              </label>

              <span>
                {prompt.length}/500
              </span>
            </div>

            <textarea
              id="art-prompt"
              value={prompt}
              maxLength={500}
              onChange={(event) =>
                setPrompt(event.target.value)
              }
              placeholder="Describe the artwork you want to create..."
            />

            <div className="create-prompt-hint">
              <span>✨</span>

              <span>
                Be descriptive for better
                results.
              </span>
            </div>
          </div>

          {/* PROJECT NAME */}

          <div className="create-field">
            <div className="create-field-label-row">
              <label htmlFor="project-name">
                Project name
              </label>

              <span>
                Optional
              </span>
            </div>

            <input
              id="project-name"
              type="text"
              value={projectName}
              maxLength={80}
              onChange={(event) =>
                setProjectName(
                  event.target.value
                )
              }
              placeholder="My AI Artwork"
            />
          </div>

          {/* STYLE */}

          <div className="create-field">
            <div className="create-field-label-row">
              <label>
                Art style
              </label>

              <span>
                Choose one
              </span>
            </div>

            <div className="style-grid">
              {styles.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`style-option ${
                    style === item
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setStyle(item)
                  }
                >
                  <span className="style-option-icon">
                    {getStyleIcon(item)}
                  </span>

                  <span>
                    {item}
                  </span>

                  {style === item && (
                    <span className="style-check">
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* RATIO */}

          <div className="create-field">
            <div className="create-field-label-row">
              <label>
                Aspect ratio
              </label>

              <span>
                Canvas size
              </span>
            </div>

            <div className="ratio-grid">
              {ratios.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`ratio-option ${
                    ratio === item
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setRatio(item)
                  }
                >
                  <span
                    className={`ratio-icon ratio-${item.replace(
                      ":",
                      "-"
                    )}`}
                  />

                  <span>
                    {item}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ERROR */}

          {error && (
            <div className="create-error">
              <span>⚠️</span>

              <div>
                <strong>
                  Generation failed
                </strong>

                <p>{error}</p>
              </div>
            </div>
          )}

          {/* GENERATE */}

          <div className="create-actions">
            <button
              type="button"
              className="create-generate-button"
              onClick={handleGenerate}
              disabled={
                !prompt.trim() ||
                isGenerating
              }
            >
              {isGenerating ? (
                <>
                  <span className="generate-spinner" />

                  Generating artwork...
                </>
              ) : (
                <>
                  <span>✦</span>

                  Generate Artwork
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT PREVIEW */}

        <div className="create-preview">
          <div className="create-preview-header">
            <div>
              <span className="create-preview-eyebrow">
                AI PREVIEW
              </span>

              <h2>
                {image
                  ? "Your artwork"
                  : "Artwork preview"}
              </h2>
            </div>

            {image && (
              <div className="preview-status">
                <span />
                Generated
              </div>
            )}
          </div>

          {/* REAL IMAGE AREA */}

          <div
            className={`preview-canvas ${
              image
                ? "preview-has-image"
                : ""
            } ratio-preview-${ratio.replace(
              ":",
              "-"
            )}`}
          >
            {isGenerating ? (
              <div className="generation-state">
                <div className="generation-spinner-large">
                  <span />
                  <span />
                  <span />
                </div>

                <h3>
                  Creating your artwork...
                </h3>

                <p>
                  ArtMotion AI is turning
                  your idea into a real image.
                </p>

                <div className="generation-progress">
                  <span />
                </div>
              </div>
            ) : image ? (
              <div className="real-artwork">
                <img
                  src={image}
                  alt={
                    projectName ||
                    "Generated artwork"
                  }
                />

                <div className="artwork-overlay">
                  <button
                    type="button"
                    onClick={
                      downloadArtwork
                    }
                  >
                    ↓ Download
                  </button>
                </div>
              </div>
            ) : (
              <div className="empty-preview">
                <div className="empty-preview-icon">
                  🎨
                </div>

                <h3>
                  Your artwork will appear here
                </h3>

                <p>
                  Enter your idea and click
                  Generate Artwork.
                </p>

                <div className="preview-meta">
                  <span>{style}</span>

                  <span>•</span>

                  <span>{ratio}</span>
                </div>
              </div>
            )}
          </div>

          {/* PREVIEW FOOTER */}

          <div className="create-preview-footer">
            <div className="preview-info">
              <span>STYLE</span>

              <strong>
                {style}
              </strong>
            </div>

            <div className="preview-info">
              <span>RATIO</span>

              <strong>
                {ratio}
              </strong>
            </div>

            {image && (
              <div className="preview-footer-actions">
                <button
                  type="button"
                  onClick={
                    downloadArtwork
                  }
                >
                  ↓ Download
                </button>

                <button
                  type="button"
                  onClick={
                    openProjects
                  }
                >
                  🖼 My Projects
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* AFTER GENERATION */}

      {image && (
        <section className="generated-success">
          <div>
            <span className="success-icon">
              ✓
            </span>

            <div>
              <strong>
                Artwork generated successfully
              </strong>

              <p>
                Your artwork is ready to
                download or view in My Projects.
              </p>
            </div>
          </div>

          <div className="success-actions">
            <button
              type="button"
              onClick={
                downloadArtwork
              }
            >
              ↓ Download Image
            </button>

            <button
              type="button"
              onClick={
                openProjects
              }
            >
              🖼 Open My Projects
            </button>

            <button
              type="button"
              onClick={
                openTutorials
              }
            >
              📚 Tutorials
            </button>
          </div>
        </section>
      )}

      {/* PROMPT TIP */}

      <section className="create-tips">
        <div className="create-tip-icon">
          💡
        </div>

        <div>
          <strong>
            Prompt tip
          </strong>

          <p>
            Describe the subject, environment,
            lighting, mood and visual style.
            For example: “A futuristic city
            at night, glowing neon buildings,
            cinematic lighting, detailed
            atmosphere.”
          </p>
        </div>
      </section>
    </main>
  );
}