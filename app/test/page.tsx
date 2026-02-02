'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
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

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.1;
            meshRef.current.rotation.x += delta * 0.05;
        }
    });

    // FIX: Use 'Color' directly
    const colorA = useMemo(() => new THREE.Color('#d946ef'), []);
    const colorB = useMemo(() => new THREE.Color('#bef264'), []);

    // FIX: Use 'IcosahedronGeometry' directly
    const geometry = useMemo(() => new THREE.IcosahedronGeometry(2, 0), []);

    return (
        <group ref={meshRef}>
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
                    size={0.15}
                    color="#ffffff"
                    transparent
                    opacity={0.9}
                    sizeAttenuation={true}
                />
            </points>

            <mesh geometry={geometry}>
                <meshBasicMaterial
                    color="#000000"
                    transparent
                    opacity={0.1}
                    wireframe={false}
                />
            </mesh>
        </group>
    );
};

// --- 3. The Main Page Component ---
export default function SacredGeometryPage() {
    return (
        <div className="w-full h-screen bg-black overflow-hidden relative">
            <Canvas dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={50} />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />

                <GlowingIcosahedron />

                <Stars
                    radius={100}
                    depth={50}
                    count={5000}
                    factor={4}
                    saturation={0}
                    fade
                    speed={1}
                />

                {/* FIX: enableNormalPass={false} handles the type error from before */}
                <EffectComposer enableNormalPass={false}>
                    <Bloom
                        luminanceThreshold={0}
                        mipmapBlur
                        intensity={1.5}
                        radius={0.6}
                    />
                </EffectComposer>
            </Canvas>

            <div className="absolute bottom-10 left-0 w-full text-center pointer-events-none">
                <p className="text-white/30 text-xs tracking-[0.5em] font-light uppercase font-mono">
                    System Initialized
                </p>
            </div>
        </div>
    );
}