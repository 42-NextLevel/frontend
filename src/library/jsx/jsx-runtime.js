export const h = (type, props, ...children) =>
  jsx(type, { ...props, children });

export const jsx = (type, props) => {
  if (typeof type === 'function') {
    return type(props);
  }

  const children =
    props.children === undefined
      ? []
      : Array.isArray(props.children)
        ? props.children.flat(2).filter((child) => child)
        : [props.children];

  return { type, props, children };
};

export const jsxs = jsx;

export const Fragment = ({ children }) => children;
