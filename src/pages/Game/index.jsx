import { PongGame } from './PongGame.js';
import { useEffect, useState } from '@/library/hooks.js';
import { useLoaderData, useParams } from '@/library/router/hooks.js';

const Game = () => {
  const elementId = 'game';
  const { matchType, intraId, players } = useLoaderData();
  const { roomId } = useParams();
  const { nickname } = players.find((player) => player.intraId === intraId);
  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const connectionURI = `${import.meta.env.VITE_ROOM_WEBSOCKET_URI}/game/${roomId}-${matchType}?nickname=${nickname}&intraId=${intraId}`;

  useEffect(() => {
    const pongGame = new PongGame(elementId, connectionURI, setScore);
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
