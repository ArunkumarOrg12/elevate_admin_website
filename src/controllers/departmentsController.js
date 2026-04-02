import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../services/api";
import { ADMIN_PATHS, QUERY_KEYS } from "../constants/apiUrlConstant";

// ── API functions ─────────────────────────────────────────────────────────────
const departmentsApi = {
  getAll: (params) => api.get(ADMIN_PATHS.DEPARTMENTS, { params }),

  getById: (id) => api.get(`${ADMIN_PATHS.DEPARTMENTS}/${id}`),

  create: (data) => api.post(ADMIN_PATHS.DEPARTMENTS, data),

  update: (id, data) => api.put(`${ADMIN_PATHS.DEPARTMENTS}/${id}`, data),

  remove: (id) => api.delete(`${ADMIN_PATHS.DEPARTMENTS}/${id}`),

  getStudents: (id, params) =>
    api.get(`${ADMIN_PATHS.DEPARTMENTS}/${id}/students`, { params }),
};

// ── Hooks ─────────────────────────────────────────────────────────────────────
// departmentController.js
export function useDepartments(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.DEPARTMENTS, params],
    queryFn: async () => {
      const res = await departmentsApi.getAll(params);
      console.log("Departments raw response:", res); // check what shape it is
      return res?.departments ?? res?.data?.departments ?? [];
    },
  });
}

export function useDepartment(id) {
  return useQuery({
    queryKey: [...QUERY_KEYS.DEPARTMENTS, id],
    queryFn: () => departmentsApi.getById(id),
    enabled: !!id,
  });
}

export function useDepartmentStudents(id, params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.DEPARTMENTS, id, "students", params],
    queryFn: () => departmentsApi.getStudents(id, params),
    enabled: !!id,
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: departmentsApi.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEPARTMENTS });
      toast.success("Department created successfully!", {
        description: `${data.name} has been added.`,
      });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create department";
      const details =
        error?.response?.data?.error ||
        "Please check your input and try again.";
      toast.error(message, { description: details });
      console.error("Failed to create department:", error);
    },
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => departmentsApi.update(id, data),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEPARTMENTS });
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.DEPARTMENTS, id],
      });
      toast.success("Department updated successfully!", {
        description: "Changes have been saved.",
      });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update department";
      const details = error?.response?.data?.error || "Please try again.";
      toast.error(message, { description: details });
      console.error("Failed to update department:", error);
    },
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: departmentsApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEPARTMENTS });
      toast.success("Department deleted successfully!", {
        description: "The department record has been removed.",
      });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete department";
      const details = error?.response?.data?.error || "Please try again.";
      toast.error(message, { description: details });
      console.error("Failed to delete department:", error);
    },
  });
}

export default departmentsApi;
