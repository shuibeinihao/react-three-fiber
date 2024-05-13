import { Canvas, useLoader, useThree, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { FirstPersonCameraControl } from "../../../assets/js/firstPersonCameraControl";

import { Stars } from "@react-three/drei";
import { useControls } from "leva"; //快速设置gui
/**房屋院子模型 */
function Model({ result }) {
  /**加载模型 */
  return (
    <>
      <primitive object={result} />
    </>
  );
}

/**人物模型 */
function PersonModel({ result, personModel }) {
  //实例化FirstPersonCameraControl
  const camera = useThree((state) => state.camera);
  const renderer = useThree((state) => {
    return state.gl;
  });
  const firstperson = new FirstPersonCameraControl(camera, renderer.domElement);
  firstperson.colliders = result;
  firstperson.personModel = personModel;
  personModel.scene.add(camera);
  /**加载人物模型动画 */
  const modelRef = useRef();

  /** 更新状态或调用其他函数 */
  useEffect(() => {
    const actions = {};
    const model = modelRef.current;
    const mixer = new THREE.AnimationMixer(model);
    personModel.animations.forEach((clip) => {
      actions[clip.name] = mixer.clipAction(clip);
    });
    const animate = () => {
      mixer.update(0.0167); // Update the mixer with the time delta
      requestAnimationFrame(animate);
    };
    animate();
    actions["Walk"].play(); // Play an animation "Idle"  "Run"  "TPose" "Walk"

    firstperson.enabled = true;
    firstperson.actions = actions;
    firstperson.personModel = personModel;
    return () => {
      mixer.stopAllAction();
    };
  }, []);

  /**根据渲染帧执行 */
  useFrame(() => {
    firstperson.update();
  });

  return (
    <>
      <primitive object={personModel.scene} ref={modelRef} />
    </>
  );
}

//相机参数初始化
function ChangeCamera() {
  const camera = useThree((state) => state.camera);
  const scene = useThree((state) => state.scene);
  camera.position.set(0, 2, 1.5);
  camera.lookAt(new THREE.Vector3(0, 2, 1.5));
  const helper = new THREE.CameraHelper(camera);
  scene.add(helper);
}

export default function App() {
  const { axesHelperLength } = useControls({ axesHelperLength: 10 });
  /**加载场景模型 */
  const result = useLoader(GLTFLoader, "/scene.gltf", (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco-gltf/");
    loader.setDRACOLoader(dracoLoader);
  });
  /**加载人物模型并初始化位置 */
  const personModel = useLoader(
    GLTFLoader,
    "/gltf/Soldier.glb",
    (loader) => {}
  );
  personModel.scene.scale.set(0.5, 0.5, 0.5);
  personModel.scene.position.set(8.5, 1.2, 1.8);
  personModel.scene.rotation.y = Math.PI / 2;
  console.log("personModel.scene", personModel.scene);
  return (
    <Canvas>
      <ChangeCamera />
      <Stars />
      <axesHelper args={[axesHelperLength]} />
      <ambientLight intensity={Math.PI} />
      <Suspense fallback={null}>
        <PersonModel result={result.scene} personModel={personModel} />
        <Model result={result.scene} />
      </Suspense>
    </Canvas>
  );
}
