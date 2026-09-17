export type HandMode =
  | "none"
  | "rotate"
  | "zoom";

export const handControl = {
  enabled: false,
  detected: false,

  x: 0.5,
  y: 0.5,

  // 0 = thumb/index together
  // 1 = thumb/index apart
  pinch: 1,

  mode: "none" as HandMode,

  lastSeen: 0,

  sensitivity: 1,
  smoothing: 0.08,

  // Keep these for the existing
  // hand-control panel.
  pinchZoom: false,
  followX: true,
  followY: true,

  // Front artwork rotation
  rotationX: 0,
  rotationY: 0,

  rotateStartHandX: 0.5,
  rotateStartHandY: 0.5,

  rotateStartRotationX: 0,
  rotateStartRotationY: 0,

  // Front artwork zoom
  scale: 1,

  minScale: 0.75,
  maxScale: 1.55,
};


// ============================================================
// UPDATE HAND
// ============================================================

export function updateHandPosition(
  x: number,
  y: number,
  pinch: number
) {
  const previousMode =
    handControl.mode;

  handControl.x = x;
  handControl.y = y;
  handControl.pinch = pinch;

  handControl.detected = true;
  handControl.lastSeen =
    performance.now();


  // ==========================================================
  // GESTURE DETECTION
  // ==========================================================

  /*
   * 🤏 Thumb + index together
   *    = ROTATE
   *
   * 🖐 Fingers apart
   *    = ZOOM
   */

  const newMode: HandMode =
    pinch < 0.45
      ? "rotate"
      : "zoom";


  // ==========================================================
  // GESTURE CHANGED
  // ==========================================================

  if (
    newMode !== previousMode
  ) {
    if (
      newMode === "rotate"
    ) {
      /*
       * Remember where the hand
       * was when pinch started.
       */

      handControl.rotateStartHandX =
        x;

      handControl.rotateStartHandY =
        y;

      handControl.rotateStartRotationX =
        handControl.rotationX;

      handControl.rotateStartRotationY =
        handControl.rotationY;
    }

    handControl.mode =
      newMode;
  }


  // ==========================================================
  // ROTATE
  // ==========================================================

  if (
    handControl.mode ===
    "rotate"
  ) {
    const deltaX =
      x -
      handControl.rotateStartHandX;

    const deltaY =
      y -
      handControl.rotateStartHandY;


    if (
      handControl.followX
    ) {
      handControl.rotationY =
        handControl.rotateStartRotationY +
        deltaX *
          Math.PI *
          2 *
          handControl.sensitivity;
    }


    if (
      handControl.followY
    ) {
      handControl.rotationX =
        handControl.rotateStartRotationX -
        deltaY *
          Math.PI *
          1.5 *
          handControl.sensitivity;
    }


    handControl.rotationX =
      Math.max(
        -Math.PI / 2,
        Math.min(
          Math.PI / 2,
          handControl.rotationX
        )
      );
  }


  // ==========================================================
  // ZOOM
  // ==========================================================

  if (
    handControl.mode ===
    "zoom"
  ) {
    /*
     * Open hand:
     *
     * hand UP
     *    = zoom in
     *
     * hand DOWN
     *    = zoom out
     */

    const targetScale =
      1.0 -
      (y - 0.5) *
        0.8 *
        handControl.sensitivity;


    handControl.scale =
      Math.max(
        handControl.minScale,
        Math.min(
          handControl.maxScale,
          targetScale
        )
      );
  }
}


// ============================================================
// ENABLE / DISABLE
// ============================================================

export function setHandControlEnabled(
  enabled: boolean
) {
  handControl.enabled =
    enabled;

  if (!enabled) {
    resetHandControl();
  }
}


// ============================================================
// DETECTION STATUS
// ============================================================

export function setHandDetected(
  detected: boolean
) {
  handControl.detected =
    detected;

  if (!detected) {
    handControl.lastSeen =
      0;

    handControl.mode =
      "none";
  }
}


// ============================================================
// RESET
// ============================================================

export function resetHandControl() {
  handControl.detected =
    false;

  handControl.x = 0.5;
  handControl.y = 0.5;
  handControl.pinch = 1;

  handControl.mode =
    "none";

  handControl.lastSeen =
    0;

  handControl.rotationX =
    0;

  handControl.rotationY =
    0;

  handControl.scale =
    1;

  handControl.rotateStartHandX =
    0.5;

  handControl.rotateStartHandY =
    0.5;

  handControl.rotateStartRotationX =
    0;

  handControl.rotateStartRotationY =
    0;
}