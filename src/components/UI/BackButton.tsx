import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export function BackButton() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  return (
    <button
      onClick={handleBack}
      className="cursor-target btn flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white transition-all duration-200 font-button font-medium text-sm"
    >
      <ArrowLeftIcon className="w-4 h-4" />
      <span>Back</span>
    </button>
  );
}
