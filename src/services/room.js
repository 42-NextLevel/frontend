import { service } from './index.js';

export const getUserInfo = async () => {
  return service.get('/game/user-info').then((res) => res.data);
};

export const gameStart = async (roomId) => {
  return service.post('/game/start', { roomId });
};
