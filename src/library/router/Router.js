import { virtualDOM } from '../dom/VirtualDOM.js';

class Router {
  constructor() {
    this.routes = null;
    this.path = null;
    this.loaderData = null;
    window.addEventListener('popstate', () => {
      virtualDOM.render(this.loadRoute());
    });
  }

  setRoutes(routes) {
    this.routes = routes;
    return this;
  }

  loadRoute() {
    this.path = window.location.pathname;
    const { element, loader } = this.matchRoute(this.routes);
    if (loader && typeof loader === 'function') {
      return loader().then((data) => {
        this.loaderData = data;
        return element;
      });
    }
    return Promise.resolve(element);
  }

  matchRoute($routes, parentPath = '/') {
    const routes = $routes.map((route) => ({
      ...route,
      absolutePath: getAbsolutePath(route, parentPath),
    }));

    const match = routes.find((route) => this.path === route.absolutePath);
    if (match && match.element) {
      return match;
    }

    const route = routes
      .filter((route) => this.path.startsWith(route.absolutePath))
      .reduce((match, route) =>
        match.absolutePath.length > route.absolutePath.length ? match : route,
      );
    return this.matchRoute(route.children, route.absolutePath);
  }

  navigate(path, options) {
    this.updateHistory(path, options);
    virtualDOM.render(this.loadRoute());
  }

  updateHistory(path, options) {
    if (options && options.replace) {
      return window.history.replaceState({}, '', path);
    }
    window.history.pushState({}, '', path);
  }
}

export const $router = new Router();

const getAbsolutePath = (route, parentPath) => {
  if (route.index) {
    return parentPath;
  }
  if (isAbsolutePath(route.path)) {
    return route.path;
  }
  const absolutePath = [parentPath];
  if (!parentPath.endsWith('/')) {
    absolutePath.push('/');
  }
  absolutePath.push(route.path);
  return absolutePath.join('');
};

const isAbsolutePath = (path) => path.startsWith('/');
