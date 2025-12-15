import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import CineButton from "./CineButton";

type CineCardProps = {
	id?: string;
	title: string;
	poster?: string; // for movies
	src?: string; // for events/news
	description?: string;
	releaseDate?: string;
	showBookButton?: boolean;
	bookButtonLink?: string;
	bookButtonLabel?: string;
	disabled?: boolean;
	genres?: string[];
};

export type { CineCardProps };

const imageVariants = {
	initial: { scale: 1.01, x: 0, y: 0 },
	exit: { scale: 1.01, x: 0, y: 0 },
	top: { scale: 1.05, y: 5 },
	bottom: { scale: 1.05, y: -5 },
	left: { scale: 1.05, x: 5 },
	right: { scale: 1.05, x: -5 },
};



export function CineCard(props: CineCardProps) {
	const {
		poster,
		src,
		title,
		description,
		releaseDate,
		showBookButton,
		bookButtonLink,
		bookButtonLabel,
		disabled,
		genres,
	} = props;
	const imageUrl = poster || src || "";
	const ref = useRef<HTMLDivElement>(null);
	const [direction, setDirection] = useState<
		"top" | "bottom" | "left" | "right" | string
	>("left");
	const [isHovered, setIsHovered] = useState(false);

	const handleMouseEnter = (
		event: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		if (!ref.current) return;
		const { width: w, height: h, left, top } =
			ref.current.getBoundingClientRect();
		const x = event.clientX - left - (w / 2) * (w > h ? h / w : 1);
		const y = event.clientY - top - (h / 2) * (h > w ? w / h : 1);
		const d = Math.round(Math.atan2(y, x) / 1.57079633 + 5) % 4;
		switch (d) {
			case 0:
				setDirection("top");
				break;
			case 1:
				setDirection("right");
				break;
			case 2:
				setDirection("bottom");
				break;
			case 3:
				setDirection("left");
				break;
			default:
				setDirection("left");
				break;
		}
		setIsHovered(true);
	};

	const handleMouseLeave = () => {
		setIsHovered(false);
		setDirection("left");
	};

	return (
		<motion.div
			ref={ref}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			className={
				"relative group/card rounded-2xl overflow-hidden cursor-pointer shadow-2xl transition-all bg-gradient-to-br from-indigo-900 via-pink-900 to-indigo-700 " +
				""
			}
			style={{ minWidth: "12rem", aspectRatio: "2 / 3" }}
		>
			<AnimatePresence mode="wait">
				<motion.div
					className="relative h-full w-full"
					initial="initial"
					exit="exit"
				>
					{/* Subtle dark overlay for readability */}
					<motion.div className="absolute inset-0 w-full h-full bg-black/12 z-10 transition duration-500" />
					<motion.div
						variants={imageVariants}
						animate={isHovered ? direction : "initial"}
						className="absolute inset-0 w-full h-full bg-black"
						transition={{ duration: 0.3, ease: "easeOut" }}
					>
						<img
							alt="card"
							className="h-full w-full object-cover transition-transform duration-300"
							src={imageUrl}
							style={{
								willChange: "transform",
							}}
						/>
					</motion.div>
											{/* Show genres and name at bottom by default, move to top on hover */}
											<AnimatePresence>
												{!isHovered && (
													<motion.div className="absolute bottom-0 left-0 w-full p-4 z-20 pointer-events-none flex flex-col items-start"
														initial={{ opacity: 0 }}
														animate={{ opacity: 1 }}
														exit={{ opacity: 0 }}>
														<div className="flex flex-wrap gap-1 mb-2">
															{genres?.map((genre) => (
																<span
																	key={genre}
																	className="bg-pink-700/80 text-xs text-white px-2 py-1 rounded-full shadow font-label"
																>
																	{genre}
																</span>
															))}
														</div>
														<span className="inline-block px-4 py-2 rounded-xl shadow-lg border-2 border-blue-950 bg-gradient-to-r from-blue-950 via-indigo-900 to-blue-900 text-amber-200 font-label font-extrabold text-base tracking-wide">
															{title}
														</span>
													</motion.div>
												)}
															{/* No name/genre at top when hovered */}
											</AnimatePresence>
											{/* Show full info and Book Now button only on hover, blacken lower part only, enlarge info text */}
											<AnimatePresence>
												{isHovered && (
													<motion.div
														className="absolute left-0 bottom-0 w-full pb-4 pt-10 px-4 z-30 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-b-2xl flex flex-col justify-end"
														initial={{ opacity: 0 }}
														animate={{ opacity: 1 }}
														exit={{ opacity: 0 }}
													>
														{description && (
															<div className="text-white text-sm font-body mb-2 line-clamp-3">
																{description}
															</div>
														)}
														{releaseDate && (
															<div className="text-amber-200 text-base font-label mb-3 font-bold">
																Release: {releaseDate}
															</div>
														)}
														{showBookButton && bookButtonLink && (
															<CineButton as={Link} to={bookButtonLink} className="w-full" disabled={disabled}>
																{bookButtonLabel || "Book Now"}
															</CineButton>
														)}
													</motion.div>
												)}
											</AnimatePresence>
				</motion.div>
			</AnimatePresence>
		</motion.div>
	);
}