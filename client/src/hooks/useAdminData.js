import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as adminApi from "../api/adminApi.js";
import toast from "react-hot-toast";

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const usePlatformAnalytics = () =>
  useQuery({ queryKey: ["admin", "analytics"], queryFn: adminApi.fetchDashboardAnalytics });

// ─── Documents ────────────────────────────────────────────────────────────────
export const usePendingDocuments = () =>
  useQuery({ queryKey: ["admin", "documents", "pending"], queryFn: adminApi.fetchPendingDocuments });
export const useAllDocuments = () =>
  useQuery({ queryKey: ["admin", "documents", "all"], queryFn: adminApi.fetchAllDocuments });
export const useVerifyDocumentMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminApi.verifyDocument,
    onSuccess: (data) => {
      toast.success(data.message || "Document updated");
      qc.invalidateQueries({ queryKey: ["admin", "documents"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Action failed"),
  });
};

// ─── Users ────────────────────────────────────────────────────────────────────
export const useUserManagement = (role = "all") =>
  useQuery({ queryKey: ["admin", "users", role], queryFn: () => adminApi.fetchUsers(role) });
export const useUpdateUserStatusMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminApi.updateUserStatus,
    onSuccess: (data) => {
      toast.success(data.message || "User updated");
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed"),
  });
};
export const useEditUserMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }) => adminApi.editUser({ userId, data }),
    onSuccess: () => {
      toast.success("User edited successfully");
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
};

// ─── Applications ─────────────────────────────────────────────────────────────
export const useAdminApplications = (status = "all") =>
  useQuery({ queryKey: ["admin", "applications", status], queryFn: () => adminApi.fetchApplicationsForAdmin(status) });
export const useApproveApplicationMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ appId, note }) => adminApi.approveApplication(appId, note),
    onSuccess: () => {
      toast.success("✅ Application approved!");
      qc.invalidateQueries({ queryKey: ["admin", "applications"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed"),
  });
};
export const useRejectApplicationMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ appId, reason }) => adminApi.rejectApplication(appId, reason),
    onSuccess: () => {
      toast.success("Application rejected");
      qc.invalidateQueries({ queryKey: ["admin", "applications"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed"),
  });
};

// ─── Universities ─────────────────────────────────────────────────────────────
export const useAdminUniversities = (status = "all") =>
  useQuery({ queryKey: ["admin", "universities", status], queryFn: () => adminApi.fetchUniversitiesForAdmin(status) });
export const useApproveUniversityMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (uniId) => adminApi.approveUniversity(uniId),
    onSuccess: () => {
      toast.success("✅ University approved and published!");
      qc.invalidateQueries({ queryKey: ["admin", "universities"] });
    },
  });
};

// ─── Settings ─────────────────────────────────────────────────────────────────
export const useSystemSettings = () =>
  useQuery({ queryKey: ["admin", "settings"], queryFn: adminApi.fetchSystemSettings });
export const useUpdateSettingsMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminApi.updateSystemSettings,
    onSuccess: () => {
      toast.success("Settings saved!");
      qc.invalidateQueries({ queryKey: ["admin", "settings"] });
    },
  });
};

// ─── AI Admissions ─────────────────────────────────────────────────────────────
export const useAiDashboardStats = () =>
  useQuery({ queryKey: ["ai", "dashboard"], queryFn: adminApi.fetchAiDashboardStats });
export const useAiDiscoveries = (status = "all") =>
  useQuery({ queryKey: ["ai", "discoveries", status], queryFn: () => adminApi.fetchAiDiscoveries(status) });
export const useAiActivityLog = () =>
  useQuery({ queryKey: ["ai", "activity-log"], queryFn: adminApi.fetchActivityLog });

// Polls cooldown status on page load — lets the button show remaining time persistently
export const useCrawlerCooldownStatus = () =>
  useQuery({
    queryKey: ["ai", "cooldown"],
    queryFn: adminApi.fetchCooldownStatus,
    refetchInterval: 60000, // refresh every 60 seconds to keep remaining time accurate
    staleTime: 30000,
  });

export const useApproveAiDiscoveryMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, adminNote }) => adminApi.approveAiDiscovery(id, adminNote),
    onSuccess: () => {
      toast.success("✅ Discovery approved & published!");
      qc.invalidateQueries({ queryKey: ["ai"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed"),
  });
};
export const useRejectAiDiscoveryMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }) => adminApi.rejectAiDiscovery(id, reason),
    onSuccess: () => {
      toast.success("Discovery rejected");
      qc.invalidateQueries({ queryKey: ["ai"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed"),
  });
};
export const useEditAiDiscoveryMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => adminApi.editAiDiscovery(id, data),
    onSuccess: () => {
      toast.success("Data updated successfully");
      qc.invalidateQueries({ queryKey: ["ai"] });
    },
  });
};
export const useTriggerCrawlMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminApi.triggerAiCrawl,
    onSuccess: (data) => {
      toast.success(data.data?.message || "Crawl started!");
      // Refresh cooldown status and discoveries after a successful run
      qc.invalidateQueries({ queryKey: ["ai"] });
    },
    onError: (err) => {
      // 429 means cooldown is active — show the server's remaining time message
      const msg = err.response?.data?.message || err.message || "Failed to trigger crawl";
      toast.error(msg);
      // Still refresh the cooldown display so it shows up-to-date info
      qc.invalidateQueries({ queryKey: ["ai", "cooldown"] });
    },
  });
};

