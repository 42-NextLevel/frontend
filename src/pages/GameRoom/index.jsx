import { useLoaderData, useNavigate, useParams } from '@/library/router/hooks';
import { useEffect, useState } from '@/library/hooks';

import Button from '@/components/Button';
import Profile from '@/components/Profile';
import Badge from '@/components/Badge';
import Spinner from '@/components/Spinner';

import { connectRoom, gameStart } from '@/services/room.js';

import { GAME_RULES, TYPES } from '@/constants/game.js';

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
    if (!intra_id || !nickname) {
      alert('잘못된 접근입니다.');
      return navigate('/lobby', { replace: true });
    }

    const connectURI = `${import.meta.env.VITE_ROOM_WEBSOCKET_URI}/room/${roomId}?nickname=${nickname}&intraId=${intra_id}`;
    const onerror = () => {
      alert('방이 존재하지 않습니다.');
      navigate('/lobby', { replace: true });
    };
    const websocket = connectRoom(connectURI, onerror);
    websocket.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);
      switch (type) {
        case TYPES.roomUpdate:
          return setRoom(data);
        case TYPES.gameStart:
          return navigate(`/game/${roomId}`, { replace: true });
        case TYPES.error: {
          alert(data);
          return navigate('/lobby', { replace: true });
        }
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

  if (!intra_id || !nickname) {
    return null;
  }

  if (!room.players.length) {
    return (
      <div className='wrap'>
        <Spinner message='연결중..' />
      </div>
    );
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
      <Button onClick={handleClick} disabled={room.host !== nickname}>
        게임 시작
      </Button>
      <h4 className='mt-5'>🏓 게임 규칙</h4>
      <ul className='d-flex flex-column align-items-center'>
        {GAME_RULES.map((rule) => (
          <li>{rule}</li>
        ))}
      </ul>
    </div>
  );
};

export default GameRoom;
