import { getRoomList } from '../../services/game';
import { getUserProfile } from '../../services/user';

export const lobbyLoader = async () => {
  const [roomList, userProfile] = await Promise.all([
    getRoomList(),
    getUserProfile(),
  ]);

  const slicedRoomList = [];
  for (let i = 0; i < roomList.length; i += 4) {
    const chunk = roomList.slice(i, i + 4);
    slicedRoomList.push(chunk);
  }

  return { roomList: slicedRoomList, userProfile };
};
