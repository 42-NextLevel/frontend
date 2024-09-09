import { $router } from './Router.js';

export const useNavigate = () => (path, options) => {
  $router.navigate(path, options);
};
