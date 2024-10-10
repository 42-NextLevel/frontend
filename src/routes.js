import Home from '@/pages/Home';
import Auth from '@/pages/Auth';
import AuthMail from '@/pages/AuthMail';
import AuthCode from '@/pages/AuthCode';
import GameRoom from '@/pages/GameRoom';

import { getUserInfo } from './services/room.js';

export const routes = [
  {
    path: '/',
    element: Home,
  },
  {
    path: '/auth',
    children: [
      {
        index: true,
        element: Auth,
      },
      {
        path: 'mail',
        element: AuthMail,
      },
      {
        path: 'code',
        element: AuthCode,
      },
    ],
  },
  {
    path: '/room/:roomId',
    element: GameRoom,
    loader: getUserInfo(),
  },
];
