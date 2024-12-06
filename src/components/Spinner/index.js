import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "@lib/jsx/jsx-runtime";
var Spinner = function Spinner(_ref) {
  var message = _ref.message;
  return _jsxs(_Fragment, {
    children: [_jsx("div", {
      className: "spinner-border",
      role: "status",
      children: _jsx("span", {
        className: "visually-hidden",
        children: "Loading..."
      })
    }), _jsx("div", {
      className: "mt-2",
      children: message
    })]
  });
};
export default Spinner;