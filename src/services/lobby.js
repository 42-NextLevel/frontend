import { getRoomList } from '@/services/game';
import { getUserProfile } from '@/services/user';
import { getGameHistory } from './game';

export const lobbyLoader = async () => {
  const [roomList, userProfile, gameHistory] = await Promise.all([
    getRoomList(),
    getUserProfile(),
    getGameHistory(),
  ]);

  return { roomList, userProfile, gameHistory };
};
