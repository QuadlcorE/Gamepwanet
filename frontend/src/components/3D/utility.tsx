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
export const GleetchEffect = wrapEffect(GlitchEffect);

export function CameraOffset() {
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