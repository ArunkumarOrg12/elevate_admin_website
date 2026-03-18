import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { ADMIN_PATHS, QUERY_KEYS } from '../constants/apiUrlConstant';

// ── Questions API ──────────────────────────────────────────────────────────────
const questionsApi = {
  getAll: (params) => api.get(ADMIN_PATHS.QUESTIONS, { params }),
  search: (params) => api.get(`${ADMIN_PATHS.QUESTIONS}/search`, { params }),
  getById: (id) => api.get(`${ADMIN_PATHS.QUESTIONS}/${id}`),
  create: (data) => api.post(ADMIN_PATHS.QUESTIONS, data),
  update: (id, data) => api.put(`${ADMIN_PATHS.QUESTIONS}/${id}`, data),
  remove: (id) => api.delete(`${ADMIN_PATHS.QUESTIONS}/${id}`),
  uploadQuestionImage: (id, formData) =>
    api.post(`${ADMIN_PATHS.QUESTIONS.replace('/questions', '')}/upload/${id}/question-image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  uploadOptionImages: (id, formData) =>
    api.post(`${ADMIN_PATHS.QUESTIONS.replace('/questions', '')}/upload/${id}/option-image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// ── Paper Sets API ─────────────────────────────────────────────────────────────
const paperSetsApi = {
  getAll: () => api.get(ADMIN_PATHS.PAPER_SETS),
  getQuestions: (setId) => api.get(`${ADMIN_PATHS.PAPER_SETS}/${setId}/questions`),
  addQuestion: (setId, data) => api.post(`${ADMIN_PATHS.PAPER_SETS}/${setId}/questions`, data),
  removeQuestion: (setId, qId) => api.delete(`${ADMIN_PATHS.PAPER_SETS}/${setId}/questions/${qId}`),
};

// ── Question Bank API ──────────────────────────────────────────────────────────
const bankApi = {
  getAll: (params) => api.get(ADMIN_PATHS.QUESTION_BANK, { params }),
  getStats: () => api.get(`${ADMIN_PATHS.QUESTION_BANK}/stats`),
  publish: (id) => api.post(`${ADMIN_PATHS.QUESTION_BANK}/publish/${id}`),
  unpublish: (id) => api.post(`${ADMIN_PATHS.QUESTION_BANK}/unpublish/${id}`),
};

// ── Cycles API ─────────────────────────────────────────────────────────────────
const cyclesApi = {
  getAll: () => api.get(ADMIN_PATHS.CYCLES),
  getById: (id) => api.get(`${ADMIN_PATHS.CYCLES}/${id}`),
  create: (data) => api.post(ADMIN_PATHS.CYCLES, data),
  changeStatus: (id, data) => api.patch(`${ADMIN_PATHS.CYCLES}/${id}/status`, data),
  publish: (id) => api.post(`${ADMIN_PATHS.CYCLES}/${id}/publish`),
  unpublish: (id) => api.post(`${ADMIN_PATHS.CYCLES}/${id}/unpublish`),
  getResults: (id) => api.get(`${ADMIN_PATHS.CYCLES}/${id}/results`),
  getLeaderboard: (id) => api.get(`${ADMIN_PATHS.CYCLES}/${id}/leaderboard`),
  getParticipants: (id) => api.get(`${ADMIN_PATHS.CYCLES}/${id}/participants`),
};

// ── Question Hooks ─────────────────────────────────────────────────────────────
export function useQuestions(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.QUESTIONS, params],
    queryFn: () => questionsApi.getAll(params),
  });
}

export function useQuestionSearch(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.QUESTIONS, 'search', params],
    queryFn: () => questionsApi.search(params),
    enabled: !!params?.q,
  });
}

export function useQuestion(id) {
  return useQuery({
    queryKey: [...QUERY_KEYS.QUESTIONS, id],
    queryFn: () => questionsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: questionsApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUESTIONS }),
  });
}

export function useUpdateQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => questionsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUESTIONS });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.QUESTIONS, id] });
    },
  });
}

export function useDeleteQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: questionsApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUESTIONS }),
  });
}

// ── Paper Set Hooks ────────────────────────────────────────────────────────────
export function usePaperSets() {
  return useQuery({
    queryKey: QUERY_KEYS.PAPER_SETS,
    queryFn: paperSetsApi.getAll,
  });
}

export function usePaperSetQuestions(setId) {
  return useQuery({
    queryKey: [...QUERY_KEYS.PAPER_SETS, setId, 'questions'],
    queryFn: () => paperSetsApi.getQuestions(setId),
    enabled: !!setId,
  });
}

export function useAddQuestionToPaperSet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ setId, ...data }) => paperSetsApi.addQuestion(setId, data),
    onSuccess: (_, { setId }) =>
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.PAPER_SETS, setId] }),
  });
}

export function useRemoveQuestionFromPaperSet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ setId, qId }) => paperSetsApi.removeQuestion(setId, qId),
    onSuccess: (_, { setId }) =>
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.PAPER_SETS, setId] }),
  });
}

// ── Question Bank Hooks ────────────────────────────────────────────────────────
export function useQuestionBank(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.QUESTION_BANK, params],
    queryFn: () => bankApi.getAll(params),
  });
}

export function useQuestionBankStats() {
  return useQuery({
    queryKey: [...QUERY_KEYS.QUESTION_BANK, 'stats'],
    queryFn: bankApi.getStats,
  });
}

export function usePublishBankQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bankApi.publish,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUESTION_BANK }),
  });
}

export function useUnpublishBankQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bankApi.unpublish,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUESTION_BANK }),
  });
}

// ── Cycle Hooks ────────────────────────────────────────────────────────────────
export function useCycles() {
  return useQuery({
    queryKey: QUERY_KEYS.CYCLES,
    queryFn: cyclesApi.getAll,
  });
}

export function useCycle(id, options = {}) {
  return useQuery({
    queryKey: [...QUERY_KEYS.CYCLES, id],
    queryFn: () => cyclesApi.getById(id),
    enabled: !!id,
    ...options,
  });
}

export function useCreateCycle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cyclesApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CYCLES }),
  });
}

export function useChangeCycleStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => cyclesApi.changeStatus(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CYCLES }),
  });
}

export function usePublishCycle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => cyclesApi.publish(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CYCLES }),
  });
}

export function useUnpublishCycle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => cyclesApi.unpublish(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CYCLES }),
  });
}

export function useCycleParticipants(id, options = {}) {
  return useQuery({
    queryKey: [...QUERY_KEYS.CYCLES, id, 'participants'],
    queryFn: () => cyclesApi.getParticipants(id),
    enabled: !!id,
    ...options,
  });
}

export function useCycleResults(id) {
  return useQuery({
    queryKey: [...QUERY_KEYS.CYCLES, id, 'results'],
    queryFn: () => cyclesApi.getResults(id),
    enabled: !!id,
  });
}

export function useCycleLeaderboard(id, options = {}) {
  return useQuery({
    queryKey: [...QUERY_KEYS.CYCLES, id, 'leaderboard'],
    queryFn: () => cyclesApi.getLeaderboard(id),
    enabled: !!id,
    ...options,
  });
}

export { questionsApi, paperSetsApi, bankApi, cyclesApi };
