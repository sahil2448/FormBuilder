// services/formService.js
import api from "./api";

export const formService = {
  getForms: async () => {
    try {
      const response = await api.get("/forms");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getFormById: async (formId) => {
    try {
      const response = await api.get(`/forms/${formId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  createForm: async (formData) => {
    try {
      const response = await api.post("/forms", formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateForm: async (formId, formData) => {
    try {
      const response = await api.put(`/forms/${formId}`, formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteForm: async (formId) => {
    try {
      const response = await api.delete(`/forms/${formId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  publishForm: async (formId) => {
    try {
      const response = await api.patch(`/forms/${formId}/publish`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  unpublishForm: async (formId) => {
    try {
      const res = await api.patch(`/forms/${formId}/unpublish`);
      return res.data;
    } catch (e) {
      throw e.response?.data || e.message;
    }
  },
};
