'use client';

import * as THREE from 'three';
import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Image,
  Environment,
  ScrollControls,
  useScroll,
  useTexture,
} from '@react-three/drei';
import { easing } from 'maath';
import './util';
import CustomCursor from '../CustomCursor';

const ScrollSlider = () => (
  <div className={`w-full h-screen cursor-none`}>
    <CustomCursor text="Scroll" />
    <Canvas camera={{ position: [0, 0, 100], fov: 15 }}>
      <fog attach="fog" args={['#a79', 8.5, 12]} />
      <ScrollControls pages={4} infinite>
        <Rig rotation={[0, 0, 0.15]}>
          <Carousel />
        </Rig>
        <Banner position={[0, -0.15, 0]} />
      </ScrollControls>
      <Environment preset="dawn" background backgroundBlurriness={0.5} />
    </Canvas>
  </div>
);

function Rig(props: any) {
  const ref = useRef();
  const scroll = useScroll();
  useFrame((state, delta) => {
    //@ts-ignore
    ref.current.rotation.y = -scroll.offset * (Math.PI * 2); // Rotate contents
    //@ts-ignore
    state.events.update(); // Raycasts every frame rather than on pointer-move
    easing.damp3(
      state.camera.position,
      [-state.pointer.x * 2, state.pointer.y + 1.5, 10],
      0.3,
      delta,
    ); // Move camera
    state.camera.lookAt(0, 0, 0); // Look at center
  });
  return <group ref={ref} {...props} />;
}

function Carousel({ radius = 1.4, count = 8 }) {
  return Array.from({ length: count }, (_, i) => (
    <Card
      key={i}
      url={`/img${Math.floor(i % 10) + 1}__.jpeg`}
      position={[
        Math.sin((i / count) * Math.PI * 2) * radius,
        0,
        Math.cos((i / count) * Math.PI * 2) * radius,
      ]}
      rotation={[0, Math.PI + (i / count) * Math.PI * 2, 0]}
    />
  ));
}

//@ts-ignore
function Card({ url, ...props }) {
  const ref = useRef(null);
  const [hovered, hover] = useState(false);
  const pointerOver = (e: any) => (e.stopPropagation(), hover(true));
  const pointerOut = () => hover(false);
  useFrame((state, delta) => {
    //@ts-ignore
    easing.damp3(ref.current.scale, hovered ? 1.15 : 1, 0.1, delta);
    easing.damp(
      //@ts-ignore
      ref.current.material,
      'radius',
      hovered ? 0.25 : 0.1,
      0.2,
      delta,
    );
    //@ts-ignore
    easing.damp(ref.current.material, 'zoom', hovered ? 1 : 1.5, 0.2, delta);
  });
  return (
    <>
      <Image
        //@ts-ignore
        alt="sample"
        ref={ref}
        url={url}
        transparent
        side={THREE.DoubleSide}
        onPointerOver={pointerOver}
        onPointerOut={pointerOut}
        {...props}
      >
        {/* 
      //@ts-ignore */}
        <bentPlaneGeometry args={[0.1, 1, 1, 20, 20]} />
      </Image>
    </>
  );
}

//@ts-ignore
function createTextTexture(
  //@ts-ignore
  text,
  font = 'Arial',
  size = 100,
  color = 'black',
  backgroundColor = 'white',
) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  //@ts-ignore
  context.font = `${size}px ${font}`;
  //@ts-ignore

  const textWidth = context.measureText(text).width;

  canvas.width = textWidth;
  canvas.height = size * 1.4; // Add some padding to the height

  // Optional: Adjust canvas dimensions if needed
  // canvas.width = Math.ceil(canvas.width / 4) * 4
  // canvas.height = Math.ceil(canvas.height / 4) * 4

  // Set the background color
  //@ts-ignore

  context.fillStyle = backgroundColor;
  //@ts-ignore

  context.fillRect(0, 0, canvas.width, canvas.height);

  // Set the text color
  //@ts-ignore

  context.fillStyle = color;
  //@ts-ignore

  context.font = `${size}px ${font}`;
  //@ts-ignore

  context.fillText(text, 0, size);

  return new THREE.CanvasTexture(canvas);
}

//@ts-ignore
function Banner(props) {
  const ref = useRef();
  // const texture = useTexture('/work_.png');
  const texture = useMemo(() => createTextTexture(' Sample Text '), []);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  const scroll = useScroll();
  useFrame((state, delta) => {
    //@ts-ignore
    ref.current.material.time.value += Math.abs(scroll.delta) * 4;
    //@ts-ignore
    ref.current.material.map.offset.x += delta / 2;
  });
  return (
    <mesh ref={ref} {...props}>
      <cylinderGeometry args={[1.6, 1.6, 0.14, 128, 16, true]} />
      {/* 
      //@ts-ignore */}
      <meshSineMaterial
        map={texture}
        map-anisotropy={16}
        map-repeat={[30, 1]}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}

export default ScrollSlider;
