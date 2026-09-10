import { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import SmoothOrbitControls from '../../SmoothOrbitControls';
import { Scene } from './Scene';
import {
  CAMERA_FOV,
  CAMERA_START,
  MAX_DISTANCE,
  MIN_DISTANCE,
  ORBIT_SETTINGS,
  TRACE_SAMPLES,
  type Telemetry,
  type Variant,
} from './shared';

type PaneProps = {
  variant: Variant;
  telemetry: Telemetry;
  zoomSpeed: number;
  zoomDamping: number;
  resetToken: number;
  onFirstInteraction: () => void;
};

/** Records the camera-to-target distance each frame so the zoom curve can be drawn. */
function DistanceProbe({ telemetry, resetToken }: { telemetry: Telemetry; resetToken: number }) {
  const camera = useThree((s) => s.camera);

  useEffect(() => {
    // Both controls derive their state from the live camera transform on every update(),
    // so writing the camera position is enough to reset either variant.
    camera.position.copy(CAMERA_START);
    camera.updateProjectionMatrix();
  }, [camera, resetToken]);

  useFrame(() => {
    const d = camera.position.length();
    telemetry.distance = d;
    telemetry.samples[telemetry.head] = d;
    telemetry.head = (telemetry.head + 1) % TRACE_SAMPLES;
  });

  return null;
}

export function Pane({
  variant,
  telemetry,
  zoomSpeed,
  zoomDamping,
  resetToken,
  onFirstInteraction,
}: PaneProps) {
  const traceRef = useRef<HTMLCanvasElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      const canvas = traceRef.current;
      if (numRef.current) numRef.current.textContent = telemetry.distance.toFixed(2);
      if (!canvas) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (w === 0 || h === 0) return;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      const pad = 4 * dpr;
      const span = MAX_DISTANCE - MIN_DISTANCE;
      ctx.beginPath();
      for (let i = 0; i < TRACE_SAMPLES; i++) {
        const v = telemetry.samples[(telemetry.head + i) % TRACE_SAMPLES];
        const x = (i / (TRACE_SAMPLES - 1)) * w;
        const t = Math.min(Math.max((v - MIN_DISTANCE) / span, 0), 1);
        const y = pad + (1 - t) * (h - pad * 2);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = variant === 'smooth' ? '#5cc8ff' : '#ff8a5c';
      ctx.lineWidth = 1.5 * dpr;
      ctx.lineJoin = 'round';
      ctx.stroke();
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [telemetry, variant]);

  const isSmooth = variant === 'smooth';

  return (
    <section className="pane" data-variant={variant}>
      <div className="canvas-wrap" onPointerDown={onFirstInteraction} onWheel={onFirstInteraction}>
        <Canvas
          dpr={[1, 2]}
          camera={{ fov: CAMERA_FOV, position: CAMERA_START.toArray(), near: 0.1, far: 100 }}
        >
          <Scene />
          <DistanceProbe telemetry={telemetry} resetToken={resetToken} />
          {isSmooth ? (
            <SmoothOrbitControls
              {...ORBIT_SETTINGS}
              zoomSpeed={zoomSpeed}
              zoomDamping={zoomDamping}
            />
          ) : (
            <OrbitControls {...ORBIT_SETTINGS} />
          )}
        </Canvas>
      </div>

      <header className="pane-head">
        <span className="dot" />
        <span className="name">{isSmooth ? 'SmoothOrbitControls' : 'OrbitControls'}</span>
        <span className="sub">{isSmooth ? 'this repo' : 'drei, stock'}</span>
      </header>

      <div className="readout">
        <div className="trace">
          <canvas ref={traceRef} />
        </div>
        <div className="num">
          distance <b ref={numRef}>0.00</b>
        </div>
      </div>
    </section>
  );
}
