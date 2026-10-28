// src/components/three/TarotTableScene.tsx
"use client";

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, PerspectiveCamera, ContactShadows, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '@/store/useGameStore';
import { SPREAD_BOARD_SLOTS } from '@/lib/games/tarot-engine';
import type { TarotCard, SpreadSlotSpec } from '@/lib/games/tarot-engine';

const SUIT_COLORS: Record<string, string> = {
  SWORDS: '#00F5D4',
  PENTACLES: '#F59E0B',
  CUPS: '#EC4899',
  WANDS: '#8B5CF6',
};

const SHADER_EMISSIVE: Record<string, string> = {
  NONE: '#000000',
  CHROME: '#E2E8F0',
  HOLO: '#EC4899',
  GLITCH: '#00F5D4',
  OVERCLOCK: '#F59E0B',
};

function PrefabConcreteWall() {
  const blocks = [];
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 7; c++) {
      const offset = r % 2 === 0 ? 0 : 0.9;
      blocks.push(
        <mesh
          key={`${r}-${c}`}
          position={[(c - 3.5) * 1.85 + offset, r * 1.15 - 1, -5.2]}
          receiveShadow
        >
          <boxGeometry args={[1.78, 1.08, 0.4]} />
          <meshStandardMaterial color="#16181D" roughness={0.92} metalness={0.08} />
        </mesh>
      );
    }
  }
  return <group>{blocks}</group>;
}

function CyberTarotReader() {
  const headRef = useRef<THREE.Group>(null);
  const { currentSpread, isResolving } = useGameStore();

  useFrame((state) => {
    if (!headRef.current) return;
    const t = state.clock.getElapsedTime();
    headRef.current.position.y = 1.25 + Math.sin(t * 1.8) * 0.04;
    headRef.current.rotation.y = Math.sin(t * 0.7) * 0.1;
  });

  const eyeColor = currentSpread === 'FUTURE' || isResolving ? '#FF2A54' : '#00F5D4';

  return (
    <group ref={headRef} position={[0, 1.25, -2.5]}>
      <mesh position={[0, -0.75, 0]}>
        <cylinderGeometry args={[0.45, 0.7, 1.1, 8]} />
        <meshStandardMaterial color="#121318" metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.48, 24, 24]} />
        <meshStandardMaterial color="#1F222A" metalness={0.6} roughness={0.35} />
      </mesh>
      {/* Visor Redondo */}
      <mesh position={[0, 0.02, 0.42]}>
        <sphereGeometry args={[0.19, 32, 32]} />
        <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={1.9} />
      </mesh>
      {/* Pálpebra Superior Mecânica Cansada */}
      <mesh position={[0, 0.09, 0.44]} rotation={[0.32, 0, 0]}>
        <sphereGeometry args={[0.205, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.48]} />
        <meshStandardMaterial color="#0A0B0E" metalness={0.8} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// Slot Físico da Tiragem no Centro do Tabuleiro 3D
function SpreadBoardSlot3D({
  spec,
  card,
  isTriggering,
  onClickSlot,
}: {
  spec: SpreadSlotSpec;
  card: TarotCard | null;
  isTriggering: boolean;
  onClickSlot: () => void;
}) {
  const cardGroupRef = useRef<THREE.Group>(null);
  const effectiveReversed = card ? (spec.slotIndex === 1 ? !card.isReversed : card.isReversed) : false;

  useFrame((state, delta) => {
    if (!cardGroupRef.current || !card) return;
    const targetY = isTriggering ? 0.45 : 0.06;
    const targetScale = isTriggering ? 1.25 : 1;
    const targetRotZ = effectiveReversed ? Math.PI : 0;

    cardGroupRef.current.position.y = THREE.MathUtils.lerp(cardGroupRef.current.position.y, targetY, delta * 12);
    cardGroupRef.current.rotation.z = THREE.MathUtils.lerp(cardGroupRef.current.rotation.z, targetRotZ, delta * 10);
    cardGroupRef.current.scale.setScalar(THREE.MathUtils.lerp(cardGroupRef.current.scale.x, targetScale, delta * 12));

    if (card.shader === 'GLITCH') {
      cardGroupRef.current.position.x = Math.sin(state.clock.elapsedTime * 35) * 0.015;
    }
  });

  const suitColor = card ? SUIT_COLORS[card.suit] : '#475569';
  const shaderGlow = card && card.shader !== 'NONE' ? SHADER_EMISSIVE[card.shader] : suitColor;

  return (
    <group position={spec.position3D} onClick={(e) => { e.stopPropagation(); onClickSlot(); }}>
      {/* Moldura Holográfica da Casa da Tiragem na Mesa */}
      <mesh rotation={[-Math.PI / 2, 0, spec.rotationZ]}>
        <planeGeometry args={[0.88, 1.24]} />
        <meshBasicMaterial
          color={card ? '#00F5D4' : '#8B5CF6'}
          wireframe
          transparent
          opacity={card ? 0.85 : 0.4}
        />
      </mesh>

      {/* Nome da Casa gravado na Mesa */}
      <Text
        position={[0, 0.01, 0.72]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.075}
        color={card ? '#00F5D4' : '#94A3B8'}
        anchorX="center"
        anchorY="middle"
      >
        {spec.shortTag}
      </Text>

      {/* Se houver uma carta posicionada nesta Casa da Tiragem */}
      {card && (
        <group ref={cardGroupRef} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.78, 1.14, 0.03]} />
            <meshStandardMaterial
              color={card.shader === 'CHROME' ? '#E2E8F0' : '#11131A'}
              metalness={card.shader === 'CHROME' ? 0.95 : 0.6}
              roughness={card.shader === 'CHROME' ? 0.1 : 0.3}
              emissive={isTriggering ? '#00F5D4' : shaderGlow}
              emissiveIntensity={isTriggering ? 1.1 : card.shader !== 'NONE' ? 0.45 : 0.15}
            />
          </mesh>

          <Text position={[0, 0.26, 0.02]} fontSize={0.16} color="#FFFFFF" anchorX="center" anchorY="middle">
            {card.rank}
          </Text>

          <Text
            position={[0, -0.12, 0.02]}
            fontSize={0.065}
            maxWidth={0.68}
            textAlign="center"
            color={effectiveReversed ? '#FF2A54' : '#00F5D4'}
            anchorX="center"
            anchorY="middle"
          >
            {`${card.name}\n${effectiveReversed ? '[INVERTIDA]' : '[NORMAL]'}`}
          </Text>

          {card.shader !== 'NONE' && (
            <Text position={[0, -0.44, 0.02]} fontSize={0.055} color="#F59E0B" anchorX="center" anchorY="middle">
              {`★ ${card.shader}`}
            </Text>
          )}
        </group>
      )}
    </group>
  );
}

export default function TarotTableScene() {
  const { boardSlots, activeStepSlot, removeCardFromSlot } = useGameStore();
  const centerPos = SPREAD_BOARD_SLOTS[0].position3D;

  return (
    <div className="w-full h-full relative bg-[#07080B]">
      <Canvas shadows="percentage">
        <PerspectiveCamera makeDefault position={[0, 3.1, 6.3]} fov={45} rotation={[-0.45, 0, 0]} />

        <ambientLight intensity={0.45} />
        <pointLight position={[-3, 3, -1]} intensity={20} color="#8B5CF6" />
        <pointLight position={[3, 2.5, 1]} intensity={16} color="#00F5D4" />
        <spotLight position={[0, 5, 0.5]} angle={0.6} penumbra={0.8} intensity={40} color="#F8FAFC" castShadow />

        <PrefabConcreteWall />
        <CyberTarotReader />

        {/* Mesa Metálica */}
        <mesh position={[0, -0.2, 0]} receiveShadow>
          <boxGeometry args={[7.8, 0.3, 5.2]} />
          <meshStandardMaterial color="#0C0D12" metalness={0.82} roughness={0.22} />
        </mesh>

        {/* Linhas de Sinergia Adjacente ligando o Nexo Central (Casa 0) às Casas Vizinhas */}
        {SPREAD_BOARD_SLOTS.slice(1).map((slot) => {
          const bothOccupied = Boolean(boardSlots[0] && boardSlots[slot.slotIndex]);
          return (
            <Line
              key={`line-${slot.slotIndex}`}
              points={[centerPos, slot.position3D]}
              color={bothOccupied ? '#00F5D4' : '#334155'}
              lineWidth={bothOccupied ? 2.5 : 1}
              dashed={!bothOccupied}
            />
          );
        })}

        {/* As 5 Casas da Tiragem no Centro da Mesa */}
        <group>
          {SPREAD_BOARD_SLOTS.map((spec) => (
            <SpreadBoardSlot3D
              key={spec.slotIndex}
              spec={spec}
              card={boardSlots[spec.slotIndex]}
              isTriggering={activeStepSlot === spec.slotIndex}
              onClickSlot={() => removeCardFromSlot(spec.slotIndex)}
            />
          ))}
        </group>

        <ContactShadows position={[0, -0.04, 0]} opacity={0.65} scale={10} blur={2} far={4} />
      </Canvas>
    </div>
  );
}