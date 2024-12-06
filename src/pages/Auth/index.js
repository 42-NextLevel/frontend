function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import { useNavigate, useSearchParams } from '@/library/router/hooks.js';
import { useEffect, useState } from '@/library/hooks.js';
import { post42Code } from '@/services/auth.js';
import PageNotFound from '@/pages/Error/404';
import AuthCode from '@/pages/AuthCode';
import AuthMail from '@/pages/AuthMail';
import Spinner from '@/components/Spinner';
import { jsx as _jsx } from "@lib/jsx/jsx-runtime";
var Auth = function Auth() {
  var searchParams = useSearchParams();
  var code = searchParams.get('code');
  if (!code) {
    return _jsx(PageNotFound, {});
  }
  var _useState = useState(0),
    _useState2 = _slicedToArray(_useState, 2),
    page = _useState2[0],
    setPage = _useState2[1];
  var navigate = useNavigate();
  var handleRedirect = function handleRedirect() {
    if (searchParams.get('error')) {
      return navigate('/', {
        replace: true
      });
    }
    post42Code(code).then(function (_ref) {
      var registered = _ref.registered;
      if (registered) {
        setPage(2);
        return;
      }
      setPage(1);
    })["catch"](function () {
      alert('잘못된 접근입니다.');
      navigate('/', {
        replace: true
      });
    });
  };
  useEffect(function () {
    handleRedirect();
  }, []);
  if (page === 1) {
    return _jsx(AuthMail, {
      onSuccess: function onSuccess() {
        return setPage(2);
      }
    });
  }
  if (page === 2) {
    return _jsx(AuthCode, {});
  }
  return _jsx("div", {
    className: "wrap",
    children: _jsx(Spinner, {
      message: "\uB85C\uADF8\uC778\uC911.."
    })
  });
};
export default Auth;