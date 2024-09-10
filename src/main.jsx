import '@/styles/global.scss';
import { virtualDOM } from '@/library/dom/VirtualDOM.js';
import { RouterProvider } from '@/library/router/RouterProvider.js';
import { routes } from './routes.js';

virtualDOM
  .createRoot(document.getElementById('root'))
  .render(<RouterProvider routes={routes} />);
