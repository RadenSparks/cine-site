import { CineButton } from "../../../components/UI/CineButton";
import MagicText from "../../../components/UI/MagicText";
import { cn } from "../../../lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => (
  <div
    className={cn(
      "mx-auto grid max-w-5xl grid-cols-1 gap-6 md:auto-rows-[18rem] md:grid-cols-2",
      className
    )}
  >
    {children}
  </div>
);

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  action,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}) => (
  <div
    className={cn(
      "group/bento shadow-lg row-span-1 flex flex-col justify-between rounded-2xl border border-pink-400 bg-gradient-to-br from-indigo-900 via-pink-900 to-indigo-700 p-6 transition duration-200 hover:scale-[1.025] hover:shadow-2xl dark:border-pink-700/40 dark:bg-black/80",
      className
    )}
  >
    {header}
    <div className="flex-1 flex flex-col justify-between">
      {icon}
      <div className="mt-2 mb-2 font-title font-bold text-white text-2xl">
        {title}
      </div>
      <div className="font-body text-base font-normal text-pink-100 mb-4">
        {description}
      </div>
      {action && <div>{action}</div>}
    </div>
  </div>
);

export default function GiftPromotionsSection() {
  return (
    <div className="mb-12">
      <MagicText gradientColors={["#fff", "#e5e7eb", "#f3f4f6", "#d1d5db"]} starColors={["#fff", "#e5e7eb", "#f3f4f6", "#d1d5db"]} starCount={4} gradientSpeed="2.5s" sparkleFrequency={1200} starSize="clamp(18px,2vw,32px)" className="text-3xl sm:text-4xl md:text-5xl font-title font-extrabold leading-tight mb-8 block">Gift & Promotions</MagicText>
      <BentoGrid>
        <BentoGridItem
          title="Gift Cards"
          description="Buy gift cards for your loved ones!"
          action={
            <CineButton className="mt-2 w-full">
              Buy Gift Card
            </CineButton>
          }
        />
        <BentoGridItem
          title="Special Promotions"
          description="Check out our latest offers and discounts."
          action={
            <CineButton className="mt-2 w-full">
              See Promotions
            </CineButton>
          }
        />
      </BentoGrid>
    </div>
  );
}