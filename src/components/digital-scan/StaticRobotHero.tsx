"use client";

import { Canvas } from "@react-three/fiber";

const SHELL = { color: "#f0f3f7", metalness: 0.12, roughness: 0.32 } as const;
const JOINT = { color: "#181b20", metalness: 0.35, roughness: 0.5 } as const;
const EYE = {
  color: "#062338",
  emissive: "#39c9ff",
  emissiveIntensity: 2.4,
  toneMapped: false,
} as const;

interface ArmProps {
  shoulderPos: [number, number, number];
  upperArmRot: [number, number, number];
  forearmRot: [number, number, number];
  handRot: [number, number, number];
  fingersOpen: boolean;
}

function Arm({ shoulderPos, upperArmRot, forearmRot, handRot, fingersOpen }: ArmProps) {
  return (
    <group position={shoulderPos}>
      <mesh>
        <sphereGeometry args={[0.27, 24, 24]} />
        <meshStandardMaterial {...SHELL} />
      </mesh>
      <group rotation={upperArmRot}>
        <mesh position={[0, -0.275, 0]}>
          <cylinderGeometry args={[0.16, 0.14, 0.55, 20]} />
          <meshStandardMaterial {...SHELL} />
        </mesh>
        <group position={[0, -0.55, 0]} rotation={forearmRot}>
          <mesh>
            <sphereGeometry args={[0.14, 20, 20]} />
            <meshStandardMaterial {...JOINT} />
          </mesh>
          <mesh position={[0, -0.25, 0]}>
            <cylinderGeometry args={[0.12, 0.09, 0.5, 20]} />
            <meshStandardMaterial {...SHELL} />
          </mesh>
          <group position={[0, -0.5, 0]} rotation={handRot}>
            <mesh>
              <boxGeometry args={[0.22, 0.24, 0.11]} />
              <meshStandardMaterial {...JOINT} />
            </mesh>
            {[-1.5, -0.5, 0.5, 1.5].map((i) => (
              <mesh
                key={i}
                position={[i * 0.045, -0.17, 0.02]}
                rotation={[fingersOpen ? 0.3 : 0.1, 0, i * (fingersOpen ? 0.16 : 0.04)]}
              >
                <cylinderGeometry args={[0.026, 0.02, 0.2, 10]} />
                <meshStandardMaterial {...JOINT} />
              </mesh>
            ))}
          </group>
        </group>
      </group>
    </group>
  );
}

function RobotModel() {
  return (
    <group>
      {/* голова */}
      <group position={[0, 1.75, 0]}>
        <mesh scale={[1, 1.12, 0.92]}>
          <sphereGeometry args={[0.46, 32, 32]} />
          <meshStandardMaterial {...SHELL} />
        </mesh>
        <mesh position={[0.16, 0.03, 0.35]}>
          <sphereGeometry args={[0.17, 24, 24]} />
          <meshStandardMaterial {...EYE} />
        </mesh>
        <mesh position={[0, -0.02, 0.42]}>
          <torusGeometry args={[0.18, 0.025, 12, 24, Math.PI]} />
          <meshStandardMaterial {...JOINT} />
        </mesh>
      </group>

      {/* шея */}
      <mesh position={[0, 1.42, 0]}>
        <cylinderGeometry args={[0.14, 0.16, 0.25, 20]} />
        <meshStandardMaterial {...JOINT} />
      </mesh>

      {/* торс */}
      <group position={[0, 0.75, 0]}>
        <mesh>
          <boxGeometry args={[0.95, 1.15, 0.55]} />
          <meshStandardMaterial {...SHELL} />
        </mesh>
        <mesh position={[0, 0.18, 0.29]}>
          <sphereGeometry args={[0.15, 24, 24]} />
          <meshStandardMaterial {...EYE} emissiveIntensity={2.8} />
        </mesh>
        <mesh position={[0, 0.18, 0.29]}>
          <torusGeometry args={[0.2, 0.02, 12, 32]} />
          <meshStandardMaterial {...JOINT} />
        </mesh>
        <mesh position={[-0.28, -0.15, 0.29]}>
          <boxGeometry args={[0.08, 0.08, 0.02]} />
          <meshStandardMaterial {...EYE} emissiveIntensity={1.6} />
        </mesh>
        <mesh position={[-0.05, -0.32, 0.29]}>
          <boxGeometry args={[0.08, 0.08, 0.02]} />
          <meshStandardMaterial {...EYE} emissiveIntensity={1.6} />
        </mesh>
        <mesh position={[0, -0.45, 0.29]}>
          <boxGeometry args={[0.7, 0.03, 0.02]} />
          <meshStandardMaterial {...JOINT} />
        </mesh>
      </group>

      {/* левая рука (в покое) */}
      <Arm
        shoulderPos={[-0.62, 1.18, 0]}
        upperArmRot={[0, 0, 0.08]}
        forearmRot={[0.15, 0, 0.1]}
        handRot={[0.1, 0, 0]}
        fingersOpen={false}
      />

      {/* правая рука (протянута вперед) */}
      <Arm
        shoulderPos={[0.62, 1.18, 0]}
        upperArmRot={[-1.35, 0.1, -0.15]}
        forearmRot={[0.35, 0, -0.1]}
        handRot={[0.15, 0.15, 0]}
        fingersOpen
      />

      {/* пояс / основание */}
      <mesh position={[0, -0.02, 0]}>
        <cylinderGeometry args={[0.42, 0.36, 0.3, 20]} />
        <meshStandardMaterial {...JOINT} />
      </mesh>
    </group>
  );
}

/**
 * Этап 1 (ревизия): статичный робот-андроид без анимации по референсам —
 * белый пластиковый корпус, темные суставы, светящийся синий «глаз» и
 * индикатор в груди, протянутая рука с пальцами. Крупный масштаб,
 * закреплен в правом нижнем углу.
 */
export function StaticRobotHero() {
  return (
    <div
      className="pointer-events-none fixed bottom-0 right-0 z-20 h-[210px] w-[180px] sm:-bottom-4 sm:-right-4 sm:h-[380px] sm:w-[330px] lg:-bottom-10 lg:-right-16 lg:h-[520px] lg:w-[440px]"
      aria-hidden="true"
    >
      <Canvas
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.7, 5], fov: 34 }}
        style={{ pointerEvents: "none" }}
      >
        <ambientLight intensity={0.6} />
        <hemisphereLight args={["#dbe8ff", "#0a1730", 0.5]} />
        <directionalLight position={[3, 4, 5]} intensity={1.3} color="#ffffff" />
        <directionalLight position={[-3, -1, 2]} intensity={0.5} color="#3ad0ff" />
        <group rotation={[0.02, -0.5, 0]} position={[0.05, 0, 0]}>
          <RobotModel />
        </group>
      </Canvas>
    </div>
  );
}
