import { updateElements } from './updateElement.js';

class VirtualDOM {
  constructor() {
    this.root = null;
    this.VDOM = {
      instance: [],
      function: null,
    };
    this.states = {
      store: [],
      count: 0,
    };
  }

  createRoot(root) {
    this.root = root;
    return this;
  }

  createDOM() {
    const newVDOM = this.VDOM.function();
    this.states.count = 0;
    return newVDOM.length ? newVDOM : [newVDOM];
  }

  render(component) {
    if (component) {
      this.VDOM.function = component;
      this.states.store = [];
    }
    const newVDOM = this.createDOM();
    updateElements(this.root, this.VDOM.instance, newVDOM);
    this.VDOM.instance = newVDOM;
  }

  useState(initial) {
    const index = this.states.count++;
    if (this.states.store[index] === undefined) {
      this.states.store[index] = initial;
    }
    const state = this.states.store[index];

    const setState = (newState) => {
      if (typeof newState === 'function') {
        this.states.store[index] = newState(this.states.store[index]);
      } else {
        this.states.store[index] = newState;
      }
      this.render();
    };

    return [state, setState];
  }
}

export const virtualDOM = new VirtualDOM();
