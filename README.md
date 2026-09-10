<div align="center">

# SmoothOrbitControls

**A drop-in `OrbitControls` replacement for React Three Fiber with smooth, damped zoom.**

![demo](./demo.gif)

**[▶ Live demo — side by side with stock `OrbitControls`](https://orbit.niccolofanton.dev)**

[![GitHub stars](https://img.shields.io/github/stars/niccolofanton/SmoothOrbitControls?style=flat)](https://github.com/niccolofanton/SmoothOrbitControls/stargazers)

</div>

## What it does

Default [drei](https://github.com/pmndrs/drei) `OrbitControls` zoom in discrete, snappy steps. `SmoothOrbitControls` keeps the familiar orbit/pan behaviour but replaces the abrupt zoom with a smooth, inertial one by pairing `OrbitControls` (for rotation and panning, with its own zoom disabled) with `TrackballControls` (for damped zoom). A `useFrame` effect keeps the `TrackballControls` target aligned with the `OrbitControls` target so the camera stays consistent.

It is a single, self-contained TypeScript/React component that accepts every prop the standard `OrbitControls` does, plus two extras to tune the zoom feel.

## Installation

There is no npm package: simply download [`SmoothOrbitControls.tsx`](./SmoothOrbitControls.tsx) and drop it into your project.

It relies on the React Three Fiber stack as peer dependencies, so make sure they are installed:

```bash
npm install three @react-three/fiber @react-three/drei
```

## Usage

Use it exactly like drei's `OrbitControls`, inside your `<Canvas>`:

```tsx
import { Canvas } from '@react-three/fiber';
import SmoothOrbitControls from './SmoothOrbitControls';

export default function Scene() {
  return (
    <Canvas>
      {/* your meshes, lights, etc. */}
      <SmoothOrbitControls zoomSpeed={0.07} zoomDamping={0.03} />
    </Canvas>
  );
}
```

### Props

| Prop          | Type     | Default | Description                                     |
| ------------- | -------- | ------- | ----------------------------------------------- |
| `zoomSpeed`   | `number` | `0.07`  | Speed of the smooth zoom.                        |
| `zoomDamping` | `number` | `0.03`  | Dynamic damping factor applied to the zoom.      |
| `...props`    | —        | —       | Any standard drei `OrbitControlsProps` (spread onto the underlying `OrbitControls`). |

## Features

- **Smooth, inertial zoom** instead of the default stepped zoom.
- **Drop-in API** — accepts all `OrbitControls` props.
- **Tunable feel** via `zoomSpeed` and `zoomDamping`.
- **Single file, zero extra dependencies** beyond the R3F stack you already use.

## Demo

[**orbit.niccolofanton.dev**](https://orbit.niccolofanton.dev) puts stock `OrbitControls` and `SmoothOrbitControls` next to each other in the same procedural scene, with the same starting camera and the same `OrbitControls` settings, so the zoom is the only variable. Scroll (or pinch) on one half, then the other: a live distance trace under each pane shows the stepped jump against the damped ease. `zoomSpeed` and `zoomDamping` are sliders.

The source lives in [`demo/`](./demo) and imports the component straight from the repository root, so it always exercises the file above:

```bash
cd demo
npm install
npm run dev
```

## Tech stack

- [React](https://react.dev/) + TypeScript
- [@react-three/fiber](https://github.com/pmndrs/react-three-fiber)
- [@react-three/drei](https://github.com/pmndrs/drei)
- [three.js](https://threejs.org/)

## Credits

Built by [niccolofanton](https://github.com/niccolofanton). Powered by the [pmndrs](https://github.com/pmndrs) ecosystem.
</content>
</invoke>
