import * as THREE from "three";
import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Particles } from "@/components/magicui/particles";
import { Galaxy } from "@/components/modes/starry/Galaxy";
import { useGroupStore } from "@/lib/store/group";
import { useSettingsStore } from "@/lib/store/settings";
import { allGroupItems } from "@/api/group_item";
import type { Group, GroupItem } from "@/lib/types/group";

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
