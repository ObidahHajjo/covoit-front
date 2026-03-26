import { Suspense, useRef } from 'react'
import type { MutableRefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Html, useProgress } from '@react-three/drei'
import { CarModel } from './CarModel'
import type { CarState } from './CarModel'

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <p style={{ color: 'var(--theme-muted, #888)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
        {Math.round(progress)}%
      </p>
    </Html>
  )
}

function CameraController({ carState, bp }: { carState: MutableRefObject<CarState>; bp: string }) {
  const { camera } = useThree()
  const targetZ = bp === 'mobile' ? 8.5 : bp === 'tablet' ? 7.5 : 6.5
  const introZ = useRef(11)
  const lookX = useRef(-1.5)

  useFrame(() => {
    introZ.current += (targetZ - introZ.current) * 0.018
    camera.position.set(0, 0.8, introZ.current + carState.current.camZDelta)

    lookX.current += (carState.current.camLookX - lookX.current) * 0.05
    camera.lookAt(lookX.current * 0.35, 0.2, 0)
  })

  return null
}

type Props = {
  carState: MutableRefObject<CarState>
  isMobile: boolean
  bp: 'mobile' | 'tablet' | 'desktop'
}

export function Scene({ carState, isMobile, bp }: Props) {
  const fov = bp === 'mobile' ? 50 : bp === 'tablet' ? 45 : 40

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0.8, 11], fov }}
        gl={{ alpha: true }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 6]} intensity={1.4} castShadow />
        <directionalLight position={[-5, 4, -4]} intensity={0.35} color="#d4e9c5" />
        <Suspense fallback={<Loader />}>
          <CarModel carState={carState} isMobile={isMobile} bp={bp} />
          <ContactShadows
            position={[0, -0.78, 0]}
            opacity={0.25}
            scale={16}
            blur={3}
            far={4}
            color="#2a3a2a"
          />
        </Suspense>
        <CameraController carState={carState} bp={bp} />
      </Canvas>
    </div>
  )
}
