import { service } from './index.js';

export const getUserProfile = async () => {
  return service.get('/user').then((res) => res.data);
};
export const logout = () => {
  return service.delete('/user');
};
