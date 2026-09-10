import { useEffect, useMemo, useRef, useState } from 'react';
import { Pane } from './Pane';
import { ControlPanel } from './ControlPanel';
import { createTelemetry } from './shared';

const DEFAULTS = { zoomSpeed: 0.07, zoomDamping: 0.03 };

export function App() {
  const [zoomSpeed, setZoomSpeed] = useState(DEFAULTS.zoomSpeed);
  const [zoomDamping, setZoomDamping] = useState(DEFAULTS.zoomDamping);
  const [resetToken, setResetToken] = useState(0);
  const [interacted, setInteracted] = useState(false);

  const plain = useMemo(createTelemetry, []);
  const smooth = useMemo(createTelemetry, []);

  const interactedRef = useRef(false);
  const markInteracted = () => {
    if (interactedRef.current) return;
    interactedRef.current = true;
    setInteracted(true);
  };

  const isCoarse =
    typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  useEffect(() => {
    // Stops the page from scrolling/zooming while the user is pinching a canvas on mobile.
    const stop = (e: TouchEvent) => {
      if (e.touches.length > 1) e.preventDefault();
    };
    document.addEventListener('touchmove', stop, { passive: false });
    return () => document.removeEventListener('touchmove', stop);
  }, []);

  return (
    <div className="app">
      <header className="top">
        <p className="brand">SmoothOrbitControls</p>
        <p>
          Same scene, same camera, same OrbitControls settings.{' '}
          {isCoarse ? 'Pinch each half' : 'Scroll on each half'} — only the zoom differs.
        </p>
        <span className="spacer" />
        <a href="https://github.com/niccolofanton/SmoothOrbitControls">GitHub</a>
      </header>

      <div className="stage">
        <Pane
          variant="plain"
          telemetry={plain}
          zoomSpeed={zoomSpeed}
          zoomDamping={zoomDamping}
          resetToken={resetToken}
          onFirstInteraction={markInteracted}
        />
        <Pane
          variant="smooth"
          telemetry={smooth}
          zoomSpeed={zoomSpeed}
          zoomDamping={zoomDamping}
          resetToken={resetToken}
          onFirstInteraction={markInteracted}
        />
        <div className="hint" data-hidden={interacted}>
          <span>{isCoarse ? 'Pinch to zoom' : 'Scroll to zoom'}</span>
        </div>
      </div>

      <ControlPanel
        defaults={DEFAULTS}
        onZoomSpeed={setZoomSpeed}
        onZoomDamping={setZoomDamping}
        onReset={() => setResetToken((n) => n + 1)}
      />
    </div>
  );
}
