import { service } from './index.js';

export const getUserProfile = () => {
  return service.get('/user').then((res) => res.data);
};
export const logout = () => {
  return service.delete('/user').then((res) => res);
};
