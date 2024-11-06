import { createElement } from './createElement.js';
import { updateAttributes } from './attribute.js';

export const updateElement = (parent, currentVNode, newVNode, index = 0) => {
  // 1. newNode만 있는 경우 -> node 추가
  if (!isExist(currentVNode) && isExist(newVNode)) {
    parent.appendChild(createElement(newVNode));
    return;
  }

  // 2. newNode가 없는 경우 -> node 삭제
  if (!isExist(newVNode)) {
    return deleteElement(parent, currentVNode, index);
  }

  // 3. currentNode와 newNode 모두 text 타입일 경우
  const node = parent.childNodes[index];
  if (isTextNode(currentVNode) && isTextNode(newVNode)) {
    if (currentVNode === newVNode) {
      return;
    }
    parent.replaceChild(createElement(newVNode), node);
    return;
  }

  // 4. currentNode와 newNode의 태그 이름(type)이 다를 경우
  if (currentVNode.type !== newVNode.type) {
    if (node) {
      parent.replaceChild(createElement(newVNode), node);
      return;
    }
    parent.appendChild(createElement(newVNode));
    return;
  }

  // 5. currentNode와 newNode의 태그 이름(type)이 같을 경우
  updateAttributes(node, newVNode.props ?? {}, currentVNode.props ?? {});

  // 6. newNode와 currentNode의 모든 자식 태그를 순회하며 1 ~ 5의 내용을 반복한다.
  updateElements(node, currentVNode.children, newVNode.children);
};

const deleteElement = (parent, currentVNode, index) => {
  if (!isExist(currentVNode)) {
    return;
  }
  const node = parent.childNodes[index];
  parent.removeChild(node);
  return index;
};

export const updateElements = (parent, currentVNodes, newVNodes) => {
  const maxLength = Math.max(currentVNodes?.length, newVNodes?.length);
  let index = undefined;
  for (let i = 0; i < maxLength; i++) {
    index = updateElement(parent, currentVNodes[i], newVNodes[i], index ?? i);
  }
};

const isExist = (node) => {
  return node !== null && node !== undefined;
};

const isTextNode = (node) => {
  return typeof node === 'string' || typeof node === 'number';
};
