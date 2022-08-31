Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
require('prop-types');
require('warning');
require('react-swipeable-views-core');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var ReactSliderViews = function ReactSliderViews() {
  // States
  var _useState = React.useState(null),
      _useState2 = _slicedToArray(_useState, 2);
      _useState2[0];
      _useState2[1]; // const [containerNode, setContainerNode] = useState(null);
  // const [ignoreNextScrollEvents, setIgnoreNextScrollEvents] = useState(false);
  // const [viewLength, setViewLength] = useState(0);
  // const [startX, setStartX] = useState(0);
  // const [lastX, setLastX] = useState(0);
  // const [vx, setVx] = useState(0);
  // const [startY, setStartY] = useState(0);
  // const [isSwiping, setIsSwiping] = useState(undefined);
  // const [started, setStarted] = useState(false);
  // const [startIndex, setStartIndex] = useState(0);
  // const [transitionListener, setTransitionListener] = useState(false);
  // const [touchMoveListener, setTouchMoveListener] = useState(null);
  // const [activeSlide, setActiveSlide] = useState(null);
  // const [indexCurrent, setIndexCurrent] = useState(null);
  // const [firstRenderTimeout, setFirstRenderTimeout] = useState(null);
  // Context


  var SwipeableViewsContext = /*#__PURE__*/React.createContext();

  if (process.env.NODE_ENV !== "production") {
    SwipeableViewsContext.displayName = "SwipeableViewsContext";
  }

  return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, "Mi componente");
};

exports["default"] = ReactSliderViews;
//# sourceMappingURL=index.js.map
