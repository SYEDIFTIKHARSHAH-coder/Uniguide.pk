import { Link } from "react-router-dom";
import { Clock, User } from "lucide-react";

export default function ArticleCard({ article }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group flex flex-col h-full">
      <div className="relative h-48 overflow-hidden bg-slate-100">
        {article.thumbnailUrl ? (
          <img 
            src={article.thumbnailUrl} 
            alt={article.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            No Image
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur text-blue-700 text-xs font-bold rounded-full shadow-sm uppercase tracking-wide">
            {article.category}
          </span>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex space-x-2 mb-3">
          {article.tags?.slice(0, 2).map((tag, idx) => (
            <span key={idx} className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              {tag}{idx !== article.tags.slice(0, 2).length - 1 ? " • " : ""}
            </span>
          ))}
        </div>
        
        <Link to={`/guidance/article/${article.id}`}>
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-4 line-clamp-2">
            {article.title}
          </h3>
        </Link>
        
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2 text-slate-400" />
            <span className="font-medium">{article.author}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-slate-400" />
            {article.readTimeMinutes} min read
          </div>
        </div>
      </div>
    </div>
  );
}
