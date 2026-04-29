import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import {
  Noise,
  EffectComposer,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { CameraOffset, GleetchEffect } from "./utility";

function Model() {
  const { scene } = useGLTF("/switch_console.glb");
  return <primitive object={scene} scale={15} />;
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
  
    const meshPosition = new THREE.Vector3();
    meshRef.current.getWorldPosition(meshPosition);
  
    const target = new THREE.Vector3(
      meshPosition.x + clampedX,
      meshPosition.y + clampedY,
      meshPosition.z + 1  
    );
  
    const currentTarget = new THREE.Vector3();
    meshRef.current.getWorldDirection(currentTarget);
  
    currentTarget
      .multiplyScalar(1)
      .add(meshPosition)
      .lerp(target, 0.01);
  
    meshRef.current.lookAt(currentTarget);
  });
  

  return (
    <group position={[0.7, 0.3, 0]}>
      <ambientLight intensity={1} />
      <directionalLight color={THREE.Color.NAMES.darkgoldenrod} intensity={3} position={[10, 5, 5]}/>
      <directionalLight color={THREE.Color.NAMES.greenyellow} intensity={3} position={[-20, -5, 5]}/>
      <mesh ref={meshRef}>
        <Model />
      </mesh>
    </group>
  );
}

export default function SwitchConsole() {
  return (
    <Canvas
      className="w-full h-full"
      camera={{ fov: 75, position: [0, 0, 5] }}
      dpr={[1, 2]}
      gl={{
        antialias: true, // smoother edges
        powerPreference: "high-performance", // use dedicated GPU if available
      }}
    >
      <Suspense fallback={null}>
        <CameraOffset />

        <EffectComposer>
          <Noise opacity={0.5} blendFunction={BlendFunction.OVERLAY} />
          <GleetchEffect />
        </EffectComposer>

        <Scene />
      </Suspense>
    </Canvas>
  );
}
