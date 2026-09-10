import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const RING_COUNT = 5;
const PER_RING = 26;
const TOTAL = RING_COUNT * PER_RING;

/**
 * Fully procedural scene: no downloaded assets.
 * The concentric rings of pillars give strong parallax at every zoom level, which is what
 * makes a difference in zoom easing visible rather than just felt.
 */
export function Scene() {
  const pillars = useRef<THREE.InstancedMesh>(null);
  const core = useRef<THREE.Mesh>(null);

  const { matrices, colors } = useMemo(() => {
    const m: THREE.Matrix4[] = [];
    const c = new Float32Array(TOTAL * 3);
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    let i = 0;
    for (let ring = 0; ring < RING_COUNT; ring++) {
      const radius = 2.6 + ring * 1.35;
      for (let k = 0; k < PER_RING; k++) {
        const a = (k / PER_RING) * Math.PI * 2 + ring * 0.24;
        // Deterministic pseudo-random height, so both panes are byte-identical scenes.
        const n = Math.sin(a * 3.1 + ring * 1.7) * 0.5 + Math.cos(a * 1.3 - ring) * 0.5;
        const h = 0.35 + Math.abs(n) * 1.7;
        dummy.position.set(Math.cos(a) * radius, h / 2 - 1.2, Math.sin(a) * radius);
        dummy.rotation.set(0, -a, 0);
        dummy.scale.set(0.34, h, 0.34);
        dummy.updateMatrix();
        m.push(dummy.matrix.clone());

        color.setHSL(0.55 + n * 0.06, 0.35, 0.28 + Math.abs(n) * 0.22);
        c[i * 3 + 0] = color.r;
        c[i * 3 + 1] = color.g;
        c[i * 3 + 2] = color.b;
        i++;
      }
    }
    return { matrices: m, colors: c };
  }, []);

  useLayoutEffect(() => {
    const mesh = pillars.current;
    if (!mesh) return;
    matrices.forEach((matrix, i) => mesh.setMatrixAt(i, matrix));
    mesh.instanceMatrix.needsUpdate = true;
  }, [matrices]);

  useFrame((state) => {
    // Something is always moving, so the page is alive the moment it loads.
    if (core.current) {
      core.current.rotation.x = state.clock.elapsedTime * 0.18;
      core.current.rotation.y = state.clock.elapsedTime * 0.27;
    }
  });

  return (
    <>
      <color attach="background" args={['#0a0c10']} />
      <fog attach="fog" args={['#0a0c10', 9, 30]} />

      <hemisphereLight args={['#9fc7ff', '#12161d', 1.1]} />
      <directionalLight position={[4, 7, 3]} intensity={2.1} color="#ffe9d0" />
      <directionalLight position={[-6, 2, -4]} intensity={0.9} color="#5cc8ff" />

      <mesh ref={core}>
        <torusKnotGeometry args={[0.85, 0.27, 220, 32]} />
        <meshStandardMaterial color="#dfe7f5" roughness={0.22} metalness={0.65} />
      </mesh>

      <instancedMesh ref={pillars} args={[undefined, undefined, TOTAL]}>
        <boxGeometry args={[1, 1, 1]}>
          <instancedBufferAttribute attach="attributes-color" args={[colors, 3]} />
        </boxGeometry>
        <meshStandardMaterial vertexColors roughness={0.55} metalness={0.15} />
      </instancedMesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.201, 0]}>
        <circleGeometry args={[13, 64]} />
        <meshStandardMaterial color="#0e131b" roughness={0.9} metalness={0} />
      </mesh>

      <gridHelper args={[26, 26, '#1d2532', '#151b25']} position={[0, -1.2, 0]} />
    </>
  );
}
