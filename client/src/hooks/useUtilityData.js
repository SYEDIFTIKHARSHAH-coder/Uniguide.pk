import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as utilityApi from "../api/utilityApi.js";

// --- REVIEWS ---

export const useReviews = (targetId, targetType) => {
  return useQuery({
    queryKey: ["reviews", targetType, targetId],
    queryFn: () => utilityApi.fetchReviews(targetId, targetType),
    enabled: !!targetId && !!targetType,
  });
};

export const usePostReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: utilityApi.postReview,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", variables.targetType, variables.targetId] });
    },
  });
};

// --- FAVORITES ---

export const useFavorites = (type = "all") => {
  return useQuery({
    queryKey: ["favorites", type],
    queryFn: () => utilityApi.fetchFavorites(type),
  });
};

export const useFavoriteStatus = (targetId) => {
  return useQuery({
    queryKey: ["favorites", "status", targetId],
    queryFn: () => utilityApi.checkFavoriteStatus(targetId),
    enabled: !!targetId,
  });
};

export const useToggleFavoriteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: utilityApi.toggleFavorite,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["favorites", "status", variables.targetId] });
    },
  });
};
