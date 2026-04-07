import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import { ADMIN_PATHS } from "../constants/apiUrlConstant";

export function useGetPrograms(collegeId, departmentId) {
  return useQuery({
    queryKey: ["programs", collegeId, departmentId],
    queryFn: async () => {
      const params = { limit: 100 };
      if (collegeId) params.college_id = collegeId;
      if (departmentId) params.department_id = departmentId;
      const res = await api.get(ADMIN_PATHS.PROGRAMS, { params });
      return res?.programs ?? [];
    },
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
