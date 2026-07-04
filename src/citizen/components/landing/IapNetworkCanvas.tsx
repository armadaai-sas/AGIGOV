import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

type Props = {
  pulsePhase: number;
  active?: boolean;
};

type Network = {
  nodes: THREE.Vector3[];
  pairs: number[];
};

const NODE_COUNT = 72;
const CONNECT_DIST = 0.24;

function buildNetwork(): Network {
  const nodes: THREE.Vector3[] = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const theta = Math.random() * Math.PI * 2;
    const r = 0.12 + Math.random() * 0.88;
    nodes.push(
      new THREE.Vector3(
        Math.cos(theta) * r * 1.35,
        (Math.random() - 0.5) * 1.15,
        Math.sin(theta) * r * 0.25,
      ),
    );
  }

  const pairs: number[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (nodes[i]!.distanceTo(nodes[j]!) < CONNECT_DIST) {
        pairs.push(i, j);
      }
    }
  }

  return { nodes, pairs };
}

function IapNetworkScene({ pulsePhase }: { pulsePhase: number }) {
  const { nodes, pairs } = useMemo(() => buildNetwork(), []);
  const linesRef = useRef<THREE.LineSegments>(null);
  const pulseRef = useRef(pulsePhase);
  pulseRef.current = pulsePhase;

  const pointGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setFromPoints(nodes);
    return geo;
  }, [nodes]);

  const lineGeo = useMemo(() => {
    const segments: THREE.Vector3[] = [];
    for (let k = 0; k < pairs.length; k += 2) {
      segments.push(nodes[pairs[k]!]!, nodes[pairs[k + 1]!]!);
    }
    return new THREE.BufferGeometry().setFromPoints(segments);
  }, [nodes, pairs]);

  useFrame(({ clock }) => {
    const mat = linesRef.current?.material;
    if (!(mat instanceof THREE.LineBasicMaterial)) return;
    const wave = clock.getElapsedTime() * 0.28 + pulseRef.current * Math.PI * 2;
    const pulse = 0.22 + 0.12 * Math.sin(wave);
    mat.opacity = pulse;
  });

  return (
    <>
      <ambientLight intensity={0.85} />
      <points geometry={pointGeo}>
        <pointsMaterial
          color="#94a3b8"
          size={0.022}
          sizeAttenuation
          transparent
          opacity={0.5}
          depthWrite={false}
        />
      </points>
      <lineSegments ref={linesRef} geometry={lineGeo}>
        <lineBasicMaterial color="#38bdf8" transparent opacity={0.28} depthWrite={false} />
      </lineSegments>
    </>
  );
}

function shouldDegrade() {
  if (typeof window === 'undefined') return true;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  return (navigator.hardwareConcurrency ?? 4) < 4;
}

/** Canvas WebGL — red IAP global con pulso cian sobre fondo claro. */
export function IapNetworkCanvas({ pulsePhase, active = true }: Props) {
  if (!active || shouldDegrade()) {
    return null;
  }

  return (
    <Canvas
      className="landing-iap-canvas"
      camera={{ position: [0, 0, 2.4], fov: 48 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
      }}
    >
      <IapNetworkScene pulsePhase={pulsePhase} />
    </Canvas>
  );
}

export { shouldDegrade as iapCanvasShouldDegrade };
