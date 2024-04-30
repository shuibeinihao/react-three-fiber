import React, { Suspense, useEffect, useReducer } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
function Test() {
  const [flag, toggle] = useReducer((state) => !state, true)
  useEffect(() => {
    const interval = setInterval(toggle, 500)
    return () => clearInterval(interval)
  }, [])
  const { scene } = useLoader(GLTFLoader, flag ? '/Stork.glb' : '/Parrot.glb')
  return <primitive object={scene} />
}

export default function App() {
  let widthInfo,heightInfo;
  window.addEventListener('resize', resizeCanvas)
  function resizeCanvas(){
    widthInfo=window.innerWidth
    heightInfo=window.innerHeight
  }
  resizeCanvas()
   
  return (
    <Canvas style={{width:widthInfo,height:heightInfo}} resize={{ debounce: 0 }}>
      <ambientLight intensity={Math.PI} />
      <Suspense fallback={null}>
        <Test />
      </Suspense>
    </Canvas>
  )
}
