import { jsx as _jsx } from "@lib/jsx/jsx-runtime";
var Badge = function Badge(_ref) {
  var roomType = _ref.roomType;
  var individual = 0;
  var tournament = 1;
  if (roomType === individual) return _jsx("div", {
    className: "badge-lg green",
    children: "\uAC1C\uC778\uC804"
  });
  if (roomType === tournament) return _jsx("div", {
    className: "badge-lg blue",
    children: "\uD1A0\uB108\uBA3C\uD2B8"
  });
  return null;
};
export default Badge;