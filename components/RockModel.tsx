'use client';

import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface RockModelProps {
  scale?: number;
  position?: [number, number, number];
}

export function RockModel({ scale = 2, position = [0, 0, 0] }: RockModelProps) {
  const { scene } = useGLTF('/assets/tungtung.glb');
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!scene) return;
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.sub(center);
  }, [scene]);

  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y += 0.005;
  });

  return (
    <group ref={groupRef} scale={scale} position={position}>
      <primitive object={scene} />
    </group>
  );
}