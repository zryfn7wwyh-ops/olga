import { useMemo } from "react";
import * as THREE from "three";

/**
 * Геометрия статичного робота (Этап 1.5 — переработка до анатомичного
 * premium-силуэта). Иерархия групп именована по актуальному ТЗ:
 * Robot, Head, FaceShell, Eye_L/R, Neck, Chest_Upper, Chest_Center,
 * ScannerModule, Spine, Pelvis, Shoulder_L/R, UpperArm_L/R, Elbow_L/R,
 * Forearm_L/R, Hand_L/R, Fingers, Thigh_L/R, Knee_L/R, Shin_L/R, Foot_L/R —
 * модель готовится к риггингу, сам rigging на этом этапе не выполняется.
 */

// off-white painted composite / ceramic
const SHELL = {
  color: "#e9e6dd",
  roughness: 0.32,
  metalness: 0.16,
  clearcoat: 0.5,
  clearcoatRoughness: 0.15,
} as const;
const SHELL_SHADE = {
  color: "#d8d4c9",
  roughness: 0.34,
  metalness: 0.18,
  clearcoat: 0.45,
  clearcoatRoughness: 0.18,
} as const;
// тёмная механика: разделена на четыре разных по фактуре материала
const STEEL = { color: "#7d8793", metalness: 0.75, roughness: 0.26 } as const;
const GUNMETAL = { color: "#3c414a", metalness: 0.82, roughness: 0.32 } as const;
const TITANIUM = { color: "#24272d", metalness: 0.68, roughness: 0.48 } as const;
const ANODIZED = { color: "#131417", metalness: 0.5, roughness: 0.58 } as const;
const RUBBER = { color: "#1a1a1c", metalness: 0, roughness: 0.95 } as const;
// точечные световые акценты — только cyan / cold white
const GLOW = {
  color: "#0b2e40",
  emissive: "#7fe3ff",
  emissiveIntensity: 3.2,
  toneMapped: false,
} as const;
const LENS_GLASS = {
  color: "#eaf6ff",
  transparent: true,
  opacity: 0.5,
  metalness: 0.2,
  roughness: 0.08,
} as const;

function vec2(points: Array<[number, number]>) {
  return points.map(([x, y]) => new THREE.Vector2(x, y));
}

// анатомичный профиль торса: широкая грудь, сужение к талии
const TORSO_PROFILE = vec2([
  [0.24, -0.3],
  [0.3, -0.16],
  [0.36, -0.02],
  [0.415, 0.12],
  [0.39, 0.22],
  [0.27, 0.3],
]);

// профиль таза: пояс с сужением к бёдрам
const PELVIS_PROFILE = vec2([
  [0.3, 0.14],
  [0.35, 0.06],
  [0.37, -0.03],
  [0.32, -0.11],
  [0.23, -0.17],
]);

function JointRing({
  radius,
  tube = 0.03,
  withLed = false,
  withShell = false,
}: {
  radius: number;
  tube?: number;
  withLed?: boolean;
  withShell?: boolean;
}) {
  return (
    <group>
      {withShell && (
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.012]}>
          <torusGeometry args={[radius * 1.18, tube * 1.4, 12, 28]} />
          <meshPhysicalMaterial {...SHELL} />
        </mesh>
      )}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, tube, 12, 28]} />
        <meshStandardMaterial {...STEEL} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius * 0.68, tube * 0.55, 10, 24]} />
        <meshStandardMaterial {...GUNMETAL} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[radius - tube * 1.4, radius - tube * 1.4, tube * 1.6, 20]} />
        <meshStandardMaterial {...ANODIZED} />
      </mesh>
      {withLed && (
        <mesh position={[0, 0, radius - tube]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[tube * 0.6, 12]} />
          <meshStandardMaterial {...GLOW} />
        </mesh>
      )}
    </group>
  );
}

const EYE_BLADE_ANGLES = [0, 60, 120, 180, 240, 300].map((d) => (d * Math.PI) / 180);

function Eye({ name, x }: { name: string; x: number }) {
  return (
    <group name={name} position={[x, 0.02, 0.35]}>
      {/* впадина — умеренно тёмная, не проваливается в черноту */}
      <mesh scale={[1, 0.85, 0.68]}>
        <sphereGeometry args={[0.13, 20, 20]} />
        <meshStandardMaterial {...GUNMETAL} />
      </mesh>
      {/* три концентрических кольца оправы: светлый металл снаружи, тёмный внутри */}
      <mesh position={[0, 0, 0.038]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.105, 0.016, 10, 24]} />
        <meshStandardMaterial {...STEEL} />
      </mesh>
      <mesh position={[0, 0, 0.056]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.082, 0.009, 8, 20]} />
        <meshStandardMaterial {...TITANIUM} />
      </mesh>
      <mesh position={[0, 0, 0.068]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.06, 0.007, 8, 18]} />
        <meshStandardMaterial {...STEEL} />
      </mesh>
      {/* лепестки механической диафрагмы */}
      {EYE_BLADE_ANGLES.map((angle) => (
        <mesh key={angle} position={[0, 0, 0.052]} rotation={[0, 0, angle]}>
          <boxGeometry args={[0.09, 0.016, 0.006]} />
          <meshStandardMaterial {...TITANIUM} />
        </mesh>
      ))}
      {/* стеклянная линза */}
      <mesh position={[0, 0, 0.072]}>
        <sphereGeometry args={[0.06, 20, 20]} />
        <meshStandardMaterial {...LENS_GLASS} />
      </mesh>
      {/* оптическое ядро — холодное свечение */}
      <mesh position={[0, 0, 0.064]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial {...GLOW} />
      </mesh>
    </group>
  );
}

const SCANNER_BLADE_ANGLES = [0, 72, 144, 216, 288].map((d) => (d * Math.PI) / 180);

function ScannerModule({ position }: { position: [number, number, number] }) {
  return (
    <group name="ScannerModule" position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.17, 0.02, 12, 28]} />
        <meshStandardMaterial {...STEEL} />
      </mesh>
      <mesh position={[0, 0, 0.012]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.125, 0.011, 10, 24]} />
        <meshStandardMaterial {...GUNMETAL} />
      </mesh>
      <mesh position={[0, 0, 0.024]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.085, 0.008, 8, 20]} />
        <meshStandardMaterial {...STEEL} />
      </mesh>
      {/* механическая апертура */}
      {SCANNER_BLADE_ANGLES.map((angle) => (
        <mesh key={angle} position={[0, 0, 0.02]} rotation={[0, 0, angle]}>
          <boxGeometry args={[0.1, 0.018, 0.006]} />
          <meshStandardMaterial {...TITANIUM} />
        </mesh>
      ))}
      <mesh position={[0, 0, 0.03]} scale={[1, 1, 0.4]}>
        <sphereGeometry args={[0.095, 20, 20]} />
        <meshStandardMaterial {...LENS_GLASS} />
      </mesh>
      <mesh position={[0, 0, 0.022]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial {...GLOW} />
      </mesh>
    </group>
  );
}

function Hand({ mirror, radius }: { mirror: number; radius: number }) {
  const fingerOffsets = [-0.42, -0.14, 0.14, 0.42];
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius * 0.65, 0.015, 10, 22]} />
        <meshStandardMaterial {...GUNMETAL} />
      </mesh>
      {/* ладонь */}
      <mesh position={[0, -radius * 0.55, 0]}>
        <boxGeometry args={[radius * 1.3, radius * 1.0, radius * 0.55]} />
        <meshPhysicalMaterial {...SHELL_SHADE} />
      </mesh>
      {/* пальцы и большой палец — единая группа Fingers */}
      <group name="Fingers">
        {fingerOffsets.map((fx) => (
          <group
            key={fx}
            position={[fx * radius * 2.1, -radius * 1.05, radius * 0.18]}
            rotation={[0.35, 0, 0]}
          >
            <mesh position={[0, -radius * 0.28, 0]}>
              <cylinderGeometry args={[radius * 0.14, radius * 0.13, radius * 0.55, 10]} />
              <meshPhysicalMaterial {...SHELL_SHADE} />
            </mesh>
            <group position={[0, -radius * 0.55, 0]} rotation={[0.5, 0, 0]}>
              <mesh position={[0, -radius * 0.22, 0]}>
                <cylinderGeometry args={[radius * 0.12, radius * 0.1, radius * 0.42, 10]} />
                <meshPhysicalMaterial {...SHELL_SHADE} />
              </mesh>
            </group>
          </group>
        ))}
        <group
          position={[mirror * radius * 0.62, -radius * 0.55, radius * 0.35]}
          rotation={[0.2, 0, mirror * 0.9]}
        >
          <mesh position={[0, -radius * 0.25, 0]}>
            <cylinderGeometry args={[radius * 0.15, radius * 0.13, radius * 0.5, 10]} />
            <meshPhysicalMaterial {...SHELL_SHADE} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function Foot({ radius }: { radius: number }) {
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius * 0.62, 0.013, 10, 22]} />
        <meshStandardMaterial {...GUNMETAL} />
      </mesh>
      {/* пятка */}
      <mesh position={[0, -radius * 0.42, -radius * 0.32]}>
        <boxGeometry args={[radius * 1.15, radius * 0.62, radius * 0.7]} />
        <meshPhysicalMaterial {...SHELL_SHADE} />
      </mesh>
      {/* носок */}
      <mesh position={[0, -radius * 0.5, radius * 0.55]}>
        <boxGeometry args={[radius * 1.3, radius * 0.5, radius * 1.3]} />
        <meshPhysicalMaterial {...SHELL} />
      </mesh>
      {/* тёмная подошва */}
      <mesh position={[0, -radius * 0.82, radius * 0.15]}>
        <boxGeometry args={[radius * 1.35, radius * 0.14, radius * 2.05]} />
        <meshStandardMaterial {...ANODIZED} />
      </mesh>
    </group>
  );
}

interface LimbProps {
  side: "L" | "R";
  upperName: string;
  jointName: string;
  lowerName: string;
  endName: string;
  jointRadius: number;
  upperArgs: [number, number, number];
  upperRot: [number, number, number];
  lowerArgs: [number, number, number];
  lowerRot: [number, number, number];
  midJointRadius: number;
  endCapRadius: number;
  endShape: "hand" | "foot";
}

function Limb({
  side,
  upperName,
  jointName,
  lowerName,
  endName,
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
  const mirror = side === "L" ? 1 : -1;

  return (
    <group>
      <JointRing radius={jointRadius} withShell />
      <mesh>
        <sphereGeometry args={[jointRadius * 0.82, 20, 20]} />
        <meshPhysicalMaterial {...SHELL} />
      </mesh>

      <group name={upperName} rotation={upperRot}>
        <mesh position={[0, -upperLen / 2, 0]}>
          <cylinderGeometry args={upperArgs} />
          <meshPhysicalMaterial {...SHELL} />
        </mesh>
        {/* лента актуатора разбивает гладкий цилиндр */}
        <mesh position={[0, -upperLen * 0.62, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[upperArgs[1] * 1.02, 0.014, 8, 20]} />
          <meshStandardMaterial {...GUNMETAL} />
        </mesh>

        <group name={jointName} position={[0, -upperLen, 0]} rotation={lowerRot}>
          <JointRing radius={midJointRadius} tube={0.022} withShell withLed={endShape === "hand"} />

          <group name={lowerName}>
            <mesh position={[0, -lowerLen / 2, 0]}>
              <cylinderGeometry args={lowerArgs} />
              <meshPhysicalMaterial {...SHELL} />
            </mesh>
            <mesh position={[0, -lowerLen * 0.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[lowerArgs[1] * 1.05, 0.012, 8, 20]} />
              <meshStandardMaterial {...GUNMETAL} />
            </mesh>

            <group name={endName} position={[0, -lowerLen, 0]}>
              {endShape === "hand" ? (
                <Hand mirror={mirror} radius={endCapRadius} />
              ) : (
                <Foot radius={endCapRadius} />
              )}
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

function ContactShadow({ x }: { x: number }) {
  const texture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(8,14,20,0.35)");
    gradient.addColorStop(1, "rgba(8,14,20,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
  }, []);

  if (!texture) return null;
  return (
    <mesh position={[x, -1.4, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[0.42, 0.42]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  );
}

export function RobotModel() {
  return (
    <group name="Robot" rotation={[0.02, -0.12, 0]} position={[0, -0.4, 0]}>
      {/* голова: полноценный объёмный корпус, нейтральная небровастая мимика */}
      <group name="Head" position={[0, 1.86, 0]} rotation={[0, -0.16, 0]}>
        <mesh scale={[0.86, 1.14, 0.98]}>
          <sphereGeometry args={[0.42, 32, 32]} />
          <meshPhysicalMaterial {...SHELL} />
        </mesh>

        {/* приставная лицевая панель */}
        <group name="FaceShell" position={[0, 0.02, 0.09]}>
          <mesh scale={[0.8, 0.74, 0.5]}>
            <sphereGeometry args={[0.4, 24, 20]} />
            <meshPhysicalMaterial {...SHELL_SHADE} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.02]}>
            <torusGeometry args={[0.3, 0.006, 8, 28]} />
            <meshStandardMaterial {...TITANIUM} />
          </mesh>
        </group>

        <Eye name="Eye_L" x={-0.16} />
        <Eye name="Eye_R" x={0.16} />

        {/* деликатный нос-выступ */}
        <mesh position={[0, -0.09, 0.42]}>
          <boxGeometry args={[0.018, 0.1, 0.02]} />
          <meshPhysicalMaterial {...SHELL} />
        </mesh>

        {/* тонкий mechanical seam вместо рта */}
        <mesh position={[0, -0.21, 0.405]}>
          <boxGeometry args={[0.11, 0.007, 0.007]} />
          <meshStandardMaterial {...ANODIZED} />
        </mesh>

        {/* технологичный шов по темени */}
        <mesh position={[0, 0.39, 0]}>
          <boxGeometry args={[0.015, 0.015, 0.7]} />
          <meshStandardMaterial {...TITANIUM} />
        </mesh>

        {/* боковой вент */}
        <mesh position={[0, -0.05, -0.31]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
          <meshStandardMaterial {...ANODIZED} />
        </mesh>
        <mesh position={[0, -0.05, -0.34]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.06, 0.007, 8, 20]} />
          <meshStandardMaterial {...STEEL} />
        </mesh>

        {/* мелкие болты — микродетализация */}
        {[-0.32, 0.32].map((x) => (
          <mesh key={x} position={[x, 0.28, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.02, 8]} />
            <meshStandardMaterial {...TITANIUM} />
          </mesh>
        ))}
      </group>

      {/* шея: открытая механика — spine, тяги, кабели, кольца */}
      <group name="Neck" position={[0, 1.5, 0]}>
        <mesh>
          <cylinderGeometry args={[0.065, 0.075, 0.32, 16]} />
          <meshStandardMaterial {...TITANIUM} />
        </mesh>
        {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle) => (
          <mesh key={angle} position={[Math.cos(angle) * 0.105, 0, Math.sin(angle) * 0.105]}>
            <cylinderGeometry args={[0.016, 0.016, 0.3, 8]} />
            <meshStandardMaterial {...GUNMETAL} />
          </mesh>
        ))}
        {[0.4, 2.6].map((angle) => (
          <mesh
            key={angle}
            position={[Math.cos(angle) * 0.09, -0.02, Math.sin(angle) * 0.09]}
            rotation={[0.15, 0, 0.1]}
          >
            <cylinderGeometry args={[0.009, 0.009, 0.34, 6]} />
            <meshStandardMaterial {...RUBBER} />
          </mesh>
        ))}
        <mesh position={[0, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.13, 0.012, 8, 24]} />
          <meshStandardMaterial {...STEEL} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.12, 0.01, 8, 24]} />
          <meshStandardMaterial {...TITANIUM} />
        </mesh>
        <mesh position={[0, -0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.14, 0.012, 8, 24]} />
          <meshStandardMaterial {...STEEL} />
        </mesh>
        <mesh position={[0.09, -0.05, 0.09]}>
          <sphereGeometry args={[0.014, 8, 8]} />
          <meshStandardMaterial {...GLOW} />
        </mesh>
      </group>

      {/* грудь: анатомичная оболочка (Chest_Upper) + приставная панель (Chest_Center) */}
      <group name="Chest_Upper" position={[0, 0.98, 0]}>
        <mesh scale={[1.12, 1, 0.76]}>
          <latheGeometry args={[TORSO_PROFILE, 28]} />
          <meshPhysicalMaterial {...SHELL} />
        </mesh>

        {/* боковые панели */}
        {[-1, 1].map((s) => (
          <mesh
            key={s}
            position={[s * 0.34, 0.02, 0.04]}
            rotation={[0, s * -0.6, 0]}
          >
            <cylinderGeometry args={[0.3, 0.28, 0.34, 16, 1, true, -0.5, 1.0]} />
            <meshPhysicalMaterial {...SHELL_SHADE} side={THREE.DoubleSide} />
          </mesh>
        ))}

        <group name="Chest_Center" position={[0, 0.04, 0.05]}>
          <mesh rotation={[0, -Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.48, 0.44, 0.34, 24, 1, true, -0.75, 1.5]} />
            <meshPhysicalMaterial {...SHELL_SHADE} side={THREE.DoubleSide} />
          </mesh>
          {[-0.32, 0.32].map((x) => (
            <mesh key={x} position={[x, 0.2, 0.22]} rotation={[0, 0, x < 0 ? -0.2 : 0.2]}>
              <boxGeometry args={[0.32, 0.045, 0.09]} />
              <meshPhysicalMaterial {...SHELL_SHADE} />
            </mesh>
          ))}
          <ScannerModule position={[0, -0.02, 0.24]} />
        </group>

        {/* открытая механика живота: spine, приводы, кабели */}
        <mesh position={[0, -0.36, 0]}>
          <boxGeometry args={[0.5, 0.26, 0.34]} />
          <meshStandardMaterial {...ANODIZED} />
        </mesh>
        <mesh name="Spine" position={[0, -0.36, 0.02]}>
          <cylinderGeometry args={[0.02, 0.02, 0.5, 10]} />
          <meshStandardMaterial {...TITANIUM} />
        </mesh>
        {[-0.09, 0.09].map((x) => (
          <mesh key={x} position={[x, -0.36, 0.1]}>
            <cylinderGeometry args={[0.02, 0.02, 0.22, 8]} />
            <meshStandardMaterial {...GUNMETAL} />
          </mesh>
        ))}
        <mesh position={[0, -0.36, 0.18]}>
          <sphereGeometry args={[0.02, 10, 10]} />
          <meshStandardMaterial {...GLOW} />
        </mesh>
      </group>

      {/* плечевые узлы: белый shell + gunmetal ring + внутренний joint */}
      <group name="Shoulder_L" position={[-0.56, 1.28, 0]}>
        <Limb
          side="L"
          upperName="UpperArm_L"
          jointName="Elbow_L"
          lowerName="Forearm_L"
          endName="Hand_L"
          endShape="hand"
          jointRadius={0.19}
          upperArgs={[0.15, 0.13, 0.5]}
          upperRot={[0.1, 0, 0.06]}
          lowerArgs={[0.11, 0.09, 0.46]}
          lowerRot={[0.3, 0, 0.03]}
          midJointRadius={0.115}
          endCapRadius={0.1}
        />
      </group>
      <group name="Shoulder_R" position={[0.56, 1.28, 0]}>
        <Limb
          side="R"
          upperName="UpperArm_R"
          jointName="Elbow_R"
          lowerName="Forearm_R"
          endName="Hand_R"
          endShape="hand"
          jointRadius={0.19}
          upperArgs={[0.15, 0.13, 0.5]}
          upperRot={[0.1, 0, -0.06]}
          lowerArgs={[0.11, 0.09, 0.46]}
          lowerRot={[0.3, 0, -0.03]}
          midJointRadius={0.115}
          endCapRadius={0.1}
        />
      </group>

      {/* таз и ноги */}
      <group name="Pelvis" position={[0, 0.55, 0]}>
        <mesh scale={[1.05, 1, 0.82]}>
          <latheGeometry args={[PELVIS_PROFILE, 26]} />
          <meshPhysicalMaterial {...SHELL_SHADE} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <torusGeometry args={[0.38, 0.03, 10, 28]} />
          <meshStandardMaterial {...GUNMETAL} />
        </mesh>

        <group name="Thigh_L" position={[-0.26, -0.27, 0]}>
          <Limb
            side="L"
            upperName="Thigh_L"
            jointName="Knee_L"
            lowerName="Shin_L"
            endName="Foot_L"
            endShape="foot"
            jointRadius={0.15}
            upperArgs={[0.16, 0.14, 0.62]}
            upperRot={[0.02, 0, 0.02]}
            lowerArgs={[0.12, 0.1, 0.58]}
            lowerRot={[0.06, 0, 0]}
            midJointRadius={0.13}
            endCapRadius={0.12}
          />
        </group>
        <group name="Thigh_R" position={[0.26, -0.27, 0]}>
          <Limb
            side="R"
            upperName="Thigh_R"
            jointName="Knee_R"
            lowerName="Shin_R"
            endName="Foot_R"
            endShape="foot"
            jointRadius={0.15}
            upperArgs={[0.16, 0.14, 0.62]}
            upperRot={[0.02, 0, -0.02]}
            lowerArgs={[0.12, 0.1, 0.58]}
            lowerRot={[0.06, 0, 0]}
            midJointRadius={0.13}
            endCapRadius={0.12}
          />
        </group>
      </group>

      <ContactShadow x={-0.26} />
      <ContactShadow x={0.26} />
    </group>
  );
}
