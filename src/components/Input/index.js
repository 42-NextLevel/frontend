import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "@lib/jsx/jsx-runtime";
var Input = function Input(_ref) {
  var placeholder = _ref.placeholder,
    onChange = _ref.onChange,
    label = _ref.label,
    value = _ref.value,
    _ref$type = _ref.type,
    type = _ref$type === void 0 ? 'text' : _ref$type;
  return _jsxs(_Fragment, {
    children: [label && _jsx("label", {
      className: "form-label mt-3",
      htmlFor: label,
      children: label
    }), _jsx("input", {
      id: label,
      type: type,
      className: "form-control form-control-lg fs-6",
      placeholder: placeholder,
      onChange: onChange,
      value: value
    })]
  });
};
export default Input;