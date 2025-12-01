import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const trailers = [
	{
		id: 1,
		title: 'Inception',
		video: 'https://www.youtube.com/embed/YoHD9XEInc0',
		poster: 'https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg',
		description:
			'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.',
	},
	{
		id: 2,
		title: 'Interstellar',
		video: 'https://www.youtube.com/embed/zSWdZVtXT7E',
		poster: 'https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg',
		description:
			'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
	},
	{
		id: 3,
		title: 'The Dark Knight',
		video: 'https://www.youtube.com/embed/EXeTwQWrcwY',
		poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
		description:
			'Batman faces the Joker, a criminal mastermind who plunges Gotham into anarchy and forces Batman closer to crossing the line between hero and vigilante.',
	},
	{
		id: 4,
		title: 'Animated Feature',
		video: 'https://www.youtube.com/embed/8Qn_spdM5Zg',
		poster: 'https://image.tmdb.org/t/p/w500/2CAL2433ZeIihfX1Hb2139CX0pW.jpg',
		description:
			'A magical adventure unfolds in a world where anything is possible and friendship conquers all.',
	},
	{
		id: 5,
		title: 'Comedy Hit',
		video: 'https://www.youtube.com/embed/t433PEQGErc',
		poster: 'https://image.tmdb.org/t/p/w500/6bCplVkhowCjTHXWv49UjRPn0eK.jpg',
		description:
			'A hilarious journey of unlikely friends who find themselves in the most unexpected situations.',
	},
];

export default function HotTrailerSection() {
	const carouselRef = useRef<HTMLDivElement>(null);
	const [activeTrailer, setActiveTrailer] = useState<null | typeof trailers[0]>(null);
	const [currentPage, setCurrentPage] = useState(0);
	const itemsPerPage = 4;
	const totalPages = Math.ceil(trailers.length / itemsPerPage);

	const handlePaginationClick = (page: number) => {
		setCurrentPage(page);
		if (carouselRef.current) {
			const cardWidth = 280; // md:340px, but we'll use a consistent calculation
			const gap = 16; // 4 md:gap-8 = 32, but 4 gap = 16
			const scrollAmount = page * (itemsPerPage * (cardWidth + gap));
			carouselRef.current.scrollTo({
				left: scrollAmount,
				behavior: 'smooth',
			});
		}
	};

	return (
		<section className="mb-16 px-0 md:px-0">
			<h2 className="text-2xl md:text-3xl font-extrabold mb-6 md:mb-8 text-white text-center tracking-tight px-4">
				Hot Trailers
			</h2>
			<div className="relative w-full flex justify-center overflow-hidden">
				<div
					ref={carouselRef}
					className="flex gap-4 md:gap-8 pb-4 overflow-hidden scroll-smooth w-full"
					style={{
						justifyContent: "flex-start",
						paddingLeft: "1rem",
						paddingRight: "1rem",
						scrollBehavior: 'smooth',
					}}
				>
					{trailers.map(trailer => (
						<motion.div
							key={trailer.id}
							className="relative min-w-[280px] md:min-w-[340px] max-w-xs bg-gradient-to-br from-indigo-900 via-pink-900 to-indigo-700 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col cursor-pointer flex-shrink-0"
							whileHover={{ scale: 1.03, y: -6 }}
							transition={{ type: 'spring', stiffness: 300, damping: 20 }}
							onClick={() => setActiveTrailer(trailer)}
						>
							<div className="relative aspect-video w-full overflow-hidden">
								<iframe
									src={trailer.video}
									title={trailer.title}
									frameBorder="0"
									allow="autoplay; encrypted-media"
									allowFullScreen
									className="w-full h-full pointer-events-none"
									loading="lazy"
									tabIndex={-1}
									aria-hidden
								/>
								{/* Poster as blurred background for fallback/visual */}
								<img
									src={trailer.poster}
									alt={trailer.title}
									className="absolute inset-0 w-full h-full object-cover blur-lg opacity-30 pointer-events-none"
									aria-hidden
								/>
								{/* Overlay for readability */}
								<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
							</div>
							<div className="flex flex-col gap-2 p-5 pt-4">
								<div className="flex items-center gap-3">
									<img
										src={trailer.poster}
										alt={trailer.title}
										className="w-12 h-12 rounded-xl object-cover border-2 border-pink-500 shadow"
									/>
									<span className="font-bold text-lg text-white drop-shadow">
										{trailer.title}
									</span>
								</div>
								<p className="text-pink-100 text-sm font-medium leading-snug mt-1 mb-2">
									{trailer.description}
								</p>
							</div>
						</motion.div>
					))}
				</div>
			</div>

			{/* Pagination Navigation */}
			{totalPages > 1 && (
				<div className="flex justify-center items-center gap-3 mt-8">
					{Array.from({ length: totalPages }).map((_, index) => (
						<button
							key={index}
							onClick={() => handlePaginationClick(index)}
							className={`w-10 h-10 rounded-full font-semibold transition-all duration-300 ${
								currentPage === index
									? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg scale-110'
									: 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
							}`}
						>
							{index + 1}
						</button>
					))}
				</div>
			)}

			{/* Modal for expanded trailer */}
			<AnimatePresence>
				{activeTrailer && (
					<motion.div
						className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setActiveTrailer(null)}
					>
						<motion.div
							className="relative bg-gradient-to-br from-indigo-900 via-pink-900 to-indigo-700 rounded-3xl shadow-2xl max-w-2xl w-full mx-4"
							initial={{ scale: 0.95, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.95, opacity: 0 }}
							onClick={e => e.stopPropagation()}
						>
							<button
								className="absolute top-4 right-4 z-10 text-white bg-black/40 hover:bg-black/70 rounded-full p-2 transition"
								onClick={() => setActiveTrailer(null)}
								aria-label="Close"
							>
								<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
									<path d="M6 6l12 12M6 18L18 6" />
								</svg>
							</button>
							<div className="aspect-video w-full rounded-t-3xl overflow-hidden bg-black">
								<iframe
									src={activeTrailer.video + "?autoplay=1"}
									title={activeTrailer.title}
									frameBorder="0"
									allow="autoplay; encrypted-media"
									allowFullScreen
									className="w-full h-full"
								/>
							</div>
							<div className="p-6">
								<div className="flex items-center gap-4 mb-2">
									<img
										src={activeTrailer.poster}
										alt={activeTrailer.title}
										className="w-14 h-14 rounded-xl object-cover border-2 border-pink-500 shadow"
									/>
									<span className="font-bold text-2xl text-white drop-shadow">
										{activeTrailer.title}
									</span>
								</div>
								<p className="text-pink-100 text-base font-medium leading-snug mb-4">
									{activeTrailer.description}
								</p>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</section>
	);
}