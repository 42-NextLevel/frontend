import { useLoaderData, useNavigate, useParams } from '@/library/router/hooks';
import { useEffect, useState } from '@/library/hooks';

import Button from '@/components/Button';
import Profile from '@/components/Profile';
import Badge from '@/components/Badge';

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
      `${import.meta.env.VITE_ROOM_WEBSOCKET_URI}/room/${roomId}?nickname=${nickname}&intra_id=${intra_id}`,
    );
    websocket.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);
      switch (type) {
        case TYPES.roomUpdate:
          return setRoom(data);
        case TYPES.gameStart:
          return navigate(`/game/${roomId}`);
      }
    };

    return () => {
      websocket.close();
    };
  }, []);

  const handleClick = () => {
    gameStart(roomId).catch((err) => {
      alert('error');
    });
  };

  return (
    <div className='py-5 wrap min-vh-100 d-flex flex-column align-items-center justify-content-center'>
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
      <Button disabled={room.host === intra_id} onClick={handleClick}>
        게임 시작
      </Button>
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
