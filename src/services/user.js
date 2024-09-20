import { service } from './index.js';

export const getUserProfile = () => {
  return service.get('/user');
};
export const logout = () => {
  return service.delete('/user');
};
