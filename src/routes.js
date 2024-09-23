import Home from '@/pages/Home';
import Auth from '@/pages/Auth';
import Lobby from '@/pages/Lobby';

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
  },
];
