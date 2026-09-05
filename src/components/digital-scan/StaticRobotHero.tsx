"use client";

import { Canvas } from "@react-three/fiber";

const SHELL = { color: "#f5f6f8", metalness: 0.25, roughness: 0.16 } as const;
const SHELL_SHADE = { color: "#e2e5ea", metalness: 0.25, roughness: 0.2 } as const;
const JOINT = { color: "#16181c", metalness: 0.6, roughness: 0.35 } as const;
const AMBER = {
  color: "#3a2410",
  emissive: "#ff9d3d",
  emissiveIntensity: 1.8,
  toneMapped: false,
} as const;
const LENS = {
  color: "#eaf6ff",
  emissive: "#aee0ff",
  emissiveIntensity: 3.2,
  toneMapped: false,
} as const;
const CHEST_LIGHT = {
  color: "#0a2a45",
  emissive: "#3aa0ff",
  emissiveIntensity: 2,
  toneMapped: false,
} as const;

function JointRing({
  position,
  radius,
  tube = 0.03,
  withAmber = true,
}: {
  position: [number, number, number];
  radius: number;
  tube?: number;
  withAmber?: boolean;
}) {
  return (
    <group position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, tube, 12, 28]} />
        <meshStandardMaterial {...JOINT} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[radius - tube * 1.4, radius - tube * 1.4, tube * 1.6, 20]} />
        <meshStandardMaterial {...JOINT} />
      </mesh>
      {withAmber && (
        <mesh position={[0, 0, radius - tube]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[tube * 0.9, 12]} />
          <meshStandardMaterial {...AMBER} />
        </mesh>
      )}
    </group>
  );
}

interface LimbProps {
  rootPos: [number, number, number];
  jointRadius: number;
  upperArgs: [number, number, number];
  upperRot: [number, number, number];
  lowerArgs: [number, number, number];
  lowerRot: [number, number, number];
  midJointRadius: number;
  endCapRadius: number;
  endShape: "fist" | "ankle";
}

function Limb({
  rootPos,
  jointRadius,
  upperArgs,
  upperRot,
  lowerArgs,
  lowerRot,
  midJointRadius,
  endCapRadius,
  endShape,
}: LimbProps) {
  const upperLen = upperArgs[2];
  const lowerLen = lowerArgs[2];
  return (
    <group position={rootPos}>
      <JointRing position={[0, 0, 0]} radius={jointRadius} />
      <mesh>
        <sphereGeometry args={[jointRadius * 0.85, 20, 20]} />
        <meshStandardMaterial {...SHELL} />
      </mesh>

      <group rotation={upperRot}>
        <mesh position={[0, -upperLen / 2, 0]}>
          <cylinderGeometry args={upperArgs} />
          <meshStandardMaterial {...SHELL} />
        </mesh>

        <group position={[0, -upperLen, 0]} rotation={lowerRot}>
          <JointRing position={[0, 0, 0]} radius={midJointRadius} tube={0.022} />
          <mesh position={[0, -lowerLen / 2, 0]}>
            <cylinderGeometry args={lowerArgs} />
            <meshStandardMaterial {...SHELL} />
          </mesh>

          <group position={[0, -lowerLen, 0]}>
            {endShape === "fist" ? (
              <>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[endCapRadius * 0.7, 0.018, 10, 24]} />
                  <meshStandardMaterial {...JOINT} />
                </mesh>
                <mesh position={[0, -endCapRadius * 0.7, 0]}>
                  <sphereGeometry args={[endCapRadius, 16, 16]} />
                  <meshStandardMaterial {...SHELL_SHADE} />
                </mesh>
                <mesh position={[0, -endCapRadius * 0.85, endCapRadius * 0.55]}>
                  <boxGeometry args={[endCapRadius * 1.3, 0.015, 0.015]} />
                  <meshStandardMaterial {...JOINT} />
                </mesh>
              </>
            ) : (
              <mesh position={[0, -endCapRadius * 0.5, endCapRadius * 0.3]}>
                <boxGeometry args={[endCapRadius * 1.6, endCapRadius, endCapRadius * 2.2]} />
                <meshStandardMaterial {...JOINT} />
              </mesh>
            )}
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
      <group position={[0, 1.85, 0]}>
        <mesh scale={[0.88, 1.15, 0.95]}>
          <sphereGeometry args={[0.42, 32, 32]} />
          <meshStandardMaterial {...SHELL} />
        </mesh>
        {[-0.16, 0.16].map((x) => (
          <group key={x} position={[x, 0.02, 0.34]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.095, 0.01, 10, 24]} />
              <meshStandardMaterial {...JOINT} />
            </mesh>
            <mesh position={[0, 0, 0.015]}>
              <sphereGeometry args={[0.085, 20, 20]} />
              <meshStandardMaterial {...LENS} />
            </mesh>
          </group>
        ))}
        {/* нос */}
        <mesh position={[0, -0.1, 0.4]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial {...SHELL_SHADE} />
        </mesh>
        {/* рот */}
        <mesh position={[0, -0.22, 0.38]}>
          <boxGeometry args={[0.16, 0.012, 0.01]} />
          <meshStandardMaterial {...JOINT} />
        </mesh>
        {/* линия лба */}
        <mesh position={[0, 0.24, 0.36]}>
          <boxGeometry args={[0.4, 0.01, 0.01]} />
          <meshStandardMaterial {...SHELL_SHADE} />
        </mesh>
        {/* боковой вент */}
        <mesh position={[0, -0.05, -0.3]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
          <meshStandardMaterial {...JOINT} />
        </mesh>
      </group>

      {/* открытая механическая шея */}
      <group position={[0, 1.5, 0]}>
        <mesh>
          <cylinderGeometry args={[0.13, 0.15, 0.32, 20]} />
          <meshStandardMaterial {...JOINT} />
        </mesh>
        <mesh position={[0, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.135, 0.012, 8, 24]} />
          <meshStandardMaterial {...SHELL_SHADE} />
        </mesh>
        <mesh position={[0.09, -0.05, 0.09]}>
          <sphereGeometry args={[0.018, 8, 8]} />
          <meshStandardMaterial {...AMBER} />
        </mesh>
      </group>

      {/* торс */}
      <group position={[0, 0.98, 0]}>
        <mesh>
          <boxGeometry args={[0.98, 0.7, 0.56]} />
          <meshStandardMaterial {...SHELL} />
        </mesh>
        {/* световая полоса */}
        <mesh position={[-0.05, 0.08, 0.29]}>
          <boxGeometry args={[0.34, 0.09, 0.02]} />
          <meshStandardMaterial {...CHEST_LIGHT} />
        </mesh>
        {/* сенсоры на груди */}
        {[[-0.35, -0.12], [0.3, -0.05]].map(([x, y]) => (
          <group key={x} position={[x, y, 0.29]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.06, 0.012, 8, 20]} />
              <meshStandardMaterial {...JOINT} />
            </mesh>
            <mesh position={[0, 0, 0.01]}>
              <circleGeometry args={[0.035, 16]} />
              <meshStandardMaterial {...JOINT} />
            </mesh>
          </group>
        ))}
        {/* ключицы */}
        {[-0.32, 0.32].map((x) => (
          <mesh key={x} position={[x, 0.28, 0.22]} rotation={[0, 0, x < 0 ? -0.2 : 0.2]}>
            <boxGeometry args={[0.34, 0.05, 0.1]} />
            <meshStandardMaterial {...SHELL_SHADE} />
          </mesh>
        ))}
        {/* шов живота */}
        <mesh position={[0, -0.28, 0.26]}>
          <boxGeometry args={[0.6, 0.02, 0.02]} />
          <meshStandardMaterial {...SHELL_SHADE} />
        </mesh>
      </group>

      {/* плечевые узлы (видимый механизм в вырезе корпуса) */}
      {[-0.56, 0.56].map((x) => (
        <JointRing key={x} position={[x, 1.28, 0.05]} radius={0.19} tube={0.03} />
      ))}

      {/* руки, опущены вдоль корпуса */}
      <Limb
        rootPos={[-0.56, 1.28, 0]}
        jointRadius={0.19}
        upperArgs={[0.15, 0.13, 0.5]}
        upperRot={[0.12, 0, 0.06]}
        lowerArgs={[0.11, 0.09, 0.46]}
        lowerRot={[0.35, 0, 0.03]}
        midJointRadius={0.115}
        endCapRadius={0.1}
        endShape="fist"
      />
      <Limb
        rootPos={[0.56, 1.28, 0]}
        jointRadius={0.19}
        upperArgs={[0.15, 0.13, 0.5]}
        upperRot={[0.12, 0, -0.06]}
        lowerArgs={[0.11, 0.09, 0.46]}
        lowerRot={[0.35, 0, -0.03]}
        midJointRadius={0.115}
        endCapRadius={0.1}
        endShape="fist"
      />

      {/* пояс */}
      <mesh position={[0, 0.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.44, 0.05, 12, 32]} />
        <meshStandardMaterial {...JOINT} />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.4, 0.42, 0.24, 20]} />
        <meshStandardMaterial {...SHELL_SHADE} />
      </mesh>

      {/* тазобедренные узлы */}
      {[-0.26, 0.26].map((x) => (
        <JointRing key={x} position={[x, 0.28, 0]} radius={0.15} tube={0.024} />
      ))}

      {/* ноги */}
      <Limb
        rootPos={[-0.26, 0.28, 0]}
        jointRadius={0.15}
        upperArgs={[0.16, 0.14, 0.62]}
        upperRot={[0.02, 0, 0.02]}
        lowerArgs={[0.12, 0.1, 0.58]}
        lowerRot={[0.06, 0, 0]}
        midJointRadius={0.13}
        endCapRadius={0.12}
        endShape="ankle"
      />
      <Limb
        rootPos={[0.26, 0.28, 0]}
        jointRadius={0.15}
        upperArgs={[0.16, 0.14, 0.62]}
        upperRot={[0.02, 0, -0.02]}
        lowerArgs={[0.12, 0.1, 0.58]}
        lowerRot={[0.06, 0, 0]}
        midJointRadius={0.13}
        endCapRadius={0.12}
        endShape="ankle"
      />
    </group>
  );
}

/**
 * Статичный робот-андроид (без анимации) по референсу: глянцевый белый
 * корпус, открытые механические узлы на плечах/локтях/бедрах/коленях с
 * янтарными индикаторами, гуманоидное лицо с двумя линзами-«глазами»,
 * синяя световая полоса на груди, кулаки, полноростовая стоячая поза.
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
        <group rotation={[0.02, -0.5, 0]} position={[0.05, -1.15, 0]}>
          <RobotModel />
        </group>
      </Canvas>
    </div>
  );
}
