import { createElement } from './createElement.js';

class VirtualDOM {
  constructor() {
    this.root = null;
  }

  createRoot(root) {
    this.root = root;
    return this;
  }

  render(component) {
    this.root.innerHTML = '';
    this.root.appendChild(createElement(component));
  }
}

export const virtualDOM = new VirtualDOM();
