import { useLoaderData } from '@/library/router/hooks.js';

import Button from '@/components/Button';
import Profile from '@/components/Profile';
import Badge from '@/components/Badge';

import { GAME_RULES } from './constants.js';

const GameRoom = () => {
  const { name, roomType, users } = useLoaderData();

  return (
    <div className='py-5 w-100 min-vh-100 d-flex flex-column align-items-center justify-content-center'>
      <Badge roomType={roomType} />
      <h1 className='mt-2'>{name}</h1>
      <ul className='d-flex flex-row py-5 mb-2'>
        {users.map((user) => (
          <li className='list-unstyled mx-2'>
            <Profile intraId={user.intraId} nickname={user.nickname} />
          </li>
        ))}
      </ul>
      <Button>게임 시작</Button>
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
