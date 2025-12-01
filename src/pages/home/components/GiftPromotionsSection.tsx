import { CineButton } from "../../../components/UI/CineButton";
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
      <div className="mt-2 mb-2 font-sans font-bold text-white text-2xl">
        {title}
      </div>
      <div className="font-sans text-base font-normal text-pink-100 mb-4">
        {description}
      </div>
      {action && <div>{action}</div>}
    </div>
  </div>
);

export default function GiftPromotionsSection() {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold mb-8 text-white">Gift & Promotions</h2>
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