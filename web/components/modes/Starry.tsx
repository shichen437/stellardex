import { useEffect, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { Particles } from "@/components/magicui/particles";
import { GroupItemIcon } from "@/components/modes/starry/GroupItemIcon";
import { useGroupStore } from "@/lib/store/group";
import { useSettingsStore } from "@/lib/store/settings";
import { allGroupItems } from "@/api/group_item";
import type { Group, GroupItem } from "@/lib/types/group";

function fibonacci(n: number): number[] {
  const fib = [3, 5];
  while (fib.length < n) {
    fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
  }
  return fib.slice(0, n);
}

function getFibonacciLayers(items: GroupItem[]): GroupItem[][] {
  if (items.length <= 1) return [items];
  const fib = fibonacci(10);
  const layers: GroupItem[][] = [];
  let idx = 1;
  let remain = items.length - 1;
  while (remain > 0) {
    const count = Math.min(fib[layers.length], remain);
    layers.push(items.slice(idx, idx + count));
    idx += count;
    remain -= count;
  }
  return layers;
}

function Galaxy({
  group,
  items,
  position,
}: {
  group: Group;
  items: GroupItem[];
  position: [number, number, number];
}) {
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

function HtmlIcon({
  item,
  size,
  position,
}: {
  item: GroupItem;
  size: number;
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      <Html center style={{ pointerEvents: "auto" }}>
        <div style={{ width: size, height: size }}>
          <GroupItemIcon item={item} size={size} />
        </div>
      </Html>
    </group>
  );
}

export function StarryModeView() {
  const settings = useSettingsStore((state) => state.settings);
  const isDarkMode =
    settings.interfaceConfig?.themeMode === "dark" ||
    (settings.interfaceConfig?.themeMode === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  const particleColor = isDarkMode ? "#ffffff" : "#000011";
  const groupList = useGroupStore((state) => state.groups);
  const fetchGroups = useGroupStore((state) => state.fetchGroups);
  const [groupItemsMap, setGroupItemsMap] = useState<
    Record<number, GroupItem[]>
  >({});
  useEffect(() => {
    fetchGroups().then(async (groups: Group[]) => {
      const itemsMap: Record<number, GroupItem[]> = {};
      await Promise.all(
        groups
          .filter((g) => g.isShow)
          .map(async (group) => {
            const res = await allGroupItems(group.id);
            itemsMap[group.id] = res.data?.rows || [];
          })
      );
      setGroupItemsMap(itemsMap);
    });
  }, [fetchGroups]);
  // 计算每个星系的位置，简单环形排布
  const visibleGroups = groupList.filter((g) => g.isShow);
  const galaxyDistance = 12;
  const galaxyPositions = visibleGroups.map((g, i) => {
    const angle = (2 * Math.PI * i) / visibleGroups.length;
    return [
      Math.cos(angle) * galaxyDistance,
      0,
      Math.sin(angle) * galaxyDistance,
    ] as [number, number, number];
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orbitControls, setOrbitControls] = useState<any>(null);

  useEffect(() => {
    if (!orbitControls) return;

    orbitControls.touches = {
      ONE: THREE.TOUCH.PAN,
      TWO: THREE.TOUCH.DOLLY_ROTATE,
    };

    orbitControls.panSpeed = 1.0;
    orbitControls.rotateSpeed = 0.8;
    orbitControls.zoomSpeed = 1.2;

    // 设置缩放限制
    orbitControls.minDistance = 4;
    orbitControls.maxDistance = galaxyDistance * 2.5;

    orbitControls.minPolarAngle = 0;
    orbitControls.maxPolarAngle = Math.PI / 2;
  }, [orbitControls, galaxyDistance]);

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      <Particles
        className="absolute inset-0 z-50"
        quantity={120}
        staticity={95}
        color={particleColor}
        size={0.5}
        style={{ pointerEvents: "none" }}
      />
      <div className="relative z-10 w-full h-screen">
        <Canvas
          camera={{ position: [0, 15, 30], fov: 60 }}
          style={{ width: "100vw", height: "100vh" }}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 20, 10]} intensity={0.5} />
          {visibleGroups.map((group, idx) => {
            const items = groupItemsMap[group.id] || [];
            if (items.length === 0) return null;
            return (
              <Galaxy
                key={group.id}
                group={group}
                items={items}
                position={galaxyPositions[idx]}
              />
            );
          })}
          <OrbitControls
            enablePan
            enableZoom
            enableRotate
            ref={setOrbitControls}
          />
        </Canvas>
      </div>
    </div>
  );
}
