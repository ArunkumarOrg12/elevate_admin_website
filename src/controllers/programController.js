import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
      return res?.programs ?? [];   // ← unwrap like departments
    },
    enabled: !!collegeId,
  });
}

export function useCreateProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post(ADMIN_PATHS.PROGRAMS, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["programs"] }),
  });
}

export function useUpdateProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => api.put(`${ADMIN_PATHS.PROGRAMS}/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["programs"] }),
  });
}

export function useDeleteProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`${ADMIN_PATHS.PROGRAMS}/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["programs"] }),
  });
}
