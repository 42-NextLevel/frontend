function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useState } from '@/library/hooks';
import { useNavigate } from '@/library/router/hooks';
import { postCode } from '@/services/auth';
import { jsx as _jsx, jsxs as _jsxs } from "@lib/jsx/jsx-runtime";
var AuthCode = function AuthCode() {
  var _useState = useState(''),
    _useState2 = _slicedToArray(_useState, 2),
    code = _useState2[0],
    setCode = _useState2[1];
  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    buttonDisabled = _useState4[0],
    setButtonDisabled = _useState4[1];
  var isValidCode = validateCode(code);
  var navigate = useNavigate();
  var handldeClick = function handldeClick() {
    if (!code) {
      return alert('인증 코드를 입력해주세요');
    }
    if (!isValidCode) {
      return alert('인증 코드는 6자리 숫자로 입력해주세요');
    }
    postCode(code).then(function () {
      navigate('/lobby', {
        replace: true
      });
    })["catch"](function () {
      alert('인증 코드가 올바르지 않습니다');
      setButtonDisabled(false);
    });
    setButtonDisabled(true);
  };
  return _jsxs("div", {
    className: "card top-50 start-50 translate-middle d-flex flex-column",
    style: "width: 540px;",
    children: [_jsx("h1", {
      children: "\uC778\uC99D \uCF54\uB4DC \uC785\uB825"
    }), _jsx("p", {
      children: "\uC774\uBA54\uC77C\uB85C \uC804\uC1A1\uB41C 6\uC790\uB9AC \uC778\uC99D \uCF54\uB4DC\uB97C \uC785\uB825 \uD6C4 [\uC778\uC99D \uD65C\uC131\uD654] \uBC84\uD2BC\uC744 \uD074\uB9AD\uD574\uC8FC\uC138\uC694"
    }), _jsxs("div", {
      className: "my-4",
      children: [_jsx(Input, {
        placeholder: "\uC778\uC99D \uCF54\uB4DC\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694",
        type: "password",
        label: "Verification Code",
        onChange: function onChange(e) {
          return setCode(e.target.value);
        }
      }), !isValidCode && _jsx("span", {
        className: "form-text text-danger",
        children: "\uC778\uC99D \uCF54\uB4DC \uD615\uC2DD\uC774 \uC62C\uBC14\uB974\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4"
      })]
    }), _jsx(Button, {
      onClick: handldeClick,
      disabled: buttonDisabled,
      children: "\uC778\uC99D \uD65C\uC131\uD654"
    })]
  });
};
var validateCode = function validateCode(code) {
  return !code || /^[0-9]{6}$/.test(code);
};
export default AuthCode;