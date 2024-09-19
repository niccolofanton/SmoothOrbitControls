import { OrbitControlsProps } from '@react-three/drei/core/OrbitControls';
import { OrbitControls, TrackballControls } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import React, { useRef } from 'react';

interface SmoothOrbitControlsProps extends OrbitControlsProps {
    zoomSpeed?: number;
    zoomDamping?: number
}

export default function SmoothOrbitControls(
    {
        zoomSpeed = .07,
        zoomDamping = .03,
        ...props
    }: SmoothOrbitControlsProps
) {

    const orbitControlsRef = useRef<any>();
    const trackballControlsRef = useRef<any>();
    const { camera, gl } = useThree();

    useFrame(() => {
        if (trackballControlsRef.current && !props.zoomToCursor) {
            const t = orbitControlsRef.current.target;
            trackballControlsRef.current.target.set(t.x, t.y, t.z)
        }
    });

    return (
        <>
            <OrbitControls
                ref={orbitControlsRef}
                args={[camera, gl.domElement]}
                {...props}
                enableZoom={false}
            />

            <TrackballControls
                ref={trackballControlsRef}
                args={[camera, gl.domElement]}
                dynamicDampingFactor={zoomDamping}
                zoomSpeed={zoomSpeed}
                noPan
                noRotate
                cursorZoom={props.zoomToCursor}
            />
        </>
    );
};
