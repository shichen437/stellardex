import { Html } from "@react-three/drei";
import { GroupItemIcon } from "@/components/modes/starry/GroupItemIcon";
import type { GroupItem } from "@/lib/types/group";

interface HtmlIconProps {
  item: GroupItem;
  size: number;
  position: [number, number, number];
}

export function HtmlIcon({ item, size, position }: HtmlIconProps) {
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