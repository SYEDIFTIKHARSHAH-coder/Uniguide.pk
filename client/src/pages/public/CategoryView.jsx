import { useParams, Link } from "react-router-dom";
import { useGuidesByCategory } from "../../hooks/useGuidanceData";
import ArticleCard from "../../components/ui/ArticleCard";
import { ChevronLeft } from "lucide-react";

export default function CategoryView() {
  const { category } = useParams();
  const { data: guides, isLoading } = useGuidesByCategory(category);

  // Capitalize category name for display
  const categoryName = category ? category.charAt(0).toUpperCase() + category.slice(1) : "";

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/guidance" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-8 transition-colors">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Guidance Hub
        </Link>

        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-3">{categoryName} Guides</h1>
          <p className="text-slate-600 text-lg">Browse all our expert articles related to {categoryName.toLowerCase()}s.</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-xl"></div>
            ))}
          </div>
        ) : guides?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guides.map(guide => (
              <ArticleCard key={guide.id} article={guide} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold text-slate-700 mb-2">No articles found</h3>
            <p className="text-slate-500">Check back later for more content in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
