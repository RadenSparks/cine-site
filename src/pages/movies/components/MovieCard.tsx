import { CineCard } from "../../../components/UI/CineCard";
import type { CineCardProps } from "../../../components/UI/CineCard";

export interface MovieCardProps extends CineCardProps {
	type?: "now-showing" | "coming-soon";
}

export function MovieCard(props: MovieCardProps) {
	const {
		type = "now-showing",
		bookButtonLabel,
		...rest
	} = props;

	return (
		<CineCard
			{...rest}
			showBookButton={type === "now-showing" ? true : false}
			bookButtonLabel={type === "now-showing" ? (bookButtonLabel || "Book Now") : "Coming Soon"}
			disabled={type !== "now-showing"}
		/>
	);
}

export default MovieCard;