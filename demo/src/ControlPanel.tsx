import { useEffect, useRef } from 'react';
import { Pane as TweakPane } from 'tweakpane';
import { createDriftpane } from '@niccolofanton/driftpane';
import '@niccolofanton/driftpane/theme.css';

type Props = {
  defaults: { zoomSpeed: number; zoomDamping: number };
  onZoomSpeed: (v: number) => void;
  onZoomDamping: (v: number) => void;
  onReset: () => void;
};

/**
 * The panel earns its place here: `zoomSpeed` and `zoomDamping` are the component's only two
 * props, and their effect is a feel you have to move a slider to understand.
 * Both panes receive the same values, so the A/B stays fair -- plain OrbitControls simply
 * ignores them, which is the point.
 */
export function ControlPanel({ defaults, onZoomSpeed, onZoomDamping, onReset }: Props) {
  const handlers = useRef({ onZoomSpeed, onZoomDamping, onReset });
  handlers.current = { onZoomSpeed, onZoomDamping, onReset };

  useEffect(() => {
    const params = { ...defaults };

    const narrow = window.innerWidth <= 720;
    // On a phone the panel would sit on top of the top pane, so it starts collapsed there.
    const pane = new TweakPane({ title: 'SmoothOrbitControls props', expanded: !narrow });

    pane
      .addBinding(params, 'zoomSpeed', { min: 0.01, max: 0.3, step: 0.005 })
      .on('change', (ev) => handlers.current.onZoomSpeed(ev.value));

    pane
      .addBinding(params, 'zoomDamping', { min: 0.005, max: 0.3, step: 0.005 })
      .on('change', (ev) => handlers.current.onZoomDamping(ev.value));

    pane.addBlade({ view: 'separator' });
    pane.addButton({ title: 'Reset both cameras' }).on('click', () => handlers.current.onReset());

    // Convention for this collection: build the pane fully, then hand it to Driftpane.
    const width = 300;
    const drift = createDriftpane(pane, {
      storageNamespace: 'smooth-orbit-controls-demo',
      defaultPosition: { x: Math.max(12, window.innerWidth - width - 20), y: narrow ? 96 : 68 },
      width,
      theme: 'dark',
      // Two sliders and a button: presets and share links would be more chrome than content.
      presetsEnabled: false,
      urlSync: false,
      resizableHeight: false,
    });

    return () => {
      drift.dispose();
      pane.dispose();
    };
    // Mount once: the pane owns its own state and pushes changes out through the ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
