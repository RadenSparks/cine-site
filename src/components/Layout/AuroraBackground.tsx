import React from "react";

export function AuroraBackground({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        // Spread out radial gradient with dreamy twilight palette
        backgroundImage:
          "radial-gradient(ellipse 150% 100% at 50% 0%, #f28b6b 0%, #b14f4a 25%, #5a314b 50%, #221824 100%)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Aurora effect - warm glowing embers in twilight haze */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute left-1/4 top-1/4 w-[60vw] h-[60vw] rounded-full blur-3xl"
          style={{ backgroundColor: "rgba(242, 139, 107, 0.15)" }}
        />
        <div
          className="absolute right-1/4 bottom-1/4 w-[40vw] h-[40vw] rounded-full blur-2xl"
          style={{ backgroundColor: "rgba(177, 79, 74, 0.12)" }}
        />
        <div
          className="absolute left-1/2 top-1/2 w-[30vw] h-[30vw] rounded-full blur-2xl"
          style={{ backgroundColor: "rgba(90, 49, 75, 0.08)" }}
        />
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}