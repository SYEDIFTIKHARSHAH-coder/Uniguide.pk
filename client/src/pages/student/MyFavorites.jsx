import { useState } from "react";
import { useFavorites } from "../../hooks/useUtilityData";
import FavoriteButton from "../../components/ui/FavoriteButton";
import { Link } from "react-router-dom";
import { Heart, Building, Coins, ExternalLink } from "lucide-react";

export default function MyFavorites() {
  const [tab, setTab] = useState("university");
  const { data: favorites, isLoading } = useFavorites(tab);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center">
          <Heart className="w-7 h-7 mr-3 text-rose-500 fill-rose-500" />
          My Saved Items
        </h1>
        <p className="text-sm text-slate-500 mt-1">Quickly access your bookmarked universities and scholarships.</p>
      </div>

      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setTab("university")}
          className={`pb-4 px-4 font-medium text-sm border-b-2 transition-colors ${
            tab === "university" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Building className="w-4 h-4 inline mr-2" /> Saved Universities
        </button>
        <button
          onClick={() => setTab("scholarship")}
          className={`pb-4 px-4 font-medium text-sm border-b-2 transition-colors ${
            tab === "scholarship" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Coins className="w-4 h-4 inline mr-2" /> Saved Scholarships
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map(i => <div key={i} className="h-24 bg-slate-200 animate-pulse rounded-xl"></div>)}
        </div>
      ) : favorites?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <div key={fav.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col relative group hover:border-blue-300 transition-colors">
              <div className="absolute top-4 right-4">
                <FavoriteButton 
                  targetId={fav.targetId} 
                  targetType={fav.targetType}
                  title={fav.title}
                  subtitle={fav.subtitle} 
                />
              </div>
              
              <div className="mb-4 pr-10">
                <h3 className="font-bold text-slate-900 text-lg mb-1 line-clamp-1">{fav.title}</h3>
                <p className="text-slate-500 text-sm">{fav.subtitle}</p>
              </div>
              
              <div className="mt-auto pt-4 border-t border-slate-100">
                <Link 
                  to={fav.targetType === "university" ? `/universities/${fav.targetId}` : `/scholarships/${fav.targetId}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                >
                  View Details <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
          <Heart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">No saved {tab === "university" ? "universities" : "scholarships"}</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            When you see a heart icon next to a {tab === "university" ? "university" : "scholarship"}, click it to save it here for later.
          </p>
        </div>
      )}
    </div>
  );
}
