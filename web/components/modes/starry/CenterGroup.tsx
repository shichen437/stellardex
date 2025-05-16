import { OrbitingCircles } from "@/components/magicui/orbiting-circles";
import type { Group, GroupItem } from "@/lib/types/group";
import { GroupItemIcon } from "./GroupItemIcon";
import { getIconSize, getOrbitDuration, getOrbitRadius } from "./starry-utils";

interface CenterGroupProps {
    maxGroup: Group;
    groupItemsMap: Record<number, GroupItem[]>;
    containerSize: number;
    hoveredLayer: string | null;
    setHoveredLayer: (layer: string | null) => void;
    getFibonacciLayers: (items: GroupItem[]) => GroupItem[][];
}

export function CenterGroup({
    maxGroup,
    groupItemsMap,
    containerSize,
    hoveredLayer,
    setHoveredLayer,
    getFibonacciLayers,
}: CenterGroupProps) {
    const items = groupItemsMap[maxGroup.id] || [];
    const layers = getFibonacciLayers(items);

    return (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative" style={{ width: containerSize * 0.6, height: containerSize * 0.6 }}>
                {layers.map((layer, i) => (
                    <OrbitingCircles
                        key={i}
                        radius={getOrbitRadius(i, layers.length, 50)}
                        iconSize={getIconSize(i, true)}
                        duration={getOrbitDuration(i)}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-90"
                        paused={hoveredLayer === `center-${i}`}
                        onMouseEnter={() => setHoveredLayer(`center-${i}`)}
                        onMouseLeave={() => setHoveredLayer(null)}
                    >
                        {layer.map((item) => (
                            <GroupItemIcon key={item.id} item={item} size={getIconSize(i, true)} />
                        ))}
                    </OrbitingCircles>
                ))}
            </div>
        </div>
    );
}