import { useState } from "react";
import {
  generateArtwork,
  type GenerateArtResponse,
} from "../../services/api";

import "./GenerateArt.css";

type ArtStyle =
  | "Digital Art"
  | "Realistic"
  | "3D Render"
  | "Anime"
  | "Fantasy"
  | "Cinematic"
  | "Watercolor";

type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3";

const styles: ArtStyle[] = [
  "Digital Art",
  "Realistic",
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

export default function GenerateArt() {
  const [prompt, setPrompt] = useState(
    "A futuristic city floating above the clouds at sunset"
  );

  const [style, setStyle] =
    useState<ArtStyle>("Realistic");

  const [ratio, setRatio] =
    useState<AspectRatio>("16:9");

  const [isGenerating, setIsGenerating] =
    useState(false);

  const [artwork, setArtwork] =
    useState<GenerateArtResponse | null>(null);

  const [error, setError] = useState("");

  async function handleGenerate() {
    const cleanPrompt = prompt.trim();

    if (!cleanPrompt) {
      setError(
        "Please describe the artwork you want to create."
      );
      return;
    }

    if (isGenerating) {
      return;
    }

    setIsGenerating(true);
    setError("");
    setArtwork(null);

    try {
      console.log("Starting AI artwork generation...");

      const result = await generateArtwork({
        prompt: cleanPrompt,
        style,
        aspect_ratio: ratio,
      });

      console.log(
        "AI artwork generated successfully."
      );

      if (!result.image) {
        throw new Error(
          "The AI returned no image."
        );
      }

      setArtwork(result);

      localStorage.setItem(
        "artmotion-current-artwork",
        JSON.stringify({
          image: result.image,
          prompt: result.prompt,
          style: result.style,
          aspect_ratio: result.aspect_ratio,
          createdAt: new Date().toISOString(),
        })
      );
    } catch (err) {
      console.error(
        "Artwork generation error:",
        err
      );

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Something went wrong while generating the artwork."
        );
      }
    } finally {
      setIsGenerating(false);
    }
  }

  function handleClear() {
    setPrompt("");
    setArtwork(null);
    setError("");
  }

  return (
    <div className="generate-art-container">

      {/* HEADER */}

      <div className="generate-art-header">

        <div>
          <span className="generate-art-eyebrow">
            AI CREATIVE STUDIO
          </span>

          <h2>
            Create Something Amazing
          </h2>

          <p>
            Turn your imagination into beautiful
            AI artwork.
          </p>
        </div>

        <button
          type="button"
          className="generate-clear-button"
          onClick={handleClear}
        >
          Clear
        </button>

      </div>


      {/* MAIN WORKSPACE */}

      <div className="generate-art-workspace">

        {/* LEFT */}

        <div className="generate-art-controls">

          <div className="generate-field">

            <label htmlFor="generate-prompt">
              Describe your artwork
            </label>

            <textarea
              id="generate-prompt"
              value={prompt}
              maxLength={500}
              onChange={(event) =>
                setPrompt(event.target.value)
              }
              placeholder="Describe the image you want to create..."
            />

            <div className="generate-prompt-info">
              <span>
                Be descriptive for better results.
              </span>

              <span>
                {prompt.length}/500
              </span>
            </div>

          </div>


          {/* ART STYLE */}

          <div className="generate-field">

            <label>
              Art style
            </label>

            <div className="generate-style-grid">

              {styles.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={
                    style === item
                      ? "generate-style-option active"
                      : "generate-style-option"
                  }
                  onClick={() =>
                    setStyle(item)
                  }
                >

                  <span className="style-icon">
                    {getStyleIcon(item)}
                  </span>

                  <span>
                    {item}
                  </span>

                </button>
              ))}

            </div>

          </div>


          {/* ASPECT RATIO */}

          <div className="generate-field">

            <label>
              Aspect ratio
            </label>

            <div className="generate-ratio-grid">

              {ratios.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={
                    ratio === item
                      ? "generate-ratio-option active"
                      : "generate-ratio-option"
                  }
                  onClick={() =>
                    setRatio(item)
                  }
                >
                  {item}
                </button>
              ))}

            </div>

          </div>


          {/* GENERATE */}

          <button
            type="button"
            className="generate-main-button"
            onClick={handleGenerate}
            disabled={
              isGenerating ||
              !prompt.trim()
            }
          >

            {isGenerating ? (
              <>
                <span className="generate-spinner" />
                Generating Artwork...
              </>
            ) : (
              <>
                ✨ Generate Artwork
              </>
            )}

          </button>


          {/* ERROR */}

          {error && (
            <div className="generate-error">

              <strong>
                Generation failed
              </strong>

              <p>
                {error}
              </p>

            </div>
          )}

        </div>


        {/* RIGHT */}

        <div className="generate-art-preview">

          <div className="generate-preview-header">

            <div>
              <span>
                AI PREVIEW
              </span>

              <h3>
                {artwork
                  ? "Your artwork"
                  : "Preview"}
              </h3>
            </div>

            {artwork && (
              <span className="generate-preview-success">
                ● Generated
              </span>
            )}

          </div>


          {/* ACTUAL IMAGE AREA */}

          <div
            className={
              artwork
                ? "generate-preview-canvas has-artwork"
                : "generate-preview-canvas"
            }
          >

            {isGenerating ? (

              <div className="generate-loading">

                <div className="large-generate-spinner" />

                <h3>
                  Creating your artwork...
                </h3>

                <p>
                  ArtMotion AI is generating your image.
                </p>

              </div>

            ) : artwork ? (

              <img
                src={artwork.image}
                alt={artwork.prompt}
                className="real-generated-image"
              />

            ) : (

              <div className="generate-empty">

                <div className="generate-empty-icon">
                  🎨
                </div>

                <h3>
                  Your artwork will appear here
                </h3>

                <p>
                  Enter a prompt and click
                  Generate Artwork.
                </p>

              </div>

            )}

          </div>


          {/* FOOTER */}

          {artwork && (
            <div className="generate-preview-footer">

              <div>
                <span>
                  STYLE
                </span>

                <strong>
                  {artwork.style}
                </strong>
              </div>

              <div>
                <span>
                  RATIO
                </span>

                <strong>
                  {artwork.aspect_ratio}
                </strong>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}


function getStyleIcon(
  style: ArtStyle
) {
  switch (style) {

    case "Digital Art":
      return "◈";

    case "Realistic":
      return "◉";

    case "3D Render":
      return "◇";

    case "Anime":
      return "✧";

    case "Fantasy":
      return "♢";

    case "Cinematic":
      return "◎";

    case "Watercolor":
      return "◌";

    default:
      return "✦";
  }
}