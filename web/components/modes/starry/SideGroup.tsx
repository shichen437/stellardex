import { OrbitingCircles } from "@/components/magicui/orbiting-circles";
import type { Group, GroupItem } from "@/lib/types/group";
import { GroupItemIcon } from "./GroupItemIcon";
import { getIconSize, getOrbitDuration, getOrbitRadius } from "./starry-utils";

interface SideGroupProps {
    group: Group;
    items: GroupItem[];
    position: { x: number; y: number };
    containerSize: number;
    hoveredLayer: string | null;
    setHoveredLayer: (layer: string | null) => void;
    getFibonacciLayers: (items: GroupItem[]) => GroupItem[][];
}

export function SideGroup({
    group,
    items,
    position,
    containerSize,
    hoveredLayer,
    setHoveredLayer,
    getFibonacciLayers,
}: SideGroupProps) {
    const layers = getFibonacciLayers(items);

    return (
        <div
            className="absolute"
            style={{
                left: `calc(50% + ${position.x}px)`,
                top: `calc(50% + ${position.y}px)`,
                transform: 'translate(-50%, -50%)',
            }}
        >
            <div className="relative" style={{ width: containerSize * 0.4, height: containerSize * 0.4 }}>
                {layers.map((layer, i) => (
                    <OrbitingCircles
                        key={i}
                        radius={getOrbitRadius(i, layers.length, 40)}
                        iconSize={getIconSize(i, false)}
                        duration={getOrbitDuration(i)}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-80"
                        paused={hoveredLayer === `${group.id}-${i}`}
                        onMouseEnter={() => setHoveredLayer(`${group.id}-${i}`)}
                        onMouseLeave={() => setHoveredLayer(null)}
                    >
                        {layer.map((item) => (
                            <GroupItemIcon key={item.id} item={item} size={getIconSize(i, false)} />
                        ))}
                    </OrbitingCircles>
                ))}
            </div>
        </div>
    );
}