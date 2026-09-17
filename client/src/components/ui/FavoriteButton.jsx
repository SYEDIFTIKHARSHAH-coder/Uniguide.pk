import { useFavoriteStatus, useToggleFavoriteMutation } from "../../hooks/useUtilityData";
import { Heart } from "lucide-react";

export default function FavoriteButton({ targetId, targetType, title, subtitle }) {
  const { data: isFavorite, isLoading } = useFavoriteStatus(targetId);
  const toggleMutation = useToggleFavoriteMutation();

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleMutation.mutate({ targetId, targetType, title, subtitle });
  };

  if (isLoading) return <div className="w-8 h-8 animate-pulse bg-slate-200 rounded-full" />;

  return (
    <button
      onClick={handleToggle}
      disabled={toggleMutation.isPending}
      className={`p-2 rounded-full transition-all duration-300 ${
        isFavorite 
          ? "bg-rose-100 text-rose-500 hover:bg-rose-200" 
          : "bg-white/80 text-slate-400 hover:text-rose-500 hover:bg-white backdrop-blur shadow-sm"
      }`}
      aria-label="Toggle Favorite"
    >
      <Heart className={`w-5 h-5 ${isFavorite ? "fill-rose-500" : ""}`} />
    </button>
  );
}
