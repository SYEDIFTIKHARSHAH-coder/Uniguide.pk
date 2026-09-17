import { useQuery } from "@tanstack/react-query";
import * as guidanceApi from "../api/guidanceApi.js";

export const useLatestGuides = () => {
  return useQuery({
    queryKey: ["guidance", "latest"],
    queryFn: guidanceApi.fetchLatestGuides,
  });
};

export const useGuidesByCategory = (category) => {
  return useQuery({
    queryKey: ["guidance", "category", category],
    queryFn: () => guidanceApi.fetchGuidesByCategory(category),
    enabled: !!category,
  });
};

export const useGuideDetail = (id) => {
  return useQuery({
    queryKey: ["guidance", "detail", id],
    queryFn: () => guidanceApi.fetchGuideDetail(id),
    enabled: !!id,
  });
};
