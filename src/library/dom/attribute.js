export const isEventAttribute = (attribute, value) =>
  attribute.startsWith('on') && typeof value === 'function';

export const setAttribute = (element, attr, value) => {
  if (isEventAttribute(attr, value)) {
    const event = attr.slice(2).toLowerCase();
    return element.addEventListener(event, value);
  }
  element.setAttribute(convertAttribute(attr), value);
};

const convertAttribute = (attribute) => {
  if (attribute === 'className') {
    return 'class';
  }
  if (attribute === 'htmlFor') {
    return 'for';
  }
  return attribute;
};
