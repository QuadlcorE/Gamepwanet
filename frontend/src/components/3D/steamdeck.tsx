import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, MeshReflectorMaterial } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import {
  Noise,
  EffectComposer,
  wrapEffect,
  HueSaturation,
} from "@react-three/postprocessing";
import { BlendFunction, GlitchEffect } from "postprocessing";

const GleetchEffect = wrapEffect(GlitchEffect);

function Model() {
  const { scene } = useGLTF("/steam_deck_console.glb");
  return <primitive object={scene} />;
}

function CameraOffset() {
  const { camera, size } = useThree();

  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.setViewOffset(
        size.width,
        size.height,
        -size.width*0.25, // ← positive shifts content left (increase to push further left)
        -size.width*0.175, // ← negative shifts content down (increase magnitude to push further down)
        size.width,
        size.height
      );
    }

    return () => {
      (camera as THREE.PerspectiveCamera).clearViewOffset();
    };
  }, [camera, size]);

  return null; // renders nothing, just sets the offset
}

function Scene() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport, mouse } = useThree();

  useFrame(() => {
    if (!meshRef.current) return;

    const x = (mouse.x * viewport.width) / 2;
    const y = (mouse.y * viewport.height) / 2;

    const maxTilt = 0.3;
    const clampedX = THREE.MathUtils.clamp(x, -maxTilt, maxTilt);
    const clampedY = THREE.MathUtils.clamp(y, -maxTilt, maxTilt);

    const target = new THREE.Vector3(clampedX, clampedY, 1);

    const currentTarget = new THREE.Vector3();
    meshRef.current.getWorldDirection(currentTarget);
    currentTarget.lerp(target, 0.01);

    meshRef.current.lookAt(currentTarget);
  });

  return (
    <group>
      <ambientLight intensity={1} />
      <directionalLight
        color={THREE.Color.NAMES.azure}
        intensity={5}
        position={[10, 10, 5]}
      />
      <directionalLight
        color={THREE.Color.NAMES.indianred}
        intensity={5}
        position={[-20, 10, 3]}
      />

      <mesh ref={meshRef}>
        <Model />
        <MeshReflectorMaterial />
      </mesh>
    </group>
  );
}

export default function SteamDeckConsole() {
  return (
    <Canvas className="w-full h-full" camera={{ fov: 75, position: [5, 5, 9] }}>
      <Suspense fallback={null}>
        <CameraOffset />

        <EffectComposer>
          <Noise opacity={0.5} blendFunction={BlendFunction.OVERLAY} />
          <GleetchEffect />
          <HueSaturation
            saturation={-1} // -1 = fully greyscale, 0 = normal, 1 = oversaturated
            blendFunction={BlendFunction.NORMAL}
          />
        </EffectComposer>

        <Scene />
      </Suspense>
    </Canvas>
  );
}
