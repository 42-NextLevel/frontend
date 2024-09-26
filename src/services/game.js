import { service } from './index';

export const getRoomList = async () => {
  return service.get('/list').then((res) => res.data);
};
