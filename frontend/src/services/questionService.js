// services/questionService.js
import api from "./api";

export const questionService = {
  getQuestions: async (formId) => {
    try {
      const response = await api.get(`/questions/form/${formId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createQuestion: async (questionData) => {
    try {
      const response = await api.post("/questions", questionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateQuestion: async (questionId, questionData) => {
    try {
      const response = await api.put(`/questions/${questionId}`, questionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteQuestion: async (questionId) => {
    try {
      const response = await api.delete(`/questions/${questionId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  reorderQuestions: async (formId, questionOrders) => {
    try {
      const response = await api.patch("/questions/reorder", {
        formId,
        questionOrders,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
