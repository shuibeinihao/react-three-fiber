import { Canvas, useLoader, useThree, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { FirstPersonCameraControl } from "../../../assets/js/firstPersonCameraControl";

import { OrbitControls, Stars } from "@react-three/drei";
import { useControls } from "leva"; //快速设置gui
let personModel = null;
/**模型操作 */
function Model() {
  /**加载模型 */
  const result = useLoader(GLTFLoader, "/scene.gltf", (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco-gltf/");
    loader.setDRACOLoader(dracoLoader);
  });

  //实例化FirstPersonCameraControl
  const camera = useThree((state) => state.camera);
  const renderer = useThree((state) => {
    return state.gl;
  });
  const firstperson = new FirstPersonCameraControl(camera, renderer.domElement);
  let orbit = true;

  /**gui 可视化实时改变参数 */
  const controls = useControls({
    firstEnabled: false,
    applyGravity: false,
    applyCollision: false,
    positionEasing: false,
  });

  /** 更新状态或调用其他函数 */
  useEffect(() => {
    if (controls.firstEnabled) {
      camera.position.set(10, 3, 1.5);
      camera.lookAt(new THREE.Vector3(0, 0, 0));
      firstperson.enabled = true;
      firstperson.applyGravity = controls.applyGravity;
      firstperson.applyCollision = controls.applyCollision;
      firstperson.positionEasing = controls.positionEasing;
      orbit = false;
    } else {
      firstperson.enabled = false;
      var ray = new THREE.Ray();
      console.log("camera.matrixWorld", camera.matrixWorld);
      ray.origin.setFromMatrixPosition(camera.matrixWorld);
      ray.direction.set(0, 0, 1).unproject(camera).sub(ray.origin).normalize();
      orbit = true;
    }
  }, [
    controls.firstEnabled,
    controls.applyGravity,
    controls.applyCollision,
    controls.positionEasing,
  ]);

  /**根据渲染帧执行 */
  useFrame(() => {
    firstperson.update();
  });

  /**设置碰撞体 */
  firstperson.colliders = result.scene;
  return (
    <>
      {/* <OrbitControls enabled={orbit} /> */}
      <primitive object={result.scene} />
    </>
  );
}

/**人物模型 */
function PersonModel() {
  /**加载模型 */
  personModel = useLoader(GLTFLoader, "/gltf/Soldier.glb", (loader) => {});
  const modelRef = useRef();
  useEffect(() => {
    const model = modelRef.current;
    const mixer = new THREE.AnimationMixer(model);
    const actions = {};
    personModel.animations.forEach((clip) => {
      actions[clip.name] = mixer.clipAction(clip);
    });

    const animate = () => {
      mixer.update(0.0167); // Update the mixer with the time delta
      requestAnimationFrame(animate);
    };
    animate();
    actions["TPose"].play(); // Play an animation "Idle"  "Run"  "TPose" "Walk"
    return () => {
      mixer.stopAllAction();
    };
  }, [personModel]);
  personModel.scene.scale.set(0.6, 0.6, 0.6);
  personModel.scene.position.set(8.5, 0.4, 1.8);
  personModel.scene.rotation.y = Math.PI / 2;
  return (
    <>
      <primitive object={personModel.scene} ref={modelRef} />
    </>
  );
}

//相机参数初始化
function ChangeCamera() {
  const camera = useThree((state) => state.camera);
  camera.fov = 65; // 修改相机视野
  camera.aspect = window.innerWidth / window.innerHeight; // 修改相机长度比
  camera.near = 0.01; // 修改相机近裁剪面距离
  camera.far = 100; // 修改相机远裁剪面距离
  camera.position.set(10, 3, 1.5);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
}

export default function App() {
  const { axesHelperLength } = useControls({ axesHelperLength: 10 });

  return (
    <Canvas>
      <ChangeCamera />
      <Stars />
      <axesHelper args={[axesHelperLength]} />
      <ambientLight intensity={Math.PI} />
      <Suspense fallback={null}>
        <Model />
        <PersonModel />
      </Suspense>
    </Canvas>
  );
}
