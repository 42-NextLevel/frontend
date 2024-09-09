import { createElement } from './createElement.js';
import { convertAttribute, isEventAttribute } from './util.js';

export const updateElement = (parent, currentVNode, newVNode, index = 0) => {
  // 1. newNode만 있는 경우
  if (!isExist(currentVNode) && isExist(newVNode)) {
    return parent.appendChild(createElement(newVNode));
  }

  // 2. currentNode만 있는 경우
  const node = parent.childNodes[index];
  if (isExist(currentVNode) && !isExist(newVNode)) {
    return parent.removeChild(node);
  }

  // 3. currentNode와 newNode 모두 text 타입일 경우
  if (isTextNode(currentVNode) && isTextNode(newVNode)) {
    if (currentVNode === newVNode) {
      return;
    }
    return parent.replaceChild(createElement(newVNode), node);
  }

  // 4. currentNode와 newNode의 태그 이름(type)이 다를 경우
  if (currentVNode.type !== newVNode.type) {
    return parent.replaceChild(createElement(newVNode), node);
  }

  // 5. currentNode와 newNode의 태그 이름(type)이 같을 경우
  updateAttributes(node, newVNode.props ?? {}, currentVNode.props ?? {});

  // 6. newNode와 currentNode의 모든 자식 태그를 순회하며 1 ~ 5의 내용을 반복한다.
  updateElements(node, currentVNode.children, newVNode.children);
};

export const updateElements = (parent, currentVNodes, newVNodes) => {
  const maxLength = Math.max(currentVNodes.length, newVNodes.length);
  for (let i = 0; i < maxLength; i++) {
    updateElement(parent, currentVNodes[i], newVNodes[i], i);
  }
};

const updateAttributes = (target, newProps, oldProps) => {
  Object.entries(newProps).forEach(([attr, value]) => {
    if (oldProps[attr] === newProps[attr] || isEventAttribute(attr, value)) {
      return;
    }
    target.setAttribute(convertAttribute(attr), value);
  });

  for (const attr of Object.keys(oldProps)) {
    if (newProps[attr] === undefined) {
      target.removeAttribute(attr);
    }
  }
};

const isExist = (node) => {
  return node !== null && node !== undefined;
};

const isTextNode = (node) => {
  return typeof node === 'string' || typeof node === 'number';
};
