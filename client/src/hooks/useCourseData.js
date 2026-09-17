import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as courseApi from "../api/courseApi.js";

export const useCourseList = (category = "all") => {
  return useQuery({
    queryKey: ["courses", "list", category],
    queryFn: () => courseApi.fetchCourses(category),
  });
};

export const useCourseDetail = (courseId) => {
  return useQuery({
    queryKey: ["courses", "detail", courseId],
    queryFn: () => courseApi.fetchCourseDetail(courseId),
    enabled: !!courseId,
  });
};

export const useEnrolledCourses = () => {
  return useQuery({
    queryKey: ["courses", "enrolled"],
    queryFn: courseApi.fetchMyCourses,
  });
};

export const useEnrollMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseId) => courseApi.enrollInCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses", "enrolled"] });
    },
  });
};
