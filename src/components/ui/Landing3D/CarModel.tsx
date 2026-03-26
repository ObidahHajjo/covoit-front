import { useRef, useMemo } from 'react'
import type { MutableRefObject } from 'react'
import type { Group } from 'three'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

const CAR_MODEL_URL = '/nissan_maxima_opt.glb'

export type CarState = { x: number; rotY: number; camLookX: number; camZDelta: number }

type Props = {
  carState: MutableRefObject<CarState>
  isMobile: boolean
  bp: 'mobile' | 'tablet' | 'desktop'
}

export function CarModel({ carState, bp }: Props) {
  const groupRef = useRef<Group>(null)
  const { scene } = useGLTF(CAR_MODEL_URL)
  const model = useMemo(() => scene.clone(true), [scene])

  const amp = bp === 'mobile' ? 0.35 : bp === 'tablet' ? 0.6 : 1
  const scale = bp === 'mobile' ? 0.85 : bp === 'tablet' ? 1.15 : 1.5
  const posX = bp === 'mobile' ? -1.2 : bp === 'tablet' ? -1.8 : -2.5

  useFrame(() => {
    if (!groupRef.current) return
    const targetX = carState.current.x * amp

    groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.07
    groupRef.current.rotation.y += (carState.current.rotY - groupRef.current.rotation.y) * 0.07
  })

  return (
    <group ref={groupRef} position={[posX, -0.5, 0]} scale={scale}>
      <primitive object={model} />
    </group>
  )
}

useGLTF.preload(CAR_MODEL_URL)
