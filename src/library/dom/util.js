export const isEventAttribute = (attribute, value) =>
  attribute.startsWith('on') && typeof value === 'function';

export const convertAttribute = (attribute) => {
  if (attribute === 'className') {
    return 'class';
  }
  if (attribute === 'htmlFor') {
    return 'for';
  }
  return attribute;
};
