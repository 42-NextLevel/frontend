import { jsx as _jsx } from "@lib/jsx/jsx-runtime";
var ModalTrigger = function ModalTrigger(_ref) {
  var children = _ref.children,
    id = _ref.id;
  return _jsx("span", {
    "data-bs-toggle": "modal",
    "data-bs-target": "#".concat(id),
    children: children
  });
};
export default ModalTrigger;