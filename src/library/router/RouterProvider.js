import { $router } from './Router.js';

export const RouterProvider = ({ routes }) => {
  return $router.setRoutes(routes).loadRoute();
};
