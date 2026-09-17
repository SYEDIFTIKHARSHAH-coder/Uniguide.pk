import { useParams, Link } from "react-router-dom";
import { useGuideDetail } from "../../hooks/useGuidanceData";
import HtmlRenderer from "../../components/ui/HtmlRenderer";
import { ChevronLeft, Clock, User, Calendar } from "lucide-react";

export default function ArticleReader() {
  const { id } = useParams();
  const { data: article, isLoading, isError } = useGuideDetail(id);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading article...</div>;
  if (isError || !article) return <div className="min-h-screen flex items-center justify-center text-red-500">Article not found.</div>;

  return (
    <div className="bg-white min-h-screen">
      
      {/* Header / Hero */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          <Link to={`/guidance/category/${article.category}`} className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-8 transition-colors text-sm uppercase tracking-wider">
            <ChevronLeft className="w-4 h-4 mr-1" />
            {article.category} Guides
          </Link>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600">
            <div className="flex items-center">
              <User className="w-5 h-5 mr-2 text-slate-400" />
              <span className="font-medium text-slate-800">{article.author}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-slate-400" />
              {article.readTimeMinutes} min read
            </div>
            {article.createdAt && (
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-slate-400" />
                {new Date(article.createdAt).toLocaleDateString()}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {article.thumbnailUrl && (
          <div className="mb-12 rounded-2xl overflow-hidden shadow-sm border border-slate-100">
            <img src={article.thumbnailUrl} alt={article.title} className="w-full h-auto object-cover" />
          </div>
        )}

        <article className="pb-16 border-b border-slate-200">
          <HtmlRenderer content={article.content} />
        </article>
        
        <div className="mt-8 flex flex-wrap gap-2">
          {article.tags?.map((tag, idx) => (
            <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-600 text-sm font-medium rounded-full">
              #{tag}
            </span>
          ))}
        </div>

      </div>
    </div>
  );
}
