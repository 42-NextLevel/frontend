function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import ModalTrigger from '@/components/ModalTrigger';
import RoomCard from '@/pages/Lobby/components/RoomCard';
import { jsx as _jsx } from "@lib/jsx/jsx-runtime";
var RoomList = function RoomList(_ref) {
  var slicedRoomList = _ref.slicedRoomList,
    page = _ref.page,
    onJoinRoom = _ref.onJoinRoom;
  if (slicedRoomList.length === 0) {
    return _jsx("h5", {
      className: "col-12 text-center align-self-center text-secondary",
      children: "\uBC29\uC774 \uC5C6\uC2B5\uB2C8\uB2E4"
    });
  }
  return slicedRoomList[page - 1].map(function (roomInfo, index) {
    return _jsx("div", {
      className: "col-6 px-0 pe-3 ".concat(index < 2 ? 'pb-3' : ''),
      onClick: function onClick() {
        return onJoinRoom(roomInfo);
      },
      children: _jsx(ModalTrigger, {
        id: "join",
        children: _jsx(RoomCard, _objectSpread({}, roomInfo))
      })
    }, roomInfo.id);
  });
};
export default RoomList;