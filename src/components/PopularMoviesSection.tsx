import { useSelector } from "react-redux";
import { type RootState } from "../store";
import MagicText from "./UI/MagicText";
import ChronicleButton from "./UI/ChronicleButton";

interface Movie {
  id: string;
  title: string;
  poster: string;
  releaseDate?: string;
  description?: string;
  genres?: string[];
}

export default function PopularMoviesSection() {
  const movies = useSelector((s: RootState) => s.movies.list) as Movie[] | undefined;
  // Show 8 movies for a richer section
  const list = Array.isArray(movies) ? movies.slice(0, 8) : [];
  // fallback demo
  const fallback = [
    {
      id: 'pop-1',
      title: 'End Game',
      poster: '/assets/images/banner1.jpg',
      description: 'Epic superhero finale.',
      genres: ['Action', 'Adventure'],
    },
    {
      id: 'pop-2',
      title: 'Frozen 2',
      poster: '/assets/images/banner2.jpg',
      description: 'Magical adventure for all ages.',
      genres: ['Animation', 'Family'],
    },
    {
      id: 'pop-3',
      title: 'Doctor Sleep',
      poster: '/assets/images/banner3.jpg',
      description: 'Supernatural horror sequel.',
      genres: ['Horror', 'Thriller'],
    },
    {
      id: 'pop-4',
      title: 'Toy Story 4',
      poster: '/assets/images/banner4.jpg',
      description: 'Animated family fun.',
      genres: ['Animation', 'Family'],
    },
    {
      id: 'pop-5',
      title: 'Rocketman',
      poster: '/assets/images/banner1.jpg',
      description: 'Musical biopic of Elton John.',
      genres: ['Biography', 'Music'],
    },
    {
      id: 'pop-6',
      title: 'Knives Out',
      poster: '/assets/images/banner2.jpg',
      description: 'A modern whodunit.',
      genres: ['Mystery', 'Crime'],
    },
    {
      id: 'pop-7',
      title: 'Jumanji',
      poster: '/assets/images/banner3.jpg',
      description: 'Jungle adventure returns.',
      genres: ['Adventure', 'Comedy'],
    },
    {
      id: 'pop-8',
      title: 'Bharat',
      poster: '/assets/images/banner4.jpg',
      description: 'A journey of a man and a nation.',
      genres: ['Drama', 'History'],
    },
  ];

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
