import { useNavigate } from '@/library/router/hooks.js';
import { jsx as _jsx, jsxs as _jsxs } from "@lib/jsx/jsx-runtime";
var Error = function Error(_ref) {
  var code = _ref.code,
    title = _ref.title,
    message = _ref.message,
    buttonLabel = _ref.buttonLabel;
  var navigate = useNavigate();
  return _jsxs("div", {
    className: "wrap error-info",
    children: [_jsx("h1", {
      children: code
    }), _jsx("h2", {
      children: title
    }), _jsx("p", {
      className: "mb-4",
      children: message
    }), _jsx("button", {
      className: "btn btn-lg btn-dark px-5",
      type: "button",
      onClick: function onClick() {
        return navigate('/', {
          replace: true
        });
      },
      children: buttonLabel
    })]
  });
};
export default Error;