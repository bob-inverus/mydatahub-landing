"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface SparklesCoreProps {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  particleColor?: string;
  speed?: number;
}

export const SparklesCore: React.FC<SparklesCoreProps> = ({
  id = "sparkles",
  className,
  background = "transparent",
  minSize = 0.4,
  maxSize = 1.4,
  particleDensity = 800,
  particleColor = "#FFFFFF",
  speed = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current?.parentElement) {
        setDimensions({
          width: canvasRef.current.parentElement.offsetWidth,
          height: canvasRef.current.parentElement.offsetHeight,
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    // Parse particle color to get RGB values
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : { r: 255, g: 255, b: 255 };
    };

    const rgb = hexToRgb(particleColor);

    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      maxOpacity: number;
      fadeDirection: number;
      fadeSpeed: number;
    }

    const particles: Particle[] = [];

    // Calculate particle count based on density and area
    const area = dimensions.width * dimensions.height;
    const particleCount = Math.min(
      Math.floor((area / 10000) * (particleDensity / 100)),
      2000
    );

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * (maxSize - minSize) + minSize;
      particles.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        size,
        speedX: (Math.random() - 0.5) * 0.2 * speed,
        speedY: (Math.random() - 0.5) * 0.2 * speed,
        opacity: Math.random(),
        maxOpacity: Math.random() * 0.6 + 0.4,
        fadeDirection: Math.random() > 0.5 ? 1 : -1,
        fadeSpeed: Math.random() * 0.02 + 0.005,
      });
    }

    const drawParticle = (p: Particle) => {
      if (!ctx) return;

      // Create soft glow effect
      const gradient = ctx.createRadialGradient(
        p.x,
        p.y,
        0,
        p.x,
        p.y,
        p.size * 2
      );
      gradient.addColorStop(
        0,
        `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${p.opacity})`
      );
      gradient.addColorStop(
        0.5,
        `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${p.opacity * 0.5})`
      );
      gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Bright core
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${p.opacity})`;
      ctx.fill();
    };

    const animate = () => {
      if (!ctx) return;

      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      particles.forEach((p) => {
        // Move particle
        p.x += p.speedX;
        p.y += p.speedY;

        // Twinkle effect
        p.opacity += p.fadeDirection * p.fadeSpeed;
        if (p.opacity >= p.maxOpacity) {
          p.fadeDirection = -1;
        } else if (p.opacity <= 0.1) {
          p.fadeDirection = 1;
        }

        // Wrap around edges
        if (p.x < 0) p.x = dimensions.width;
        if (p.x > dimensions.width) p.x = 0;
        if (p.y < 0) p.y = dimensions.height;
        if (p.y > dimensions.height) p.y = 0;

        drawParticle(p);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    if (dimensions.width > 0 && dimensions.height > 0) {
      animate();
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [dimensions, minSize, maxSize, particleDensity, particleColor, speed]);

  return (
    <canvas
      ref={canvasRef}
      id={id}
      width={dimensions.width}
      height={dimensions.height}
      className={cn("pointer-events-none", className)}
      style={{
        background,
      }}
    />
  );
};
