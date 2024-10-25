import { PongGame } from './PongGame.js';
import { useEffect } from '@/library/hooks.js';
import { useLoaderData, useParams } from '@/library/router/hooks.js';

const Game = () => {
  const elementId = 'game';
  const { matchType, intraId, players } = useLoaderData();
  const { roomId } = useParams();
  const { nickname } = players.find((player) => player.intraId === intraId);
  const connectionURI = `${import.meta.env.VITE_ROOM_WEBSOCKET_URI}/game/${roomId}-${matchType}?nickname=${nickname}`;

  useEffect(() => {
    const pongGame = new PongGame(elementId, connectionURI);
    pongGame.animate();

    return () => {
      pongGame.websocket.close();
    };
  }, []);

  return <div id={elementId} />;
};

export default Game;
