import React from "react";

// ...MagicText component code from user prompt...

export default function MagicText({
  children,
  gradientColors = ["#4776cb", "#a19fe5", "#6cc606"],
  starColors = ["#4776cb", "#a19fe5", "#6cc606"],
  starCount = 3,
  gradientSpeed = "3s",
  sparkleFrequency = 1000,
  sparkVisibilityDuration = 900,
  sparkleAnimationDuration = 5000,
  sparkleIcon = undefined,
  starSize = "clamp(20px, 1.5vw, 30px)",
  mirrored = false,
  className = "",
}: {
  children: React.ReactNode;
  gradientColors?: string[];
  starColors?: string[];
  starCount?: number;
  gradientSpeed?: string;
  sparkleFrequency?: number;
  sparkVisibilityDuration?: number;
  sparkleAnimationDuration?: number;
  sparkleIcon?: React.ReactNode;
  starSize?: string;
  mirrored?: boolean;
  className?: string;
}) {
  const starsRef = React.useRef<(HTMLSpanElement | null)[]>([]);
  const instanceId = React.useId();

  const rand = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const animate = (star: HTMLElement) => {
    star.style.setProperty("--star-left", `${rand(-10, 100)}%`);
    star.style.setProperty("--star-top", `${rand(-40, 80)}%`);
    const path = star.querySelector("path");
    if (path) {
      path.setAttribute(
        "fill",
        starColors[Math.floor(Math.random() * starColors.length)]
      );
    }
    star.style.animation = "none";
    void star.offsetHeight;
    star.style.animation = `scale-${instanceId} ${sparkVisibilityDuration}ms ease forwards`;
  };

  React.useEffect(() => {
    starsRef.current.forEach((star, idx) => {
      if (star) {
        const delay = idx * 333;
        setTimeout(() => {
          animate(star);
          const interval = setInterval(() => animate(star), sparkleFrequency);
          return () => clearInterval(interval);
        }, delay);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [starColors, sparkleFrequency, sparkleAnimationDuration, sparkVisibilityDuration]);

  const gradient = `linear-gradient(${mirrored ? "to left" : "to right"}, ${[...gradientColors, gradientColors[0]].join(", ")})`;

  const DefaultStar = (
    <svg viewBox="0 0 512 512">
      <path d="M512 255.1c0 11.34-7.406 20.86-18.44 23.64l-171.3 42.78l-42.78 171.1C276.7 504.6 267.2 512 255.9 512s-20.84-7.406-23.62-18.44l-42.66-171.2L18.47 279.6C7.406 276.8 0 267.3 0 255.1c0-11.34 7.406-20.83 18.44-23.61l171.2-42.78l42.78-171.1C235.2 7.406 244.7 0 256 0s20.84 7.406 23.62 18.44l42.78 171.2l171.2 42.78C504.6 235.2 512 244.6 512 255.1z" />
    </svg>
  );

  return (
  <span className={`magic-${instanceId} ${mirrored ? "mirrored" : ""} ${className}`}>
      <span className={`stars-container-${instanceId}`}>
        {Array.from({ length: starCount }).map((_, i) => (
          <span
            key={i}
            className={`magic-star-${instanceId}`}
            ref={(el) => {
              starsRef.current[i] = el;
            }}
          >
            {sparkleIcon || DefaultStar}
          </span>
        ))}
      </span>
      <span
        className={`magic-text-${instanceId}`}
        style={{
          backgroundImage: gradient,
          backgroundSize: "200%",
          animationDuration: gradientSpeed,
        }}
      >
        {children}
      </span>
  <style>{`
        .magic-${instanceId} {
          display: inline-block;
          position: relative;
        }
        .magic-${instanceId}.mirrored .stars-container-${instanceId} {
          transform: scaleX(-1);
          transform-origin: center;
        }
        .stars-container-${instanceId} {
          display: inline-block;
          position: absolute;
          inset: 0;
        }
        .magic-star-${instanceId} {
          --size: ${starSize};
          display: block;
          height: var(--size);
          width: var(--size);
          left: var(--star-left);
          top: var(--star-top);
          position: absolute;
          opacity: 0.7;
          pointer-events: none;
          animation: none;
        }
        .magic-star-${instanceId} svg {
          animation: rotate-${instanceId} 1000ms linear infinite;
          display: block;
          width: 100%;
          height: 100%;
        }
        .magic-text-${instanceId} {
          animation: background-pan-${instanceId} linear infinite;
          white-space: nowrap;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
          position: relative;
          z-index: 1;
        }
        @keyframes background-pan-${instanceId} {
          from {
            background-position: 0% center;
          }
          to {
            background-position: ${mirrored ? "200%" : "-200%"} center;
          }
        }
        @keyframes scale-${instanceId} {
          from,
          to {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes rotate-${instanceId} {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(180deg);
          }
        }
      `}</style>
    </span>
  );
}
