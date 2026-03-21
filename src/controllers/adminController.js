import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ADMIN_PATHS } from "../constants/apiUrlConstant";
import api from "../services/api";

export const adminApi = {
  getAllAdmins: (params) =>
    api.get(ADMIN_PATHS.GET_ALL_ADMINS, { params }),

  deleteAdmin: (id) =>
    api.delete(ADMIN_PATHS.DELETE_ADMIN(id)),

  createAdmin: (data) =>
    api.post(ADMIN_PATHS.CREATE_ADMIN, data),

  getColleges: () =>
    api.get(ADMIN_PATHS.COLLEGES),
};



export function useGetAllAdmins(params = {}) {
 return useQuery({
  queryKey: ["admins", params],
  queryFn: () => adminApi.getAllAdmins(params).then(res => {
    console.log("Raw Axios response:", res);
    return res;
  }),
});
}


export function useCreateAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.createAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });
}

export function useGetColleges() {
  return useQuery({
    queryKey: ["colleges"],
    queryFn: () => adminApi.getColleges().then(res => res?.colleges ?? []),
  });
}


export function useDeleteAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.deleteAdmin,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });
}