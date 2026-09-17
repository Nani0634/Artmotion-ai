import {
  useEffect,
  useMemo,
} from "react";

import {
  Canvas,
  useFrame,
} from "@react-three/fiber";

import {
  Float,
  MeshDistortMaterial,
  Sparkles,
} from "@react-three/drei";

import * as THREE from "three";


// ============================================================
// BACKGROUND SCROLL TRACKING
// ============================================================

const interaction = {
  scrollTarget: 0,
  scrollCurrent: 0,

  mouseTarget: {
    x: 0,
    y: 0,
  },

  mouseCurrent: {
    x: 0,
    y: 0,
  },
};


// ============================================================
// SCROLL
// ============================================================

function ScrollTracking() {

  useEffect(() => {

    function handleScroll() {

      const maxScroll =
        document.documentElement
          .scrollHeight -
        window.innerHeight;


      if (
        maxScroll <= 0
      ) {
        interaction.scrollTarget =
          0;

        return;
      }


      interaction.scrollTarget =
        window.scrollY /
        maxScroll;
    }


    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );


    handleScroll();


    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };

  }, []);


  return null;
}


// ============================================================
// BACKGROUND MOUSE TRACKING
// ============================================================

function MouseTracking() {

  useEffect(() => {

    function handlePointerMove(
      event: PointerEvent
    ) {

      interaction.mouseTarget.x =
        event.clientX /
          window.innerWidth -
        0.5;


      interaction.mouseTarget.y =
        event.clientY /
          window.innerHeight -
        0.5;
    }


    window.addEventListener(
      "pointermove",
      handlePointerMove,
      {
        passive: true,
      }
    );


    return () => {
      window.removeEventListener(
        "pointermove",
        handlePointerMove
      );
    };

  }, []);


  return null;
}


// ============================================================
// BACKGROUND CAMERA MOTION
// ============================================================

function CameraMotion() {

  useFrame((state) => {

    const camera =
      state.camera;


    // --------------------------------------------------------
    // Smooth scroll
    // --------------------------------------------------------

    interaction.scrollCurrent =
      THREE.MathUtils.lerp(
        interaction.scrollCurrent,
        interaction.scrollTarget,
        0.035
      );


    // --------------------------------------------------------
    // Smooth mouse
    // --------------------------------------------------------

    interaction.mouseCurrent.x =
      THREE.MathUtils.lerp(
        interaction.mouseCurrent.x,
        interaction.mouseTarget.x,
        0.045
      );


    interaction.mouseCurrent.y =
      THREE.MathUtils.lerp(
        interaction.mouseCurrent.y,
        interaction.mouseTarget.y,
        0.045
      );


    // --------------------------------------------------------
    // BACKGROUND ONLY
    // --------------------------------------------------------

    const targetX =
      interaction.mouseCurrent.x *
      1.0;


    const targetY =
      -interaction.mouseCurrent.y *
      0.65;


    const scrollOffset =
      interaction.scrollCurrent *
      0.35;


    camera.position.x =
      THREE.MathUtils.lerp(
        camera.position.x,
        targetX,
        0.035
      );


    camera.position.y =
      THREE.MathUtils.lerp(
        camera.position.y,
        targetY -
          scrollOffset,
        0.035
      );


    camera.position.z =
      THREE.MathUtils.lerp(
        camera.position.z,
        9.5,
        0.03
      );


    camera.lookAt(
      0,
      0,
      0
    );

  });


  return null;
}


// ============================================================
// BACKGROUND OBJECTS
// ============================================================

function BackgroundObjects() {

  return (
    <group>

      {/* ================================================== */}
      {/* CYAN TORUS */}
      {/* ================================================== */}

      <Float
        speed={1.2}
        rotationIntensity={0.55}
        floatIntensity={0.8}
      >

        <mesh
          position={[
            -2.8,
            1.7,
            -1,
          ]}
          rotation={[
            0.7,
            0.4,
            0.3,
          ]}
        >

          <torusGeometry
            args={[
              1.15,
              0.24,
              32,
              96,
            ]}
          />

          <meshStandardMaterial
            color="#22d3ee"
            metalness={0.8}
            roughness={0.18}
            emissive="#083344"
            emissiveIntensity={1.2}
          />

        </mesh>

      </Float>


      {/* ================================================== */}
      {/* PINK SPHERE */}
      {/* ================================================== */}

      <Float
        speed={1.5}
        rotationIntensity={0.7}
        floatIntensity={1}
      >

        <mesh
          position={[
            2.8,
            1.4,
            -1.8,
          ]}
        >

          <sphereGeometry
            args={[
              1.05,
              64,
              64,
            ]}
          />

          <MeshDistortMaterial
            color="#ec4899"
            metalness={0.35}
            roughness={0.18}
            distort={0.22}
            speed={1.6}
            emissive="#831843"
            emissiveIntensity={0.65}
          />

        </mesh>

      </Float>


      {/* ================================================== */}
      {/* PURPLE CUBE */}
      {/* ================================================== */}

      <Float
        speed={1}
        rotationIntensity={0.8}
        floatIntensity={0.7}
      >

        <mesh
          position={[
            2.7,
            -1.8,
            -1,
          ]}
          rotation={[
            0.4,
            0.5,
            0.2,
          ]}
        >

          <boxGeometry
            args={[
              1.55,
              1.55,
              1.55,
            ]}
          />

          <meshStandardMaterial
            color="#8b5cf6"
            metalness={0.72}
            roughness={0.2}
            emissive="#4c1d95"
            emissiveIntensity={0.8}
          />

        </mesh>

      </Float>


      {/* ================================================== */}
      {/* LARGE PURPLE RING */}
      {/* ================================================== */}

      <Float
        speed={0.7}
        rotationIntensity={0.4}
        floatIntensity={0.5}
      >

        <mesh
          position={[
            -2.2,
            -2.2,
            -3,
          ]}
          rotation={[
            1.1,
            0.4,
            0.5,
          ]}
        >

          <torusGeometry
            args={[
              1.7,
              0.14,
              24,
              100,
            ]}
          />

          <meshStandardMaterial
            color="#a855f7"
            metalness={0.7}
            roughness={0.2}
            emissive="#581c87"
            emissiveIntensity={1}
          />

        </mesh>

      </Float>


      {/* ================================================== */}
      {/* SMALL CYAN RING */}
      {/* ================================================== */}

      <Float
        speed={1.8}
        rotationIntensity={0.8}
        floatIntensity={1.2}
      >

        <mesh
          position={[
            0.5,
            2.4,
            -2.5,
          ]}
          rotation={[
            0.8,
            0.2,
            0.7,
          ]}
        >

          <torusGeometry
            args={[
              0.7,
              0.1,
              20,
              80,
            ]}
          />

          <meshStandardMaterial
            color="#06b6d4"
            metalness={0.75}
            roughness={0.16}
            emissive="#164e63"
            emissiveIntensity={1.1}
          />

        </mesh>

      </Float>


      {/* ================================================== */}
      {/* DIAMOND */}
      {/* ================================================== */}

      <Float
        speed={1.3}
        rotationIntensity={0.9}
        floatIntensity={0.8}
      >

        <mesh
          position={[
            -0.5,
            -2.5,
            -2,
          ]}
          rotation={[
            0.4,
            0.7,
            0.2,
          ]}
        >

          <octahedronGeometry
            args={[
              0.75,
              0,
            ]}
          />

          <meshStandardMaterial
            color="#c084fc"
            metalness={0.9}
            roughness={0.12}
            emissive="#7e22ce"
            emissiveIntensity={0.9}
          />

        </mesh>

      </Float>

    </group>
  );
}


// ============================================================
// BACKGROUND PARTICLES
// ============================================================

function Particles() {

  const positions =
    useMemo(() => {

      const count =
        420;


      const data =
        new Float32Array(
          count * 3
        );


      for (
        let i = 0;
        i < count;
        i++
      ) {

        data[i * 3] =
          (Math.random() - 0.5) *
          16;


        data[i * 3 + 1] =
          (Math.random() - 0.5) *
          12;


        data[i * 3 + 2] =
          (Math.random() - 0.5) *
          10;
      }


      return data;

    }, []);


  return (
    <points>

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
        transparent
        opacity={0.65}
        depthWrite={false}
      />

    </points>
  );
}


// ============================================================
// BACKGROUND LIGHTS
// ============================================================

function BackgroundLights() {

  return (
    <>

      <ambientLight
        intensity={0.55}
      />


      <directionalLight
        position={[
          4,
          6,
          5,
        ]}
        intensity={2}
      />


      <pointLight
        position={[
          -4,
          3,
          2,
        ]}
        intensity={18}
        distance={10}
      />


      <pointLight
        position={[
          4,
          -3,
          1,
        ]}
        intensity={14}
        distance={9}
      />


      <pointLight
        position={[
          0,
          4,
          -4,
        ]}
        intensity={12}
        distance={8}
      />

    </>
  );
}


// ============================================================
// BACKGROUND SCENE
// ============================================================

function Scene() {

  return (
    <>

      <ScrollTracking />

      <MouseTracking />

      <CameraMotion />

      <BackgroundLights />

      <BackgroundObjects />

      <Particles />

      <Sparkles
        count={120}
        scale={12}
        size={1.2}
        speed={0.25}
      />

    </>
  );
}


// ============================================================
// ART BACKGROUND
// ============================================================

export default function ArtBackground() {

  return (
    <div className="art-background">

      <Canvas
        camera={{
          position: [
            0,
            0,
            9.5,
          ],

          fov: 52,
        }}

        dpr={[
          1,
          1.5,
        ]}

        gl={{
          antialias: true,
          alpha: true,
          powerPreference:
            "high-performance",
        }}
      >

        <Scene />

      </Canvas>

    </div>
  );
}