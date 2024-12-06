import { jsx as _jsx } from "@lib/jsx/jsx-runtime";
var Button = function Button(_ref) {
  var children = _ref.children,
    onClick = _ref.onClick,
    _ref$color = _ref.color,
    color = _ref$color === void 0 ? 'primary' : _ref$color,
    _ref$disabled = _ref.disabled,
    disabled = _ref$disabled === void 0 ? false : _ref$disabled,
    _ref$outline = _ref.outline,
    outline = _ref$outline === void 0 ? false : _ref$outline,
    _ref$noPadding = _ref.noPadding,
    noPadding = _ref$noPadding === void 0 ? false : _ref$noPadding;
  var styles = ['btn', 'btn-lg'];
  if (!noPadding) {
    styles.push('px-5');
  }
  var buttonStyle = ['btn-'];
  if (outline) {
    buttonStyle.push('outline-');
  }
  buttonStyle.push(color);
  styles.push(buttonStyle.join(''));
  var className = styles.join(' ');
  return _jsx("button", {
    type: "button",
    className: className,
    onClick: onClick,
    disabled: disabled,
    children: children
  });
};
export default Button;