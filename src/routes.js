import Home from '@/pages/Home';
import Auth from '@/pages/Auth';
import Lobby from '@/pages/Lobby';
import GameRoom from '@/pages/GameRoom';
import Game from '@/pages/Game';
import Unauthorized from '@/pages/Error/401';
import PageNotFound from '@/pages/Error/404';

import { getUserInfo } from './services/room.js';
import { getPlayersInfo } from './services/game.js';
import { lobbyLoader } from '@/services/lobby.js';

export const routes = [
  {
    path: '/',
    element: Home,
  },
  {
    path: '/auth',
    element: Auth,
  },
  {
    path: '/lobby',
    element: Lobby,
    loader: lobbyLoader,
    errorElement: Unauthorized,
  },
  {
    path: '/room/:roomId',
    element: GameRoom,
    loader: getUserInfo,
  },
  {
    path: '/game/:roomId',
    element: Game,
    loader: ({ params }) => getPlayersInfo(params.roomId),
    errorElement: PageNotFound,
  },
  {
    path: '*',
    element: PageNotFound,
  },
];
