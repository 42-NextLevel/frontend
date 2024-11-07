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

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // 토큰 만료로 인한 403 에러 && 재시도하지 않은 요청
      if (error.response.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const response = await axios.post('/api/auth/token');

          const { accessToken: newToken } = response.data;

          localStorage.setItem('access_token', newToken);

          // 새로운 토큰으로 원래 요청 재시도
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axios(originalRequest);
        } catch (error) {
          localStorage.removeItem('access_token');
          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    },
  );

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
