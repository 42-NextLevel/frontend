function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import { PongGame } from '@/animations/PongGame.js';
import { useEffect, useState } from '@/library/hooks.js';
import { useLoaderData, useNavigate, useParams } from '@/library/router/hooks.js';
import Profile from '@/components/Profile';
import { jsx as _jsx, jsxs as _jsxs } from "@lib/jsx/jsx-runtime";
var Game = function Game() {
  var elementId = 'game';
  var _useLoaderData = useLoaderData(),
    matchType = _useLoaderData.matchType,
    intraId = _useLoaderData.intraId,
    players = _useLoaderData.players;
  var _useParams = useParams(),
    roomId = _useParams.roomId;
  var my = players.find(function (player) {
    return player.intraId === intraId;
  });
  var your = players.find(function (player) {
    return player.intraId !== intraId;
  });
  var _useState = useState({
      player1: 0,
      player2: 0
    }),
    _useState2 = _slicedToArray(_useState, 2),
    score = _useState2[0],
    setScore = _useState2[1];
  var navigate = useNavigate();
  var _useState3 = useState({
      player1: {
        image: '',
        intraId: ''
      },
      player2: {
        image: '',
        intraId: ''
      }
    }),
    _useState4 = _slicedToArray(_useState3, 2),
    game = _useState4[0],
    setGame = _useState4[1];
  var setProfile = function setProfile(playerNumber) {
    if (playerNumber === 'player1') {
      setGame({
        player1: _objectSpread(_objectSpread({}, my), {}, {
          image: my.profileImage
        }),
        player2: _objectSpread(_objectSpread({}, your), {}, {
          image: your.profileImage
        })
      });
      return;
    }
    setGame({
      player2: _objectSpread(_objectSpread({}, my), {}, {
        image: my.profileImage
      }),
      player1: _objectSpread(_objectSpread({}, your), {}, {
        image: your.profileImage
      })
    });
  };
  useEffect(function () {
    var pongGame = new PongGame({
      elementId: elementId,
      roomId: roomId,
      matchType: matchType,
      intraId: intraId,
      nickname: my.nickname,
      setScore: setScore,
      navigate: navigate,
      setProfile: setProfile
    });
    pongGame.animate();
    return function () {
      pongGame.dispose();
    };
  }, []);
  return _jsxs("div", {
    className: "bg-black",
    children: [_jsxs("div", {
      className: "position-absolute d-flex justify-content-between w-100 mt-4 px-4 game-info",
      children: [_jsx(Profile, _objectSpread({}, game.player1)), _jsx("h1", {
        className: "text-white",
        children: "".concat(score.player1, " : ").concat(score.player2)
      }), _jsx(Profile, _objectSpread({}, game.player2))]
    }), _jsx("div", {
      id: elementId
    })]
  });
};
export default Game;