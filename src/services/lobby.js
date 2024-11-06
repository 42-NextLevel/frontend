import { getRoomList } from '@/services/game';
import { getUserProfile } from '@/services/user';
import { sliceRoomList } from '@/util/sliceRoomList';

export const lobbyLoader = async () => {
  const [roomList, userProfile] = await Promise.all([
    getRoomList(),
    getUserProfile(),
  ]);

  const slicedRoomList = sliceRoomList({ roomList });

  return { roomList: slicedRoomList, userProfile };
};
