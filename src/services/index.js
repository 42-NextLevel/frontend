import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URI,
  headers: {
    'Content-Type': 'application/json',
  },
});

const setAccessToken = () => {
  axiosInstance.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('access_token');
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  });

  return axiosInstance;
};

export const service = {
  post: async (url, data) => {
    return setAccessToken().post(url, data);
  },

  get: async (url) => {
    return setAccessToken().get(url);
  },

  put: async (url, data) => {
    return setAccessToken().put(url, data);
  },

  delete: async (url) => {
    return setAccessToken().delete(url);
  },
};
