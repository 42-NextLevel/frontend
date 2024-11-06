export const updateAttributes = (target, newProps, oldProps) => {
  Object.entries(oldProps).forEach(([attr, value]) => {
    if (isEventAttribute(attr, value)) {
      const event = attr.slice(2).toLowerCase();
      return target.removeEventListener(event, value);
    }
    if (newProps[attr] === undefined) {
      target.removeAttribute(convertAttribute(attr));
    }
  });

  Object.entries(newProps).forEach(([attr, value]) => {
    if (oldProps[attr] === newProps[attr]) {
      return;
    }
    setAttribute(target, attr, value);
  });
};

const isEventAttribute = (attribute, value) =>
  attribute.startsWith('on') && typeof value === 'function';

export const setAttribute = (element, attr, value) => {
  if (isEventAttribute(attr, value)) {
    const event = attr.slice(2).toLowerCase();
    return element.addEventListener(event, value);
  }
  element.setAttribute(convertAttribute(attr), value);
};

const convertAttribute = (attribute) => {
  switch (attribute) {
    case 'className':
      return 'class';
    case 'htmlFor':
      return 'for';
    default:
      return attribute;
  }
};
