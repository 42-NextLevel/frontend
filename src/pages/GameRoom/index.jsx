import { useLoaderData, useNavigate, useParams } from '@/library/router/hooks';
import { useEffect, useState } from '@/library/hooks';

import Button from '@/components/Button';
import Profile from '@/components/Profile';
import Badge from '@/components/Badge';

import { gameStart } from '@/services/room.js';

import { GAME_RULES, TYPES } from './constants.js';

const GameRoom = () => {
  const { roomId } = useParams();
  const { intra_id, nickname } = useLoaderData();
  const [room, setRoom] = useState({
    name: '',
    roomType: NaN,
    host: '',
    players: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    const websocket = new WebSocket(
      `${import.meta.env.VITE_ROOM_WEBSOCKET_URI}/room/${roomId}?nickname=${nickname}&intraId=${intra_id}`,
    );
    websocket.onerror = () => {
      alert('잘못된 접근입니다.');
      navigate('/lobby', { replace: true });
    };
    websocket.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);
      switch (type) {
        case TYPES.roomUpdate:
          return setRoom(data);
        case TYPES.gameStart:
          return navigate(`/game/${roomId}`, { replace: true });
      }
    };

    return () => {
      websocket.close();
    };
  }, []);

  const handleClick = () => {
    if (room.host !== nickname) {
      alert('방장만 게임을 시작할 수 있습니다.');
      return;
    }
    gameStart(roomId).catch(() => {
      alert('아직 게임을 시작할 수 없습니다.');
    });
  };

  if (!room.players.length) {
    return null;
  }

  return (
    <div className='py-5 wrap'>
      <Badge roomType={room.roomType} />
      <h1 className='mt-2'>{room.name}</h1>
      <ul className='w-100 row py-5 mb-2 justify-content-center'>
        {room.players.map((user) => (
          <li className='list-unstyled col-3'>
            <Profile
              intraId={user.intraId}
              nickname={user.nickname}
              image={user.profileImage}
            />
          </li>
        ))}
      </ul>
      <Button onClick={handleClick}>게임 시작</Button>
      <h5 className='mt-5'>🏓 게임 규칙</h5>
      <ul>
        {GAME_RULES.map((rule) => (
          <li>{rule}</li>
        ))}
      </ul>
    </div>
  );
};

export default GameRoom;
