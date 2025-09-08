import { CineCard } from './UI/CineCard';

interface Movie {
  id: string;
  title: string;
  poster: string;
  releaseDate: string;
}

const comingSoonMovies: Movie[] = [
  {
    id: '101',
    title: 'Avatar: The Way of Water',
    poster: 'https://image.tmdb.org/t/p/w500/5Avw5m4rGgNfZr0GrMIQZ1mjJw6.jpg',
    releaseDate: '2025-10-01',
  },
  {
    id: '102',
    title: 'Mission Impossible: Dead Reckoning',
    poster: 'https://image.tmdb.org/t/p/w500/NNxYkU70HPurnNCSiCjYAmacwm.jpg',
    releaseDate: '2025-11-15',
  },
  {
    id: '103',
    title: 'Inside Out 2',
    poster: 'https://image.tmdb.org/t/p/w500/6fAqf2j6pQjQH2b7bA5T2yYQ6bA.jpg',
    releaseDate: '2025-12-20',
  },
  {
    id: '104',
    title: 'Spider-Man: Beyond the Spider-Verse',
    poster: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    releaseDate: '2026-01-10',
  },
];

export default function ComingSoonSection() {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold mb-4 text-white">Coming Soon</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {comingSoonMovies.map(movie => (
          <CineCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            poster={movie.poster}
            releaseDate={movie.releaseDate}
            showBookButton={false}
            disabled={true}
          />
        ))}
      </div>
    </div>
  );
}