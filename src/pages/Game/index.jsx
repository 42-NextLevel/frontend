import { PongGame } from './PongGame.js';
import { useEffect, useState } from '@/library/hooks.js';
import {
  useLoaderData,
  useNavigate,
  useParams,
} from '@/library/router/hooks.js';
import Profile from '@/components/Profile';

const Game = () => {
  const elementId = 'game';
  const { matchType, intraId, players } = useLoaderData();
  const { roomId } = useParams();
  const my = players.find((player) => player.intraId === intraId);
  const your = players.find((player) => player.intraId !== intraId);
  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const navigate = useNavigate();
  const [game, setGame] = useState({
    player1: { image: '', intraId: '' },
    player2: { image: '', intraId: '' },
  });

  const setProfile = (playerNumber) => {
    if (playerNumber === 'player1') {
      setGame({
        player1: { ...my, image: my.profileImage },
        player2: { ...your, image: your.profileImage },
      });
      return;
    }
    setGame({
      player2: { ...my, image: my.profileImage },
      player1: { ...your, image: your.profileImage },
    });
  };

  useEffect(() => {
    const pongGame = new PongGame({
      elementId,
      roomId,
      matchType,
      intraId,
      nickname: my.nickname,
      setScore,
      navigate,
      setProfile,
    });
    pongGame.animate();

    return () => {
      pongGame.dispose();
    };
  }, []);

  return (
    <div className='bg-black'>
      <div className='position-absolute d-flex justify-content-between w-100 mt-4 px-4 game-info'>
        <Profile {...game.player1} />
        <h1 className='text-white'>{`${score.player1} : ${score.player2}`}</h1>
        <Profile {...game.player2} />
      </div>
      <div id={elementId} />
    </div>
  );
};

export default Game;
