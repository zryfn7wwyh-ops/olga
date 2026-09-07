import { useMemo } from "react";
import * as THREE from "three";

/**
 * Геометрия статичного робота (Этап 1.6 — второй design pass после
 * неудачной итерации: голова, глаза, торс, плечи, конечности и стопы
 * пересобраны заново, а не отполированы поверх старой формы). Иерархия:
 * Robot, Head, FaceShell, Eye_L/R, Neck, Chest_Upper, Chest_Center,
 * ScannerModule, Spine, Pelvis, Shoulder_L/R, UpperArm_L/R, Elbow_L/R,
 * Forearm_L/R, Hand_L/R, Finger_1..4, Thigh_L/R, Knee_L/R, Shin_L/R,
 * Foot_L/R — модель готовится к риггингу, сам rigging не выполняется.
 */

// off-white painted composite / ceramic
const SHELL = {
  color: "#eae7de",
  roughness: 0.3,
  metalness: 0.14,
  clearcoat: 0.55,
  clearcoatRoughness: 0.14,
} as const;
const SHELL_SHADE = {
  color: "#d6d2c6",
  roughness: 0.33,
  metalness: 0.16,
  clearcoat: 0.5,
  clearcoatRoughness: 0.17,
} as const;
// тёмная механика: разделена на четыре разных по фактуре материала
const STEEL = { color: "#828c98", metalness: 0.78, roughness: 0.24 } as const;
const GUNMETAL = { color: "#3c414a", metalness: 0.82, roughness: 0.32 } as const;
const TITANIUM = { color: "#24272d", metalness: 0.68, roughness: 0.48 } as const;
const ANODIZED = { color: "#131417", metalness: 0.5, roughness: 0.58 } as const;
const RUBBER = { color: "#1a1a1c", metalness: 0, roughness: 0.95 } as const;
// точечные световые акценты — только cyan / cold white
const GLOW = {
  color: "#0b2e40",
  emissive: "#7fe3ff",
  emissiveIntensity: 3.4,
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
  [0.25, -0.14],
  [0.31, -0.02],
  [0.37, 0.1],
  [0.42, 0.2],
  [0.395, 0.28],
  [0.28, 0.34],
]);

// профиль таза: пояс с сужением к бёдрам
const PELVIS_PROFILE = vec2([
  [0.3, 0.14],
  [0.35, 0.06],
  [0.37, -0.03],
  [0.32, -0.11],
  [0.23, -0.17],
]);

// профиль бедра: массивнее голени, с бедренным объёмом.
// y идёт от 0 (тазобедренный сустав) вниз к колену — anchor сверху,
// как и остальная иерархия ("свисает" из родительского узла).
const THIGH_LEN = 0.59;
const THIGH_PROFILE = vec2([
  [0.17, 0],
  [0.195, -0.11],
  [0.19, -0.26],
  [0.16, -0.41],
  [0.135, -THIGH_LEN],
]);

// профиль голени: своя форма, заметно тоньше бедра, y от 0 (колено) вниз к щиколотке
const SHIN_LEN = 0.55;
const SHIN_PROFILE = vec2([
  [0.12, 0],
  [0.115, -0.15],
  [0.1, -0.32],
  [0.088, -0.47],
  [0.082, -SHIN_LEN],
]);

function HeavyJoint({ radius, boltCount = 6 }: { radius: number; boltCount?: number }) {
  const boltAngles = useMemo(
    () => Array.from({ length: boltCount }, (_, i) => (i / boltCount) * Math.PI * 2),
    [boltCount],
  );
  return (
    <group>
      {/* выпуклая белая защитная оболочка сустава */}
      <mesh scale={[1, 1, 0.62]}>
        <sphereGeometry args={[radius * 1.2, 26, 22]} />
        <meshPhysicalMaterial {...SHELL} />
      </mesh>
      {/* утопленное тёмное кольцо */}
      <mesh position={[0, 0, radius * 0.52]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius * 0.86, radius * 0.17, 12, 28]} />
        <meshStandardMaterial {...ANODIZED} />
      </mesh>
      {/* многослойный механический сустав */}
      <mesh position={[0, 0, radius * 0.6]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius * 0.63, radius * 0.05, 10, 26]} />
        <meshStandardMaterial {...STEEL} />
      </mesh>
      <mesh position={[0, 0, radius * 0.67]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius * 0.42, radius * 0.04, 10, 22]} />
        <meshStandardMaterial {...GUNMETAL} />
      </mesh>
      <mesh position={[0, 0, radius * 0.72]}>
        <cylinderGeometry args={[radius * 0.3, radius * 0.3, radius * 0.08, 18]} />
        <meshStandardMaterial {...TITANIUM} />
      </mesh>
      {/* видимые технические болты по периметру оболочки */}
      {boltAngles.map((a) => (
        <mesh
          key={a}
          position={[Math.cos(a) * radius * 0.98, Math.sin(a) * radius * 0.98, radius * 0.42]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[radius * 0.07, radius * 0.07, radius * 0.12, 8]} />
          <meshStandardMaterial {...TITANIUM} />
        </mesh>
      ))}
    </group>
  );
}

function JointRing({
  radius,
  tube = 0.03,
  withLed = false,
}: {
  radius: number;
  tube?: number;
  withLed?: boolean;
}) {
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.012]}>
        <torusGeometry args={[radius * 1.18, tube * 1.4, 12, 28]} />
        <meshPhysicalMaterial {...SHELL} />
      </mesh>
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

// оптический сенсор: круглый цилиндрический корпус камеры, без "век" —
// именно скруглённая по всем сторонам форма убирает эффект "сонных глаз"
function Eye({ name, x }: { name: string; x: number }) {
  return (
    <group name={name} position={[x, 0.03, 0.38]}>
      {/* неглубокая тёмная посадка — тонкий барабан, не большой плоский диск */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.115, 0.13, 0.05, 28]} />
        <meshStandardMaterial {...ANODIZED} />
      </mesh>
      {/* выступающий металлический ободок сенсора */}
      <mesh position={[0, 0, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.128, 0.015, 10, 28]} />
        <meshStandardMaterial {...STEEL} />
      </mesh>
      {/* тонкое кольцо диафрагмы среднего радиуса */}
      <mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.09, 0.009, 10, 24]} />
        <meshStandardMaterial {...GUNMETAL} />
      </mesh>
      {/* лепестки диафрагмы — тонкие, не перекрывают центральную линзу */}
      {EYE_BLADE_ANGLES.map((angle) => (
        <mesh key={angle} position={[0, 0, 0.04]} rotation={[0, 0, angle]}>
          <boxGeometry args={[0.088, 0.01, 0.004]} />
          <meshStandardMaterial {...TITANIUM} />
        </mesh>
      ))}
      {/* крупная стеклянная линза — доминирующий элемент вместо тёмной ямы */}
      <mesh position={[0, 0, 0.07]}>
        <sphereGeometry args={[0.082, 22, 22]} />
        <meshStandardMaterial {...LENS_GLASS} />
      </mesh>
      {/* яркое оптическое ядро — главный акцент, читается как включённый прибор */}
      <mesh position={[0, 0, 0.062]}>
        <sphereGeometry args={[0.058, 18, 18]} />
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

function Finger({
  name,
  x,
  radius,
}: {
  name: string;
  x: number;
  radius: number;
}) {
  return (
    <group name={name} position={[x, -1.05 * radius, 0.18 * radius]} rotation={[0.35, 0, 0]}>
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
  );
}

function Hand({ mirror, radius }: { mirror: number; radius: number }) {
  const fingerOffsets: [string, number][] = [
    ["Finger_1", -0.42],
    ["Finger_2", -0.14],
    ["Finger_3", 0.14],
    ["Finger_4", 0.42],
  ];
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
      {fingerOffsets.map(([name, fx]) => (
        <Finger key={name} name={name} x={fx * radius * 2.1} radius={radius} />
      ))}
      <group
        name="Finger_Thumb"
        position={[mirror * radius * 0.62, -radius * 0.55, radius * 0.35]}
        rotation={[0.2, 0, mirror * 0.9]}
      >
        <mesh position={[0, -radius * 0.25, 0]}>
          <cylinderGeometry args={[radius * 0.15, radius * 0.13, radius * 0.5, 10]} />
          <meshPhysicalMaterial {...SHELL_SHADE} />
        </mesh>
      </group>
    </group>
  );
}

function Foot({ radius }: { radius: number }) {
  return (
    <group>
      {/* воротник лодыжки */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius * 0.68, 0.02, 10, 22]} />
        <meshStandardMaterial {...GUNMETAL} />
      </mesh>
      {/* боковые накладки лодыжки */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * radius * 0.5, -radius * 0.2, 0]}>
          <boxGeometry args={[radius * 0.12, radius * 0.42, radius * 0.46]} />
          <meshStandardMaterial {...TITANIUM} />
        </mesh>
      ))}
      {/* верхняя оболочка стопы — скруглённая, не прямоугольный блок */}
      <mesh position={[0, -radius * 0.38, radius * 0.15]} scale={[1, 0.68, 1.55]}>
        <sphereGeometry args={[radius * 0.66, 20, 16]} />
        <meshPhysicalMaterial {...SHELL} />
      </mesh>
      {/* скруглённая пятка */}
      <mesh position={[0, -radius * 0.55, -radius * 0.42]} scale={[1, 0.85, 0.85]}>
        <sphereGeometry args={[radius * 0.5, 16, 14]} />
        <meshPhysicalMaterial {...SHELL_SHADE} />
      </mesh>
      {/* широкая устойчивая подошва */}
      <mesh position={[0, -radius * 0.92, radius * 0.1]}>
        <boxGeometry args={[radius * 1.7, radius * 0.16, radius * 2.5]} />
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
  const upperShellLen = upperLen * 0.86;
  const upperGap = upperLen - upperShellLen;
  const lowerShellLen = lowerLen * 0.88;
  const lowerGap = lowerLen - lowerShellLen;

  return (
    <group>
      <HeavyJoint radius={jointRadius} />
      <mesh>
        <sphereGeometry args={[jointRadius * 0.7, 20, 20]} />
        <meshPhysicalMaterial {...SHELL} />
      </mesh>

      <group name={upperName} rotation={upperRot}>
        {/* бицепс-образная выпуклость вместо прямого конуса */}
        <mesh position={[0, -upperShellLen * 0.32, 0]}>
          <cylinderGeometry args={[upperArgs[0], upperArgs[0] * 1.06, upperShellLen * 0.55, 16]} />
          <meshPhysicalMaterial {...SHELL} />
        </mesh>
        <mesh position={[0, -upperShellLen * 0.74, 0]}>
          <cylinderGeometry args={[upperArgs[0] * 1.06, upperArgs[1], upperShellLen * 0.45, 16]} />
          <meshPhysicalMaterial {...SHELL} />
        </mesh>
        <mesh position={[0, -upperShellLen * 0.62, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[upperArgs[1] * 1.02, 0.014, 8, 20]} />
          <meshStandardMaterial {...GUNMETAL} />
        </mesh>
        {/* открытая механика в зазоре перед суставом */}
        <mesh position={[0, -(upperShellLen + upperLen) / 2, 0]}>
          <cylinderGeometry args={[upperArgs[1] * 0.72, upperArgs[1] * 0.66, upperGap, 12]} />
          <meshStandardMaterial {...GUNMETAL} />
        </mesh>

        <group name={jointName} position={[0, -upperLen, 0]} rotation={lowerRot}>
          <JointRing radius={midJointRadius} tube={0.024} withLed={endShape === "hand"} />

          <group name={lowerName}>
            <mesh position={[0, -lowerShellLen / 2, 0]}>
              <cylinderGeometry args={lowerArgs} />
              <meshPhysicalMaterial {...SHELL} />
            </mesh>
            <mesh position={[0, -lowerShellLen * 0.68, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[lowerArgs[1] * 1.05, 0.012, 8, 20]} />
              <meshStandardMaterial {...GUNMETAL} />
            </mesh>
            <mesh position={[0, -(lowerShellLen + lowerLen) / 2, 0]}>
              <cylinderGeometry args={[lowerArgs[1] * 0.68, lowerArgs[1] * 0.6, lowerGap, 10]} />
              <meshStandardMaterial {...TITANIUM} />
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

function LegLimb({
  side,
  upperName,
  jointName,
  lowerName,
  endName,
  jointRadius,
  thighScale,
  thighRot,
  shinScale,
  shinRot,
  midJointRadius,
  endCapRadius,
}: {
  side: "L" | "R";
  upperName: string;
  jointName: string;
  lowerName: string;
  endName: string;
  jointRadius: number;
  thighScale: [number, number, number];
  thighRot: [number, number, number];
  shinScale: [number, number, number];
  shinRot: [number, number, number];
  midJointRadius: number;
  endCapRadius: number;
}) {
  return (
    <group>
      <HeavyJoint radius={jointRadius} boltCount={8} />
      <mesh>
        <sphereGeometry args={[jointRadius * 0.68, 20, 20]} />
        <meshPhysicalMaterial {...SHELL} />
      </mesh>

      <group name={upperName} rotation={thighRot}>
        <mesh scale={thighScale}>
          <latheGeometry args={[THIGH_PROFILE, 22]} />
          <meshPhysicalMaterial {...SHELL} />
        </mesh>
        <mesh position={[0, -THIGH_LEN * 0.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.15 * thighScale[0], 0.014, 8, 20]} />
          <meshStandardMaterial {...GUNMETAL} />
        </mesh>

        <group name={jointName} position={[0, -THIGH_LEN, 0]}>
          <HeavyJoint radius={midJointRadius} boltCount={6} />

          <group name={lowerName} rotation={shinRot}>
            <mesh scale={shinScale}>
              <latheGeometry args={[SHIN_PROFILE, 20]} />
              <meshPhysicalMaterial {...SHELL} />
            </mesh>
            <mesh position={[0, -SHIN_LEN * 0.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.1 * shinScale[0], 0.011, 8, 20]} />
              <meshStandardMaterial {...GUNMETAL} />
            </mesh>

            <group name={endName} position={[0, -SHIN_LEN - 0.03, 0]}>
              <Foot radius={endCapRadius} />
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
    <mesh position={[x, -1.42, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[0.46, 0.46]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  );
}

export function RobotModel() {
  return (
    <group name="Robot" rotation={[0.02, -0.12, 0]} position={[0, -0.42, 0]}>
      {/* голова: составной объём, инженерная сложность вместо гладкого овала */}
      <group name="Head" position={[0, 1.88, 0]} rotation={[0, -0.16, 0]}>
        <mesh scale={[0.84, 1.1, 0.95]}>
          <sphereGeometry args={[0.42, 32, 32]} />
          <meshPhysicalMaterial {...SHELL} />
        </mesh>
        {/* затылочная панель другого тона — визуально отдельная секция */}
        <mesh position={[0, 0.02, -0.09]} scale={[0.8, 1.0, 0.68]}>
          <sphereGeometry args={[0.41, 24, 20]} />
          <meshPhysicalMaterial {...SHELL_SHADE} />
        </mesh>

        {/* приставная лицевая панель — явный отдельный элемент со швом */}
        <group name="FaceShell" position={[0, 0.01, 0.11]}>
          <mesh scale={[0.76, 0.66, 0.46]}>
            <sphereGeometry args={[0.4, 24, 20]} />
            <meshPhysicalMaterial {...SHELL} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.03]}>
            <torusGeometry args={[0.29, 0.007, 8, 28]} />
            <meshStandardMaterial {...TITANIUM} />
          </mesh>
        </group>

        <Eye name="Eye_L" x={-0.17} />
        <Eye name="Eye_R" x={0.17} />

        {/* деликатный нос-выступ */}
        <mesh position={[0, -0.1, 0.44]}>
          <boxGeometry args={[0.02, 0.11, 0.022]} />
          <meshPhysicalMaterial {...SHELL} />
        </mesh>

        {/* тонкий mechanical seam вместо рта */}
        <mesh position={[0, -0.23, 0.42]}>
          <boxGeometry args={[0.12, 0.008, 0.008]} />
          <meshStandardMaterial {...ANODIZED} />
        </mesh>

        {/* боковые конструктивные швы черепа — короткие, следуют изгибу поверхности */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.34, 0.05, 0.08]} rotation={[0, s * 0.5, 0.06]}>
            <boxGeometry args={[0.01, 0.22, 0.01]} />
            <meshStandardMaterial {...TITANIUM} />
          </mesh>
        ))}

        {/* теменной шов */}
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[0.014, 0.014, 0.72]} />
          <meshStandardMaterial {...TITANIUM} />
        </mesh>

        {/* височные вентиляционные решётки */}
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 0.38, 0.04, -0.04]} rotation={[0, s * 0.35, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.045, 0.045, 0.03, 12]} />
              <meshStandardMaterial {...ANODIZED} />
            </mesh>
            <mesh position={[0, 0, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.045, 0.005, 6, 16]} />
              <meshStandardMaterial {...STEEL} />
            </mesh>
          </group>
        ))}

        {/* затылочный вент */}
        <mesh position={[0, -0.05, -0.33]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
          <meshStandardMaterial {...ANODIZED} />
        </mesh>
        <mesh position={[0, -0.05, -0.36]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.06, 0.007, 8, 20]} />
          <meshStandardMaterial {...STEEL} />
        </mesh>

        {/* мелкие болты — микродетализация */}
        {[-0.33, 0.33].map((x) => (
          <mesh key={x} position={[x, 0.3, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.02, 8]} />
            <meshStandardMaterial {...TITANIUM} />
          </mesh>
        ))}
      </group>

      {/* шея: открытый сложный механизм, а не тонкая стойка */}
      <group name="Neck" position={[0, 1.52, 0]}>
        <mesh>
          <cylinderGeometry args={[0.07, 0.08, 0.34, 16]} />
          <meshStandardMaterial {...TITANIUM} />
        </mesh>
        {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle) => (
          <mesh key={angle} position={[Math.cos(angle) * 0.11, 0, Math.sin(angle) * 0.11]}>
            <cylinderGeometry args={[0.017, 0.017, 0.32, 8]} />
            <meshStandardMaterial {...GUNMETAL} />
          </mesh>
        ))}
        {[0.4, 2.0, 3.6].map((angle) => (
          <mesh
            key={angle}
            position={[Math.cos(angle) * 0.095, -0.02, Math.sin(angle) * 0.095]}
            rotation={[0.15, 0, 0.1]}
          >
            <cylinderGeometry args={[0.009, 0.009, 0.36, 6]} />
            <meshStandardMaterial {...RUBBER} />
          </mesh>
        ))}
        <mesh position={[0, 0.17, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.14, 0.013, 8, 24]} />
          <meshStandardMaterial {...STEEL} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.13, 0.011, 8, 24]} />
          <meshStandardMaterial {...TITANIUM} />
        </mesh>
        <mesh position={[0, -0.17, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.15, 0.013, 8, 24]} />
          <meshStandardMaterial {...STEEL} />
        </mesh>
        <mesh position={[0.095, -0.06, 0.095]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshStandardMaterial {...GLOW} />
        </mesh>
      </group>

      {/* грудь: анатомичная оболочка + приставная центральная панель + нижняя секция */}
      <group name="Chest_Upper" position={[0, 1.0, 0]}>
        <mesh scale={[1.1, 1, 0.74]}>
          <latheGeometry args={[TORSO_PROFILE, 28]} />
          <meshPhysicalMaterial {...SHELL} />
        </mesh>

        {/* боковые грудные элементы */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.36, 0.12, 0.03]} rotation={[0, s * -0.6, 0]}>
            <cylinderGeometry args={[0.3, 0.27, 0.32, 16, 1, true, -0.5, 1.0]} />
            <meshPhysicalMaterial {...SHELL_SHADE} side={THREE.DoubleSide} />
          </mesh>
        ))}

        <group name="Chest_Center" position={[0, 0.14, 0.05]}>
          <mesh rotation={[0, -Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.46, 0.42, 0.32, 24, 1, true, -0.75, 1.5]} />
            <meshPhysicalMaterial {...SHELL_SHADE} side={THREE.DoubleSide} />
          </mesh>
          {[-0.32, 0.32].map((x) => (
            <mesh key={x} position={[x, 0.19, 0.2]} rotation={[0, 0, x < 0 ? -0.2 : 0.2]}>
              <boxGeometry args={[0.32, 0.045, 0.09]} />
              <meshPhysicalMaterial {...SHELL_SHADE} />
            </mesh>
          ))}
          <ScannerModule position={[0, -0.03, 0.22]} />
        </group>

        {/* нижняя корпусная секция — отдельная деталь силуэта у пояса */}
        {[-1, 1].map((s) => (
          <mesh key={"lower" + s} position={[s * 0.2, -0.42, -0.03]} rotation={[0, s * 1.15, 0]}>
            <cylinderGeometry args={[0.27, 0.23, 0.24, 18, 1, true, -0.85, 1.7]} />
            <meshPhysicalMaterial {...SHELL_SHADE} side={THREE.DoubleSide} />
          </mesh>
        ))}

        {/* открытая механика живота: spine, приводы, кабели, рёбра */}
        <mesh position={[0, -0.38, 0]}>
          <boxGeometry args={[0.48, 0.28, 0.32]} />
          <meshStandardMaterial {...ANODIZED} />
        </mesh>
        <mesh name="Spine" position={[0, -0.38, 0.02]}>
          <cylinderGeometry args={[0.02, 0.02, 0.52, 10]} />
          <meshStandardMaterial {...TITANIUM} />
        </mesh>
        {[-0.09, 0.09].map((x) => (
          <mesh key={x} position={[x, -0.38, 0.1]}>
            <cylinderGeometry args={[0.02, 0.02, 0.24, 8]} />
            <meshStandardMaterial {...GUNMETAL} />
          </mesh>
        ))}
        {[-0.28, -0.48].map((y) => (
          <mesh key={y} position={[0, y, -0.02]}>
            <boxGeometry args={[0.4, 0.018, 0.24]} />
            <meshStandardMaterial {...STEEL} />
          </mesh>
        ))}
        {[-0.6, 2.4].map((angle) => (
          <mesh
            key={angle}
            position={[Math.cos(angle) * 0.13, -0.44, Math.sin(angle) * 0.13]}
            rotation={[0.1, 0, 0.2]}
          >
            <cylinderGeometry args={[0.008, 0.008, 0.2, 6]} />
            <meshStandardMaterial {...RUBBER} />
          </mesh>
        ))}
        <mesh position={[0, -0.38, 0.17]}>
          <sphereGeometry args={[0.02, 10, 10]} />
          <meshStandardMaterial {...GLOW} />
        </mesh>
      </group>

      {/* плечевые узлы: тяжёлый многослойный сустав */}
      <group name="Shoulder_L" position={[-0.58, 1.32, 0]}>
        <Limb
          side="L"
          upperName="UpperArm_L"
          jointName="Elbow_L"
          lowerName="Forearm_L"
          endName="Hand_L"
          endShape="hand"
          jointRadius={0.2}
          upperArgs={[0.15, 0.13, 0.5]}
          upperRot={[0.1, 0, 0.06]}
          lowerArgs={[0.11, 0.09, 0.46]}
          lowerRot={[0.3, 0, 0.03]}
          midJointRadius={0.12}
          endCapRadius={0.1}
        />
      </group>
      <group name="Shoulder_R" position={[0.58, 1.32, 0]}>
        <Limb
          side="R"
          upperName="UpperArm_R"
          jointName="Elbow_R"
          lowerName="Forearm_R"
          endName="Hand_R"
          endShape="hand"
          jointRadius={0.2}
          upperArgs={[0.15, 0.13, 0.5]}
          upperRot={[0.1, 0, -0.06]}
          lowerArgs={[0.11, 0.09, 0.46]}
          lowerRot={[0.3, 0, -0.03]}
          midJointRadius={0.12}
          endCapRadius={0.1}
        />
      </group>

      {/* таз: центральный блок + боковые секции + hip joints */}
      <group name="Pelvis" position={[0, 0.5, 0]}>
        <mesh scale={[1.05, 1, 0.82]}>
          <latheGeometry args={[PELVIS_PROFILE, 26]} />
          <meshPhysicalMaterial {...SHELL_SHADE} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.31, 0, 0]} rotation={[0, s * 0.32, 0]}>
            <boxGeometry args={[0.12, 0.32, 0.26]} />
            <meshPhysicalMaterial {...SHELL} />
          </mesh>
        ))}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
          <torusGeometry args={[0.39, 0.032, 10, 28]} />
          <meshStandardMaterial {...GUNMETAL} />
        </mesh>

        <group name="Thigh_L" position={[-0.27, -0.14, 0]}>
          <LegLimb
            side="L"
            upperName="Thigh_L"
            jointName="Knee_L"
            lowerName="Shin_L"
            endName="Foot_L"
            jointRadius={0.155}
            thighScale={[1, 1, 0.86]}
            thighRot={[0.02, 0, 0.02]}
            shinScale={[1, 1, 0.86]}
            shinRot={[0.06, 0, 0]}
            midJointRadius={0.125}
            endCapRadius={0.12}
          />
        </group>
        <group name="Thigh_R" position={[0.27, -0.14, 0]}>
          <LegLimb
            side="R"
            upperName="Thigh_R"
            jointName="Knee_R"
            lowerName="Shin_R"
            endName="Foot_R"
            jointRadius={0.155}
            thighScale={[1, 1, 0.86]}
            thighRot={[0.02, 0, -0.02]}
            shinScale={[1, 1, 0.86]}
            shinRot={[0.06, 0, 0]}
            midJointRadius={0.125}
            endCapRadius={0.12}
          />
        </group>
      </group>

      <ContactShadow x={-0.27} />
      <ContactShadow x={0.27} />
    </group>
  );
}
