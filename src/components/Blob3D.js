import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/*
 * A morphing 3D "liquid glass" blob (Three.js). Gently deforms, reflects a
 * studio environment, follows the pointer, and lerps its colour toward the
 * active theme tint. Falls back to nothing if WebGL is unavailable.
 */
function Blob3D({ tint = '#7C5CFF' }) {
  const mountRef = useRef(null);
  const targetColor = useRef(new THREE.Color(tint));

  // Keep the colour target in sync without re-initialising the scene.
  useEffect(() => { targetColor.current.set(tint); }, [tint]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
      return undefined; // no WebGL — panel keeps its gradient
    }

    const width = mount.clientWidth || 400;
    const height = mount.clientHeight || 320;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.2);

    // Studio reflections (no external HDR needed).
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;

    const geometry = new THREE.IcosahedronGeometry(1.2, 24);
    const basePos = geometry.attributes.position.array.slice();
    const nVerts = geometry.attributes.position.count;

    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(tint),
      metalness: 0.35,
      roughness: 0.12,
      clearcoat: 1,
      clearcoatRoughness: 0.18,
      iridescence: 0.55,
      iridescenceIOR: 1.4,
      envMapIntensity: 1.15,
      emissive: new THREE.Color(tint),
      emissiveIntensity: 0.06,
    });

    const blob = new THREE.Mesh(geometry, material);
    scene.add(blob);

    const key = new THREE.PointLight(0xffffff, 40, 20);
    key.position.set(4, 5, 5);
    const rim = new THREE.PointLight(new THREE.Color(tint), 26, 20);
    rim.position.set(-5, -3, 2);
    scene.add(key, rim, new THREE.AmbientLight(0xffffff, 0.35));

    // Pointer parallax
    const pointer = { x: 0, y: 0 };
    const onMove = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clock = new THREE.Clock();
    const posAttr = geometry.attributes.position;
    let raf = 0;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Organic displacement (cheap sum-of-sines pseudo-noise) along normals.
      if (!reduced) {
        for (let i = 0; i < nVerts; i++) {
          const ix = i * 3;
          const x = basePos[ix], y = basePos[ix + 1], z = basePos[ix + 2];
          const n =
            0.16 * Math.sin(x * 2.1 + t * 0.9) +
            0.13 * Math.sin(y * 2.7 - t * 1.1) +
            0.11 * Math.sin(z * 2.3 + t * 0.7) +
            0.07 * Math.sin((x + y + z) * 1.8 + t * 1.4);
          const k = 1 + n;
          posAttr.array[ix] = x * k;
          posAttr.array[ix + 1] = y * k;
          posAttr.array[ix + 2] = z * k;
        }
        posAttr.needsUpdate = true;
        geometry.computeVertexNormals();
      }

      blob.rotation.y = t * 0.18 + pointer.x * 0.5;
      blob.rotation.x = pointer.y * 0.35;
      blob.position.y = Math.sin(t * 0.8) * 0.08;

      // Smoothly move colour toward the active tint.
      material.color.lerp(targetColor.current, 0.05);
      material.emissive.lerp(targetColor.current, 0.05);
      rim.color.lerp(targetColor.current, 0.05);

      renderer.render(scene, camera);
    };
    animate();

    const ro = new ResizeObserver(() => {
      const w = mount.clientWidth, h = mount.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      geometry.dispose();
      material.dispose();
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div className="blob3d" ref={mountRef} aria-hidden="true" />;
}

export default Blob3D;
