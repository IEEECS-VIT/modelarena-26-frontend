'use client';

import React, { useRef, useMemo, useState, useEffect, Component, ReactNode, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useTexture } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// Error boundary with auto-reset capability
class CanvasErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode; resetKey?: number },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode; resetKey?: number }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidUpdate(prevProps: { resetKey?: number }) {
    // Reset error state when resetKey changes (e.g., on auth change)
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('Hero3D Error (handled gracefully):', error.message);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }
    return this.props.children;
  }
}

// --- Custom Shader for the Gradient Wireframe ---
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

// Icosahedron WITHOUT logo (fallback when texture fails)
const IcosahedronWithoutLogo = () => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
      meshRef.current.rotation.x += delta * 0.05;
    }
  });

  const colorA = useMemo(() => new THREE.Color('#9333EA'), []);
  const colorB = useMemo(() => new THREE.Color('#D4FF00'), []);
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.6, 0), []);

  return (
    <group ref={meshRef} position={[0, 0.3, 0]} rotation={[0.2, 0, 0]}>
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

// Logo component that handles its own loading
const LogoSprite = () => {
  const logoTexture = useTexture('/hero/ma-logo.png');

  return (
    <sprite scale={[1.2, 1.2, 1]}>
      <spriteMaterial
        map={logoTexture}
        transparent
        opacity={0.9}
        depthTest={false}
      />
    </sprite>
  );
};

// Full icosahedron with logo (wrapped in Suspense for texture loading)
const GlowingIcosahedron = () => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
      meshRef.current.rotation.x += delta * 0.05;
    }
  });

  const colorA = useMemo(() => new THREE.Color('#9333EA'), []);
  const colorB = useMemo(() => new THREE.Color('#D4FF00'), []);
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.6, 0), []);

  return (
    <group ref={meshRef} position={[0, 0.3, 0]} rotation={[0.2, 0, 0]}>
      {/* Logo wrapped in error boundary - if it fails, we just don't show it */}
      <CanvasErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          <LogoSprite />
        </Suspense>
      </CanvasErrorBoundary>

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

// Scene content wrapper
const SceneContent = () => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 4.5]} fov={50} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />

      <Suspense fallback={<IcosahedronWithoutLogo />}>
        <GlowingIcosahedron />
      </Suspense>

      <EffectComposer enableNormalPass={false}>
        <Bloom
          luminanceThreshold={0.3}
          mipmapBlur
          intensity={1.5}
          radius={0.3}
        />
      </EffectComposer>
    </>
  );
};

// --- Main Page Component ---
export default function Hero3D() {
  const [isReady, setIsReady] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [canRender, setCanRender] = useState(true);

  // Check for WebGL support on mount
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setCanRender(false);
      }
    } catch {
      setCanRender(false);
    }
  }, []);

  // Reset error boundary periodically to recover from WebGL context loss
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setResetKey(prev => prev + 1);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Handle WebGL context loss/restore
  const handleCreated = ({ gl }: { gl: THREE.WebGLRenderer }) => {
    setIsReady(true);

    const canvas = gl.domElement;

    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      console.warn('WebGL context lost - will attempt recovery');
      setIsReady(false);
    });

    canvas.addEventListener('webglcontextrestored', () => {
      console.log('WebGL context restored');
      setResetKey(prev => prev + 1);
      setIsReady(true);
    });
  };

  // Don't render anything if WebGL is not supported - just show empty space
  if (!canRender) {
    return <div className="w-full h-full" />;
  }

  return (
    <div
      className={`w-full h-full overflow-hidden transition-opacity duration-500 ${isReady ? 'opacity-100' : 'opacity-0'}`}
      style={{ background: 'transparent' }}
    >
      <CanvasErrorBoundary
        fallback={<div className="w-full h-full" style={{ background: 'transparent' }} />}
        resetKey={resetKey}
      >
        <Canvas
          key={resetKey}
          dpr={[1, 2]}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance',
            failIfMajorPerformanceCaveat: false,
          }}
          style={{ background: 'transparent' }}
          onCreated={handleCreated}
        >
          <SceneContent />
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}