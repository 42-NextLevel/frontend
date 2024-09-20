import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  },
});

export const service = {
  post: async (url, data) => {
    return axiosInstance.post(url, data);
  },

  get: async (url) => {
    return axiosInstance.get(url);
  },

  put: async (url, data) => {
    return axiosInstance.put(url, data);
  },

  delete: async (url) => {
    return axiosInstance.delete(url);
  },
};
