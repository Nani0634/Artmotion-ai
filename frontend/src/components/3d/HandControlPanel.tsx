import { useEffect, useState } from "react";

import { handControl } from "./handControl";

type HandControlPanelProps = {
  enabled: boolean;
  tracking: boolean;
  loading: boolean;
  error: string;
  onStart: () => void;
  onStop: () => void;
};

const SETTINGS_KEY =
  "artmotion-hand-settings";

type HandSettings = {
  sensitivity: number;
  smoothing: number;
  pinchZoom: boolean;
  followX: boolean;
  followY: boolean;
};

const defaultSettings: HandSettings = {
  sensitivity: 1,
  smoothing: 0.055,
  pinchZoom: true,
  followX: true,
  followY: true,
};

export default function HandControlPanel({
  enabled,
  tracking,
  loading,
  error,
  onStart,
  onStop,
}: HandControlPanelProps) {
  const [open, setOpen] = useState(true);

  const [settings, setSettings] =
    useState<HandSettings>(
      defaultSettings
    );

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(
          SETTINGS_KEY
        );

      if (!saved) {
        return;
      }

      const parsed =
        JSON.parse(saved);

      const nextSettings = {
        ...defaultSettings,
        ...parsed,
      };

      setSettings(nextSettings);

      applySettings(nextSettings);
    } catch (err) {
      console.warn(
        "Unable to load hand settings:",
        err
      );
    }
  }, []);

  function applySettings(
    nextSettings: HandSettings
  ) {
    handControl.sensitivity =
      nextSettings.sensitivity;

    handControl.smoothing =
      nextSettings.smoothing;

    handControl.pinchZoom =
      nextSettings.pinchZoom;

    handControl.followX =
      nextSettings.followX;

    handControl.followY =
      nextSettings.followY;
  }

  function updateSetting<
    K extends keyof HandSettings
  >(
    key: K,
    value: HandSettings[K]
  ) {
    const nextSettings = {
      ...settings,
      [key]: value,
    };

    setSettings(nextSettings);

    applySettings(nextSettings);

    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify(nextSettings)
    );
  }

  function resetSettings() {
    setSettings(defaultSettings);

    applySettings(defaultSettings);

    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify(defaultSettings)
    );
  }

  return (
    <div
      className={`hand-settings ${
        open
          ? "hand-settings-open"
          : "hand-settings-closed"
      }`}
    >
      {/* Header */}

      <div className="hand-settings-header">
        <div className="hand-settings-title">
          <div className="hand-settings-icon">
            🖐
          </div>

          <div>
            <strong>
              Hand Control
            </strong>

            <span>
              Camera interaction
            </span>
          </div>
        </div>

        <button
          type="button"
          className="hand-settings-toggle"
          onClick={() =>
            setOpen((value) => !value)
          }
          aria-label={
            open
              ? "Collapse hand control settings"
              : "Expand hand control settings"
          }
        >
          {open ? "−" : "+"}
        </button>
      </div>

      {open && (
        <div className="hand-settings-body">

          {/* Status */}

          <div className="hand-settings-status">

            <div className="hand-status-row">
              <span
                className={`hand-status-dot ${
                  tracking
                    ? "active"
                    : ""
                }`}
              />

              <span>
                {tracking
                  ? "Hand detected"
                  : enabled
                    ? "Show your hand"
                    : "Camera disabled"}
              </span>
            </div>

            {enabled && (
              <span className="hand-status-live">
                LIVE
              </span>
            )}

          </div>

          {/* Enable */}

          {!enabled ? (
            <button
              type="button"
              className="hand-main-button"
              onClick={onStart}
              disabled={loading}
            >
              {loading
                ? "Starting camera..."
                : "🖐 Enable Hand Control"}
            </button>
          ) : (
            <button
              type="button"
              className="hand-main-button hand-main-button-stop"
              onClick={onStop}
            >
              🛑 Disable Hand Control
            </button>
          )}

          {/* Settings */}

          <div className="hand-settings-section">

            <div className="hand-section-title">
              Camera movement
            </div>

            {/* Sensitivity */}

            <div className="hand-setting">

              <div className="hand-setting-label">
                <span>
                  Sensitivity
                </span>

                <span>
                  {settings.sensitivity.toFixed(
                    1
                  )}
                </span>
              </div>

              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={
                  settings.sensitivity
                }
                onChange={(event) =>
                  updateSetting(
                    "sensitivity",
                    Number(
                      event.target.value
                    )
                  )
                }
              />

            </div>

            {/* Smoothing */}

            <div className="hand-setting">

              <div className="hand-setting-label">
                <span>
                  Smoothing
                </span>

                <span>
                  {Math.round(
                    settings.smoothing *
                      1000
                  )}
                </span>
              </div>

              <input
                type="range"
                min="0.02"
                max="0.12"
                step="0.005"
                value={
                  settings.smoothing
                }
                onChange={(event) =>
                  updateSetting(
                    "smoothing",
                    Number(
                      event.target.value
                    )
                  )
                }
              />

            </div>

          </div>

          {/* Tracking options */}

          <div className="hand-settings-section">

            <div className="hand-section-title">
              Tracking options
            </div>

            <label className="hand-toggle-row">

              <span>
                Follow horizontal movement
              </span>

              <input
                type="checkbox"
                checked={
                  settings.followX
                }
                onChange={(event) =>
                  updateSetting(
                    "followX",
                    event.target.checked
                  )
                }
              />

              <span className="hand-switch" />

            </label>

            <label className="hand-toggle-row">

              <span>
                Follow vertical movement
              </span>

              <input
                type="checkbox"
                checked={
                  settings.followY
                }
                onChange={(event) =>
                  updateSetting(
                    "followY",
                    event.target.checked
                  )
                }
              />

              <span className="hand-switch" />

            </label>

            <label className="hand-toggle-row">

              <span>
                Pinch to zoom
              </span>

              <input
                type="checkbox"
                checked={
                  settings.pinchZoom
                }
                onChange={(event) =>
                  updateSetting(
                    "pinchZoom",
                    event.target.checked
                  )
                }
              />

              <span className="hand-switch" />

            </label>

          </div>

          {/* Instructions */}

          <div className="hand-gesture-guide">

            <div className="hand-section-title">
              Gestures
            </div>

            <div className="hand-gesture">
              <span>↔️</span>
              <div>
                <strong>
                  Move hand
                </strong>
                <small>
                  Move the 3D camera
                </small>
              </div>
            </div>

            <div className="hand-gesture">
              <span>🤏</span>
              <div>
                <strong>
                  Pinch
                </strong>
                <small>
                  Zoom the camera
                </small>
              </div>
            </div>

            <div className="hand-gesture">
              <span>🖐</span>
              <div>
                <strong>
                  Open hand
                </strong>
                <small>
                  Return to normal zoom
                </small>
              </div>
            </div>

          </div>

          {/* Reset */}

          <button
            type="button"
            className="hand-reset-button"
            onClick={resetSettings}
          >
            Reset settings
          </button>

          {/* Error */}

          {error && (
            <div className="hand-control-error">
              {error}
            </div>
          )}

        </div>
      )}
    </div>
  );
}