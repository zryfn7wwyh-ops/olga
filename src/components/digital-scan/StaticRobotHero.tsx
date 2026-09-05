"use client";

import { Canvas } from "@react-three/fiber";

function RobotModel() {
  return (
    <group>
      {/* голова */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[1.1, 0.7, 0.65]} />
        <meshStandardMaterial color="#1b3a73" metalness={0.75} roughness={0.28} />
      </mesh>
      {/* визор */}
      <mesh position={[0, 0.68, 0.34]}>
        <boxGeometry args={[0.9, 0.22, 0.05]} />
        <meshStandardMaterial color="#dfeaff" emissive="#3a7bff" emissiveIntensity={0.4} metalness={0.2} roughness={0.4} />
      </mesh>
      {/* оптические сенсоры */}
      <mesh position={[-0.24, 0.5, 0.36]}>
        <sphereGeometry args={[0.09, 24, 24]} />
        <meshStandardMaterial color="#0c3aa0" emissive="#246bfd" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0.24, 0.5, 0.36]}>
        <sphereGeometry args={[0.09, 24, 24]} />
        <meshStandardMaterial color="#0c3aa0" emissive="#246bfd" emissiveIntensity={0.6} />
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
      <mesh position={[0, -0.35, 0]}>
        <boxGeometry args={[1.35, 0.85, 0.7]} />
        <meshStandardMaterial color="#12294f" metalness={0.7} roughness={0.32} />
      </mesh>
      {/* светящаяся панель */}
      <mesh position={[0, -0.08, 0.36]}>
        <boxGeometry args={[0.9, 0.1, 0.03]} />
        <meshStandardMaterial color="#8fb4ff" emissive="#3ad0ff" emissiveIntensity={0.35} metalness={0.3} roughness={0.4} />
      </mesh>
      {/* оптический сканер — главный элемент на передней панели */}
      <mesh position={[0, -0.35, 0.37]}>
        <torusGeometry args={[0.16, 0.035, 16, 32]} />
        <meshStandardMaterial color="#8fb4ff" metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh position={[0, -0.35, 0.4]}>
        <circleGeometry args={[0.13, 32]} />
        <meshStandardMaterial color="#0a2a70" emissive="#3ad0ff" emissiveIntensity={0.5} toneMapped={false} />
      </mesh>
      {/* боковые панели / вентиляция */}
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

/**
 * Этап 1: статичный робот (без анимации) в правом нижнем углу первого
 * экрана — компактный AI-сканер по описанию из ТЗ.
 */
export function StaticRobotHero() {
  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-20 h-24 w-24 sm:bottom-6 sm:right-6 sm:h-32 sm:w-32"
      aria-hidden="true"
    >
      <Canvas
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ pointerEvents: "none" }}
      >
        <ambientLight intensity={0.6} />
        <hemisphereLight args={["#dbe8ff", "#0a1730", 0.5]} />
        <directionalLight position={[3, 4, 5]} intensity={1.2} color="#ffffff" />
        <directionalLight position={[-3, -2, -2]} intensity={0.6} color="#3ad0ff" />
        <group scale={0.85} rotation={[0.08, -0.35, 0]}>
          <RobotModel />
        </group>
      </Canvas>
    </div>
  );
}
