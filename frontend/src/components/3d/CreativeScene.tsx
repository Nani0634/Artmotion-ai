import {
  Canvas,
  useFrame,
} from "@react-three/fiber";

import {
  useEffect,
  useRef,
} from "react";

import * as THREE from "three";

import {
  handControl,
} from "./handControl";


// ============================================================
// FLOATING PAINT PALETTE
// ============================================================

function PaintPalette() {
  const groupRef =
    useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    const t =
      state.clock.elapsedTime;

    groupRef.current.rotation.z =
      Math.sin(t * 0.5) * 0.08;

    groupRef.current.rotation.y =
      t * 0.25;

    groupRef.current.position.y =
      Math.sin(t * 0.8) * 0.18;
  });

  return (
    <group
      ref={groupRef}
      position={[
        -1.35,
        0.15,
        0,
      ]}
      rotation={[
        0.15,
        0,
        -0.2,
      ]}
      scale={1.15}
    >

      {/* Palette */}

      <mesh>
        <sphereGeometry
          args={[
            0.85,
            64,
            32,
          ]}
        />

        <meshStandardMaterial
          color="#d99a73"
          roughness={0.65}
          metalness={0.05}
        />
      </mesh>


      {/* Palette hole */}

      <mesh
        position={[
          0.38,
          0.15,
          0.78,
        ]}
      >

        <cylinderGeometry
          args={[
            0.17,
            0.17,
            0.12,
            32,
          ]}
        />

        <meshStandardMaterial
          color="#17132d"
          roughness={0.9}
        />

      </mesh>


      {/* Purple paint */}

      <PaintBlob
        position={[
          -0.35,
          0.38,
          0.72,
        ]}
        color="#8b5cf6"
        scale={0.23}
      />


      {/* Pink paint */}

      <PaintBlob
        position={[
          0.05,
          0.55,
          0.58,
        ]}
        color="#ec4899"
        scale={0.2}
      />


      {/* Cyan paint */}

      <PaintBlob
        position={[
          0.42,
          0.42,
          0.5,
        ]}
        color="#22d3ee"
        scale={0.21}
      />


      {/* Orange paint */}

      <PaintBlob
        position={[
          -0.05,
          0.05,
          0.86,
        ]}
        color="#f59e0b"
        scale={0.18}
      />

    </group>
  );
}


// ============================================================
// PAINT BLOB
// ============================================================

function PaintBlob({
  position,
  color,
  scale,
}: {
  position: [
    number,
    number,
    number
  ];

  color: string;

  scale: number;
}) {
  return (
    <mesh
      position={position}
      scale={scale}
    >

      <sphereGeometry
        args={[
          1,
          32,
          24,
        ]}
      />

      <meshStandardMaterial
        color={color}
        roughness={0.25}
        metalness={0.15}
      />

    </mesh>
  );
}


// ============================================================
// FLOATING PAINT BRUSH
// ============================================================

function PaintBrush() {
  const groupRef =
    useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    const t =
      state.clock.elapsedTime;

    groupRef.current.rotation.z =
      Math.sin(t * 0.7) * 0.12;

    groupRef.current.rotation.y =
      Math.sin(t * 0.45) * 0.25;

    groupRef.current.position.y =
      0.55 +
      Math.sin(t * 1.1) * 0.22;
  });

  return (
    <group
      ref={groupRef}
      position={[
        1.55,
        0.55,
        0,
      ]}
      rotation={[
        0,
        0,
        -0.65,
      ]}
    >

      {/* Wooden handle */}

      <mesh>

        <cylinderGeometry
          args={[
            0.07,
            0.09,
            1.8,
            32,
          ]}
        />

        <meshStandardMaterial
          color="#e6b87a"
          roughness={0.45}
        />

      </mesh>


      {/* Metal connector */}

      <mesh
        position={[
          0,
          0.95,
          0,
        ]}
      >

        <cylinderGeometry
          args={[
            0.12,
            0.12,
            0.25,
            32,
          ]}
        />

        <meshStandardMaterial
          color="#d5d8df"
          metalness={0.8}
          roughness={0.2}
        />

      </mesh>


      {/* Brush bristles */}

      <mesh
        position={[
          0,
          1.3,
          0,
        ]}
      >

        <coneGeometry
          args={[
            0.2,
            0.65,
            32,
          ]}
        />

        <meshStandardMaterial
          color="#a855f7"
          roughness={0.5}
        />

      </mesh>

    </group>
  );
}


// ============================================================
// ARTISTIC RING
// ============================================================

function ArtisticRing() {
  const ringRef =
    useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ringRef.current) return;

    const t =
      state.clock.elapsedTime;

    ringRef.current.rotation.x =
      t * 0.35;

    ringRef.current.rotation.y =
      t * 0.55;

    ringRef.current.position.y =
      -0.55 +
      Math.sin(t * 0.7) * 0.15;
  });

  return (
    <mesh
      ref={ringRef}
      position={[
        0.25,
        -0.6,
        -0.5,
      ]}
      rotation={[
        0.6,
        0.2,
        0,
      ]}
    >

      <torusGeometry
        args={[
          0.75,
          0.07,
          32,
          96,
        ]}
      />

      <meshStandardMaterial
        color="#22d3ee"
        emissive="#0891b2"
        emissiveIntensity={0.8}
        metalness={0.7}
        roughness={0.2}
      />

    </mesh>
  );
}


// ============================================================
// FLOATING ART SHAPES
// ============================================================

function FloatingShape({
  position,
  color,
  type,
}: {
  position: [
    number,
    number,
    number
  ];

  color: string;

  type:
    | "box"
    | "sphere"
    | "torus";
}) {
  const meshRef =
    useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;

    const t =
      state.clock.elapsedTime;

    meshRef.current.rotation.x =
      t * 0.45;

    meshRef.current.rotation.y =
      t * 0.65;

    meshRef.current.position.y =
      position[1] +
      Math.sin(
        t * 1.1 +
        position[0]
      ) *
        0.15;
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
    >

      {type === "box" && (
        <boxGeometry
          args={[
            0.35,
            0.35,
            0.35,
          ]}
        />
      )}


      {type === "sphere" && (
        <sphereGeometry
          args={[
            0.25,
            32,
            32,
          ]}
        />
      )}


      {type === "torus" && (
        <torusGeometry
          args={[
            0.25,
            0.07,
            24,
            48,
          ]}
        />
      )}


      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.25}
        metalness={0.45}
        roughness={0.25}
      />

    </mesh>
  );
}


// ============================================================
// PARTICLES
// ============================================================

function Particles() {

  const pointsRef =
    useRef<THREE.Points>(null);

  const count =
    180;

  const positions =
    new Float32Array(
      count * 3
    );


  for (
    let i = 0;
    i < count;
    i++
  ) {

    positions[i * 3] =
      (Math.random() - 0.5) *
      10;


    positions[i * 3 + 1] =
      (Math.random() - 0.5) *
      6;


    positions[i * 3 + 2] =
      (Math.random() - 0.5) *
      5;
  }


  useFrame((state) => {

    if (!pointsRef.current) {
      return;
    }


    const t =
      state.clock.elapsedTime;


    pointsRef.current.rotation.y =
      t * 0.018;


    pointsRef.current.rotation.x =
      Math.sin(t * 0.15) *
      0.04;

  });


  return (
    <points
      ref={pointsRef}
    >

      <bufferGeometry>

        <bufferAttribute
          attach="attributes-position"
          args={[
            positions,
            3,
          ]}
        />

      </bufferGeometry>


      <pointsMaterial
        size={0.035}
        color="#ffffff"
        transparent
        opacity={0.65}
        sizeAttenuation
      />

    </points>
  );
}


// ============================================================
// GLOW SPHERE
// ============================================================

function GlowSphere({
  position,
  color,
  scale,
}: {
  position: [
    number,
    number,
    number
  ];

  color: string;

  scale: number;
}) {

  const meshRef =
    useRef<THREE.Mesh>(null);


  useFrame((state) => {

    if (!meshRef.current) {
      return;
    }


    const t =
      state.clock.elapsedTime;


    const pulse =
      1 +
      Math.sin(t * 1.5) *
        0.08;


    meshRef.current.scale.setScalar(
      scale * pulse
    );

  });


  return (
    <mesh
      ref={meshRef}
      position={position}
    >

      <sphereGeometry
        args={[
          1,
          32,
          32,
        ]}
      />


      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.2}
        transparent
        opacity={0.45}
      />

    </mesh>
  );
}


// ============================================================
// HAND ARTWORK CONTROLLER
// ============================================================

function HandArtworkController({
  groupRef,
}: {
  groupRef:
    React.RefObject<
      THREE.Group | null
    >;
}) {

  useFrame(() => {

    const group =
      groupRef.current;


    if (!group) {
      return;
    }


    const handActive =
      handControl.enabled &&
      handControl.detected &&
      performance.now() -
        handControl.lastSeen <
        500;


    if (!handActive) {
      return;
    }


    const smoothing =
      handControl.smoothing;


    // ========================================================
    // ROTATE
    // ========================================================

    group.rotation.x =
      THREE.MathUtils.lerp(
        group.rotation.x,
        handControl.rotationX,
        smoothing
      );


    group.rotation.y =
      THREE.MathUtils.lerp(
        group.rotation.y,
        handControl.rotationY,
        smoothing
      );


    // ========================================================
    // ZOOM
    // ========================================================

    if (
      handControl.mode ===
      "zoom"
    ) {

      const nextScale =
        THREE.MathUtils.lerp(
          group.scale.x,
          handControl.scale,
          smoothing
        );


      group.scale.setScalar(
        nextScale
      );
    }

  });


  return null;
}


// ============================================================
// MAIN CREATIVE SCENE
// ============================================================

export default function CreativeScene() {

  const artworkGroupRef =
    useRef<THREE.Group>(null);


  // ==========================================================
  // MOUSE STATE
  // ==========================================================

  const mouseDraggingRef =
    useRef(false);


  const lastMouseXRef =
    useRef(0);


  const lastMouseYRef =
    useRef(0);


  const mouseRotationXRef =
    useRef(0);


  const mouseRotationYRef =
    useRef(0);


  const mouseScaleRef =
    useRef(1);


  // ==========================================================
  // ARTWORK CONTAINER
  // ==========================================================

  const artworkContainerRef =
    useRef<HTMLDivElement>(null);


  // ==========================================================
  // MOUSE DOWN
  // ==========================================================

  function handleMouseDown(
    event: React.PointerEvent<HTMLDivElement>
  ) {

    event.preventDefault();


    mouseDraggingRef.current =
      true;


    lastMouseXRef.current =
      event.clientX;


    lastMouseYRef.current =
      event.clientY;


    event.currentTarget.setPointerCapture(
      event.pointerId
    );


    event.currentTarget.style.cursor =
      "grabbing";
  }


  // ==========================================================
  // MOUSE MOVE
  // ==========================================================

  function handleMouseMove(
    event: React.PointerEvent<HTMLDivElement>
  ) {

    if (
      !mouseDraggingRef.current
    ) {
      return;
    }


    const deltaX =
      event.clientX -
      lastMouseXRef.current;


    const deltaY =
      event.clientY -
      lastMouseYRef.current;


    lastMouseXRef.current =
      event.clientX;


    lastMouseYRef.current =
      event.clientY;


    // Horizontal drag

    mouseRotationYRef.current +=
      deltaX * 0.012;


    // Vertical drag

    mouseRotationXRef.current +=
      deltaY * 0.012;


    mouseRotationXRef.current =
      THREE.MathUtils.clamp(
        mouseRotationXRef.current,
        -Math.PI / 2,
        Math.PI / 2
      );
  }


  // ==========================================================
  // MOUSE UP
  // ==========================================================

  function handleMouseUp(
    event: React.PointerEvent<HTMLDivElement>
  ) {

    mouseDraggingRef.current =
      false;


    event.currentTarget.style.cursor =
      "grab";
  }


  // ==========================================================
  // NATIVE MOUSE WHEEL
  // ==========================================================

  useEffect(() => {

    const element =
      artworkContainerRef.current;


    if (!element) {
      return;
    }


    function handleNativeWheel(
      event: WheelEvent
    ) {

      /*
       * IMPORTANT:
       *
       * This prevents the webpage
       * from scrolling while the
       * mouse is over the artwork.
       */

      event.preventDefault();


      /*
       * deltaY:
       *
       * negative = wheel UP
       * positive = wheel DOWN
       *
       * Therefore:
       *
       * UP   → zoom IN
       * DOWN → zoom OUT
       */

      mouseScaleRef.current -=
        event.deltaY * 0.0015;


      mouseScaleRef.current =
        THREE.MathUtils.clamp(
          mouseScaleRef.current,
          0.75,
          1.55
        );
    }


    element.addEventListener(
      "wheel",
      handleNativeWheel,
      {
        passive: false,
      }
    );


    return () => {

      element.removeEventListener(
        "wheel",
        handleNativeWheel
      );

    };

  }, []);


  // ==========================================================
  // MOUSE ARTWORK MOTION
  // ==========================================================

  function MouseArtworkMotion() {

    useFrame(() => {

      const group =
        artworkGroupRef.current;


      if (!group) {
        return;
      }


      /*
       * Hand gets priority.
       */

      const handActive =
        handControl.enabled &&
        handControl.detected &&
        performance.now() -
          handControl.lastSeen <
          500;


      if (handActive) {
        return;
      }


      // ======================================================
      // ROTATION
      // ======================================================

      group.rotation.x =
        THREE.MathUtils.lerp(
          group.rotation.x,
          mouseRotationXRef.current,
          0.12
        );


      group.rotation.y =
        THREE.MathUtils.lerp(
          group.rotation.y,
          mouseRotationYRef.current,
          0.12
        );


      // ======================================================
      // ZOOM
      // ======================================================

      group.scale.setScalar(
        THREE.MathUtils.lerp(
          group.scale.x,
          mouseScaleRef.current,
          0.08
        )
      );

    });


    return null;
  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div
      ref={
        artworkContainerRef
      }

      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",

        /*
         * Shows the user that
         * the artwork is draggable.
         */

        cursor: "grab",

        /*
         * Prevents browser touch
         * gestures from interfering.
         */

        touchAction: "none",
      }}

      onPointerDown={
        handleMouseDown
      }

      onPointerMove={
        handleMouseMove
      }

      onPointerUp={
        handleMouseUp
      }

      onPointerCancel={
        handleMouseUp
      }
    >

      <Canvas
        camera={{
          position: [
            0,
            0,
            6,
          ],

          fov: 45,
        }}

        dpr={[
          1,
          2,
        ]}
      >

        {/* ================================================= */}
        {/* FRONT CANVAS BACKGROUND */}
        {/* ================================================= */}

        <color
          attach="background"
          args={[
            "#080b2b",
          ]}
        />


        {/* ================================================= */}
        {/* LIGHTING */}
        {/* ================================================= */}

        <ambientLight
          intensity={1.2}
        />


        <directionalLight
          position={[
            4,
            5,
            6,
          ]}
          intensity={2.5}
        />


        <pointLight
          position={[
            -4,
            2,
            3,
          ]}
          intensity={3}
          color="#8b5cf6"
        />


        <pointLight
          position={[
            4,
            1,
            3,
          ]}
          intensity={3}
          color="#22d3ee"
        />


        <pointLight
          position={[
            0,
            -3,
            2,
          ]}
          intensity={2}
          color="#ec4899"
        />


        {/* ================================================= */}
        {/* ARTWORK GROUP */}
        {/* ================================================= */}

        <group
          ref={
            artworkGroupRef
          }
        >

          <PaintPalette />

          <PaintBrush />

          <ArtisticRing />


          <FloatingShape
            position={[
              -2.5,
              1.3,
              -0.5,
            ]}
            color="#8b5cf6"
            type="sphere"
          />


          <FloatingShape
            position={[
              2.4,
              -0.8,
              -0.8,
            ]}
            color="#22d3ee"
            type="box"
          />


          <FloatingShape
            position={[
              2.6,
              1.6,
              -0.7,
            ]}
            color="#ec4899"
            type="torus"
          />


          <FloatingShape
            position={[
              -2.7,
              -1.3,
              -0.5,
            ]}
            color="#f59e0b"
            type="box"
          />


          <GlowSphere
            position={[
              -2.8,
              1.8,
              -1,
            ]}
            color="#8b5cf6"
            scale={0.35}
          />


          <GlowSphere
            position={[
              2.8,
              0.4,
              -1,
            ]}
            color="#22d3ee"
            scale={0.3}
          />


          <GlowSphere
            position={[
              0,
              2.1,
              -1.5,
            ]}
            color="#ec4899"
            scale={0.25}
          />

        </group>


        {/* ================================================= */}
        {/* PARTICLES */}
        {/* ================================================= */}

        <Particles />


        {/* ================================================= */}
        {/* HAND CONTROL */}
        {/* ================================================= */}

        <HandArtworkController
          groupRef={
            artworkGroupRef
          }
        />


        {/* ================================================= */}
        {/* MOUSE CONTROL */}
        {/* ================================================= */}

        <MouseArtworkMotion />

      </Canvas>

    </div>
  );
}