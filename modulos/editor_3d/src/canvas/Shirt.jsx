import React, { useRef } from "react";
import { easing } from "maath";
import { useSnapshot } from "valtio";
import { useFrame } from "@react-three/fiber";
import { Decal, useGLTF, useTexture } from "@react-three/drei";
import state from "../store";

const Shirt = () => {
  const snap = useSnapshot(state);
  const { nodes, materials } = useGLTF("/shirt_baked.glb");

  const logoTexture = useTexture(snap.logoDecal);
  const textTexture = useTexture(snap.textDecal);

  useFrame((state, delta) =>
    easing.dampC(materials.lambert1.color, snap.color, 0.25, delta)
  );

  const meshRef = useRef();

  const handlePointerDown = (e) => {
    e.stopPropagation();
    // convert world point to local mesh coordinates
    const localPoint = e.point.clone();
    if (meshRef.current) meshRef.current.worldToLocal(localPoint);
    // Prefer logo dragging if logo texture active, otherwise text
    if (snap.isLogoTexture) {
      state.isDraggingLogo = true;
      state.logoPosition = [localPoint.x, localPoint.y, localPoint.z];
      return;
    }

    if (snap.isTextEnabled) {
      state.isDraggingText = true;
      state.textPosition = [localPoint.x, localPoint.y, localPoint.z];
    }
  };

  const handlePointerMove = (e) => {
    e.stopPropagation();
    const localPoint = e.point.clone();
    if (meshRef.current) meshRef.current.worldToLocal(localPoint);
    if (snap.isLogoTexture && snap.isDraggingLogo) {
      state.logoPosition = [localPoint.x, localPoint.y, localPoint.z];
      return;
    }

    if (snap.isTextEnabled && snap.isDraggingText) {
      state.textPosition = [localPoint.x, localPoint.y, localPoint.z];
    }
  };

  const handlePointerUp = (e) => {
    e.stopPropagation();
    if (snap.isDraggingLogo) state.isDraggingLogo = false;
    if (snap.isDraggingText) state.isDraggingText = false;
  };

  const stateString = JSON.stringify(snap);

  return (
    <group key={stateString}>
      <mesh
        castShadow
        ref={meshRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        geometry={nodes.T_Shirt_male.geometry}
        material={materials.lambert1}
        material-roughness={1}
        dispose={null}
      >
        {/* T-shirt logo */}
        {snap.isLogoTexture && (
          <Decal
            position={snap.logoPosition || [0, 0.04, 0.15]}
            rotation={[0, 0, 0]}
            scale={snap.logoScale}
            map={logoTexture}
            {...{ mapAnisotropy: 16, depthTest: false, depthWrite: true }}
          />
        )}

        {/* T-shirt text (generated) */}
        {snap.isTextEnabled && textTexture && (
          <Decal
            position={snap.textPosition || [0, 0.12, 0.15]}
            rotation={[0, 0, 0]}
            scale={snap.textScale}
            map={textTexture}
            {...{ mapAnisotropy: 16, depthTest: false, depthWrite: true }}
          />
        )}
      </mesh>
    </group>
  );
};

export default Shirt;

/* The properties mapAnisotropy, depthTest, and depthWrite were not recognized in the first version of the code because they were not defined as valid props for the Decal component.

In React, components can only receive and recognize props that are explicitly defined and expected by the component. When you pass a prop to a component that is not recognized or expected, React will ignore that prop and it will not have any effect on the component. 

By using the spread syntax in the second version, these properties are properly spread onto the Decal component, allowing it to receive and utilize the additional properties correctly.
*/
