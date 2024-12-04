// src/services/apiService.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.anthropic.com/v1/messages';
const API_KEY = process.env.REACT_APP_API_KEY;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  }
});

export const geometryAPI = {
  // Get all available questions
  getQuestions: async () => {
    try {
      const response = await apiClient.get('/questions');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch questions');
    }
  },

  // Get a specific question by ID
  getQuestionById: async (questionId) => {
    try {
      const response = await apiClient.get(`/questions/${questionId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch question');
    }
  },

  // Submit an answer for evaluation
  submitAnswer: async (questionId, answer) => {
    try {
      const response = await apiClient.post('/evaluate', {
        questionId,
        answer
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to evaluate answer');
    }
  },

  // Request a hint for a specific question
  getHint: async (questionId) => {
    try {
      const response = await apiClient.get(`/hints/${questionId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get hint');
    }
  },

  // Get step-by-step solution
  getSolution: async (questionId) => {
    try {
      const response = await apiClient.get(`/solutions/${questionId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get solution');
    }
  }
};