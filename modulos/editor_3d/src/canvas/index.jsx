import { Canvas } from "@react-three/fiber";
import { Environment, Center } from "@react-three/drei";

import Shirt from "./Shirt";
import Backdrop from "./Backdrop";
import CameraRig from "./CameraRig";

const CanvasModel = () => {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 0], fov: 25 }} // fov = field of view
      // make the canvas opaque so CSS background and three.js clear color render as white
      gl={{ preserveDrawingBuffer: true, alpha: false }}
      onCreated={(state) => {
        // Force a white clear color so the canvas background is white.
        state.gl.setClearColor(0xffffff, 1);
        // Ensure exposure stays neutral
        if (state.gl.toneMappingExposure !== undefined) state.gl.toneMappingExposure = 1;
      }}
      onPointerMove={(e) => {
        // normalize pointer to -1..1 range based on window center
        const nx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        const ny = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
        import("../store").then(({ default: state }) => {
          state.pointer = { x: nx, y: ny };
        });
      }}
      onPointerLeave={() => {
        import("../store").then(({ default: state }) => {
          state.pointer = { x: 0, y: 0 };
        });
      }}
      className="w-full max-w-full h-full bg-white"
    >
      <ambientLight intensity={0.5} />
      <Environment preset="city" background={false} />

      <CameraRig>
        <Backdrop />
        <Center>
          <Shirt />
        </Center>
      </CameraRig>
    </Canvas>
  );
};

export default CanvasModel;
