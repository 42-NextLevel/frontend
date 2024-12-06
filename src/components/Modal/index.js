import { jsx as _jsx, jsxs as _jsxs } from "@lib/jsx/jsx-runtime";
var Modal = function Modal(_ref) {
  var children = _ref.children,
    id = _ref.id,
    onClick = _ref.onClick,
    onClose = _ref.onClose,
    _ref$title = _ref.title,
    title = _ref$title === void 0 ? '제목을 넣어주세요' : _ref$title,
    _ref$btnText = _ref.btnText,
    btnText = _ref$btnText === void 0 ? '확인' : _ref$btnText;
  return _jsx("div", {
    "class": "modal fade modal-lg",
    id: id,
    tabindex: "-1",
    children: _jsx("div", {
      "class": "modal-dialog",
      children: _jsxs("div", {
        "class": "modal-content",
        children: [_jsxs("div", {
          "class": "modal-header",
          children: [_jsx("h1", {
            "class": "modal-title fs-5",
            children: title
          }), _jsx("button", {
            type: "button",
            "class": "btn-close",
            "data-bs-dismiss": "modal",
            onClick: onClose
          })]
        }), _jsx("div", {
          "class": "modal-body",
          children: children
        }), _jsxs("div", {
          "class": "modal-footer",
          children: [_jsx("button", {
            type: "button",
            "class": "btn btn-secondary",
            "data-bs-dismiss": "modal",
            onClick: onClose,
            children: "\uB2EB\uAE30"
          }), onClick && _jsx("button", {
            type: "button",
            "class": "btn btn-primary",
            "data-bs-dismiss": "modal",
            onClick: onClick,
            children: btnText
          })]
        })]
      })
    })
  });
};
export default Modal;