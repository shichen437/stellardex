import type { GroupItem } from "@/lib/types/group";

export function fibonacci(n: number): number[] {
  const fib = [3, 5];
  while (fib.length < n) {
    fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
  }
  return fib.slice(0, n);
}

export function calculateCircularPositions(
  count: number,
  radius: number
): [number, number, number][] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (2 * Math.PI * i) / count;
    return [Math.cos(angle) * radius, 0, Math.sin(angle) * radius] as [
      number,
      number,
      number
    ];
  });
}

export function getFibonacciLayers(items: GroupItem[]): GroupItem[][] {
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
