import * as THREE from 'three';

/** Identical starting camera for both panes. */
export const CAMERA_START = new THREE.Vector3(4.6, 3.1, 6.4);
export const CAMERA_FOV = 50;

export const MIN_DISTANCE = 3;
export const MAX_DISTANCE = 17;

/**
 * The one thing this demo has to get right: every OrbitControls setting is shared, so the only
 * difference between the two panes is which component drives the zoom.
 * Note that `enableDamping` damps rotation on both sides -- plain OrbitControls never damps the
 * dolly, which is exactly the gap SmoothOrbitControls fills.
 */
export const ORBIT_SETTINGS = {
  enableDamping: true,
  dampingFactor: 0.075,
  enablePan: false,
  autoRotate: true,
  autoRotateSpeed: 0.45,
  minDistance: MIN_DISTANCE,
  maxDistance: MAX_DISTANCE,
  minPolarAngle: 0.35,
  maxPolarAngle: Math.PI / 2 - 0.05,
} as const;

export type Variant = 'plain' | 'smooth';

export type Telemetry = { distance: number; samples: Float32Array; head: number };

export const TRACE_SAMPLES = 300;

export function createTelemetry(): Telemetry {
  return {
    distance: CAMERA_START.length(),
    samples: new Float32Array(TRACE_SAMPLES).fill(CAMERA_START.length()),
    head: 0,
  };
}
