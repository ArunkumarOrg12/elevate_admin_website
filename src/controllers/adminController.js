import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ADMIN_PATHS } from "../constants/apiUrlConstant";
import api from "../services/api";

export const adminApi = {
  getAllAdmins: (params) => api.get(ADMIN_PATHS.GET_ALL_ADMINS, { params }),

  deleteAdmin: (id) => api.delete(ADMIN_PATHS.DELETE_ADMIN(id)),

  createAdmin: (data) => api.post(ADMIN_PATHS.CREATE_ADMIN, data),

  getColleges: () => api.get(ADMIN_PATHS.COLLEGES),
};

export function useGetAllAdmins(params = {}) {
  return useQuery({
    queryKey: ["admins", params],
    queryFn: () =>
      adminApi.getAllAdmins(params).then((res) => {
        console.log("Raw Axios response:", res);
        return res;
      }),
  });
}

export function useCreateAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.createAdmin,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      toast.success("Admin created successfully!", {
        description: `${data.email} has been added as an admin.`,
      });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create admin";
      const details =
        error?.response?.data?.error ||
        "Please check your input and try again.";
      toast.error(message, { description: details });
      console.error("Failed to create admin:", error);
    },
  });
}

export function useGetColleges() {
  return useQuery({
    queryKey: ["colleges"],
    queryFn: () => adminApi.getColleges().then((res) => res?.colleges ?? []),
  });
}

export function useDeleteAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.deleteAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      toast.success("Admin deleted successfully!", {
        description: "The admin account has been removed.",
      });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete admin";
      const details = error?.response?.data?.error || "Please try again.";
      toast.error(message, { description: details });
      console.error("Failed to delete admin:", error);
    },
  });
}
