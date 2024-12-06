import '@/styles/global.scss';
import { virtualDOM } from '@/library/dom/VirtualDOM.js';
import { RouterProvider } from '@/library/router/RouterProvider.js';
import { routes } from './routes.js';
import 'bootstrap';
import { jsx as _jsx } from "@lib/jsx/jsx-runtime";
virtualDOM.createRoot(document.getElementById('root')).render(_jsx(RouterProvider, {
  routes: routes
}));