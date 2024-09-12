import { virtualDOM } from './dom/VirtualDOM.js';

export const useState = (initial) => virtualDOM.useState(initial);

export const useEffect = (callback, deps) =>
  virtualDOM.useEffect(callback, deps);
