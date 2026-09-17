import { useState } from "react";
import { Star } from "lucide-react";
import { usePostReviewMutation } from "../../hooks/useUtilityData";

export default function ReviewForm({ targetId, targetType, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const postMutation = usePostReviewMutation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return alert("Please select a rating.");
    if (comment.length < 10) return alert("Comment must be at least 10 characters.");

    postMutation.mutate(
      { targetId, targetType, rating, comment },
      { 
        onSuccess: () => {
          setRating(0);
          setComment("");
          if (onSuccess) onSuccess();
        },
        onError: (err) => {
          alert(err.response?.data?.message || "Failed to post review");
        }
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Write a Review</h3>
      
      <div className="flex space-x-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="p-1 focus:outline-none transition-colors"
          >
            <Star 
              className={`w-8 h-8 ${
                (hoverRating || rating) >= star 
                  ? "fill-amber-400 text-amber-400" 
                  : "text-slate-300"
              }`} 
            />
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows="4"
        placeholder="Share your experience (min 10 characters)..."
        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
      />

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={postMutation.isPending}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-lg transition-colors"
        >
          {postMutation.isPending ? "Posting..." : "Post Review"}
        </button>
      </div>
    </form>
  );
}
