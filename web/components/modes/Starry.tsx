import { Particles } from "@/components/magicui/particles";
import { SettingsPanel } from "@/components/settings/SettingsPanel";
import { useState, useEffect } from "react";
import { useSettingsStore } from "@/lib/store/settings";
import { useGroupStore } from "@/lib/store/group";
import { allGroupItems } from "@/api/group_item";
import type { SettingsState } from "@/lib/types/settings";
import type { Group, GroupItem } from "@/lib/types/group";
import { CenterGroup } from "./starry/CenterGroup";
import { SideGroup } from "./starry/SideGroup";
import { calculatePosition } from "./starry/starry-utils";

function fibonacci(n: number): number[] {
  const fib = [2, 3];
  while (fib.length < n) {
    fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
  }
  return fib.slice(0, n);
}

export function StarryModeView() {
  const settings = useSettingsStore((state) => state.settings);
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const [showSettings, setShowSettings] = useState(false);

  const isDarkMode =
    settings.interfaceConfig?.themeMode === "dark" ||
    (settings.interfaceConfig?.themeMode === "system" &&
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

  const handleSettingsChange = (newSettings: SettingsState) => {
    updateSettings(newSettings);
  };

  function getFibonacciLayers(items: GroupItem[]): GroupItem[][] {
    if (items.length <= 1) return [items];
    const fib = fibonacci(10); // 最多10层
    const layers: GroupItem[][] = [];
    let idx = 0;
    let remain = items.length;
    while (remain > 0) {
      const count = Math.min(fib[layers.length], remain);
      layers.push(items.slice(idx, idx + count));
      idx += count;
      remain -= count;
    }
    return layers;
  }

  const getMaxGroup = (groups: Group[]): Group | null => {
    let maxGroup: Group | null = null;
    let maxCount = 0;
    groups.forEach((group) => {
      const items = groupItemsMap[group.id] || [];
      if (items.length > maxCount) {
        maxCount = items.length;
        maxGroup = group;
      }
    });
    return maxGroup;
  };

  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null);

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

      <div
        className="relative z-10 flex flex-col items-center justify-center min-h-screen"
        style={{ transform: "translateY(-40vh)" }}
      >
        {(() => {
          const visibleGroups = groupList.filter((g) => g.isShow);
          const maxGroup = getMaxGroup(visibleGroups);
          if (!maxGroup || visibleGroups.length === 0) return null;

          const sideGroups = visibleGroups.filter((g) => g.id !== maxGroup.id);
          const containerSize = window.innerWidth; // 缩小容器尺寸
          const radius = containerSize * 0.35;

          return (
            <div
              className="relative"
              style={{ width: containerSize, height: containerSize }}
            >
              <CenterGroup
                maxGroup={maxGroup}
                groupItemsMap={groupItemsMap}
                containerSize={containerSize}
                hoveredLayer={hoveredLayer}
                setHoveredLayer={setHoveredLayer}
                getFibonacciLayers={getFibonacciLayers}
              />

              {sideGroups.map((group, index) => {
                const items = groupItemsMap[group.id] || [];
                if (items.length === 0) return null;
                const pos = calculatePosition(
                  index,
                  sideGroups.length - 1,
                  radius
                );

                return (
                  <SideGroup
                    key={group.id}
                    group={group}
                    items={items}
                    position={pos}
                    containerSize={containerSize}
                    hoveredLayer={hoveredLayer}
                    setHoveredLayer={setHoveredLayer}
                    getFibonacciLayers={getFibonacciLayers}
                  />
                );
              })}
            </div>
          );
        })()}
      </div>

      {showSettings && (
        <SettingsPanel
          settings={settings}
          onSettingsChange={handleSettingsChange}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
