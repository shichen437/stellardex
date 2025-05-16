import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";

export interface BigDipperProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
  size?: number;
  starSize?: number;
  rotationSpeed?: number;
}

const BIG_DIPPER_POSITIONS = [
  { x: 0.13, y: 0.15 },  // 天枢
  { x: 0.28, y: 0.20 },  // 天璇
  { x: 0.42, y: 0.25 },  // 天玑
  { x: 0.53, y: 0.18 },  // 天权 (旋转中心)
  { x: 0.64, y: 0.10 },  // 玉衡
  { x: 0.80, y: 0.25 },  // 开阳
  { x: 0.70, y: 0.40 }   // 摇光
];

export function BigDipper({
  className,
  children,
  size = 600,
  starSize = 16,
  rotationSpeed = 1,
  ...props
}: BigDipperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0.2);
  const rotationCenter = BIG_DIPPER_POSITIONS[3];
  const [isHovered, setIsHovered] = useState(false);
  const [currentAngle, setCurrentAngle] = useState(0);

  useEffect(() => {
    let lastTime = performance.now();

    const rotate = (time: number) => {
      if (containerRef.current && !isHovered) {
        const deltaTime = time - lastTime;
        const angleDelta = (deltaTime / 1000) * rotationSpeed;
        const newAngle = currentAngle + angleDelta;

        setCurrentAngle(newAngle);
        containerRef.current.style.setProperty('--rotation-angle', `${newAngle}rad`);
      }
      lastTime = time;
      animationRef.current = requestAnimationFrame(rotate);
    };

    animationRef.current = requestAnimationFrame(rotate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [rotationSpeed, isHovered, currentAngle]);

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      style={{
        width: size,
        height: size,
        '--center-x': `${rotationCenter.x * 100}%`,
        '--center-y': `${rotationCenter.y * 100}%`,
      } as React.CSSProperties}
      {...props}
    >
      {BIG_DIPPER_POSITIONS.map((pos, index) => {
        const relativeX = pos.x - rotationCenter.x;
        const relativeY = pos.y - rotationCenter.y;
        const isCenter = index === 3;
        return (
          <div
            key={index}
            className="absolute rounded-full bg-yellow-300"
            style={{
              width: starSize,
              height: starSize,
              left: `calc(var(--center-x) + cos(var(--rotation-angle)) * ${relativeX * 100}% - sin(var(--rotation-angle)) * ${relativeY * 100}% - ${starSize / 2}px)`,
              top: `calc(var(--center-y) + sin(var(--rotation-angle)) * ${relativeX * 100}% + cos(var(--rotation-angle)) * ${relativeY * 100}% - ${starSize / 2}px)`,
              transform: 'scale(1)',
              transition: isHovered ? 'none' : 'transform 0.3s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={!isCenter ? () => setIsHovered(true) : undefined}
            onMouseLeave={!isCenter ? () => setIsHovered(false) : undefined}
          >
            {children && React.Children.toArray(children)[index]}
          </div>
        );
      })}

      {/* 连接线 */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <polyline
          points={BIG_DIPPER_POSITIONS.map(p =>
            `${p.x * size},${p.y * size}`
          ).join(' ')}
          fill="none"
          stroke="#FFD700"
          strokeWidth="3"
          strokeOpacity="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="drop-shadow-lg"
        />
      </svg>
    </div>
  );
}