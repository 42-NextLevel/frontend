import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URI}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const authService = {
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

export const post42Code = async (code) => {
  return authService.post('/42-code', { code }).then((res) => res.data);
};

export const postEmail = async (email) => {
  return authService.post('/email', { email });
};

export const postCode = async (code) => {
  return authService.post('/code', { code }).then((res) => {
    const { accessToken } = res.data;
    localStorage.setItem('access_token', accessToken);
  });
};

export const getNewToken = () => {
  return authService
    .post('/token')
    .then((res) => {
      const { accessToken } = res.data;
      localStorage.setItem('access_token', accessToken);
      return true;
    })
    .catch((e) => {
      localStorage.removeItem('access_token');
      return false;
    });
};
