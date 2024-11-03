import { PongGame } from './PongGame.js';
import { useEffect, useState } from '@/library/hooks.js';
import {
  useLoaderData,
  useNavigate,
  useParams,
} from '@/library/router/hooks.js';

const Game = () => {
  const elementId = 'game';
  const { matchType, intraId, players } = useLoaderData();
  const { roomId } = useParams();
  const { nickname } = players.find((player) => player.intraId === intraId);
  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const pongGame = new PongGame(
      {
        elementId,
        roomId,
        matchType,
        intraId,
        nickname,
      },
      setScore,
      navigate,
    );
    pongGame.animate();

    return () => {
      pongGame.websocket.close();
    };
  }, []);

  return (
    <div>
      <div className='position-absolute d-flex justify-content-center w-100 mt-4'>
        <h1 className='text-white'>{`${score.player1} : ${score.player2}`}</h1>
      </div>
      <div id={elementId} />
    </div>
  );
};

export default Game;
