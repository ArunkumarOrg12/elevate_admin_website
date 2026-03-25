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
      console.error("Error response:", error?.response?.data); 
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
      const response = await api.get(STUDENT_API.DEPARTMENTS, {
        params: { college_id: collegeId }
      });
      // interceptor already unwraps, so response IS the data object
      return response?.departments ?? [];
    },
    enabled: !!collegeId,
  });
};

//bulk import
export const useBulkUploadStudents = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (students) => {
      const response = await api.post(STUDENT_API.BULK_UPLOAD, students);
      return response.data ?? response;
    },
    onSuccess: (data) => {
      console.log("Bulk upload result:", data);
      console.log("FAILED DETAILS:", JSON.stringify(data.failed, null, 2));
      alert(`✅ ${data.successCount} uploaded, ❌ ${data.failedCount} failed`);
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (error) => {
      console.error("Bulk upload failed:", error?.response?.data);
    },
  });
};


export default studentsApi;