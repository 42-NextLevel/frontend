import { $router } from './Router.js';

export const useNavigate = () => (path, options) => {
  $router.navigate(path, options);
};

export const useSearchParams = () =>
  new URLSearchParams(window.location.search);

export const useLoaderData = () => $router.loaderData;
