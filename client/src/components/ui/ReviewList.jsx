import { useReviews } from "../../hooks/useUtilityData";
import { Star } from "lucide-react";

export default function ReviewList({ targetId, targetType }) {
  const { data: reviews, isLoading } = useReviews(targetId, targetType);

  if (isLoading) return <div className="py-8 text-center text-slate-500">Loading reviews...</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-slate-900 mb-6">Student Reviews</h3>
      
      {reviews?.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-500">
          No reviews yet. Be the first to share your experience!
        </div>
      ) : (
        reviews?.map((review) => (
          <div key={review.id} className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="font-bold text-slate-900">{review.userName}</div>
                <div className="text-xs text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`w-4 h-4 ${star <= review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} 
                  />
                ))}
              </div>
            </div>
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
              {review.comment}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
