import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { FirstPersonCameraControl } from "../../../assets/js/firstPersonCameraControl";

import {
  OrbitControls,
  Stars,
  KeyboardControls,
  PointerLockControls,
} from "@react-three/drei";
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

  // const clock = new THREE.Clock();
  // const v = new THREE.Vector3(-1, 0, 0);

  // const onChange = (name) => {
  //   const deltaTime = clock.getDelta();
  //   if (name === "forward") {
  //     const deltaPos = v.clone().multiplyScalar(deltaTime);
  //     console.log(deltaPos);
  //     camera.position.add(deltaPos); //更新玩家角色的位置
  //   }
  // };
  return (
    <KeyboardControls
      map={[
        { name: "forward", keys: ["ArrowUp", "w", "W"] },
        { name: "backward", keys: ["ArrowDown", "s", "S"] },
        { name: "left", keys: ["ArrowLeft", "a", "A"] },
        { name: "right", keys: ["ArrowRight", "d", "D"] },
        { name: "jump", keys: ["Space"] },
      ]}
      // onChange={onChange}
    >
      <primitive object={result.scene} />
    </KeyboardControls>
  );
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
      {/* <PointerLockControls /> */}
    </Canvas>
  );
}
