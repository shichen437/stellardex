import type { Group, GroupItem } from "@/lib/types/group";

export function fibonacci(n: number): number[] {
  const fib = [2, 3];
  while (fib.length < n) {
    fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
  }
  return fib.slice(0, n);
}

export function getFibonacciLayers(items: GroupItem[]): GroupItem[][] {
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

export function getMaxGroup(
  groups: Group[],
  groupItemsMap: Record<number, GroupItem[]>
): Group | null {
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
}

export function calculatePosition(
  index: number,
  total: number,
  radius: number
) {
  const angle = (index / total) * Math.PI;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;
  return { x, y };
}

export function getOrbitRadius(
  layerIndex: number,
  totalLayers: number,
  baseRadius: number
): number {
  return baseRadius + layerIndex * baseRadius * 1.1;
}

export function getOrbitDuration(layerIndex: number): number {
  return 20 + layerIndex * 8;
}

export function getIconSize(layerIndex: number, isCenter: boolean): number {
  const baseSize = isCenter ? 40 : 36;
  return Math.max(baseSize - layerIndex * 4, 24);
}
