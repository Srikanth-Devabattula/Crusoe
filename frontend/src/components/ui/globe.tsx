"use client";

import { useEffect, useRef } from "react";
import createGlobe, { type COBEOptions } from "cobe";
import { useMotionValue, useSpring } from "motion/react";

import { cn } from "@/lib/cn";

const MOVEMENT_DAMPING = 1400;

/** Green globe #7EA849, orange dots/markers, glow #E8F0DC */
const ORANGE = [251 / 255, 100 / 255, 21 / 255] as const;
const LIGHT_BLUE = [96 / 255, 165 / 255, 250 / 255] as const;

export const BRAND_GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0,
  dark: 0,
  diffuse: 0.55,
  mapSamples: 20000,
  mapBrightness: 6,
  mapBaseBrightness: 0,
  baseColor: [126 / 255, 168 / 255, 73 / 255],
  markerColor: [...ORANGE],
  glowColor: [232 / 255, 240 / 255, 220 / 255],
  markers: [
    { location: [39.8283, -98.5795], size: 0.09, color: [...ORANGE] }, // US
    { location: [23.6345, -102.5528], size: 0.08, color: [...ORANGE] }, // Mexico
    { location: [50.0755, 14.4378], size: 0.08, color: [...ORANGE] }, // Czech Republic
    { location: [51.1657, 10.4515], size: 0.08, color: [...ORANGE] }, // Germany
    { location: [59.9139, 10.7522], size: 0.08, color: [...ORANGE] }, // Norway
    { location: [35.8617, 104.1954], size: 0.09, color: [...ORANGE] }, // China
    { location: [-25.2744, 133.7751], size: 0.08, color: [...ORANGE] }, // Australia
    { location: [53.3498, -6.2603], size: 0.08, color: [...ORANGE] }, // Ireland
    { location: [17.385, 78.4867], size: 0.1, color: [...LIGHT_BLUE] }, // Hyderabad, India
    { location: [17.6868, 83.2185], size: 0.1, color: [...LIGHT_BLUE] }, // Vizag, India
  ],
};

export function Globe({
  className,
  config = BRAND_GLOBE_CONFIG,
}: {
  className?: string;
  config?: COBEOptions;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(0);
  const widthRef = useRef(0);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);

  const r = useMotionValue(0);
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  });

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab";
    }
  };

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      r.set(r.get() + delta / MOVEMENT_DAMPING);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let globe: ReturnType<typeof createGlobe> | null = null;

    const onResize = () => {
      if (!canvasRef.current) return;
      widthRef.current = canvasRef.current.offsetWidth;
    };

    const initGlobe = () => {
      onResize();
      if (widthRef.current === 0) return;

      globe?.destroy();

      globe = createGlobe(canvas, {
        ...config,
        width: widthRef.current * 2,
        height: widthRef.current * 2,
        onRender: (state) => {
          if (!pointerInteracting.current) phiRef.current += 0.005;
          state.phi = phiRef.current + rs.get();
          state.width = widthRef.current * 2;
          state.height = widthRef.current * 2;
        },
      });

      setTimeout(() => {
        if (canvasRef.current) canvasRef.current.style.opacity = "1";
      }, 0);
    };

    const resizeObserver = new ResizeObserver(() => {
      initGlobe();
    });

    resizeObserver.observe(canvas);
    initGlobe();

    return () => {
      resizeObserver.disconnect();
      globe?.destroy();
    };
  }, [rs, config]);

  return (
    <div
      className={cn(
        "relative mx-auto aspect-square w-full max-w-[600px]",
        className
      )}
    >
      <canvas
        className="size-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]"
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX;
          updatePointerInteraction(e.clientX);
        }}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
    </div>
  );
}
