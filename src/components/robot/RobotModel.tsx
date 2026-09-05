/**
 * Геометрия статичного робота. Иерархия групп именована в соответствии
 * с ТЗ (Robot, Head, Eye_L, Eye_R, Neck, Chest, ScannerModule,
 * Shoulder_L/R, Arm_L/R, Hand_L/R, Spine, Pelvis, Leg_L/R, Foot_L/R) —
 * это готовит модель к риггингу и анимации на следующем этапе, хотя
 * сам rigging пока не делается.
 */

// холодный белый корпус
const SHELL = { color: "#eef1f4", metalness: 0.22, roughness: 0.2 } as const;
const SHELL_SHADE = { color: "#dde2e8", metalness: 0.24, roughness: 0.24 } as const;
// темная механика: графит / гранметал
const MECH = { color: "#2b2f36", metalness: 0.65, roughness: 0.4 } as const;
const MECH_LIGHT = { color: "#7d8793", metalness: 0.75, roughness: 0.28 } as const;
// точечные акценты (используются очень ограниченно)
const AMBER = {
  color: "#3a2410",
  emissive: "#ff9d3d",
  emissiveIntensity: 1.6,
  toneMapped: false,
} as const;
const GLOW = {
  color: "#0b2e40",
  emissive: "#7fe3ff",
  emissiveIntensity: 2.6,
  toneMapped: false,
} as const;
const LENS_GLASS = {
  color: "#eaf6ff",
  transparent: true,
  opacity: 0.5,
  metalness: 0.25,
  roughness: 0.1,
} as const;

function JointRing({
  radius,
  tube = 0.03,
  withAmber = false,
}: {
  radius: number;
  tube?: number;
  withAmber?: boolean;
}) {
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, tube, 12, 28]} />
        <meshStandardMaterial {...MECH} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius * 0.68, tube * 0.55, 10, 24]} />
        <meshStandardMaterial {...MECH_LIGHT} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[radius - tube * 1.4, radius - tube * 1.4, tube * 1.6, 20]} />
        <meshStandardMaterial {...MECH} />
      </mesh>
      {withAmber && (
        <mesh position={[0, 0, radius - tube]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[tube * 0.7, 12]} />
          <meshStandardMaterial {...AMBER} />
        </mesh>
      )}
    </group>
  );
}

function Eye({ name, x }: { name: string; x: number }) {
  return (
    <group name={name} position={[x, 0.02, 0.33]}>
      {/* впадина */}
      <mesh scale={[1, 0.85, 0.5]}>
        <sphereGeometry args={[0.12, 20, 20]} />
        <meshStandardMaterial {...MECH} />
      </mesh>
      {/* концентрические кольца оправы */}
      <mesh position={[0, 0, 0.035]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.1, 0.014, 10, 24]} />
        <meshStandardMaterial {...MECH_LIGHT} />
      </mesh>
      <mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.075, 0.008, 8, 20]} />
        <meshStandardMaterial {...MECH_LIGHT} />
      </mesh>
      {/* стеклянная линза */}
      <mesh position={[0, 0, 0.055]}>
        <sphereGeometry args={[0.07, 20, 20]} />
        <meshStandardMaterial {...LENS_GLASS} />
      </mesh>
      {/* светящееся оптическое ядро */}
      <mesh position={[0, 0, 0.05]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial {...GLOW} />
      </mesh>
    </group>
  );
}

function ScannerModule({ position }: { position: [number, number, number] }) {
  return (
    <group name="ScannerModule" position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.16, 0.018, 12, 28]} />
        <meshStandardMaterial {...MECH_LIGHT} />
      </mesh>
      <mesh position={[0, 0, 0.01]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.11, 0.01, 10, 24]} />
        <meshStandardMaterial {...MECH} />
      </mesh>
      <mesh position={[0, 0, 0.018]} scale={[1, 1, 0.4]}>
        <sphereGeometry args={[0.095, 20, 20]} />
        <meshStandardMaterial {...LENS_GLASS} />
      </mesh>
      <mesh position={[0, 0, 0.012]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial {...GLOW} />
      </mesh>
    </group>
  );
}

interface LimbProps {
  name: string;
  jointRadius: number;
  upperArgs: [number, number, number];
  upperRot: [number, number, number];
  lowerArgs: [number, number, number];
  lowerRot: [number, number, number];
  midJointRadius: number;
  endCapRadius: number;
  endName: string;
  endShape: "fist" | "foot";
}

function Limb({
  name,
  jointRadius,
  upperArgs,
  upperRot,
  lowerArgs,
  lowerRot,
  midJointRadius,
  endCapRadius,
  endName,
  endShape,
}: LimbProps) {
  const upperLen = upperArgs[2];
  const lowerLen = lowerArgs[2];
  return (
    <group>
      <JointRing radius={jointRadius} />
      <mesh>
        <sphereGeometry args={[jointRadius * 0.85, 20, 20]} />
        <meshStandardMaterial {...SHELL} />
      </mesh>

      <group name={name} rotation={upperRot}>
        <mesh position={[0, -upperLen / 2, 0]}>
          <cylinderGeometry args={upperArgs} />
          <meshStandardMaterial {...SHELL} />
        </mesh>

        <group position={[0, -upperLen, 0]} rotation={lowerRot}>
          <JointRing radius={midJointRadius} tube={0.022} withAmber={endShape === "fist"} />
          <mesh position={[0, -lowerLen / 2, 0]}>
            <cylinderGeometry args={lowerArgs} />
            <meshStandardMaterial {...SHELL} />
          </mesh>

          <group name={endName} position={[0, -lowerLen, 0]}>
            {endShape === "fist" ? (
              <>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[endCapRadius * 0.7, 0.016, 10, 24]} />
                  <meshStandardMaterial {...MECH} />
                </mesh>
                <mesh position={[0, -endCapRadius * 0.7, 0]}>
                  <sphereGeometry args={[endCapRadius, 16, 16]} />
                  <meshStandardMaterial {...SHELL_SHADE} />
                </mesh>
                <mesh position={[0, -endCapRadius * 0.6, endCapRadius * 0.75]}>
                  <sphereGeometry args={[endCapRadius * 0.5, 12, 12]} />
                  <meshStandardMaterial {...SHELL_SHADE} />
                </mesh>
                <mesh position={[0, -endCapRadius * 0.85, endCapRadius * 0.55]}>
                  <boxGeometry args={[endCapRadius * 1.3, 0.015, 0.015]} />
                  <meshStandardMaterial {...MECH} />
                </mesh>
              </>
            ) : (
              <>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[endCapRadius * 0.7, 0.014, 10, 24]} />
                  <meshStandardMaterial {...MECH} />
                </mesh>
                <mesh position={[0, -endCapRadius * 0.5, endCapRadius * 0.3]}>
                  <boxGeometry args={[endCapRadius * 1.6, endCapRadius, endCapRadius * 2.2]} />
                  <meshStandardMaterial {...MECH} />
                </mesh>
              </>
            )}
          </group>
        </group>
      </group>
    </group>
  );
}

export function RobotModel() {
  return (
    <group name="Robot" rotation={[0.03, -0.14, 0]} position={[0, -0.4, 0]}>
      {/* голова: минималистичное лицо, не слишком человеческое */}
      <group name="Head" position={[0, 1.85, 0]} rotation={[0, -0.12, 0]}>
        <mesh scale={[0.88, 1.15, 0.95]}>
          <sphereGeometry args={[0.42, 32, 32]} />
          <meshStandardMaterial {...SHELL} />
        </mesh>

        <Eye name="Eye_L" x={-0.16} />
        <Eye name="Eye_R" x={0.16} />

        {/* очень деликатный нос */}
        <mesh position={[0, -0.08, 0.41]}>
          <boxGeometry args={[0.02, 0.09, 0.015]} />
          <meshStandardMaterial {...SHELL_SHADE} />
        </mesh>

        {/* минималистичная линия рта */}
        <mesh position={[0, -0.19, 0.4]}>
          <boxGeometry args={[0.12, 0.008, 0.008]} />
          <meshStandardMaterial {...MECH} />
        </mesh>

        {/* технологичные швы-панели */}
        <mesh position={[0, 0.38, 0]}>
          <boxGeometry args={[0.015, 0.015, 0.7]} />
          <meshStandardMaterial {...SHELL_SHADE} />
        </mesh>

        {/* боковой вент */}
        <mesh position={[0, -0.05, -0.3]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
          <meshStandardMaterial {...MECH} />
        </mesh>
        <mesh position={[0, -0.05, -0.33]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.06, 0.007, 8, 20]} />
          <meshStandardMaterial {...MECH_LIGHT} />
        </mesh>
      </group>

      {/* шея: преимущественно открытая механика */}
      <group name="Neck" position={[0, 1.5, 0]}>
        <mesh>
          <cylinderGeometry args={[0.065, 0.075, 0.32, 16]} />
          <meshStandardMaterial {...MECH} />
        </mesh>
        {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle) => (
          <mesh key={angle} position={[Math.cos(angle) * 0.105, 0, Math.sin(angle) * 0.105]}>
            <cylinderGeometry args={[0.016, 0.016, 0.3, 8]} />
            <meshStandardMaterial {...MECH_LIGHT} />
          </mesh>
        ))}
        <mesh position={[0, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.13, 0.012, 8, 24]} />
          <meshStandardMaterial {...MECH_LIGHT} />
        </mesh>
        <mesh position={[0, -0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.14, 0.012, 8, 24]} />
          <meshStandardMaterial {...MECH_LIGHT} />
        </mesh>
        <mesh position={[0.09, -0.05, 0.09]}>
          <sphereGeometry args={[0.016, 8, 8]} />
          <meshStandardMaterial {...AMBER} />
        </mesh>
      </group>

      {/* грудь: крупные гладкие панели, минимум деталей */}
      <group name="Chest" position={[0, 0.98, 0]}>
        <mesh>
          <boxGeometry args={[0.98, 0.5, 0.56]} />
          <meshStandardMaterial {...SHELL} />
        </mesh>
        {[-0.32, 0.32].map((x) => (
          <mesh key={x} position={[x, 0.24, 0.22]} rotation={[0, 0, x < 0 ? -0.2 : 0.2]}>
            <boxGeometry args={[0.34, 0.05, 0.1]} />
            <meshStandardMaterial {...SHELL_SHADE} />
          </mesh>
        ))}
        <ScannerModule position={[0, 0.02, 0.29]} />

        {/* механическая область живота */}
        <mesh position={[0, -0.36, 0]}>
          <boxGeometry args={[0.7, 0.32, 0.44]} />
          <meshStandardMaterial {...MECH} />
        </mesh>
        <mesh position={[0, -0.36, 0.23]}>
          <boxGeometry args={[0.34, 0.09, 0.02]} />
          <meshStandardMaterial {...GLOW} />
        </mesh>
      </group>

      {/* Spine — условная ось между грудью и тазом */}
      <mesh name="Spine" position={[0, 0.68, 0]} visible={false}>
        <boxGeometry args={[0.01, 0.01, 0.01]} />
      </mesh>

      {/* плечевые узлы */}
      <group name="Shoulder_L" position={[-0.56, 1.28, 0]}>
        <Limb
          name="Arm_L"
          jointRadius={0.19}
          upperArgs={[0.15, 0.13, 0.5]}
          upperRot={[0.1, 0, 0.06]}
          lowerArgs={[0.11, 0.09, 0.46]}
          lowerRot={[0.3, 0, 0.03]}
          midJointRadius={0.115}
          endCapRadius={0.1}
          endName="Hand_L"
          endShape="fist"
        />
      </group>
      <group name="Shoulder_R" position={[0.56, 1.28, 0]}>
        <Limb
          name="Arm_R"
          jointRadius={0.19}
          upperArgs={[0.15, 0.13, 0.5]}
          upperRot={[0.1, 0, -0.06]}
          lowerArgs={[0.11, 0.09, 0.46]}
          lowerRot={[0.3, 0, -0.03]}
          midJointRadius={0.115}
          endCapRadius={0.1}
          endName="Hand_R"
          endShape="fist"
        />
      </group>

      {/* таз */}
      <group name="Pelvis" position={[0, 0.55, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.44, 0.05, 12, 32]} />
          <meshStandardMaterial {...MECH} />
        </mesh>
        <mesh position={[0, -0.13, 0]}>
          <cylinderGeometry args={[0.4, 0.42, 0.24, 20]} />
          <meshStandardMaterial {...SHELL_SHADE} />
        </mesh>

        <group name="Leg_L" position={[-0.26, -0.27, 0]}>
          <Limb
            name="Leg_L"
            jointRadius={0.15}
            upperArgs={[0.16, 0.14, 0.62]}
            upperRot={[0.02, 0, 0.02]}
            lowerArgs={[0.12, 0.1, 0.58]}
            lowerRot={[0.06, 0, 0]}
            midJointRadius={0.13}
            endCapRadius={0.12}
            endName="Foot_L"
            endShape="foot"
          />
        </group>
        <group name="Leg_R" position={[0.26, -0.27, 0]}>
          <Limb
            name="Leg_R"
            jointRadius={0.15}
            upperArgs={[0.16, 0.14, 0.62]}
            upperRot={[0.02, 0, -0.02]}
            lowerArgs={[0.12, 0.1, 0.58]}
            lowerRot={[0.06, 0, 0]}
            midJointRadius={0.13}
            endCapRadius={0.12}
            endName="Foot_R"
            endShape="foot"
          />
        </group>
      </group>
    </group>
  );
}
