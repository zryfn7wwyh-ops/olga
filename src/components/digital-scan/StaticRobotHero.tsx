"use client";

import { Canvas } from "@react-three/fiber";

const SHELL = { color: "#f0f3f7", metalness: 0.12, roughness: 0.32 } as const;
const SHELL_SHADE = { color: "#dee3ea", metalness: 0.14, roughness: 0.36 } as const;
const JOINT = { color: "#181b20", metalness: 0.35, roughness: 0.5 } as const;
const TRIM = { color: "#8b96a5", metalness: 0.5, roughness: 0.4 } as const;
const EYE = {
  color: "#062338",
  emissive: "#39c9ff",
  emissiveIntensity: 2.4,
  toneMapped: false,
} as const;

interface FingerProps {
  x: number;
  spread: number;
  curl: number;
  length1?: number;
  length2?: number;
  radius?: number;
}

function Finger({ x, spread, curl, length1 = 0.13, length2 = 0.1, radius = 0.026 }: FingerProps) {
  return (
    <group position={[x, -0.12, 0.02]} rotation={[0, 0, spread]}>
      <group rotation={[curl, 0, 0]}>
        <mesh position={[0, -length1 / 2, 0]}>
          <cylinderGeometry args={[radius, radius * 0.85, length1, 10]} />
          <meshStandardMaterial {...JOINT} />
        </mesh>
        <group position={[0, -length1, 0]} rotation={[curl * 0.7, 0, 0]}>
          <mesh>
            <sphereGeometry args={[radius * 0.9, 10, 10]} />
            <meshStandardMaterial {...JOINT} />
          </mesh>
          <mesh position={[0, -length2 / 2, 0]}>
            <cylinderGeometry args={[radius * 0.85, radius * 0.6, length2, 10]} />
            <meshStandardMaterial {...JOINT} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

interface ArmProps {
  shoulderPos: [number, number, number];
  upperArmRot: [number, number, number];
  forearmRot: [number, number, number];
  handRot: [number, number, number];
  fingersOpen: boolean;
}

function Arm({ shoulderPos, upperArmRot, forearmRot, handRot, fingersOpen }: ArmProps) {
  const spread = fingersOpen ? 0.22 : 0.04;
  const curl = fingersOpen ? 0.15 : 0.55;
  return (
    <group position={shoulderPos}>
      <mesh>
        <sphereGeometry args={[0.27, 24, 24]} />
        <meshStandardMaterial {...SHELL} />
      </mesh>
      {/* наплечник */}
      <mesh position={[0, 0.06, 0.02]} rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.24, 0.27, 0.14, 24]} />
        <meshStandardMaterial {...SHELL_SHADE} />
      </mesh>
      <mesh position={[0, 0.1, 0.08]} rotation={[0.3, 0, 0]}>
        <torusGeometry args={[0.235, 0.015, 10, 28]} />
        <meshStandardMaterial {...TRIM} />
      </mesh>

      <group rotation={upperArmRot}>
        <mesh position={[0, -0.275, 0]}>
          <cylinderGeometry args={[0.16, 0.14, 0.55, 20]} />
          <meshStandardMaterial {...SHELL} />
        </mesh>
        <mesh position={[0, -0.275, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.15, 0.008, 8, 24]} />
          <meshStandardMaterial {...TRIM} />
        </mesh>

        <group position={[0, -0.55, 0]} rotation={forearmRot}>
          <mesh>
            <sphereGeometry args={[0.14, 20, 20]} />
            <meshStandardMaterial {...JOINT} />
          </mesh>
          <mesh position={[0, 0, 0.13]}>
            <sphereGeometry args={[0.045, 12, 12]} />
            <meshStandardMaterial {...TRIM} />
          </mesh>
          <mesh position={[0, -0.25, 0]}>
            <cylinderGeometry args={[0.12, 0.09, 0.5, 20]} />
            <meshStandardMaterial {...SHELL} />
          </mesh>

          <group position={[0, -0.5, 0]}>
            {/* запястье */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.09, 0.02, 10, 24]} />
              <meshStandardMaterial {...JOINT} />
            </mesh>
            <group rotation={handRot}>
              <mesh>
                <boxGeometry args={[0.22, 0.24, 0.11]} />
                <meshStandardMaterial {...JOINT} />
              </mesh>
              <mesh position={[0, 0.02, 0.056]}>
                <boxGeometry args={[0.16, 0.16, 0.006]} />
                <meshStandardMaterial {...TRIM} />
              </mesh>
              <Finger x={-0.075} spread={-spread} curl={curl} />
              <Finger x={-0.025} spread={-spread * 0.3} curl={curl * 1.05} />
              <Finger x={0.025} spread={spread * 0.3} curl={curl * 1.05} />
              <Finger x={0.075} spread={spread} curl={curl} />
              {/* большой палец */}
              <group position={[-0.13, -0.05, 0.03]} rotation={[0, 0, fingersOpen ? 1.1 : 0.75]}>
                <Finger x={0} spread={0} curl={curl * 0.6} length1={0.09} length2={0.07} radius={0.028} />
              </group>
            </group>
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
        {/* шов на макушке */}
        <mesh position={[0, 0.38, 0]}>
          <boxGeometry args={[0.02, 0.02, 0.75]} />
          <meshStandardMaterial {...TRIM} />
        </mesh>
        {/* глаз */}
        <mesh position={[0.16, 0.03, 0.35]}>
          <sphereGeometry args={[0.17, 24, 24]} />
          <meshStandardMaterial {...EYE} />
        </mesh>
        <mesh position={[0.16, 0.03, 0.35]}>
          <torusGeometry args={[0.19, 0.014, 10, 28]} />
          <meshStandardMaterial {...TRIM} />
        </mesh>
        <mesh position={[0, -0.02, 0.42]}>
          <torusGeometry args={[0.18, 0.025, 12, 24, Math.PI]} />
          <meshStandardMaterial {...JOINT} />
        </mesh>
        {/* челюсть */}
        <mesh position={[0.05, -0.32, 0.18]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.34, 0.14, 0.3]} />
          <meshStandardMaterial {...JOINT} />
        </mesh>
        {/* боковой вент / «ухо» */}
        <mesh position={[0, -0.05, -0.34]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.05, 16]} />
          <meshStandardMaterial {...JOINT} />
        </mesh>
        <mesh position={[0, -0.05, -0.37]}>
          <torusGeometry args={[0.07, 0.012, 8, 20]} />
          <meshStandardMaterial {...TRIM} />
        </mesh>
      </group>

      {/* шея */}
      <mesh position={[0, 1.42, 0]}>
        <cylinderGeometry args={[0.14, 0.16, 0.25, 20]} />
        <meshStandardMaterial {...JOINT} />
      </mesh>
      <mesh position={[0, 1.31, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.19, 0.02, 10, 28]} />
        <meshStandardMaterial {...TRIM} />
      </mesh>

      {/* торс: верхняя пластина груди */}
      <group position={[0, 0.95, 0]}>
        <mesh>
          <boxGeometry args={[0.92, 0.75, 0.55]} />
          <meshStandardMaterial {...SHELL} />
        </mesh>
        <mesh position={[0, 0.02, 0.29]}>
          <sphereGeometry args={[0.15, 24, 24]} />
          <meshStandardMaterial {...EYE} emissiveIntensity={2.8} />
        </mesh>
        <mesh position={[0, 0.02, 0.29]}>
          <torusGeometry args={[0.2, 0.02, 12, 32]} />
          <meshStandardMaterial {...TRIM} />
        </mesh>
        <mesh position={[0, 0.02, 0.29]} rotation={[0, 0, Math.PI / 4]}>
          <torusGeometry args={[0.27, 0.012, 8, 32]} />
          <meshStandardMaterial {...TRIM} />
        </mesh>
        {/* ключицы */}
        <mesh position={[-0.3, 0.24, 0.24]} rotation={[0, 0, -0.25]}>
          <boxGeometry args={[0.32, 0.06, 0.1]} />
          <meshStandardMaterial {...SHELL_SHADE} />
        </mesh>
        <mesh position={[0.3, 0.24, 0.24]} rotation={[0, 0, 0.25]}>
          <boxGeometry args={[0.32, 0.06, 0.1]} />
          <meshStandardMaterial {...SHELL_SHADE} />
        </mesh>
        {/* боковые вентиляционные прорези */}
        {[-0.42, -0.34].map((x) => (
          <mesh key={x} position={[x, -0.1, 0.2]} rotation={[0, 0.5, 0]}>
            <boxGeometry args={[0.02, 0.28, 0.09]} />
            <meshStandardMaterial {...JOINT} />
          </mesh>
        ))}
        {[0.42, 0.34].map((x) => (
          <mesh key={x} position={[x, -0.1, 0.2]} rotation={[0, -0.5, 0]}>
            <boxGeometry args={[0.02, 0.28, 0.09]} />
            <meshStandardMaterial {...JOINT} />
          </mesh>
        ))}
      </group>

      {/* торс: нижняя пластина (живот) */}
      <group position={[0, 0.4, 0]}>
        <mesh>
          <boxGeometry args={[0.72, 0.45, 0.48]} />
          <meshStandardMaterial {...SHELL_SHADE} />
        </mesh>
        <mesh position={[-0.2, 0.06, 0.25]}>
          <boxGeometry args={[0.08, 0.08, 0.02]} />
          <meshStandardMaterial {...EYE} emissiveIntensity={1.6} />
        </mesh>
        <mesh position={[0.03, -0.1, 0.25]}>
          <boxGeometry args={[0.08, 0.08, 0.02]} />
          <meshStandardMaterial {...EYE} emissiveIntensity={1.6} />
        </mesh>
        <mesh position={[0, -0.22, 0.25]}>
          <boxGeometry args={[0.5, 0.025, 0.02]} />
          <meshStandardMaterial {...TRIM} />
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
        upperArmRot={[-0.95, 0.15, -0.2]}
        forearmRot={[0.55, 0, -0.15]}
        handRot={[0.15, 0.15, 0]}
        fingersOpen
      />

      {/* пояс */}
      <mesh position={[0, 0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.38, 0.045, 12, 32]} />
        <meshStandardMaterial {...JOINT} />
      </mesh>
      {/* бедро / основание */}
      <mesh position={[0, -0.02, 0]}>
        <cylinderGeometry args={[0.4, 0.34, 0.3, 20]} />
        <meshStandardMaterial {...JOINT} />
      </mesh>
      <mesh position={[0, -0.17, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.34, 0.015, 8, 28]} />
        <meshStandardMaterial {...TRIM} />
      </mesh>
    </group>
  );
}

/**
 * Статичный робот-андроид (без анимации) по референсам: белый пластиковый
 * корпус с сегментированными пластинами, темные суставы, наплечники,
 * артикулированные пальцы с большим пальцем, светящийся синий «глаз» и
 * индикатор в груди. Крупный масштаб, закреплен в правом нижнем углу.
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
        <group rotation={[0.02, -0.5, 0]} position={[0.05, -1.05, 0]}>
          <RobotModel />
        </group>
      </Canvas>
    </div>
  );
}
