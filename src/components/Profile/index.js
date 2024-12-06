import defaultImg from '/images/42_logo.png';
import { jsx as _jsx, jsxs as _jsxs } from "@lib/jsx/jsx-runtime";
var Profile = function Profile(_ref) {
  var image = _ref.image,
    intraId = _ref.intraId,
    _ref$nickname = _ref.nickname,
    nickname = _ref$nickname === void 0 ? '' : _ref$nickname;
  return _jsxs("div", {
    className: "card ratio-1 d-flex flex-column text-center align-items-center justify-content-center bg-transparent",
    children: [_jsx("img", {
      src: image ? image : defaultImg,
      className: "object-fit-cover profile-image ratio-1 rounded-circle mt-2",
      alt: "profile_image"
    }), _jsxs("div", {
      className: "pt-3 pb-2",
      children: ["@", intraId]
    }), nickname && _jsx("h5", {
      children: nickname
    })]
  });
};
export default Profile;