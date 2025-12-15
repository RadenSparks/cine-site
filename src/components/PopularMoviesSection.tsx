import MagicText from "./UI/MagicText";
import ChronicleButton from "./UI/ChronicleButton";

export default function PopularMoviesSection() {
  return (
    <section className="mb-12">
      <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
        <MagicText gradientColors={["#fff", "#e5e7eb", "#f3f4f6", "#d1d5db"]} starColors={["#fff", "#e5e7eb", "#f3f4f6", "#d1d5db"]} starCount={4} gradientSpeed="2.5s" sparkleFrequency={1200} starSize="clamp(18px,2vw,32px)" className="text-5xl font-extrabold leading-tight">Popular Movies</MagicText>
        <div className="flex gap-2 flex-wrap ml-4">
          <ChronicleButton
            text="See More Hot"
            onClick={() => window.location.href = "/movies?filter=hot"}
            customBackground="#be185d"
            customForeground="#fff"
            hoverColor="#9d174d"
            width="auto"
          />
          <ChronicleButton
            text="See More Now Showing"
            onClick={() => window.location.href = "/movies?filter=now-showing"}
            customBackground="#2563eb"
            customForeground="#fff"
            hoverColor="#1d4ed8"
            width="auto"
          />
          <ChronicleButton
            text="See More Upcoming"
            onClick={() => window.location.href = "/movies?filter=upcoming"}
            customBackground="#4f46e5"
            customForeground="#fff"
            hoverColor="#3730a3"
            width="auto"
          />
        </div>
      </div>
      <hr className="border-t border-gray-600 mb-6" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      </div>
    </section>
  );
}
