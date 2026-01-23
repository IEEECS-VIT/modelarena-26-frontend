"use client";

import * as THREE from "three";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { useEffect, useRef } from "react";

export default function Hero3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- SCENE ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
      // ensure the scene has no opaque background so the canvas stays transparent
      scene.background = null;

    // use filmic tone mapping and slightly lower exposure to reduce overall brightness
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.75;
    renderer.setPixelRatio(window.devicePixelRatio);
      // keep canvas background transparent so the page background shows through
      renderer.setClearColor(0x000000, 0);

  containerRef.current.appendChild(renderer.domElement);
  // ensure the canvas element stays visually transparent
  renderer.domElement.style.background = "transparent";

    // --- GROUPS ---
    const tiltWrapper = new THREE.Group();
    const spinWrapper = new THREE.Group();
    tiltWrapper.add(spinWrapper);
    scene.add(tiltWrapper);

    // --- COLORS ---
    const colorA = new THREE.Color("#7C3AED");
    const colorB = new THREE.Color("#CCFF00");

    // --- GEOMETRY ---
    const baseGeo = new THREE.IcosahedronGeometry(1.3, 0);
    const edges = new THREE.EdgesGeometry(baseGeo);
    const lineGeo = new LineSegmentsGeometry().setPositions(
      edges.attributes.position.array
    );

    const pos = edges.attributes.position.array;
    const colors: number[] = [];
    const c = new THREE.Color();

    for (let i = 0; i < pos.length; i += 3) {
      const t = (pos[i + 1] + 1.3) / 2.6;
      c.lerpColors(colorA, colorB, t);
      colors.push(c.r, c.g, c.b);
    }

    lineGeo.setColors(colors);

    const lineMat = new LineMaterial({
      linewidth: 3,
      vertexColors: true,
      transparent: true,
      // keep opacity within normal range
      opacity: 2,
    });

    const wire = new Line2(lineGeo, lineMat);
    spinWrapper.add(wire);

    // --- POINTS ---
    const pointsMat = new THREE.PointsMaterial({
      size: 0.02,
      color: 0xe6f7ff,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 2,
    });

    const points = new THREE.Points(baseGeo, pointsMat);
    spinWrapper.add(points);

    // --- SPRINKLES (small particles that emit when the shape moves) ---
    const maxSprinkles = 80;
    type Sprinkle = {
      sprite: any;
      vel: any;
      life: number;
    };

    const sprinkles: Sprinkle[] = [];

    // create two soft circular sprite textures for sprinkles (one per color)
  const makeSprinkleTexture = (col: any) => {
      const size = 64;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      // bright center then colored halo matching the shape palette, with low alpha
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(0.15, `rgba(${Math.round(col.r * 255)}, ${Math.round(col.g * 255)}, ${Math.round(col.b * 255)}, 0.9)`);
      grad.addColorStop(0.5, `rgba(${Math.round(col.r * 255)}, ${Math.round(col.g * 255)}, ${Math.round(col.b * 255)}, 0.45)`);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);
      const tex = new THREE.CanvasTexture(canvas);
      tex.minFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      return tex;
    };

    const sprinkleTexA = makeSprinkleTexture(colorA);
    const sprinkleTexB = makeSprinkleTexture(colorB);

  const spawnSprinkle = (position: any) => {
      if (sprinkles.length >= maxSprinkles) return;

      // choose color texture randomly but subtly favoring the underlying palette
      const tex = Math.random() > 0.5 ? sprinkleTexA : sprinkleTexB;

      const material = new THREE.SpriteMaterial({
        map: tex,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
        opacity: 0.7,
      });

      const sprite = new THREE.Sprite(material);
      // smaller, subtler sprinkles
      sprite.scale.set(0.04, 0.04, 0.04);
      sprite.position.copy(position);

      // gentler velocity away from center with a small random offset
      const vel = position.clone().normalize().multiplyScalar(0.008 + Math.random() * 0.01);
      vel.x += (Math.random() - 0.5) * 0.006;
      vel.y += (Math.random() - 0.5) * 0.006;
      vel.z += (Math.random() - 0.5) * 0.006;

      const s: Sprinkle = { sprite, vel, life: 0.7 };
      sprinkles.push(s);
      scene.add(sprite);
    };

    // --- POST ---
    // Create an RGBA render target for the composer so postprocessing keeps alpha
    const size = new THREE.Vector2();
    renderer.getSize(size);
    const renderTarget = new THREE.WebGLRenderTarget(size.x || 800, size.y || 600, {
      format: THREE.RGBAFormat,
      encoding: renderer.outputEncoding,
      samples: Math.max(0, renderer.getContext()?.getParameter?.(renderer.getContext().SAMPLES) || 0),
    });

    const composer = new EffectComposer(renderer, renderTarget);
    composer.renderToScreen = true;
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(
      new UnrealBloomPass(
        new THREE.Vector2(300, 300),
        0.5, // lower strength for less aggressive glow
        0.2,
        0.85
      )
    );

    // --- RESIZE ---
    const resize = () => {
  if (!containerRef.current) return;

  const { clientWidth, clientHeight } = containerRef.current;

  renderer.setSize(clientWidth, clientHeight);

  camera.aspect = clientWidth / clientHeight;
  camera.updateProjectionMatrix();

  composer.setSize(clientWidth, clientHeight);

  // IMPORTANT: LineMaterial needs resolution AFTER width/height exist
  lineMat.resolution.set(clientWidth, clientHeight);
};

    resize();
    window.addEventListener("resize", resize);

    // --- MOUSE ---
    let mx = 0,
      my = 0;

    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth) * 2 - 1;
      my = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", onMouse);

    // --- ANIMATE ---
    let prevY = spinWrapper.rotation.y;
    let prevX = spinWrapper.rotation.x;

    const animate = () => {
      // base rotation
      spinWrapper.rotation.y += 0.005;
      spinWrapper.rotation.x += 0.002;

      // responsive tilt
      tiltWrapper.rotation.y += 0.05 * (mx * 0.4 - tiltWrapper.rotation.y);
      tiltWrapper.rotation.x += 0.05 * (my * 0.4 - tiltWrapper.rotation.x);

      // detect motion amount (how much the shape rotated since last frame)
      const dy = Math.abs(spinWrapper.rotation.y - prevY);
      const dx = Math.abs(spinWrapper.rotation.x - prevX);
      const motion = Math.sqrt(dx * dx + dy * dy);

      // when motion is above a tiny threshold, spawn a few sprinkles
      if (motion > 0.0005) {
        const spawnCount = Math.min(4, Math.ceil(motion * 200));
        for (let i = 0; i < spawnCount; i++) {
          // pick a random vertex from base geometry
          const posAttr = baseGeo.attributes.position;
          const vIdx = Math.floor(Math.random() * (posAttr.count));
          const p = new THREE.Vector3().fromBufferAttribute(posAttr, vIdx);
          // transform the local vertex position to world space
          spinWrapper.localToWorld(p);
          spawnSprinkle(p);
        }
      }

      prevY = spinWrapper.rotation.y;
      prevX = spinWrapper.rotation.x;

      // update sprinkles: simple physics + fade
      for (let i = sprinkles.length - 1; i >= 0; i--) {
        const s = sprinkles[i];
        s.sprite.position.add(s.vel);
        // apply slight damping
        s.vel.multiplyScalar(0.98);
        // reduce life
        s.life -= 0.01;
  (s.sprite.material as any).opacity = Math.max(0, s.life);
        // slowly scale down
        s.sprite.scale.multiplyScalar(0.985);
        if (s.life <= 0) {
          scene.remove(s.sprite);
          if ((s.sprite.material as any).map) {
            // don't dispose the shared texture
          }
          (s.sprite.material as any).dispose();
          s.sprite.geometry.dispose?.();
          sprinkles.splice(i, 1);
        }
      }

      composer.render();
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      // cleanup sprinkles
      for (const s of sprinkles) {
        scene.remove(s.sprite);
        (s.sprite.material as any).dispose();
      }
      sprinkles.length = 0;
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}
