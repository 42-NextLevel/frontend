import Badge from '@/components/Badge/index';
import userIconFill from '/images/user_icon_fill.svg';
import { jsx as _jsx, jsxs as _jsxs } from "@lib/jsx/jsx-runtime";
var RoomTile = function RoomTile(_ref) {
  var roomType = _ref.roomType,
    name = _ref.name,
    people = _ref.people;
  return _jsxs("div", {
    className: "card",
    style: "cursor: pointer;",
    children: [_jsx(Badge, {
      roomType: roomType
    }), _jsx("h5", {
      className: "mt-2",
      children: name
    }), _jsxs("div", {
      className: "text-end",
      children: [_jsx("img", {
        src: userIconFill,
        alt: "user_icon_fill"
      }), people, " / ", roomType === 0 ? 2 : 4]
    })]
  });
};
export default RoomTile;