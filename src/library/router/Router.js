import { virtualDOM } from '../dom/VirtualDOM.js';

class Router {
  constructor() {
    this.routes = null;
    window.addEventListener('popstate', () => {
      virtualDOM.render(this.loadRoute());
    });
  }

  setRoutes(routes) {
    this.routes = routes;
    return this;
  }

  loadRoute() {
    const path = window.location.pathname;
    const { element } = this.routes.find((route) => route.path === path);
    return element;
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
