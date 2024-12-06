import { HistoryTile } from './HistoryTile';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "@lib/jsx/jsx-runtime";
export var HistoryList = function HistoryList(_ref) {
  var historyList = _ref.historyList;
  if (historyList.length === 0) {
    return _jsx("h5", {
      className: "text-center text-secondary mt-6",
      children: "\uACBD\uAE30 \uAE30\uB85D\uC774 \uC5C6\uC2B5\uB2C8\uB2E4"
    });
  }
  return _jsxs(_Fragment, {
    children: [_jsx("div", {
      className: "text-center py-3",
      style: "padding-left:20px; padding-right:40px",
      children: _jsxs("div", {
        className: "d-flex",
        children: [_jsx("div", {
          className: "w-25 fs-5",
          children: "\uB9E4\uCE58 \uD0C0\uC785"
        }), _jsx("div", {
          className: "w-25 fs-5",
          children: "\uC77C\uC790"
        }), _jsx("div", {
          className: "w-25 fs-5",
          children: "\uC720\uC800"
        }), _jsx("div", {
          className: "w-25 fs-5",
          children: "\uC810\uC218"
        })]
      })
    }), _jsx("div", {
      className: "accordion",
      id: "HistoryList",
      children: historyList.map(function (history, key) {
        return _jsx(HistoryTile, {
          history: history,
          id: 'history' + key
        });
      })
    })]
  });
};