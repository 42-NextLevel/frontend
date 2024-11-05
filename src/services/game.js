import { service } from './index';

export const getHistory = () => {
  return service.get('/game/history');
};

export const getRoomList = async () => {
  return service.get('/game/list').then((res) => {
    const roomList = res.data;
    const slicedRoomList = [];

    for (let i = 0; i < roomList.length; i += 4) {
      const chunk = roomList.slice(i, i + 4);
      slicedRoomList.push(chunk);
    }

    return slicedRoomList;
  });
};

export const postMakeRoom = async (data) => {
  return service.post('/game/new', data).then((res) => res.data);
};

export const postJoinRoom = async (data) => {
  return service.post('/game/join', data).then((res) => res.data);
};

export const getRoomInfo = () => {
  return service.get('/game/info');
};

export const postGameStart = () => {
  return service.get('/game/start');
};

export const getUserInfo = () => {
  return service.get('/game/user-info');
};

export const getPlayersInfo = (roomId) => {
  return service.post('/game/players', { roomId }).then((res) => res.data);
};

export const getGameHistory = () => {
  return service.get('/game/history').then((res) => res.data);
};
