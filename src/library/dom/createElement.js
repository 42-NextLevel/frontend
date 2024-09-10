import { setAttribute } from './attribute.js';

export const createElement = (node) => {
  // null이나 undefined의 경우 fragment 생성
  if (node === null || node === undefined) {
    return document.createDocumentFragment();
  }

  // 기본형 타입의 경우 text노드를 생성
  if (typeof node === 'string' || typeof node === 'number') {
    return document.createTextNode(String(node));
  }

  // node.type 기반으로 실제 dom에 element생성
  const element = node.type
    ? document.createElement(node.type)
    : document.createDocumentFragment();

  // 정의한 속성을 삽입
  Object.entries(node.props || {})
    .filter(([attr, value]) => value)
    .forEach(([attr, value]) => {
      setAttribute(element, attr, value);
    });

  // 자식노드가 있는 경우 재귀호출
  node.children.forEach((child) => element.appendChild(createElement(child)));

  return element;
};
