import { virtualDOM } from '../dom/VirtualDOM.js';
import { matchRoute } from './util/matchRoute.js';

class Router {
  constructor() {
    this.routes = null;
    this.path = null;
    this.loaderData = null;
    this.params = null;
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
    const { element, loader, params } = matchRoute(this.routes, this.path);
    this.params = params;
    if (loader && typeof loader === 'function') {
      return loader().then((data) => {
        this.loaderData = data;
        return element;
      });
    }
    return Promise.resolve(element);
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
