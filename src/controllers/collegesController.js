import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../services/api";
import { ADMIN_PATHS, QUERY_KEYS } from "../constants/apiUrlConstant";

// ── API functions ─────────────────────────────────────────────────────────────
const collegesApi = {
  getAll: (params) => api.get(ADMIN_PATHS.COLLEGES, { params }),

  getById: (id) => api.get(`${ADMIN_PATHS.COLLEGES}/${id}`),

  create: (data) => api.post(ADMIN_PATHS.COLLEGES, data),

  update: (id, data) => api.patch(`${ADMIN_PATHS.COLLEGES}/${id}`, data),

  remove: (id) => api.delete(`${ADMIN_PATHS.COLLEGES}/${id}`),

  getDepartments: (id, params) =>
    api.get(`${ADMIN_PATHS.COLLEGES}/${id}/departments`, { params }),

  getAdmins: (id) => api.get(`${ADMIN_PATHS.COLLEGES}/${id}/admins`),
};

// ── Hooks ─────────────────────────────────────────────────────────────────────
export function useColleges(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.COLLEGES, params],
    queryFn: () => collegesApi.getAll(params),
  });
}

export function useCollege(id) {
  return useQuery({
    queryKey: [...QUERY_KEYS.COLLEGES, id],
    queryFn: () => collegesApi.getById(id),
    enabled: !!id,
  });
}

export function useCollegeDepartments(id, params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.COLLEGES, id, "departments", params],
    queryFn: () => collegesApi.getDepartments(id, params),
    enabled: !!id,
  });
}

export function useCollegeAdmins(id) {
  return useQuery({
    queryKey: [...QUERY_KEYS.COLLEGES, id, "admins"],
    queryFn: () => collegesApi.getAdmins(id),
    enabled: !!id,
  });
}

export function useCreateCollege() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: collegesApi.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COLLEGES });
      toast.success("College created successfully!", {
        description: `${data.name} has been added.`,
      });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create college";
      const details =
        error?.response?.data?.error ||
        "Please check your input and try again.";
      toast.error(message, { description: details });
      console.error("Failed to create college:", error);
    },
  });
}

export function useUpdateCollege() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => collegesApi.update(id, data),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COLLEGES });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.COLLEGES, id] });
      toast.success("College updated successfully!", {
        description: "Changes have been saved.",
      });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update college";
      const details = error?.response?.data?.error || "Please try again.";
      toast.error(message, { description: details });
      console.error("Failed to update college:", error);
    },
  });
}

export function useDeleteCollege() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: collegesApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COLLEGES });
      toast.success("College deleted successfully!", {
        description: "The college record has been removed.",
      });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete college";
      const details = error?.response?.data?.error || "Please try again.";
      toast.error(message, { description: details });
      console.error("Failed to delete college:", error);
    },
  });
}

export default collegesApi;
