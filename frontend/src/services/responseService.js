// services/responseService.js
import api from "./api";

export const responseService = {
  // Load public form by shareableLink
  getPublicForm: async (shareableLink) => {
    try {
      const res = await api.get(`/forms/public/${shareableLink}`);
      return res.data;
    } catch (e) {
      throw e.response?.data || e.message;
    }
  },

  // Submit responses
  submitResponses: async (shareableLink, payload) => {
    try {
      const res = await api.post(`/responses/submit/${shareableLink}`, payload);
      return res.data;
    } catch (e) {
      throw e.response?.data || e.message;
    }
  },
};
