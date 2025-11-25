import React, { useRef } from "react";
// import { easing } from "maath";
// import { useFrame } from "@react-three/fiber";
import { AccumulativeShadows, RandomizedLight } from "@react-three/drei";

const Backdrop = () => {

  const shadows = useRef();
/* 
  // Utilizando useFrame para animar la posición de las luces
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime(); // Obtener el tiempo transcurrido

    // Animar la posición de las luces utilizando easing
    const light1Position = [
      easing.easeInOutSine(t, -5, 5, 10), // Animar la posición en el eje x
      5, // Mantener la posición en el eje y
      -9 // Mantener la posición en el eje z
    ];
    const light2Position = [
      easing.easeInOutSine(t, 5, -5, 10), // Animar la posición en el eje x
      5, // Mantener la posición en el eje y
      -10 // Mantener la posición en el eje z
    ];

    // Actualizar la posición de las luces
    shadows.current.children[0].position.set(...light1Position);
    shadows.current.children[1].position.set(...light2Position);
  });
 */

  return (
    <>
      {/* unlit white background plane placed far behind the model so it always reads white */}
      <mesh position={[0, 0, -10]} rotation={[0, 0, 0]}>
        <planeGeometry args={[120, 80]} />
        {/* use Basic material so lighting doesn't darken the background */}
        <meshBasicMaterial color={0xffffff} />
      </mesh>

      {/* keep a very subtle accumulative contact shadow under the shirt */}
      <AccumulativeShadows
        ref={shadows}
        temporal={true}
        frames={30}
        // make shadows barely visible so background stays white
        color="#000"
        opacity={0.12}
        scale={0.8}
        rotation={[Math.PI / 2, 0, 0]}
        // move shadow plane lower so it doesn't intersect the shirt silhouette
        position={[0, -1.0, -0.14]}
      >
        <RandomizedLight
          amount={2}
          radius={6}
          intensity={0.08}
          ambient={0.35}
          position={[5, 5, -10]}
        />
      </AccumulativeShadows>
    </>
  );
};

export default Backdrop;

/* 
easing: se utiliza para proporcionar funciones de interpolación que permiten animar propiedades de manera suave y controlada. Estas funciones de interpolación pueden ser útiles si se desea agregar animaciones personalizadas a los elementos de la escena, como transiciones suaves entre diferentes estados o efectos de movimiento más complejos. Si se desea agregar animaciones personalizadas a los elementos en el código, la importación de easing podría ser útil para proporcionar las funciones de interpolación necesarias.

useFrame: se utiliza en el contexto de la biblioteca @react-three/fiber para acceder al bucle de renderizado de Three.js y realizar acciones en cada fotograma de la animación. Esta función de gancho personalizado permite ejecutar código en cada fotograma de la animación, lo que puede ser útil para realizar actualizaciones dinámicas en la escena en respuesta a eventos o cambios en el estado. Por ejemplo, se puede utilizar useFrame para realizar transformaciones o animaciones específicas en los elementos de la escena en función del tiempo transcurrido o de otros factores. Si se desea agregar lógica personalizada que se ejecute en cada fotograma de la animación, la importación de useFrame podría ser útil para proporcionar esta funcionalidad. */