import React from "react";

export function AuroraBackground({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        // use the requested colour palette directly (no external CSS required)
        backgroundImage:
          "linear-gradient(135deg, #5e85acff 10%, rgba(221, 205, 139, 1) 100%)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Aurora effect - colours taken from the palette, applied inline */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute left-1/4 top-1/4 w-[60vw] h-[60vw] rounded-full blur-3xl"
          style={{ backgroundColor: "rgba(255,45,135,0.12)" }}
        />
        <div
          className="absolute right-1/4 bottom-1/4 w-[40vw] h-[40vw] rounded-full blur-2xl"
          style={{ backgroundColor: "rgba(123,47,247,0.10)" }}
        />
        <div
          className="absolute left-1/2 top-1/2 w-[30vw] h-[30vw] rounded-full blur-2xl"
          style={{ backgroundColor: "rgba(0,0,0,0.06)" }}
        />
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}