function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import { useLoaderData, useNavigate, useParams } from '@/library/router/hooks';
import { useEffect, useState } from '@/library/hooks';
import Button from '@/components/Button';
import Profile from '@/components/Profile';
import Badge from '@/components/Badge';
import Spinner from '@/components/Spinner';
import { connectRoom, gameStart } from '@/services/room.js';
import { GAME_RULES, TYPES } from '@/constants/game.js';
import { jsx as _jsx, jsxs as _jsxs } from "@lib/jsx/jsx-runtime";
var GameRoom = function GameRoom() {
  var _useParams = useParams(),
    roomId = _useParams.roomId;
  var _useLoaderData = useLoaderData(),
    intra_id = _useLoaderData.intra_id,
    nickname = _useLoaderData.nickname;
  var _useState = useState({
      name: '',
      roomType: NaN,
      host: '',
      players: []
    }),
    _useState2 = _slicedToArray(_useState, 2),
    room = _useState2[0],
    setRoom = _useState2[1];
  var navigate = useNavigate();
  useEffect(function () {
    if (!intra_id || !nickname) {
      alert('잘못된 접근입니다.');
      return navigate('/lobby', {
        replace: true
      });
    }
    var connectURI = "".concat(import.meta.env.VITE_ROOM_WEBSOCKET_URI, "/room/").concat(roomId, "?nickname=").concat(nickname, "&intraId=").concat(intra_id);
    var onerror = function onerror() {
      alert('방이 존재하지 않습니다.');
      navigate('/lobby', {
        replace: true
      });
    };
    var websocket = connectRoom(connectURI, onerror);
    websocket.onmessage = function (event) {
      var _JSON$parse = JSON.parse(event.data),
        type = _JSON$parse.type,
        data = _JSON$parse.data;
      switch (type) {
        case TYPES.roomUpdate:
          return setRoom(data);
        case TYPES.gameStart:
          return navigate("/game/".concat(roomId), {
            replace: true
          });
        case TYPES.error:
          {
            alert(data);
            return navigate('/lobby', {
              replace: true
            });
          }
      }
    };
    return function () {
      websocket.close();
    };
  }, []);
  var handleClick = function handleClick() {
    if (room.host !== nickname) {
      alert('방장만 게임을 시작할 수 있습니다.');
      return;
    }
    gameStart(roomId)["catch"](function () {
      alert('아직 게임을 시작할 수 없습니다.');
    });
  };
  if (!intra_id || !nickname) {
    return null;
  }
  if (!room.players.length) {
    return _jsx("div", {
      className: "wrap",
      children: _jsx(Spinner, {
        message: "\uC5F0\uACB0\uC911.."
      })
    });
  }
  return _jsxs("div", {
    className: "py-5 wrap",
    children: [_jsx(Badge, {
      roomType: room.roomType
    }), _jsx("h1", {
      className: "mt-2",
      children: room.name
    }), _jsx("ul", {
      className: "w-100 row py-5 mb-2 justify-content-center",
      children: room.players.map(function (user) {
        return _jsx("li", {
          className: "list-unstyled col-3",
          children: _jsx(Profile, {
            intraId: user.intraId,
            nickname: user.nickname,
            image: user.profileImage
          })
        });
      })
    }), _jsx(Button, {
      onClick: handleClick,
      disabled: room.host !== nickname,
      children: "\uAC8C\uC784 \uC2DC\uC791"
    }), _jsx("h4", {
      className: "mt-5",
      children: "\uD83C\uDFD3 \uAC8C\uC784 \uADDC\uCE59"
    }), _jsx("ul", {
      className: "d-flex flex-column align-items-center",
      children: GAME_RULES.map(function (rule) {
        return _jsx("li", {
          children: rule
        });
      })
    })]
  });
};
export default GameRoom;