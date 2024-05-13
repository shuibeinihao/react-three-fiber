import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { FirstPersonCameraControl } from "../../../assets/js/firstPersonCameraControl1";

import { OrbitControls, Stars, KeyboardControls } from "@react-three/drei";
import { useControls } from "leva"; //快速设置gui

/**加载gltf房屋模型 */
function Model() {
  const result = useLoader(GLTFLoader, "/scene.gltf", (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco-gltf/");
    loader.setDRACOLoader(dracoLoader);
  });

  //firstperson
  const camera = useThree((state) => state.camera);
  const renderer = useThree((state) => {
    return state.gl;
  });
  const firstperson = new FirstPersonCameraControl(camera, renderer.domElement);
  firstperson.enabled = false;

  let settings = {
    firstPerson: false,
    gravity: false,
    collision: false,
    positionEasing: false,
    threePerson: false,
  };
  return <primitive object={result.scene} />;
}

//相机参数修改
function ChangeCamera() {
  const camera = useThree((state) => state.camera);
  camera.position.set(10, 3, 1.5);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
}

function onSettingsChange() {
  console.log(222222);
}

export default function App() {
  const { axesHelperLength } = useControls({ axesHelperLength: 10 });
  useControls({
    check: false,
    firstPerson: false,
  });
  return (
    <Canvas>
      <ChangeCamera />
      <Stars />
      <axesHelper args={[axesHelperLength]} />
      <ambientLight intensity={Math.PI} />
      <OrbitControls />
      <Suspense fallback={null}>
        <Model />
      </Suspense>
    </Canvas>
  );
}
