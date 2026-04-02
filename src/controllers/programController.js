import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../services/api";
import { ADMIN_PATHS } from "../constants/apiUrlConstant";

export function useGetPrograms(collegeId, departmentId) {
  return useQuery({
    queryKey: ["programs", collegeId, departmentId],
    queryFn: async () => {
      const res = await api.get(ADMIN_PATHS.PROGRAMS, {
        params: {
          college_id: collegeId,
          ...(departmentId && { department_id: departmentId }),
        },
      });
      console.log("Programs raw response:", res); // check shape
      return res?.programs ?? []; // ← unwrap like departments
    },
    enabled: !!collegeId,
  });
}

export function useCreateProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post(ADMIN_PATHS.PROGRAMS, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      toast.success("Program created successfully!", {
        description: `${data.name} has been added.`,
      });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create program";
      const details =
        error?.response?.data?.error ||
        "Please check your input and try again.";
      toast.error(message, { description: details });
      console.error("Failed to create program:", error);
    },
  });
}

export function useUpdateProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) =>
      api.put(`${ADMIN_PATHS.PROGRAMS}/${id}`, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      toast.success("Program updated successfully!", {
        description: "Changes have been saved.",
      });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update program";
      const details = error?.response?.data?.error || "Please try again.";
      toast.error(message, { description: details });
      console.error("Failed to update program:", error);
    },
  });
}

export function useDeleteProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`${ADMIN_PATHS.PROGRAMS}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      toast.success("Program deleted successfully!", {
        description: "The program record has been removed.",
      });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete program";
      const details = error?.response?.data?.error || "Please try again.";
      toast.error(message, { description: details });
      console.error("Failed to delete program:", error);
    },
  });
}
