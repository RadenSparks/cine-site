"use client";
import { cn } from "../../lib/utils";
import React, { useEffect, useState, useRef } from "react";

interface ShootingStar {
  id: number;
  x: number;
  y: number;
  angle: number;
  scale: number;
  speed: number;
  distance: number;
}

interface ShootingStarsProps {
  minSpeed?: number;
  maxSpeed?: number;
  minDelay?: number;
  maxDelay?: number;
  starColor?: string;
  trailColor?: string;
  starWidth?: number;
  starHeight?: number;
  className?: string;
  maxStars?: number; // New prop to control maximum concurrent stars
}

const getRandomStartPoint = () => {
  // Modified to focus on top of screen for rain effect
  const x = Math.random() * (window.innerWidth + 200) - 100; // Spread wider than screen
  const y = -20; // Start above screen
  const angle = 95 + (Math.random() * 20 - 10); // Mostly downward angle with slight variation
  return { x, y, angle };
};

export const ShootingStars: React.FC<ShootingStarsProps> = ({
  minSpeed = 2,
  maxSpeed = 5,
  minDelay = 100, // Reduced delay for more frequent stars
  maxDelay = 500,
  starColor = "#ffffff",
  trailColor = "#6366f1",
  starWidth = 3, // Thinner stars
  starHeight = 15, // Longer trails
  maxStars = 20, // Maximum concurrent stars
  className,
}) => {
  const [stars, setStars] = useState<ShootingStar[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const createStar = () => {
      const { x, y, angle } = getRandomStartPoint();
      const newStar: ShootingStar = {
        id: Date.now() + Math.random(), // Ensure unique IDs
        x,
        y,
        angle,
        scale: 0.5 + Math.random() * 0.5, // Varied sizes
        speed: Math.random() * (maxSpeed - minSpeed) + minSpeed,
        distance: 0,
      };

      setStars(currentStars => {
        // Remove stars if we're at max capacity
        if (currentStars.length >= maxStars) {
          return [...currentStars.slice(1), newStar];
        }
        return [...currentStars, newStar];
      });

      const randomDelay = Math.random() * (maxDelay - minDelay) + minDelay;
      setTimeout(createStar, randomDelay);
    };

    // Create initial batch of stars
    for (let i = 0; i < maxStars / 2; i++) {
      setTimeout(createStar, i * 100);
    }

    return () => {};
  }, [minSpeed, maxSpeed, minDelay, maxDelay, maxStars]);

  useEffect(() => {
    const moveStars = () => {
      setStars(prevStars => {
        return prevStars.map(star => {
          const newX =
            star.x +
            star.speed * Math.cos((star.angle * Math.PI) / 180);
          const newY =
            star.y +
            star.speed * Math.sin((star.angle * Math.PI) / 180);
          const newDistance = star.distance + star.speed;

          // Remove stars that have moved off screen
          if (
            newX < -50 ||
            newX > window.innerWidth + 50 ||
            newY > window.innerHeight + 50
          ) {
            const { x, y, angle } = getRandomStartPoint();
            return {
              ...star,
              x,
              y,
              angle,
              distance: 0,
              scale: 0.5 + Math.random() * 0.5,
              speed: Math.random() * (maxSpeed - minSpeed) + minSpeed,
            };
          }

          return {
            ...star,
            x: newX,
            y: newY,
            distance: newDistance,
          };
        });
      });
    };

    const animationFrame = requestAnimationFrame(moveStars);
    return () => cancelAnimationFrame(animationFrame);
  }, [stars, minSpeed, maxSpeed]);

  return (
    <svg
      ref={svgRef}
      className={cn("w-full h-full absolute inset-0", className)}
    >
      {stars.map(star => (
        <rect
          key={star.id}
          x={star.x}
          y={star.y}
          width={starWidth * star.scale}
          height={starHeight}
          fill="url(#gradient)"
          transform={`rotate(${star.angle}, ${
            star.x + (starWidth * star.scale) / 2
          }, ${star.y + starHeight / 2})`}
        />
      ))}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: trailColor, stopOpacity: 0 }} />
          <stop
            offset="100%"
            style={{ stopColor: starColor, stopOpacity: 1 }}
          />
        </linearGradient>
      </defs>
    </svg>
  );
};