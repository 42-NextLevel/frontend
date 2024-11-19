import { service } from './index';

export const getContractHistory = (id) => {
  return service.get(`/contract/game/${id}`).then((res) => res.data);
};
