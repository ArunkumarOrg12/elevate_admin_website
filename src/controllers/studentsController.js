import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import { ADMIN_PATHS, QUERY_KEYS, STUDENT_API } from "../constants/apiUrlConstant";

// ── API functions ─────────────────────────────────────────────────────────────
const studentsApi = {
  getAll:      (params) => api.get(STUDENT_API.GET_ALL_STUDENTS, { params }),
  getById:     (id)     => api.get(`${STUDENT_API.GET_ALL_STUDENTS}/${id}`),
  create:      (data)   => api.post(STUDENT_API.CREATE_STUDENT, data),
  update:      (id, data) => api.put(`${STUDENT_API.GET_ALL_STUDENTS}/${id}`, data),
  remove:      (id)     => api.delete(`${STUDENT_API.GET_ALL_STUDENTS}/${id}`),
};

// ── Get all students ──────────────────────────────────────────────────────────
export const useGetAllStudents = () => {
  return useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const response = await api.get(STUDENT_API.GET_ALL_STUDENTS);
      // Backend returns { data: rows, pagination: {...} }
      // api interceptor unwraps res.data, so response IS the body
      return response.data ?? response; // handle both shapes
    },
  });
};

// ── Get student by ID ─────────────────────────────────────────────────────────
export const useGetStudentById = (id) => {
  return useQuery({
    queryKey: ["students", id],
    queryFn: async () => {
      const response = await api.get(`${STUDENT_API.GET_ALL_STUDENTS}/${id}`);
      return response.data ?? response;
    },
    enabled: !!id,
  });
};

// ── Create student ────────────────────────────────────────────────────────────
export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (studentData) => {
      const response = await api.post(STUDENT_API.CREATE_STUDENT, studentData);
      return response.data ?? response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (error) => {
      console.error("Failed to create student:", error);
    },
  });
};

// ── Update student ────────────────────────────────────────────────────────────
export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }) => {
      const response = await api.put(`${STUDENT_API.GET_ALL_STUDENTS}/${id}`, data);
      return response.data ?? response;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["students", id] });
    },
  });
};

// ── Delete student ────────────────────────────────────────────────────────────
export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`${STUDENT_API.GET_ALL_STUDENTS}/${id}`);
      return response.data ?? response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};

// ── Get departments for a college (for Add Student dialog) ────────────────────
export const useGetDepartments = (collegeId) => {
  return useQuery({
    queryKey: ["departments", collegeId],
    queryFn: async () => {
       console.log("➡️ collegeId:", collegeId);
      // Backend registered at /api/v1/department
      const response = await api.get(
        `${STUDENT_API.DEPARTMENTS}?college_id=${collegeId}`
        
      );

       console.log("➡️ raw response:", response);
      console.log("➡️ response.data:", response.data);
      console.log("➡️ response.departments:", response.departments);
      // Backend returns { data: [...], departments: [...] }
      return response.data ?? response.departments ?? [];
    },
    enabled: !!collegeId,
  });
};

export default studentsApi;