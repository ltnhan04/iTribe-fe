"use client";
import { OrbitControls, PerspectiveCamera, View } from "@react-three/drei";
import * as THREE from "three";
import Lights from "@/components/common/lights";
import Loader from "@/components/common/loader";
import IPhone from "@/components/common/iPhone";
import { Suspense, MutableRefObject } from "react";

type ModelViewProps = {
  index: number;
  groupRef: MutableRefObject<THREE.Group | null>;
  gsapType: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  controlRef: MutableRefObject<any>;
  setRotationState: (angle: number) => void;
  size: string;
  item: {
    img: string;
    color: string[];
  };
};

const ModelView = ({
  index,
  groupRef,
  gsapType,
  controlRef,
  setRotationState,
  size,
  item,
}: ModelViewProps) => {
  return (
    <View
      index={index}
      id={gsapType}
      className={`w-full h-full absolute ${index === 2 ? "right-[-100%]" : ""}`}
    >
      <ambientLight intensity={0.3} />
      <PerspectiveCamera makeDefault position={[0, 0, 4]} />

      <Lights />
      <OrbitControls
        makeDefault
        ref={controlRef}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.4}
        target={new THREE.Vector3(0, 0, 0)}
        onEnd={() => setRotationState(controlRef.current.getAzimuthalAngle())}
      />

      <group
        ref={groupRef}
        name={`${index === 1 ? "small" : "large"}`}
        position={[0, 0, 0]}
      >
        <Suspense fallback={<Loader />}>
          <IPhone
            scale={index === 1 ? [15, 15, 15] : [17, 17, 17]}
            item={item}
            size={size}
          />
        </Suspense>
      </group>
    </View>
  );
};

export default ModelView;
