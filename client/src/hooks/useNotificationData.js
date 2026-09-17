import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as notifApi from "../api/notificationApi.js";

export const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications", "list"],
    queryFn: notifApi.fetchNotifications,
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: ["notifications", "unreadCount"],
    queryFn: notifApi.fetchUnreadCount,
    refetchInterval: 30000, // Poll every 30 seconds for real-time feel
  });
};

export const useMarkReadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids) => notifApi.markNotificationsRead(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
