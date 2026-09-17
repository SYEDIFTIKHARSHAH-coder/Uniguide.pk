import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as uniApi from "../api/universityApi.js";

// Hook for fetching dashboard analytics
export const useDashboardAnalytics = () => {
  return useQuery({
    queryKey: ["university", "dashboard"],
    queryFn: uniApi.fetchDashboardAnalytics,
  });
};

// Hook for fetching academic programs
export const usePrograms = () => {
  return useQuery({
    queryKey: ["university", "programs"],
    queryFn: uniApi.fetchPrograms,
  });
};

// Hook for adding a new program
export const useAddProgram = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uniApi.createProgram,
    onSuccess: () => {
      // Invalidate the cache to automatically fetch the new list of programs
      queryClient.invalidateQueries({ queryKey: ["university", "programs"] });
    },
  });
};

// Hook for fetching received applications
export const useApplications = () => {
  return useQuery({
    queryKey: ["university", "applications"],
    queryFn: uniApi.fetchApplications,
  });
};
