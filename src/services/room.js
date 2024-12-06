import { service } from './index.js';

export const getUserInfo = async () => {
  return service.get('/game/user-info').then((res) => res.data);
};

export const gameStart = async (roomId) => {
  return service.post('/game/start', { roomId });
};

export const connectRoom = (url, onerror, count = 0) => {
  const websocket = new WebSocket(url);
  websocket.onerror = () => {
    if (count < 3) {
      return setTimeout(() => connectRoom(url, onerror, count + 1), 1000);
    }
    onerror();
  };
  return websocket;
};
