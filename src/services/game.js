import { service } from './index';

export const getHistory = () => {
  return service.get('/history');
};

export const getRoomList = async () => {
  return service.get('/list').then((res) => res.data);
};

export const postMakeRoom = async (data) => {
  return service.post('/new', data).then((res) => res.data);
};

export const postJoinRoom = async (data) => {
  return service.post('/join', data).then((res) => res.data);
};

export const getRoomInfo = () => {
  return service.get('/info');
};

export const postGameStart = () => {
  return service.get('/start');
};

export const getUserInfo = () => {
  return service.get('/user-info');
};
