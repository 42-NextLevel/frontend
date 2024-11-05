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
    this.effects = {
      store: [],
      count: 0,
      deps: [],
      cleanUps: [],
    };
  }

  createRoot(root) {
    this.root = root;
    return this;
  }

  createDOM() {
    const newVDOM = this.VDOM.function();
    this.states.count = 0;
    this.effects.count = 0;
    return Array.isArray(newVDOM) ? newVDOM : [newVDOM];
  }

  async render(component) {
    if (component) {
      this.VDOM.function = await component;
      this.states.store = [];
      this.cleanUpEffects();
    }
    const newVDOM = this.createDOM();
    updateElements(this.root, this.VDOM.instance, newVDOM);
    this.VDOM.instance = newVDOM;
    this.runEffects();
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

  useEffect(callback, deps) {
    const index = this.effects.count++;
    this.effects.store[index] = () => {
      if (!deps || isDepsChanged(deps, this.effects.deps[index])) {
        const cleanUp = callback();
        if (typeof cleanUp === 'function') {
          this.effects.cleanUps[index] = cleanUp;
        }
        this.effects.deps[index] = deps;
      }
    };
  }

  runEffects() {
    this.effects.store.forEach((effect) => effect());
  }

  cleanUpEffects() {
    this.effects.store = [];
    this.effects.deps = [];
    this.effects.cleanUps.forEach((cleanUp) => cleanUp());
    this.effects.cleanUps = [];
  }
}

export const virtualDOM = new VirtualDOM();

const isDepsChanged = (newDeps, prevDeps) => {
  if (!prevDeps || newDeps.length !== prevDeps.length) {
    return true;
  }
  return newDeps.some((newDep, i) => newDep !== prevDeps[i]);
};
