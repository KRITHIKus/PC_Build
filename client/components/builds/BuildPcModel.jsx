'use client'

import { useRef, Suspense, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

/* ══════════════════════════════════════════════════════════════════
   CASE DIMENSIONS  —  ATX mid-tower, 1 unit ≈ 300 mm
   Real reference: ~240 W × 505 H × 435 D mm
══════════════════════════════════════════════════════════════════ */
const CW = 0.80   // case width  (X)
const CH = 1.68   // case height (Y)
const CD = 1.45   // case depth  (Z)  ← much deeper than before

/* ══════════════════════════════════════════════════════════════════
   useRGB  —  cycles hue on a MeshStandardMaterial ref
══════════════════════════════════════════════════════════════════ */
function useRGB(speed = 0.17, offset = 0) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (!ref.current) return
    const h = (clock.getElapsedTime() * speed + offset) % 1
    ref.current.color.setHSL(h, 1, 0.55)
    ref.current.emissive.setHSL(h, 1, 0.42)
  })
  return ref
}

/* ══════════════════════════════════════════════════════════════════
   RGB POINT LIGHT
══════════════════════════════════════════════════════════════════ */
function RGBLight({ position, intensity = 3, distance = 1.8, offset = 0 }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current)
      ref.current.color.setHSL((clock.getElapsedTime() * 0.17 + offset) % 1, 1, 0.6)
  })
  return (
    <pointLight ref={ref} position={position} intensity={intensity} distance={distance} decay={2} />
  )
}

/* ══════════════════════════════════════════════════════════════════
   FAN  —  7-blade, housing ring, 4 frame struts, RGB hub + ring
══════════════════════════════════════════════════════════════════ */
function Fan({ position, rotation = [0, 0, 0], r = 0.19, speed = 9, rgbOff = 0 }) {
  const spinRef = useRef()
  const hubMat  = useRGB(0.17, rgbOff)
  const ringMat = useRGB(0.17, rgbOff)

  useFrame((_, dt) => {
    if (spinRef.current) spinRef.current.rotation.z -= dt * speed
  })

  const bladeData = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const a = (i / 7) * Math.PI * 2
        return [a, Math.sin(a) * r * 0.42, Math.cos(a) * r * 0.42]
      }),
    [r],
  )

  return (
    <group position={position} rotation={rotation}>
      {/* Outer housing ring */}
      <mesh>
        <torusGeometry args={[r, r * 0.057, 8, 48]} />
        <meshStandardMaterial color="#121212" metalness={0.93} roughness={0.15} />
      </mesh>

      {/* 4 frame struts */}
      {[0, 1, 2, 3].map(i => {
        const a = (i / 4) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[Math.sin(a) * r * 0.50, Math.cos(a) * r * 0.50, 0.001]}
            rotation={[0, 0, a]}
          >
            <boxGeometry args={[r * 0.48, r * 0.050, 0.011]} />
            <meshStandardMaterial color="#1c1c1c" metalness={0.70} roughness={0.42} />
          </mesh>
        )
      })}

      {/* Blade group (spins) */}
      <group ref={spinRef}>
        {bladeData.map(([a, bx, by], i) => (
          <mesh key={i} position={[bx, by, 0.005]} rotation={[0, 0, a + 0.5]}>
            <boxGeometry args={[r * 0.22, r * 0.54, 0.013]} />
            <meshStandardMaterial
              color="#1c1c2c"
              metalness={0.40}
              roughness={0.65}
              transparent
              opacity={0.93}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}

        {/* Hub cylinder */}
        <mesh>
          <cylinderGeometry args={[r * 0.10, r * 0.10, 0.021, 18]} />
          <meshStandardMaterial
            ref={hubMat}
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={5}
          />
        </mesh>

        {/* RGB ring */}
        <mesh>
          <torusGeometry args={[r * 0.155, 0.006, 8, 32]} />
          <meshStandardMaterial
            ref={ringMat}
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={3.5}
          />
        </mesh>
      </group>

      {/* Corner mounting screws */}
      {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([sx, sy], i) => (
        <mesh key={i} position={[sx * r * 0.90, sy * r * 0.90, 0]}>
          <cylinderGeometry args={[0.0062, 0.0062, 0.026, 8]} />
          <meshStandardMaterial color="#080808" roughness={0.90} />
        </mesh>
      ))}
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════════
   WATER TUBE  —  CatmullRom spline, translucent sleeve + cyan core
══════════════════════════════════════════════════════════════════ */
function WaterTube({ points, r = 0.016 }) {
  const { og, ig } = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      points.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    )
    return {
      og: new THREE.TubeGeometry(curve, 52, r,       10, false),
      ig: new THREE.TubeGeometry(curve, 52, r * 0.58, 8, false),
    }
  }, []) // static geometry — computed once on mount

  return (
    <group>
      <mesh geometry={og}>
        <meshStandardMaterial
          color="#c0d8ee"
          transparent
          opacity={0.52}
          roughness={0.06}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh geometry={ig}>
        <meshStandardMaterial
          color="#00c8ff"
          transparent
          opacity={0.85}
          emissive="#003060"
          emissiveIntensity={2.5}
          roughness={0}
        />
      </mesh>
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════════
   RAM STICK  —  green PCB + aluminium heatspreader + RGB diffuser
══════════════════════════════════════════════════════════════════ */
function RamStick({ position, rgbOff = 0 }) {
  const capMat  = useRGB(0.17, rgbOff)
  const lightRef = useRef()
  useFrame(({ clock }) => {
    if (lightRef.current)
      lightRef.current.color.setHSL((clock.getElapsedTime() * 0.17 + rgbOff) % 1, 1, 0.6)
  })

  return (
    <group position={position}>
      {/* Green PCB */}
      <mesh>
        <boxGeometry args={[0.038, 0.340, 0.006]} />
        <meshStandardMaterial color="#040e05" metalness={0.10} roughness={0.90} />
      </mesh>

      {/* DRAM IC chips */}
      {[-0.065, -0.020, 0.025, 0.070, 0.110].map((oy, i) => (
        <mesh key={i} position={[0, oy, 0.005]}>
          <boxGeometry args={[0.026, 0.018, 0.003]} />
          <meshStandardMaterial color="#0e0e0e" metalness={0.88} roughness={0.14} />
        </mesh>
      ))}

      {/* Aluminium heatspreader */}
      <mesh position={[0, 0.016, 0]}>
        <boxGeometry args={[0.042, 0.314, 0.012]} />
        <meshStandardMaterial color="#12121e" metalness={0.95} roughness={0.09} />
      </mesh>

      {/* Top fin details */}
      {[-0.011, 0, 0.011].map((ox, i) => (
        <mesh key={i} position={[ox, 0.177, 0]}>
          <boxGeometry args={[0.005, 0.028, 0.014]} />
          <meshStandardMaterial color="#1c1c2c" metalness={0.92} roughness={0.14} />
        </mesh>
      ))}

      {/* RGB diffuser strip */}
      <mesh position={[0, 0.187, 0.002]}>
        <boxGeometry args={[0.040, 0.012, 0.007]} />
        <meshStandardMaterial
          ref={capMat}
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={5}
          transparent
          opacity={0.90}
        />
      </mesh>

      <pointLight ref={lightRef} position={[0, 0.20, 0.01]} intensity={0.20} distance={0.26} decay={2} />
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════════
   MOTHERBOARD  —  ATX PCB, CPU socket, VRM, RAM clips, PCIe, M.2
══════════════════════════════════════════════════════════════════ */
function Motherboard({ position }) {
  return (
    <group position={position}>
      {/* PCB */}
      <mesh>
        <boxGeometry args={[0.009, 1.32, 0.94]} />
        <meshStandardMaterial color="#030d04" metalness={0.10} roughness={0.88} />
      </mesh>

      {/* Green soldermask face */}
      <mesh position={[0.006, 0, 0]}>
        <boxGeometry args={[0.001, 1.30, 0.92]} />
        <meshStandardMaterial color="#041904" metalness={0.08} roughness={0.90} />
      </mesh>

      {/* Gold PCB traces */}
      {Array.from({ length: 10 }, (_, i) => (
        <mesh key={i} position={[0.007, -0.44 + i * 0.10, 0.20 - i * 0.030]}>
          <boxGeometry args={[0.0012, 0.0016, 0.20 + (i % 3) * 0.04]} />
          <meshStandardMaterial color="#c89a0c" metalness={0.96} roughness={0.04} />
        </mesh>
      ))}

      {/* CPU socket LGA pad */}
      <mesh position={[0.007, 0.42, 0.12]}>
        <boxGeometry args={[0.003, 0.28, 0.28]} />
        <meshStandardMaterial color="#0c0c0c" metalness={0.92} roughness={0.08} />
      </mesh>

      {/* CPU socket gold border */}
      <mesh position={[0.0073, 0.42, 0.12]}>
        <boxGeometry args={[0.0015, 0.284, 0.005]} />
        <meshStandardMaterial color="#d4a210" metalness={0.95} roughness={0.04} />
      </mesh>

      {/* VRM heatsink block */}
      <mesh position={[0.018, 0.62, -0.03]}>
        <boxGeometry args={[0.028, 0.12, 0.20]} />
        <meshStandardMaterial color="#141420" metalness={0.90} roughness={0.14} />
      </mesh>

      {/* VRM heatsink fins */}
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={i} position={[0.036, 0.62, -0.03 + (i - 2) * 0.032]}>
          <boxGeometry args={[0.008, 0.115, 0.012]} />
          <meshStandardMaterial color="#20203a" metalness={0.88} roughness={0.18} />
        </mesh>
      ))}

      {/* RAM slot clips × 4 */}
      {[0.28, 0.21, 0.14, 0.07].map((oz, i) => (
        <mesh key={i} position={[0.007, 0.44, oz]}>
          <boxGeometry args={[0.003, 0.40, 0.048]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.65} roughness={0.55} />
        </mesh>
      ))}

      {/* PCIe x16 primary slot */}
      <mesh position={[0.007, -0.04, -0.02]}>
        <boxGeometry args={[0.003, 0.016, 0.70]} />
        <meshStandardMaterial color="#1e1c00" metalness={0.60} roughness={0.55} />
      </mesh>

      {/* PCIe secondary slots */}
      {[-0.18, -0.30].map((oy, i) => (
        <mesh key={i} position={[0.007, oy, -0.02]}>
          <boxGeometry args={[0.003, 0.013, i === 0 ? 0.32 : 0.54]} />
          <meshStandardMaterial color="#0d0d0d" metalness={0.60} roughness={0.55} />
        </mesh>
      ))}

      {/* M.2 NVMe slot */}
      <mesh position={[0.008, 0.14, -0.04]}>
        <boxGeometry args={[0.003, 0.010, 0.24]} />
        <meshStandardMaterial color="#060f06" metalness={0.10} roughness={0.90} />
      </mesh>

      {/* M.2 heatsink cover */}
      <mesh position={[0.015, 0.14, -0.04]}>
        <boxGeometry args={[0.013, 0.022, 0.148]} />
        <meshStandardMaterial color="#181818" metalness={0.88} roughness={0.18} />
      </mesh>

      {/* Chipset heatsink */}
      <mesh position={[0.018, -0.22, 0.06]}>
        <boxGeometry args={[0.026, 0.092, 0.092]} />
        <meshStandardMaterial color="#17172a" metalness={0.88} roughness={0.16} />
      </mesh>

      {/* Electrolytic capacitors */}
      {[0.14, 0.06, -0.02, -0.10].map((oz, i) => (
        <mesh key={i} position={[0.014, 0.62, oz]}>
          <cylinderGeometry args={[0.006, 0.006, 0.020, 8]} />
          <meshStandardMaterial color="#14143a" metalness={0.55} roughness={0.55} />
        </mesh>
      ))}

      {/* IO shield area */}
      <mesh position={[0.006, 0.48, -0.435]}>
        <boxGeometry args={[0.005, 0.36, 0.060]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.72} roughness={0.42} />
      </mesh>
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════════
   GPU  —  triple-fan, fin stack, heat pipes, backplate, RGB strip
══════════════════════════════════════════════════════════════════ */
function GPU({ position }) {
  const rgbMat  = useRGB(0.17, 0.55)
  const lightRef = useRef()
  useFrame(({ clock }) => {
    if (lightRef.current)
      lightRef.current.color.setHSL((clock.getElapsedTime() * 0.17 + 0.55) % 1, 1, 0.6)
  })

  const GL = 1.26  // GPU length  Z  ~380 mm
  const GH = 0.54  // GPU height  Y  ~162 mm (3-slot)
  const GT = 0.22  // GPU thickness X ~66 mm

  return (
    <group position={position}>
      {/* Main shroud */}
      <mesh>
        <boxGeometry args={[GT, GH, GL]} />
        <meshStandardMaterial color="#0f0f1a" metalness={0.74} roughness={0.28} />
      </mesh>

      {/* Fan shroud openings (recessed circles) */}
      {[-GL * 0.32, 0, GL * 0.32].map((oz, i) => (
        <mesh key={i} position={[GT * 0.36, 0, oz]}>
          <cylinderGeometry args={[0.100, 0.100, GT * 0.10, 36]} />
          <meshStandardMaterial color="#070710" metalness={0.50} roughness={0.85} />
        </mesh>
      ))}

      {/* Aluminium heatsink fin stack */}
      {Array.from({ length: 18 }, (_, i) => (
        <mesh key={i} position={[GT * 0.28, -GH * 0.30 + i * 0.020, 0]}>
          <boxGeometry args={[GT * 0.26, 0.005, GL * 0.88]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.88} roughness={0.15} />
        </mesh>
      ))}

      {/* Copper heat pipes */}
      {[-0.15, -0.04, 0.07, 0.18].map((oz, i) => (
        <mesh key={i} position={[GT * 0.14, 0, oz]}>
          <cylinderGeometry args={[0.007, 0.007, GH * 0.76, 8]} />
          <meshStandardMaterial color="#b8700a" metalness={0.95} roughness={0.08} />
        </mesh>
      ))}

      {/* Backplate */}
      <mesh position={[-GT * 0.46, 0, 0]}>
        <boxGeometry args={[0.013, GH * 0.92, GL * 0.96]} />
        <meshStandardMaterial color="#1c1c24" metalness={0.90} roughness={0.13} />
      </mesh>

      {/* Backplate RGB strip */}
      <mesh position={[-GT * 0.46, GH * 0.36, 0]}>
        <boxGeometry args={[0.010, 0.009, GL * 0.80]} />
        <meshStandardMaterial
          ref={rgbMat}
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={3.5}
        />
      </mesh>

      {/* 16-pin power connector */}
      <mesh position={[GT * 0.08, GH * 0.44, -GL * 0.26]}>
        <boxGeometry args={[GT * 0.78, 0.052, 0.050]} />
        <meshStandardMaterial color="#1e1e1e" roughness={0.88} />
      </mesh>

      {/* PCIe power connector hood */}
      <mesh position={[GT * 0.08, GH * 0.50, -GL * 0.26]}>
        <boxGeometry args={[GT * 0.74, 0.020, 0.046]} />
        <meshStandardMaterial color="#141414" roughness={0.85} />
      </mesh>

      {/* 3 × fans (face toward +X = glass side) */}
      <Fan position={[GT * 0.38, 0, -GL * 0.32]} rotation={[0, -Math.PI / 2, 0]} r={0.096} speed={20} rgbOff={0.50} />
      <Fan position={[GT * 0.38, 0,  0          ]} rotation={[0, -Math.PI / 2, 0]} r={0.096} speed={20} rgbOff={0.60} />
      <Fan position={[GT * 0.38, 0,  GL * 0.32  ]} rotation={[0, -Math.PI / 2, 0]} r={0.096} speed={20} rgbOff={0.70} />

      {/* IO bracket */}
      <mesh position={[0, 0, GL * 0.476]}>
        <boxGeometry args={[GT * 0.62, GH, 0.024]} />
        <meshStandardMaterial color="#1a1a20" metalness={0.88} roughness={0.18} />
      </mesh>

      {/* Bracket ventilation slots */}
      {[-0.14, -0.06, 0.02, 0.10].map((oy, i) => (
        <mesh key={i} position={[0, oy, GL * 0.49]}>
          <boxGeometry args={[GT * 0.42, 0.026, 0.012]} />
          <meshStandardMaterial color="#080808" />
        </mesh>
      ))}

      <pointLight ref={lightRef} position={[0, 0, 0]} intensity={1.8} distance={1.4} decay={2} />
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════════
   AIO WATER COOLER
   Pump block on CPU  ▸  240 mm radiator at top  ▸  2 fans  ▸  tubes
══════════════════════════════════════════════════════════════════ */
// Static positions (derived from CW/CH constants — safe at module level)
const PUMP_P = [-CW / 2 + 0.082, 0.44, 0.12]
const RAD_P  = [0, CH / 2 - 0.068, 0]

function AIOCooler() {
  const pumpMat  = useRGB(0.17, 0.22)
  const lightRef = useRef()
  useFrame(({ clock }) => {
    if (lightRef.current)
      lightRef.current.color.setHSL((clock.getElapsedTime() * 0.17 + 0.22) % 1, 1, 0.6)
  })

  // Tube control points (static — captured once)
  const tube1 = useMemo(
    () => [
      [PUMP_P[0] + 0.01, PUMP_P[1] + 0.09, PUMP_P[2] - 0.06],
      [PUMP_P[0] - 0.05, PUMP_P[1] + 0.28, PUMP_P[2] - 0.16],
      [PUMP_P[0] - 0.10, PUMP_P[1] + 0.52, PUMP_P[2] - 0.25],
      [RAD_P[0]  - 0.31, RAD_P[1]  - 0.06, RAD_P[2]  - 0.36],
      [RAD_P[0]  - 0.31, RAD_P[1]  + 0.02, RAD_P[2]  - 0.36],
    ],
    [],
  )

  const tube2 = useMemo(
    () => [
      [PUMP_P[0] + 0.01, PUMP_P[1] + 0.09, PUMP_P[2] + 0.06],
      [PUMP_P[0] - 0.04, PUMP_P[1] + 0.28, PUMP_P[2] + 0.17],
      [PUMP_P[0] - 0.09, PUMP_P[1] + 0.52, PUMP_P[2] + 0.26],
      [RAD_P[0]  + 0.31, RAD_P[1]  - 0.06, RAD_P[2]  + 0.36],
      [RAD_P[0]  + 0.31, RAD_P[1]  + 0.02, RAD_P[2]  + 0.36],
    ],
    [],
  )

  return (
    <group>
      {/* ── Pump block (sits on CPU) ── */}
      <group position={PUMP_P}>
        {/* Octagonal housing */}
        <mesh>
          <cylinderGeometry args={[0.090, 0.090, 0.038, 8]} />
          <meshStandardMaterial color="#191926" metalness={0.90} roughness={0.12} />
        </mesh>

        {/* Illuminated logo disc */}
        <mesh position={[0, 0.021, 0]}>
          <cylinderGeometry args={[0.072, 0.072, 0.006, 8]} />
          <meshStandardMaterial
            ref={pumpMat}
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={5}
            transparent
            opacity={0.88}
          />
        </mesh>

        {/* Mounting arms × 4 */}
        {[[0.10, 0], [-0.10, 0], [0, 0.10], [0, -0.10]].map(([ox, oz], i) => (
          <mesh key={i} position={[ox * 1.08, 0, oz * 1.08]}>
            <boxGeometry
              args={[Math.abs(ox) > 0 ? 0.068 : 0.013, 0.009, Math.abs(oz) > 0 ? 0.068 : 0.013]}
            />
            <meshStandardMaterial color="#222222" metalness={0.90} roughness={0.12} />
          </mesh>
        ))}

        <pointLight ref={lightRef} intensity={0.70} distance={0.55} decay={2} />
      </group>

      {/* ── 240 mm Radiator (horizontal at top, fans blow upward) ── */}
      <group position={RAD_P}>
        {/* Aluminium fin core */}
        <mesh>
          <boxGeometry args={[0.80, 0.035, 0.88]} />
          <meshStandardMaterial color="#1c1c1c" metalness={0.80} roughness={0.28} />
        </mesh>

        {/* Individual fins */}
        {Array.from({ length: 22 }, (_, i) => (
          <mesh key={i} position={[0, 0, -0.44 + i * 0.042]}>
            <boxGeometry args={[0.80, 0.038, 0.007]} />
            <meshStandardMaterial color="#252525" metalness={0.78} roughness={0.30} />
          </mesh>
        ))}

        {/* Header tanks */}
        <mesh position={[ 0.43, 0, 0]}>
          <boxGeometry args={[0.030, 0.060, 0.88]} />
          <meshStandardMaterial color="#101010" metalness={0.92} roughness={0.12} />
        </mesh>
        <mesh position={[-0.43, 0, 0]}>
          <boxGeometry args={[0.030, 0.060, 0.88]} />
          <meshStandardMaterial color="#101010" metalness={0.92} roughness={0.12} />
        </mesh>

        {/* 2 × 120 mm fans (rotation: face up = -PI/2 on X) */}
        <Fan position={[0, 0.060,  0.220]} rotation={[-Math.PI / 2, 0, 0]} r={0.168} speed={13} rgbOff={0.18} />
        <Fan position={[0, 0.060, -0.220]} rotation={[-Math.PI / 2, 0, 0]} r={0.168} speed={13} rgbOff={0.26} />
      </group>

      {/* ── Coolant tubes ── */}
      <WaterTube points={tube1} r={0.016} />
      <WaterTube points={tube2} r={0.016} />
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════════
   CASE BODY  —  steel panels, glass panel, IO, RGB strips, PSU shroud
══════════════════════════════════════════════════════════════════ */
function CaseBody() {
  const strip1  = useRGB(0.17, 0.00)
  const strip2  = useRGB(0.17, 0.50)
  const frontRGB = useRGB(0.17, 0.15)
  const pwrRGB   = useRGB(0.17, 0.35)

  return (
    <group>
      {/* ─ Steel panels ─ */}
      {/* Back */}
      <mesh position={[0, 0, -CD / 2]}>
        <boxGeometry args={[CW, CH, 0.022]} />
        <meshStandardMaterial color="#0d0d0d" metalness={0.90} roughness={0.22} />
      </mesh>
      {/* Left */}
      <mesh position={[-CW / 2, 0, 0]}>
        <boxGeometry args={[0.022, CH, CD]} />
        <meshStandardMaterial color="#0d0d0d" metalness={0.90} roughness={0.22} />
      </mesh>
      {/* Top */}
      <mesh position={[0, CH / 2, 0]}>
        <boxGeometry args={[CW, 0.022, CD]} />
        <meshStandardMaterial color="#0d0d0d" metalness={0.90} roughness={0.22} />
      </mesh>
      {/* Bottom */}
      <mesh position={[0, -CH / 2, 0]}>
        <boxGeometry args={[CW, 0.022, CD]} />
        <meshStandardMaterial color="#0d0d0d" metalness={0.90} roughness={0.22} />
      </mesh>
      {/* Front */}
      <mesh position={[0, 0, CD / 2]}>
        <boxGeometry args={[CW, CH, 0.022]} />
        <meshStandardMaterial color="#0b0b0b" metalness={0.86} roughness={0.26} />
      </mesh>

      {/* Front mesh grille insert */}
      <mesh position={[0, 0.05, CD / 2 + 0.013]}>
        <boxGeometry args={[CW * 0.84, CH * 0.78, 0.009]} />
        <meshStandardMaterial
          color="#060606"
          metalness={0.30}
          roughness={0.85}
          transparent
          opacity={0.90}
        />
      </mesh>

      {/* Front RGB vertical strip */}
      <mesh position={[CW * 0.38, 0.05, CD / 2 + 0.023]}>
        <boxGeometry args={[0.012, CH * 0.78, 0.004]} />
        <meshStandardMaterial
          ref={frontRGB}
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={4}
        />
      </mesh>

      {/* ─ Tempered glass panel (right side) ─ */}
      <mesh position={[CW / 2 + 0.007, 0, 0]}>
        <boxGeometry args={[0.006, CH - 0.055, CD - 0.055]} />
        <meshPhysicalMaterial
          color="#98c0e0"
          metalness={0}
          roughness={0}
          transparent
          opacity={0.12}
          envMapIntensity={3.0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Glass frame — 4 aluminium edges */}
      {[
        [CW / 2 + 0.007,  (CH - 0.055) / 2 + 0.011, 0,                        CW * 0.018, 0.022,       CD - 0.048],
        [CW / 2 + 0.007, -(CH - 0.055) / 2 - 0.011, 0,                        CW * 0.018, 0.022,       CD - 0.048],
        [CW / 2 + 0.007,  0,                         (CD - 0.055) / 2 + 0.011, CW * 0.018, CH - 0.048, 0.022     ],
        [CW / 2 + 0.007,  0,                        -(CD - 0.055) / 2 - 0.011, CW * 0.018, CH - 0.048, 0.022     ],
      ].map(([x, y, z, w, h, d], i) => (
        <mesh key={i} position={[x, y, z]}>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color="#1e1e28" metalness={0.94} roughness={0.10} />
        </mesh>
      ))}

      {/* ─ Top IO panel ─ */}
      <mesh position={[0, CH / 2 + 0.014, CD / 2 - 0.13]}>
        <boxGeometry args={[CW * 0.70, 0.018, 0.22]} />
        <meshStandardMaterial color="#141414" metalness={0.84} roughness={0.28} />
      </mesh>

      {/* Power button */}
      <mesh position={[-CW * 0.22, CH / 2 + 0.020, CD / 2 - 0.052]}>
        <cylinderGeometry args={[0.028, 0.028, 0.022, 20]} />
        <meshStandardMaterial color="#181818" metalness={0.88} roughness={0.14} />
      </mesh>
      <mesh position={[-CW * 0.22, CH / 2 + 0.022, CD / 2 - 0.052]}>
        <torusGeometry args={[0.024, 0.0052, 8, 24]} />
        <meshStandardMaterial
          ref={pwrRGB}
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={5}
        />
      </mesh>

      {/* USB-A × 2 */}
      {[0.05, 0.12].map((oz, i) => (
        <mesh key={i} position={[0, CH / 2 + 0.018, CD / 2 - oz]}>
          <boxGeometry args={[0.032, 0.013, 0.020]} />
          <meshStandardMaterial color="#090909" />
        </mesh>
      ))}

      {/* USB-C */}
      <mesh position={[0.075, CH / 2 + 0.018, CD / 2 - 0.088]}>
        <boxGeometry args={[0.022, 0.010, 0.016]} />
        <meshStandardMaterial color="#090909" />
      </mesh>

      {/* ─ Interior RGB strips ─ */}
      <mesh position={[0, -CH / 2 + 0.038, 0]}>
        <boxGeometry args={[CW - 0.12, 0.008, CD - 0.12]} />
        <meshStandardMaterial
          ref={strip1}
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={4.5}
          transparent
          opacity={0.88}
        />
      </mesh>
      <mesh position={[0, CH / 2 - 0.038, 0]}>
        <boxGeometry args={[CW - 0.12, 0.007, CD - 0.20]} />
        <meshStandardMaterial
          ref={strip2}
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={3}
          transparent
          opacity={0.75}
        />
      </mesh>

      {/* ─ PSU shroud ─ */}
      <mesh position={[0, -CH / 2 + 0.115, 0]}>
        <boxGeometry args={[CW - 0.10, 0.195, CD * 0.56]} />
        <meshStandardMaterial color="#0c0c0c" metalness={0.84} roughness={0.28} />
      </mesh>

      {/* PSU body (rear) */}
      <mesh position={[0, -CH / 2 + 0.105, -CD / 2 + 0.175]}>
        <boxGeometry args={[CW * 0.84, 0.168, 0.170]} />
        <meshStandardMaterial color="#0e0e0e" metalness={0.78} roughness={0.35} />
      </mesh>

      {/* PSU fan grille */}
      <mesh position={[0, -CH / 2 + 0.110, -CD / 2 + 0.270]}>
        <boxGeometry args={[CW * 0.60, 0.005, 0.140]} />
        <meshStandardMaterial color="#080808" metalness={0.3} roughness={0.85} />
      </mesh>

      {/* ─ Rubber feet ─ */}
      {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([sx, sz], i) => (
        <mesh key={i} position={[sx * CW * 0.36, -CH / 2 - 0.030, sz * CD * 0.36]}>
          <cylinderGeometry args={[0.034, 0.040, 0.054, 8]} />
          <meshStandardMaterial color="#111111" roughness={0.95} metalness={0.05} />
        </mesh>
      ))}
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════════
   SCENE  —  lights, environment, all assembled components
══════════════════════════════════════════════════════════════════ */
function Scene() {
  return (
    <>
      {/* ─ Key + fill + rim + ambient ─ */}
      <ambientLight intensity={0.50} color="#ffffff" />
      <directionalLight
        position={[5, 8, 7]}
        intensity={2.4}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-4, 3, -5]} intensity={0.65} color="#7080ff" />
      <directionalLight position={[2, -2, 3]}  intensity={0.42} color="#ffffff" />
      <pointLight position={[3, 4, 4]} intensity={1.6} color="#ffffff" />
      <pointLight position={[0, 3, 2]} intensity={1.0} color="#d0e8ff" />

      {/* ─ HDR environment — gives realistic reflections on glass & metal ─ */}
      <Environment preset="warehouse" />

      {/* ─ Interior RGB glow lights ─ */}
      <RGBLight position={[ 0.05,  0.00,  0.10]} intensity={3.5} distance={1.90} offset={0.00} />
      <RGBLight position={[ 0.05, -0.40,  0.20]} intensity={2.0} distance={1.20} offset={0.33} />
      <RGBLight position={[ 0.05,  0.60,  0.10]} intensity={1.8} distance={1.10} offset={0.66} />

      {/* ─ PC assembly — slight yaw so glass panel reads clearly ─ */}
      <group rotation={[0, -0.22, 0]}>
        <CaseBody />

        {/* Motherboard (face toward +X = glass) */}
        <Motherboard position={[-CW / 2 + 0.010, -0.04, 0]} />

        {/* 4 × RAM sticks */}
        {[0.28, 0.21, 0.14, 0.07].map((oz, i) => (
          <RamStick
            key={i}
            position={[-CW / 2 + 0.085, 0.44, oz]}
            rgbOff={i * 0.08}
          />
        ))}

        {/* AIO water cooler */}
        <AIOCooler />

        {/* GPU — PCIe slot area, lower half of case */}
        <GPU position={[-0.02, -0.34, 0.02]} />

        {/* Front intake fans × 3 (inside, just behind front grille) */}
        <Fan position={[0,  0.40, CD / 2 - 0.028]} r={0.192} speed={ 9} rgbOff={0.00} />
        <Fan position={[0,  0.00, CD / 2 - 0.028]} r={0.192} speed={10} rgbOff={0.08} />
        <Fan position={[0, -0.40, CD / 2 - 0.028]} r={0.192} speed={ 8} rgbOff={0.16} />

        {/* Rear exhaust fan */}
        <Fan position={[0.05, CH / 2 - 0.18, -CD / 2 + 0.022]} r={0.165} speed={12} rgbOff={0.40} />
      </group>

      {/* ─ Ground contact shadow ─ */}
      <ContactShadows
        position={[0, -CH / 2 - 0.035, 0]}
        scale={5}
        blur={2.8}
        far={0.6}
        opacity={0.55}
      />

      {/* ─ Camera controls ─ */}
      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={2.5}
        maxDistance={6.5}
        autoRotate
        autoRotateSpeed={0.9}
        minPolarAngle={Math.PI / 5.5}
        maxPolarAngle={Math.PI / 1.85}
        dampingFactor={0.08}
        enableDamping
        target={[0, 0, 0]}
      />
    </>
  )
}

/* ══════════════════════════════════════════════════════════════════
   EXPORT
══════════════════════════════════════════════════════════════════ */
export default function BuildPcModel({ buildName = 'Custom Build', isDreamBuild = false }) {
  const accent = isDreamBuild ? '#f59e0b' : '#ff3b1f'

  return (
    <div
      className="relative w-full select-none"
      style={{ height: 'clamp(520px, 50vw, 520px)' }}
    >
      <Canvas
        camera={{ position: [2.6, 0.95, 3.5], fov: 36 }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
        shadows
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>

      {/* Build label + interaction hint */}
      <div
      
        style={{
          position: 'absolute',
          bottom: '3rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.4rem',
          pointerEvents: 'none',
          marginTop:20
        }}
      >
        <span
          style={{
            background: `${accent}18`,
            border: `1px solid ${accent}45`,
            color: accent,
            fontFamily: 'monospace',
            fontSize: '0.60rem',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            padding: '3px 14px',
            borderRadius: '9999px',
            marginTop:23
          }}
        >
          {buildName}
        </span>
        <span
          style={{
            marginTop:20,
            color: 'rgba(255,255,255,0.20)',
            fontSize: '0.75rem',
            fontFamily: 'monospace',
            letterSpacing: '0.08em',
          }}
        >
          drag · scroll to zoom
        </span>
      </div>
    </div>
  )
}