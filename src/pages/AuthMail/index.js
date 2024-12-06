function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useState } from '@/library/hooks.js';
import { postEmail } from '@/services/auth.js';
import { jsx as _jsx, jsxs as _jsxs } from "@lib/jsx/jsx-runtime";
var AuthMail = function AuthMail(_ref) {
  var onSuccess = _ref.onSuccess;
  var _useState = useState(''),
    _useState2 = _slicedToArray(_useState, 2),
    email = _useState2[0],
    setEmail = _useState2[1];
  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    buttonDisabled = _useState4[0],
    setButtonDisabled = _useState4[1];
  var isValidEmail = validateEmail(email);
  var handldeClick = function handldeClick() {
    if (!email) {
      return alert('이메일을 입력해주세요');
    }
    if (!isValidEmail) {
      return alert('이메일을 형식에 맞게 입력해주세요');
    }
    postEmail(email).then(function () {
      setEmail('');
      setButtonDisabled(false);
      onSuccess();
    });
    setButtonDisabled(true);
  };
  return _jsxs("div", {
    className: "card top-50 start-50 translate-middle d-flex flex-column",
    style: "width: 540px;",
    children: [_jsx("h1", {
      children: "\uBA54\uC77C \uC778\uC99D"
    }), _jsx("p", {
      children: "\uC778\uC99D \uCF54\uB4DC\uB97C \uBC1B\uC744 \uC774\uBA54\uC77C\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694"
    }), _jsxs("div", {
      className: "my-4",
      children: [_jsx(Input, {
        placeholder: "\uC774\uBA54\uC77C\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694",
        type: "email",
        label: "Email",
        value: email,
        onChange: function onChange(e) {
          return setEmail(e.target.value);
        }
      }), !isValidEmail && _jsx("span", {
        className: "form-text text-danger",
        children: "\uC774\uBA54\uC77C \uD615\uC2DD\uC774 \uC62C\uBC14\uB974\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4"
      })]
    }), _jsx(Button, {
      onClick: handldeClick,
      disabled: buttonDisabled,
      children: "\uB2E4\uC74C"
    })]
  });
};
var validateEmail = function validateEmail(email) {
  return !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
export default AuthMail;