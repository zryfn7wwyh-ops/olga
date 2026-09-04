"use client";

import { useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import type { ScanProxy } from "./scanProxy";

const ROBOT_SCALE = 0.34;
const BEAM_RADIUS = 0.3;
const BEAM_HEIGHT = 1.7;

interface RobotRigProps {
  proxyRef: MutableRefObject<ScanProxy>;
  robotScale: number;
}

function RobotRig({ proxyRef, robotScale }: RobotRigProps) {
  const group = useRef<THREE.Group>(null);
  const sensorMat = useRef<THREE.MeshStandardMaterial>(null);
  const eyeMatL = useRef<THREE.MeshStandardMaterial>(null);
  const eyeMatR = useRef<THREE.MeshStandardMaterial>(null);
  const beam = useRef<THREE.Mesh>(null);
  const beamMat = useRef<THREE.MeshBasicMaterial>(null);

  // Луч — конус, у которого вершина (источник) сдвинута в локальный
  // ноль, чтобы он рос из сенсора вниз, а не расширялся в обе стороны.
  const beamGeometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(BEAM_RADIUS, BEAM_HEIGHT, 24, 1, true);
    geo.translate(0, -BEAM_HEIGHT / 2, 0);
    return geo;
  }, []);

  useFrame((state) => {
    const p = proxyRef.current;
    const bob = Math.sin(state.clock.elapsedTime * 1.6) * 0.05;
    if (group.current) {
      group.current.position.set(p.x, p.y + bob, p.z);
      group.current.rotation.y = p.rotY + Math.sin(state.clock.elapsedTime * 0.8) * 0.06;
      group.current.scale.setScalar(p.scale * robotScale);
    }
    if (sensorMat.current) sensorMat.current.emissiveIntensity = p.sensorGlow;
    if (eyeMatL.current) eyeMatL.current.emissiveIntensity = 0.6 + p.sensorGlow * 0.4;
    if (eyeMatR.current) eyeMatR.current.emissiveIntensity = 0.6 + p.sensorGlow * 0.4;
    if (beam.current) beam.current.scale.y = Math.max(0.001, p.beamLength);
    if (beamMat.current) beamMat.current.opacity = p.beamOpacity;
  });

  return (
    <group ref={group}>
      {/* голова */}
      <RoundedBox args={[1.1, 0.7, 0.65]} radius={0.16} smoothness={4} position={[0, 0.55, 0]}>
        <meshStandardMaterial color="#1b3a73" metalness={0.75} roughness={0.28} />
      </RoundedBox>
      {/* визор */}
      <RoundedBox args={[0.9, 0.22, 0.05]} radius={0.08} smoothness={4} position={[0, 0.68, 0.34]}>
        <meshStandardMaterial color="#dfeaff" emissive="#3a7bff" emissiveIntensity={0.4} metalness={0.2} roughness={0.4} />
      </RoundedBox>
      {/* глаза */}
      <mesh position={[-0.24, 0.5, 0.36]}>
        <sphereGeometry args={[0.09, 24, 24]} />
        <meshStandardMaterial ref={eyeMatL} color="#0c3aa0" emissive="#246bfd" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0.24, 0.5, 0.36]}>
        <sphereGeometry args={[0.09, 24, 24]} />
        <meshStandardMaterial ref={eyeMatR} color="#0c3aa0" emissive="#246bfd" emissiveIntensity={0.6} />
      </mesh>
      {/* антенна */}
      <mesh position={[0, 1.02, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
        <meshStandardMaterial color="#8fb4ff" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#246bfd" emissive="#246bfd" emissiveIntensity={0.9} toneMapped={false} />
      </mesh>
      {/* корпус */}
      <RoundedBox args={[1.35, 0.85, 0.7]} radius={0.2} smoothness={4} position={[0, -0.35, 0]}>
        <meshStandardMaterial color="#12294f" metalness={0.7} roughness={0.32} />
      </RoundedBox>
      {/* панель на корпусе */}
      <RoundedBox args={[0.9, 0.1, 0.03]} radius={0.03} smoothness={2} position={[0, -0.08, 0.36]}>
        <meshStandardMaterial color="#8fb4ff" emissive="#3ad0ff" emissiveIntensity={0.35} metalness={0.3} roughness={0.4} />
      </RoundedBox>
      {/* сенсор — главный элемент */}
      <mesh position={[0, -0.35, 0.37]}>
        <torusGeometry args={[0.16, 0.035, 16, 32]} />
        <meshStandardMaterial color="#8fb4ff" metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh position={[0, -0.35, 0.4]}>
        <circleGeometry args={[0.13, 32]} />
        <meshStandardMaterial ref={sensorMat} color="#0a2a70" emissive="#3ad0ff" emissiveIntensity={0.3} toneMapped={false} />
      </mesh>
      {/* объемный луч сканера: растет из сенсора строго вниз */}
      <mesh ref={beam} position={[0, -0.35, 0.4]} geometry={beamGeometry}>
        <meshBasicMaterial
          ref={beamMat}
          color="#3ad0ff"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      {/* боковые панели */}
      <mesh position={[-0.72, -0.3, 0]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.12, 0.5, 0.5]} />
        <meshStandardMaterial color="#0d2148" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0.72, -0.3, 0]} rotation={[0, 0, -0.15]}>
        <boxGeometry args={[0.12, 0.5, 0.5]} />
        <meshStandardMaterial color="#0d2148" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
}

interface RobotSceneCanvasProps {
  proxyRef: MutableRefObject<ScanProxy>;
  lite: boolean;
}

export function RobotSceneCanvas({ proxyRef, lite }: RobotSceneCanvasProps) {
  return (
    <Canvas
      gl={{ alpha: true, antialias: !lite }}
      dpr={lite ? 1 : [1, 1.5]}
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <ambientLight intensity={0.5} />
      <hemisphereLight args={["#dbe8ff", "#0a1730", 0.5]} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} color="#ffffff" />
      <directionalLight position={[-3, -2, -2]} intensity={0.6} color="#3ad0ff" />
      <RobotRig proxyRef={proxyRef} robotScale={lite ? 0.26 : ROBOT_SCALE} />
    </Canvas>
  );
}
