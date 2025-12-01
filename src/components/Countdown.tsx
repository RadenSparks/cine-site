import React, { useEffect, useState } from "react";
import { MotionValue, motion, useSpring, useTransform } from "framer-motion";

interface NumberProps {
  mv: MotionValue<number>;
  number: number;
  height: number;
}

function Number({ mv, number, height }: NumberProps) {
  const y = useTransform(mv, (latest: number) => {
    const placeValue = latest % 10;
    const offset = (10 + number - placeValue) % 10;
    let memo = offset * height;
    if (offset > 5) {
      memo -= 10 * height;
    }
    return memo;
  });
  return (
    <motion.span className="counter-number" style={{ y }}>
      {number}
    </motion.span>
  );
}

interface DigitProps {
  place: number;
  value: number;
  height: number;
  digitStyle?: React.CSSProperties;
}

function Digit({ place, value, height, digitStyle }: DigitProps) {
  const valueRoundedToPlace = Math.floor(value / place);
  const animatedValue = useSpring(valueRoundedToPlace);
  useEffect(() => {
    animatedValue.set(valueRoundedToPlace);
  }, [animatedValue, valueRoundedToPlace]);
  return (
    <div className="counter-digit" style={{ height, ...digitStyle }}>
      {Array.from({ length: 10 }, (_, i) => (
        <Number key={i} mv={animatedValue} number={i} height={height} />
      ))}
    </div>
  );
}

interface CounterProps {
  value: number;
  fontSize?: number;
  padding?: number;
  places?: number[];
  gap?: number;
  borderRadius?: number;
  horizontalPadding?: number;
  textColor?: string;
  fontWeight?: React.CSSProperties["fontWeight"];
  containerStyle?: React.CSSProperties;
  counterStyle?: React.CSSProperties;
  digitStyle?: React.CSSProperties;
  gradientHeight?: number;
  gradientFrom?: string;
  gradientTo?: string;
  topGradientStyle?: React.CSSProperties;
  bottomGradientStyle?: React.CSSProperties;
}

export function Counter({
  value,
  fontSize = 28,
  padding = 0,
  places = [100000, 10000, 1000, 100, 10, 1],
  gap = 6,
  borderRadius = 4,
  horizontalPadding = 6,
  textColor = "white",
  fontWeight = "700",
  containerStyle,
  counterStyle,
  digitStyle,
  gradientHeight = 8,
  gradientFrom = "black",
  gradientTo = "transparent",
  topGradientStyle,
  bottomGradientStyle,
}: CounterProps) {
  const height = fontSize + padding;
  const defaultCounterStyle: React.CSSProperties = {
    fontSize,
    gap,
    borderRadius,
    paddingLeft: horizontalPadding,
    paddingRight: horizontalPadding,
    color: textColor,
    fontWeight,
    display: "inline-flex",
    alignItems: "center",
  };
  const defaultTopGradientStyle: React.CSSProperties = {
    height: gradientHeight,
    background: `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})`,
  };
  const defaultBottomGradientStyle: React.CSSProperties = {
    height: gradientHeight,
    background: `linear-gradient(to top, ${gradientFrom}, ${gradientTo})`,
  };
  return (
    <div className="counter-container" style={containerStyle}>
      <div className="counter-counter" style={{ ...defaultCounterStyle, ...counterStyle }}>
        {places.map((place) => (
          <Digit key={place} place={place} value={value} height={height} digitStyle={digitStyle} />
        ))}
      </div>
      <div className="gradient-container" aria-hidden>
        <div className="top-gradient" style={topGradientStyle ? topGradientStyle : defaultTopGradientStyle} />
        <div className="bottom-gradient" style={bottomGradientStyle ? bottomGradientStyle : defaultBottomGradientStyle} />
      </div>
      <style>{`
.counter-container{position:relative;display:inline-block}
.counter-counter{display:flex;overflow:hidden;line-height:1}
.counter-digit{position:relative;width:1ch;font-variant-numeric:tabular-nums}
.counter-number{position:absolute;top:0;right:0;bottom:0;left:0;display:flex;align-items:center;justify-content:center}
.gradient-container{pointer-events:none;position:absolute;top:0;bottom:0;left:0;right:0}
.bottom-gradient{position:absolute;bottom:0;width:100%}
.top-gradient{position:absolute;top:0;width:100%}
`}</style>
    </div>
  );
}

export default function Countdown({ targetDate, fontSize }: { targetDate?: string; fontSize?: number }) {
  const [secsLeft, setSecsLeft] = useState<number>(() => {
    const t = targetDate ? new Date(targetDate).getTime() : NaN;
    if (isNaN(t)) return 0;
    return Math.max(0, Math.floor((t - Date.now()) / 1000));
  });

  useEffect(() => {
    let mounted = true;
    const update = () => {
      const t = targetDate ? new Date(targetDate).getTime() : NaN;
      const left = isNaN(t) ? 0 : Math.max(0, Math.floor((t - Date.now()) / 1000));
      if (mounted) setSecsLeft(left);
    };
    update();
    const i = setInterval(update, 1000);
    return () => {
      mounted = false;
      clearInterval(i);
    };
  }, [targetDate]);

  const hours = Math.min(99, Math.floor(secsLeft / 3600));
  const minutes = Math.floor((secsLeft % 3600) / 60);
  const seconds = secsLeft % 60;

  const packed = hours * 10000 + minutes * 100 + seconds;

  return (
    <div className="flex items-center gap-3">
      <span className="text-sl text-white/90">Next showing in</span>
      <Counter value={packed} fontSize={fontSize ?? 26} padding={6} />
    </div>
  );
}