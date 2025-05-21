import { useState } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group, GroupItem } from "@/lib/types/group";
import { getFibonacciLayers } from "./starry-utils";
import { HtmlIcon } from "./HtmlIcon";

interface GalaxyProps {
  group: Group;
  items: GroupItem[];
  position: [number, number, number];
}

export function Galaxy({ group, items, position }: GalaxyProps) {
  const layers = getFibonacciLayers(items);
  const mainItem = items[0];
  const planets = layers;
  const [angles, setAngles] = useState<number[][]>(() =>
    planets.map((layer) =>
      layer.map((_, i) => (2 * Math.PI * i) / layer.length)
    )
  );

  useFrame((state, delta) => {
    setAngles((prev) =>
      prev.map((layerAngles, layerIdx) =>
        layerAngles.map((angle) => {
          const speed = 0.25 + layerIdx * 0.12;
          const direction = group.id % 2 === 0 ? -1 : 1;
          return angle + direction * speed * delta * 0.25;
        })
      )
    );
  });

  return (
    <group position={position}>
      {mainItem && <HtmlIcon item={mainItem} size={42} position={[0, 0, 0]} />}
      {planets.map((layer, layerIdx) => {
        const radius = 2.5 + layerIdx * 2.2;
        return layer.map((item, i) => {
          const angle =
            angles[layerIdx]?.[i] ?? (2 * Math.PI * i) / layer.length;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          return (
            <HtmlIcon
              key={item.id}
              item={item}
              size={36}
              position={[x, 0, z]}
            />
          );
        });
      })}
      {planets.map((layer, layerIdx) => {
        const radius = 2.5 + layerIdx * 2.2;
        return (
          <mesh
            key={layerIdx}
            position={[0, 0, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <torusGeometry args={[radius, 0.01, 16, 100]} />
            <meshBasicMaterial color="#888" transparent opacity={0.18} />
          </mesh>
        );
      })}
    </group>
  );
}
