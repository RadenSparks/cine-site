import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { MovieResponseDTO } from "../../../types/auth";

interface HotTrailerSectionProps {
	movies?: MovieResponseDTO[];
	isLoading?: boolean;
}

/**
 * Convert various video URL formats to embeddable iframe src
 */
function getEmbeddableUrl(url: string): { embedUrl: string; isEmbeddable: boolean } {
	if (!url) return { embedUrl: "", isEmbeddable: false };

	// YouTube URL patterns
	const youtubePatterns = [
		/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
		/(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/,
		/(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/,
	];

	for (const pattern of youtubePatterns) {
		const match = url.match(pattern);
		if (match) {
			return {
				embedUrl: `https://www.youtube.com/embed/${match[1]}`,
				isEmbeddable: true,
			};
		}
	}

	// Vimeo URL patterns
	const vimeoPattern = /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/;
	const vimeoMatch = url.match(vimeoPattern);
	if (vimeoMatch) {
		return {
			embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
			isEmbeddable: true,
		};
	}

	// Check if URL is already an embed URL
	if (url.includes("youtube.com/embed") || url.includes("player.vimeo.com")) {
		return { embedUrl: url, isEmbeddable: true };
	}

	// For other URLs, we'll open in new tab instead of embedding
	return { embedUrl: url, isEmbeddable: false };
}

export default function HotTrailerSection({ movies = [], isLoading = false }: HotTrailerSectionProps) {
	const carouselRef = useRef<HTMLDivElement>(null);
	const [activeTrailer, setActiveTrailer] = useState<MovieResponseDTO | null>(null);
	const [currentPage, setCurrentPage] = useState(0);
	const itemsPerPage = 4;
	const totalPages = Math.ceil(movies.length / itemsPerPage);

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

	// Show skeleton if loading or no movies
	if (isLoading || movies.length === 0) {
		return (
			<section className="mb-16 px-0 md:px-0">
				<h2 className="text-3xl sm:text-4xl md:text-5xl font-title font-extrabold mb-6 md:mb-8 text-white text-center tracking-tight px-4">
					Hot Trailers
				</h2>
				<div className="flex gap-4 md:gap-8 pb-4 overflow-hidden scroll-smooth w-full px-4">
					{Array.from({ length: 4 }).map((_, idx) => (
						<div
							key={idx}
							className="relative min-w-[280px] md:min-w-[340px] max-w-xs bg-slate-800 rounded-2xl md:rounded-3xl overflow-hidden flex flex-col flex-shrink-0 animate-pulse"
						>
							<div className="relative aspect-video w-full bg-slate-700"></div>
							<div className="flex flex-col gap-2 p-5 pt-4">
								<div className="flex items-center gap-3">
									<div className="w-12 h-12 rounded-xl bg-slate-700"></div>
									<div className="flex-1">
										<div className="h-4 bg-slate-700 rounded w-3/4"></div>
									</div>
								</div>
								<div className="space-y-2">
									<div className="h-3 bg-slate-700 rounded w-full"></div>
									<div className="h-3 bg-slate-700 rounded w-5/6"></div>
								</div>
							</div>
						</div>
					))}
				</div>
			</section>
		);
	}

	return (
		<section className="mb-16 px-0 md:px-0">
			<h2 className="text-3xl sm:text-4xl md:text-5xl font-title font-extrabold mb-6 md:mb-8 text-white text-center tracking-tight px-4">
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
					{movies.map(movie => (
						<motion.div
							key={String(movie.id)}
							className="relative min-w-[280px] md:min-w-[340px] max-w-xs bg-gradient-to-br from-indigo-900 via-pink-900 to-indigo-700 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col cursor-pointer flex-shrink-0"
							whileHover={{ scale: 1.03, y: -6 }}
							transition={{ type: 'spring', stiffness: 300, damping: 20 }}
							onClick={() => setActiveTrailer(movie)}
						>
							<div className="relative aspect-video w-full overflow-hidden">
								{movie.teaser ? (
									<div className="w-full h-full bg-gradient-to-br from-indigo-900 to-pink-900 flex items-center justify-center">
										<div className="text-center">
											<div className="w-12 h-12 rounded-full bg-pink-500/80 flex items-center justify-center mx-auto mb-2">
												<svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
													<path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
												</svg>
											</div>
											<span className="text-pink-100 text-sm font-semibold">Click to play</span>
										</div>
									</div>
								) : (
									<div className="w-full h-full bg-slate-900 flex items-center justify-center">
										<span className="text-slate-400">No trailer available</span>
									</div>
								)}
								{/* Poster as blurred background for fallback/visual */}
								<img
									src={movie.poster}
									alt={movie.title}
									className="absolute inset-0 w-full h-full object-cover blur-lg opacity-30 pointer-events-none"
									aria-hidden
								/>
								{/* Overlay for readability */}
								<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
							</div>
							<div className="flex flex-col gap-2 p-5 pt-4">
								<div className="flex items-center gap-3">
									<img
										src={movie.poster}
										alt={movie.title}
										className="w-12 h-12 rounded-xl object-cover border-2 border-pink-500 shadow"
									/>
									<span className="font-bold text-lg text-white drop-shadow font-title">
										{movie.title}
									</span>
								</div>
								<p className="text-pink-100 text-sm font-medium leading-snug mt-1 mb-2 line-clamp-2 font-body">
									{movie.description}
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
								{activeTrailer.teaser ? (
									(() => {
										const { embedUrl, isEmbeddable } = getEmbeddableUrl(activeTrailer.teaser);
										return isEmbeddable ? (
											<iframe
												src={embedUrl.includes('?') ? `${embedUrl}&autoplay=1` : `${embedUrl}?autoplay=1`}
												title={activeTrailer.title}
												frameBorder="0"
												allow="autoplay; encrypted-media"
												allowFullScreen
												className="w-full h-full"
											/>
										) : (
											<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
												<a
													href={activeTrailer.teaser}
													target="_blank"
													rel="noopener noreferrer"
													className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
												>
													Watch on External Site
												</a>
											</div>
										);
									})()
								) : (
									<div className="w-full h-full flex items-center justify-center">
										<span className="text-slate-400">No trailer available</span>
									</div>
								)}
							</div>
							<div className="p-6">
								<div className="flex items-center gap-4 mb-2">
									<img
										src={activeTrailer.poster}
										alt={activeTrailer.title}
										className="w-14 h-14 rounded-xl object-cover border-2 border-pink-500 shadow"
									/>
									<span className="font-bold text-2xl text-white drop-shadow font-title">
										{activeTrailer.title}
									</span>
								</div>
								<p className="text-pink-100 text-base font-medium leading-snug mb-4 font-body">
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