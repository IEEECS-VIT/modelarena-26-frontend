'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useTexture } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
// FIX: Import namespace to avoid 'no exported member' errors
import * as THREE from 'three';

// --- 1. Custom Shader for the Gradient Wireframe ---
const vertexShader = `
  varying vec3 vPos;
  void main() {
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec3 vPos;
  uniform vec3 colorA;
  uniform vec3 colorB;

  void main() {
    float mixValue = (vPos.x + vPos.y * 0.5) * 0.5 + 0.5;
    mixValue = clamp(mixValue, 0.0, 1.0);
    vec3 finalColor = mix(colorA, colorB, mixValue);
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

// --- 2. The Main Geometric Structure ---
const GlowingIcosahedron = () => {
  // FIX: Use 'Group' type directly
  const meshRef = useRef<THREE.Group>(null);

  // Load the logo texture
  const logoTexture = useTexture('/hero/ma-logo.png');

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
      meshRef.current.rotation.x += delta * 0.05;
    }
  });

  // Vibrant colors for the gradient
  const colorA = useMemo(() => new THREE.Color('#9333EA'), []); // Brighter purple
  const colorB = useMemo(() => new THREE.Color('#D4FF00'), []); // Brighter lime

  // FIX: Use 'IcosahedronGeometry' directly
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.6, 0), []);

  return (
    <group ref={meshRef} position={[0, 0.3, 0]} rotation={[0.2, 0, 0]}>
      {/* Logo sprite in the center */}
      <sprite scale={[1.2, 1.2, 1]}>
        <spriteMaterial
          map={logoTexture}
          transparent
          opacity={0.9}
          depthTest={false}
        />
      </sprite>

      <lineSegments>
        <wireframeGeometry args={[geometry]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={{
            colorA: { value: colorA },
            colorB: { value: colorB },
          }}
          transparent
          depthTest={false}
          opacity={1}
        />
      </lineSegments>

      <points>
        <bufferGeometry attach="geometry" {...geometry} />
        <pointsMaterial
          size={0.12}
          color="#CCFF00"
          transparent
          opacity={0.7}
          sizeAttenuation={true}
        />
      </points>

      <mesh geometry={geometry}>
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.05}
          wireframe={false}
        />
      </mesh>
    </group>
  );
};

// --- 3. The Main Page Component ---
export default function Hero3D() {
  return (
    <div className="w-full h-full overflow-hidden">
      <Canvas dpr={[1, 2]} gl={{ alpha: true }} style={{ background: 'transparent' }}>
        <PerspectiveCamera makeDefault position={[0, 0, 4.5]} fov={50} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />

        <GlowingIcosahedron />

        <EffectComposer enableNormalPass={false}>
          <Bloom
            luminanceThreshold={0.3}
            mipmapBlur
            intensity={1.5}
            radius={0.3}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}