import { getRoomList } from '@/services/game';
import { getUserProfile } from '@/services/user';

export const lobbyLoader = async () => {
  const [roomList, userProfile] = await Promise.all([
    getRoomList(),
    getUserProfile(),
  ]);

  return { roomList, userProfile };
};
