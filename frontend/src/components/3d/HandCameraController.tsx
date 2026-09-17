import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  FilesetResolver,
  HandLandmarker,
  type HandLandmarkerResult,
} from "@mediapipe/tasks-vision";

import {
  updateHandPosition,
  setHandControlEnabled,
  setHandDetected,
} from "./handControl";


const WASM_PATH =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm";

const MODEL_PATH =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";


export default function HandCameraController() {
  const videoRef =
    useRef<HTMLVideoElement>(null);

  const landmarkerRef =
    useRef<HandLandmarker | null>(null);

  const streamRef =
    useRef<MediaStream | null>(null);

  const animationFrameRef =
    useRef<number | null>(null);

  const runningRef =
    useRef(false);

  const lastDetectionTimeRef =
    useRef(0);


  const [enabled, setEnabled] =
    useState(false);

  const [tracking, setTracking] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  // ==========================================================
  // CREATE HAND LANDMARKER
  // ==========================================================

  async function createHandLandmarker() {
    if (
      landmarkerRef.current
    ) {
      return landmarkerRef.current;
    }


    const vision =
      await FilesetResolver.forVisionTasks(
        WASM_PATH
      );


    const landmarker =
      await HandLandmarker.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath:
              MODEL_PATH,

            delegate: "GPU",
          },

          runningMode:
            "VIDEO",

          numHands: 1,

          minHandDetectionConfidence:
            0.5,

          minHandPresenceConfidence:
            0.5,

          minTrackingConfidence:
            0.5,
        }
      );


    landmarkerRef.current =
      landmarker;


    return landmarker;
  }


  // ==========================================================
  // START TRACKING
  // ==========================================================

  async function startTracking() {
    try {
      setError("");
      setLoading(true);


      if (
        !navigator.mediaDevices?.getUserMedia
      ) {
        throw new Error(
          "Your browser does not support webcam access."
        );
      }


      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            video: {
              width: {
                ideal: 640,
              },

              height: {
                ideal: 480,
              },

              facingMode:
                "user",
            },

            audio: false,
          }
        );


      streamRef.current =
        stream;


      const video =
        videoRef.current;


      if (!video) {
        throw new Error(
          "Webcam video element is unavailable."
        );
      }


      video.srcObject =
        stream;


      await video.play();


      await createHandLandmarker();


      runningRef.current =
        true;


      setEnabled(true);


      setHandControlEnabled(
        true
      );


      startDetection();

    } catch (err) {
      console.error(
        "Hand tracking failed:",
        err
      );


      const message =
        err instanceof Error
          ? err.message
          : "Unable to start hand tracking.";


      setError(message);


      stopTracking();

    } finally {
      setLoading(false);
    }
  }


  // ==========================================================
  // STOP CAMERA
  // ==========================================================

  function stopCamera() {
    if (
      streamRef.current
    ) {
      streamRef.current
        .getTracks()
        .forEach(
          (track) => {
            track.stop();
          }
        );

      streamRef.current =
        null;
    }


    const video =
      videoRef.current;


    if (video) {
      video.pause();

      video.srcObject =
        null;
    }
  }


  // ==========================================================
  // STOP TRACKING
  // ==========================================================

  function stopTracking() {
    runningRef.current =
      false;


    if (
      animationFrameRef.current !==
      null
    ) {
      cancelAnimationFrame(
        animationFrameRef.current
      );

      animationFrameRef.current =
        null;
    }


    stopCamera();


    setEnabled(false);

    setTracking(false);


    setHandControlEnabled(
      false
    );

    setHandDetected(
      false
    );
  }


  // ==========================================================
  // DETECTION LOOP
  // ==========================================================

  function startDetection() {
    if (
      !runningRef.current
    ) {
      return;
    }


    const video =
      videoRef.current;

    const landmarker =
      landmarkerRef.current;


    if (
      !video ||
      !landmarker
    ) {
      animationFrameRef.current =
        requestAnimationFrame(
          startDetection
        );

      return;
    }


    const now =
      performance.now();


    // Approximately 30 FPS

    if (
      now -
        lastDetectionTimeRef.current >=
      33
    ) {
      lastDetectionTimeRef.current =
        now;


      if (
        video.readyState >=
        HTMLMediaElement.HAVE_CURRENT_DATA
      ) {
        try {
          const result =
            landmarker.detectForVideo(
              video,
              now
            );


          processHandResult(
            result
          );

        } catch (err) {
          console.error(
            "Hand detection error:",
            err
          );
        }
      }
    }


    animationFrameRef.current =
      requestAnimationFrame(
        startDetection
      );
  }


  // ==========================================================
  // PROCESS HAND RESULT
  // ==========================================================

  function processHandResult(
    result: HandLandmarkerResult
  ) {
    if (
      !result.landmarks ||
      result.landmarks.length === 0
    ) {
      setTracking(false);

      setHandDetected(
        false
      );

      return;
    }


    const landmarks =
      result.landmarks[0];


    if (
      !landmarks ||
      landmarks.length < 21
    ) {
      setTracking(false);

      setHandDetected(
        false
      );

      return;
    }


    // ========================================================
    // PALM POSITION
    // ========================================================

    /*
     * Landmark 9 =
     * middle finger MCP.
     *
     * Used as hand center.
     */

    const palm =
      landmarks[9];


    /*
     * Mirror X so movement
     * feels natural.
     */

    const x =
      1 -
      Math.max(
        0,
        Math.min(
          1,
          palm.x
        )
      );


    const y =
      Math.max(
        0,
        Math.min(
          1,
          palm.y
        )
      );


    // ========================================================
    // THUMB + INDEX
    // ========================================================

    const thumb =
      landmarks[4];

    const index =
      landmarks[8];


    const dx =
      thumb.x -
      index.x;

    const dy =
      thumb.y -
      index.y;

    const dz =
      (thumb.z ?? 0) -
      (index.z ?? 0);


    const distance =
      Math.sqrt(
        dx * dx +
        dy * dy +
        dz * dz
      );


    /*
     * 0 = together
     * 1 = apart
     */

    const pinch =
      Math.max(
        0,
        Math.min(
          1,
          (distance - 0.025) /
            0.16
        )
      );


    // ========================================================
    // SEND TO SHARED HAND STATE
    // ========================================================

    updateHandPosition(
      x,
      y,
      pinch
    );


    setTracking(true);
  }


  // ==========================================================
  // CLEANUP
  // ==========================================================

  useEffect(() => {
    return () => {
      runningRef.current =
        false;


      if (
        animationFrameRef.current !==
        null
      ) {
        cancelAnimationFrame(
          animationFrameRef.current
        );
      }


      stopCamera();


      if (
        landmarkerRef.current
      ) {
        try {
          landmarkerRef.current.close();
        } catch {
          // Ignore cleanup errors.
        }


        landmarkerRef.current =
          null;
      }


      setHandControlEnabled(
        false
      );
    };
  }, []);


  // ==========================================================
  // UI
  // ==========================================================

  return (
    <>
      <video
        ref={videoRef}
        className={`hand-camera-video ${
          enabled
            ? "hand-camera-video-visible"
            : ""
        }`}
        muted
        playsInline
        autoPlay
      />


      <div className="hand-control-panel">

        {!enabled ? (
          <button
            type="button"
            onClick={
              startTracking
            }
            disabled={loading}
            className="hand-control-button"
          >
            {loading
              ? "Starting camera..."
              : "🖐 Enable Hand Control"}
          </button>
        ) : (
          <>
            <div className="hand-status">

              <span
                className={
                  tracking
                    ? "hand-status-dot active"
                    : "hand-status-dot"
                }
              />

              {tracking
                ? "Hand tracking active"
                : "Show your hand"}

            </div>


            <button
              type="button"
              onClick={
                stopTracking
              }
              className="hand-control-button active"
            >
              🛑 Disable Hand Control
            </button>
          </>
        )}


        {error && (
          <div className="hand-control-error">
            {error}
          </div>
        )}

      </div>
    </>
  );
}