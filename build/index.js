Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var PropTypes = require('prop-types');
var warning = require('warning');
var reactSwipeableViewsCore = require('react-swipeable-views-core');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var PropTypes__default = /*#__PURE__*/_interopDefaultLegacy(PropTypes);
var warning__default = /*#__PURE__*/_interopDefaultLegacy(warning);

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };
  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

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

/**
 * Add event listener
 *
 * @param {Node} node
 * @param {string} event
 * @param {EventListenerOrEventListenerObject} handler
 * @param {boolean|AddEventListenerOptions|undefined} options
 * @return {Function}
 */
var addEventListeners = function addEventListeners(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return {
    remove: function remove() {
      node.removeEventListener(event, handler, options);
    }
  };
};
/**
 * Create a css transition
 *
 * @param {string} property
 * @param {string} options
 * @returns {string}
 */


var createTransition = function createTransition(property, options) {
  var duration = options.duration,
      easeFunction = options.easeFunction,
      delay = options.delay;
  return "".concat(property, " ").concat(duration, " ").concat(easeFunction, " ").concat(delay);
};
/**
 * Apply rotation Matrix, we arew using 2x2
 *
 * @param {Touch} touch
 * @param {object} axis
 * @param {import("../properties/axisProperties")["axisProperties"]} axisProperties
 * @returns
 */


var applyRotationMatrix = function applyRotationMatrix(touch, axis, axisProperties) {
  var rotationMatrix = axisProperties.rotationMatrix[axis];
  return {
    pageX: rotationMatrix.x[0] * touch.pageX + rotationMatrix.x[1] * touch.pageY,
    pageY: rotationMatrix.y[0] * touch.pageX + rotationMatrix.y[1] * touch.pageY
  };
};
/**
 * Adapt mouse event
 *
 * @param {Event} event
 * @returns
 */


var adaptMouse = function adaptMouse(event) {
  event.touches = [{
    pageX: event.pageX,
    pageY: event.pageY
  }];
  return event;
};
/**
 * Get the dom tree shapes
 *
 * @param {HTMLElement} element
 * @param {HTMLElement} rootNode
 * @returns {Array<{ element: HTMLElement, scrollWidth: number, scrollHeight: number, clientWidth: number, clientHeight: number, scrollLeft: number, scrollTop: number }>}
 */


var getDomTreeShapes = function getDomTreeShapes(element, rootNode) {
  var domTreeShapes = [];

  while (element && element !== rootNode && element !== document.body) {
    // We reach a Swipeable View, no need to look higher in the dom tree.
    if (element.hasAttribute("data-swipeable")) {
      break;
    }

    var style = window.getComputedStyle(element);

    if ( // Ignore the scroll children if the element is absolute positioned.
    style.getPropertyValue("position") === "absolute" || // Ignore the scroll children if the element has an overflowX hidden
    style.getPropertyValue("overflow-x") === "hidden") {
      domTreeShapes = [];
    } else if (element.clientWidth > 0 && element.scrollWidth > element.clientWidth || element.clientHeight > 0 && element.scrollHeight > element.clientHeight) {
      // Ignore the nodes that have no width.
      // Keep elements with a scroll
      domTreeShapes.push({
        element: element,
        scrollWidth: element.scrollWidth,
        scrollHeight: element.scrollHeight,
        clientWidth: element.clientWidth,
        clientHeight: element.clientHeight,
        scrollLeft: element.scrollLeft,
        scrollTop: element.scrollTop
      });
    }

    element = element.parentNode;
  }

  return domTreeShapes;
};
/**
 * Find native handler
 *
 * @param {object} params
 * @returns {any}
 */


var findNativeHandler = function findNativeHandler(params) {
  var domTreeShapes = params.domTreeShapes,
      pageX = params.pageX,
      startX = params.startX,
      axis = params.axis;
  return domTreeShapes.some(function (shape) {
    // Determine if we are going backward or forward.
    var goingForward = pageX >= startX;

    if (axis === "x" || axis === "y") {
      goingForward = !goingForward;
    } // scrollTop is not always be an integer.
    // https://github.com/jquery/api.jquery.com/issues/608


    var scrollPosition = Math.round(shape[axisProperties.scrollPosition[axis]]);
    var areNotAtStart = scrollPosition > 0;
    var areNotAtEnd = scrollPosition + shape[axisProperties.clientLength[axis]] < shape[axisProperties.scrollLength[axis]];

    if (goingForward && areNotAtEnd || !goingForward && areNotAtStart) {
      nodeWhoClaimedTheScroll = shape.element;
      return true;
    }

    return false;
  });
};

var styles = {
  container: {
    direction: "ltr",
    display: "flex",
    willChange: "transform"
  },
  slide: {
    width: "100%",
    WebkitFlexShrink: 0,
    flexShrink: 0,
    overflow: "auto"
  }
};

var axisProperties$1 = {
  root: {
    x: {
      overflowX: "hidden"
    },
    "x-reverse": {
      overflowX: "hidden"
    },
    y: {
      overflowY: "hidden"
    },
    "y-reverse": {
      overflowY: "hidden"
    }
  },
  flexDirection: {
    x: "row",
    "x-reverse": "row-reverse",
    y: "column",
    "y-reverse": "column-reverse"
  },
  transform: {
    x: function x(translate) {
      return "translate(".concat(-translate, "%, 0)");
    },
    "x-reverse": function xReverse(translate) {
      return "translate(".concat(translate, "%, 0)");
    },
    y: function y(translate) {
      return "translate(0, ".concat(-translate, "%)");
    },
    "y-reverse": function yReverse(translate) {
      return "translate(0, ".concat(translate, "%)");
    }
  },
  length: {
    x: "width",
    "x-reverse": "width",
    y: "height",
    "y-reverse": "height"
  },
  rotationMatrix: {
    x: {
      x: [1, 0],
      y: [0, 1]
    },
    "x-reverse": {
      x: [-1, 0],
      y: [0, 1]
    },
    y: {
      x: [0, 1],
      y: [1, 0]
    },
    "y-reverse": {
      x: [0, -1],
      y: [1, 0]
    }
  },
  scrollPosition: {
    x: "scrollLeft",
    "x-reverse": "scrollLeft",
    y: "scrollTop",
    "y-reverse": "scrollTop"
  },
  scrollLength: {
    x: "scrollWidth",
    "x-reverse": "scrollWidth",
    y: "scrollHeight",
    "y-reverse": "scrollHeight"
  },
  clientLength: {
    x: "clientWidth",
    "x-reverse": "clientWidth",
    y: "clientHeight",
    "y-reverse": "clientHeight"
  }
};

/** @type {{activeSlide: HTMLElement, containerNode: HTMLElement, firstRenderTimeout: Function, isSwiping: any, ignoreNextScrollEvents: boolean, indexCurrent: any, startX: number, startY: number, lastX: number, olderProps: object, rootNode: HTMLElement, startIndex: number, started: boolean, transitionListener: Function, touchMoveListener: Function, viewLength: number, vx: number}} */
var sliderProperties = {
  activeSlide: null,
  containerNode: null,
  firstRenderTimeout: null,
  ignoreNextScrollEvents: false,
  indexCurrent: null,
  isSwiping: undefined,
  lastX: 0,
  olderProps: null,
  rootNode: null,
  started: false,
  startIndex: 0,
  startX: 0,
  startY: 0,
  touchMoveListener: null,
  transitionListener: null,
  viewLength: 0,
  vx: 0
};

var _excluded = ["action", "animateHeight", "animateTransitions", "axis", "children", "containerStyle", "disabled", "disableLazyLoading", "enableMouseEvents", "hysteresis", "ignoreNativeScroll", "index", "onChangeIndex", "onSwitching", "onMouseDown", "onMouseLeave", "onMouseMove", "onMouseUp", "onScroll", "onTouchEnd", "onTouchStart", "onTransitionEnd", "resistance", "style", "slideStyle", "springConfig", "slideClassName", "threshold"];
// Otherwise, the UX would be confusing.
// That's why we use a singleton here.

var nodeWhoClaimedTheScroll$1 = null; // First render

var isFirstRender = true;

var ReactSliderViews = function ReactSliderViews(props) {
  // Destructuring props
  var action = props.action,
      _props$animateHeight = props.animateHeight,
      animateHeight = _props$animateHeight === void 0 ? false : _props$animateHeight,
      _props$animateTransit = props.animateTransitions,
      animateTransitions = _props$animateTransit === void 0 ? true : _props$animateTransit,
      _props$axis = props.axis,
      axis = _props$axis === void 0 ? "x" : _props$axis,
      children = props.children,
      containerStyleProp = props.containerStyle,
      _props$disabled = props.disabled,
      disabled = _props$disabled === void 0 ? false : _props$disabled,
      _props$disableLazyLoa = props.disableLazyLoading,
      disableLazyLoading = _props$disableLazyLoa === void 0 ? false : _props$disableLazyLoa,
      _props$enableMouseEve = props.enableMouseEvents,
      enableMouseEvents = _props$enableMouseEve === void 0 ? false : _props$enableMouseEve,
      _props$hysteresis = props.hysteresis,
      hysteresis = _props$hysteresis === void 0 ? 0.6 : _props$hysteresis,
      _props$ignoreNativeSc = props.ignoreNativeScroll,
      ignoreNativeScroll = _props$ignoreNativeSc === void 0 ? false : _props$ignoreNativeSc,
      _props$index = props.index,
      index = _props$index === void 0 ? 0 : _props$index,
      onChangeIndex = props.onChangeIndex,
      onSwitching = props.onSwitching,
      onMouseDown = props.onMouseDown,
      onMouseLeave = props.onMouseLeave,
      onMouseMove = props.onMouseMove,
      onMouseUp = props.onMouseUp,
      onScroll = props.onScroll,
      onTouchEnd = props.onTouchEnd,
      onTouchStart = props.onTouchStart,
      onTransitionEnd = props.onTransitionEnd,
      _props$resistance = props.resistance,
      resistance = _props$resistance === void 0 ? false : _props$resistance,
      style = props.style,
      slideStyleProp = props.slideStyle,
      _props$springConfig = props.springConfig,
      springConfig = _props$springConfig === void 0 ? {
    duration: "0.35s",
    easeFunction: "cubic-bezier(0.15, 0.3, 0.25, 1)",
    delay: "0s"
  } : _props$springConfig,
      slideClassName = props.slideClassName,
      _props$threshold = props.threshold,
      threshold = _props$threshold === void 0 ? 5 : _props$threshold,
      other = _objectWithoutProperties(props, _excluded); // States


  var _useState = React.useState(index),
      _useState2 = _slicedToArray(_useState, 2),
      indexLatest = _useState2[0],
      setIndexLatest = _useState2[1];

  var _useState3 = React.useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      isDragging = _useState4[0],
      setIsDragging = _useState4[1];

  var _useState5 = React.useState(!disableLazyLoading),
      _useState6 = _slicedToArray(_useState5, 2),
      renderOnlyActive = _useState6[0],
      setRenderOnlyActive = _useState6[1];

  var _useState7 = React.useState(0),
      _useState8 = _slicedToArray(_useState7, 2),
      heightLatest = _useState8[0],
      setHeightLatest = _useState8[1];

  var _useState9 = React.useState(true),
      _useState10 = _slicedToArray(_useState9, 2),
      displaySameSlide = _useState10[0],
      setDisplaySameSlide = _useState10[1]; // Context


  var SwipeableViewsContext = /*#__PURE__*/React.createContext();

  if (process.env.NODE_ENV !== "production") {
    SwipeableViewsContext.displayName = "SwipeableViewsContext";
  }
  /**
   * Set index current
   */


  var setIndexCurrent = function setIndexCurrent(indexCurrent) {
    if (!animateTransitions && sliderProperties.indexCurrent !== indexCurrent) {
      handleTransitionEnd();
    }

    console.log("setIndexCurrent", indexCurrent);
    sliderProperties.indexCurrent = indexCurrent;

    if (sliderProperties.containerNode) {
      var transform = axisProperties$1.transform[axis](indexCurrent * 100);
      sliderProperties.containerNode.style.WebkitTransform = transform;
      sliderProperties.containerNode.style.transform = transform;
    }
  };
  /**
   * Behaivor similar to componentWillReceiveProps
   */


  var componentWillReceiveProps = function componentWillReceiveProps() {
    var aic = sliderProperties.indexCurrent !== null ? parseInt(sliderProperties.indexCurrent.toString()) : null;
    console.log("componentWillReceiveProps", index, sliderProperties.indexCurrent);

    if (typeof index === "number" && index !== aic && sliderProperties.olderProps) {
      console.log("Update componentWillReceiveProps");
      setDisplaySameSlide(reactSwipeableViewsCore.getDisplaySameSlide(sliderProperties.olderProps, props));
      setIndexLatest(index);
      setIndexCurrent(index);
    }

    sliderProperties.olderProps = props;
  }; // Constructor behaivor


  if (isFirstRender) {
    isFirstRender = false;
    setIndexCurrent(index);
  } // Call to componentWillReceiveProps


  componentWillReceiveProps(); // Effects called on first render only for manage componentWillUnmount

  React.useEffect(function () {
    // componentWillUnmount in functional component is a return in useEffect
    return function () {
      sliderProperties.transitionListener.remove();
      sliderProperties.touchMoveListener.remove();
      clearTimeout(sliderProperties.firstRenderTimeout);
    };
  }, []); // Effects called each render similar to componentDidMount and componentDidUpdate

  React.useEffect(function () {
    sliderProperties.transitionListener = addEventListeners(sliderProperties.containerNode, "transitionend", function (event) {
      if (event.target !== sliderProperties.containerNode) {
        return;
      }

      handleTransitionEnd();
    });
    sliderProperties.touchMoveListener = addEventListeners(sliderProperties.rootNode, "touchmove", function (event) {
      if (disabled) {
        return;
      }

      handleSwipeMove(event);
    }, {
      passive: false
    });

    if (disableLazyLoading) {
      sliderProperties.firstRenderTimeout = setTimeout(function () {
        setRenderOnlyActive(false);
      }, 0);
    }

    if (action) {
      action({
        updateHeight: updateHeight
      });
    }
  }); // Effects called when indexLatest updated

  var didMountIl = React.useRef(false);
  React.useEffect(function () {
    if (!didMountIl.current) {
      didMountIl.current = true;
      return;
    }

    console.log("Cambia indexLatest", indexLatest);

    if (onSwitching) {
      onSwitching(indexLatest, "end");
    }

    if (onChangeIndex) {
      onChangeIndex(indexLatestm, {
        reason: "swipe"
      });
    }

    if (sliderProperties.indexCurrent === indexLatest) {
      handleTransitionEnd();
    }
  }, [indexLatest]); // Effect called when displaySameSlide updated

  var didMountSS = React.useRef(false);
  React.useEffect(function () {
    if (!didMountSS.current) {
      didMountSS.current = true;
      return;
    }

    if (onSwitching) {
      onSwitching(sliderProperties.indexCurrent, "move");
    }
  }, [displaySameSlide]);
  /**
   * Get swipeable views context
   */

  var getSwipeableViewsContext = function getSwipeableViewsContext() {
    return {
      slideUpdateHeight: function slideUpdateHeight() {
        updateHeight();
      }
    };
  };
  /**
   * Handle mouse down event
   *
   * @param {Event} event
   */


  var handleMouseDown = function handleMouseDown(event) {
    if (onMouseDown) {
      onMouseDown(event);
    }

    event.persist();
    handleSwipeStart(adaptMouse(event));
  };
  /**
   * Handle mouse leave event
   *
   * @param {Event} event
   */


  var handleMouseLeave = function handleMouseLeave(event) {
    if (onMouseLeave) {
      onMouseLeave(event);
    }

    if (sliderProperties.started) {
      handleSwipeEnd(adaptMouse(event));
    }
  };
  /**
   * Handle mouse move event
   *
   * @param {Event} event
   */


  var handleMouseMove = function handleMouseMove(event) {
    if (onMouseMove) {
      onMouseMove(event);
    }

    if (sliderProperties.started) {
      handleSwipeMove(adaptMouse(event));
    }
  };
  /**
   * Handle mouse up event
   *
   * @param {Event} event
   */


  var handleMouseUp = function handleMouseUp(event) {
    if (onMouseUp) {
      onMouseUp(event);
    }

    handleSwipeEnd(adaptMouse(event));
  };
  /**
   * Handle scroll event
   *
   * @param {Event} event
   */


  var handleScroll = function handleScroll(event) {
    if (onScroll) {
      onScroll(event);
    }

    if (event.target !== sliderProperties.rootNode) {
      return;
    }

    if (sliderProperties.ignoreNextScrollEvents) {
      sliderProperties.ignoreNextScrollEvents = false;
      return;
    }

    var indexNew = Math.ceil(event.target.scrollLeft / event.target.clientWidth) + indexLatest;
    sliderProperties.ignoreNextScrollEvents = true;
    event.target.scrollLeft = 0;

    if (onChangeIndex && indexNew !== indexLatest) {
      onChangeIndex(indexNew, indexLatest, {
        reason: "focus"
      });
    }
  };
  /**
   * Handle the swipe start
   *
   * @param {Event} event
   */


  var handleSwipeStart = function handleSwipeStart(event) {
    var touch = applyRotationMatrix(event.touches[0], axis);
    sliderProperties.viewLength = sliderProperties.rootNode.getBoundingClientRect()[axisProperties$1.length[axis]];
    sliderProperties.startX = touch.pageX;
    sliderProperties.lastX = touch.pageX;
    sliderProperties.vx = 0;
    sliderProperties.startY = touch.pageY;
    sliderProperties.isSwiping = undefined;
    sliderProperties.started = true;
    var computedStyle = window.getComputedStyle(sliderProperties.containerNode);
    var transform = computedStyle.getPropertyValue("-webkit-transform") || computedStyle.getPropertyValue("transform");

    if (transform && transform !== "none") {
      var transformValues = transform.split("(")[1].split(")")[0].split(",");
      var rootStyle = window.getComputedStyle(sliderProperties.rootNode);
      var transformNormalized = applyRotationMatrix({
        pageX: parseInt(transformValues[4], 10),
        pageY: parseInt(transformValues[5], 10)
      }, axis);
      sliderProperties.startIndex = -transformNormalized.pageX / (sliderProperties.viewLength - parseInt(rootStyle.paddingLeft, 10) - parseInt(rootStyle.paddingRight, 10)) || 0;
    }
  };
  /**
   * Handle the swipe move
   *
   * @param {Event} event
   */


  var handleSwipeMove = function handleSwipeMove(event) {
    if (!sliderProperties.started) {
      handleTouchStart(event);
      return;
    }

    if (nodeWhoClaimedTheScroll$1 !== null && nodeWhoClaimedTheScroll$1 !== sliderProperties.rootNode) {
      return;
    }

    var touch = applyRotationMatrix(event.touches[0], axis);

    if (sliderProperties.isSwiping === undefined) {
      var dx = Math.abs(touch.pageX - sliderProperties.startX);
      var dy = Math.abs(touch.pageY - sliderProperties.startY);
      var isSwiping = dx > dy && dx > reactSwipeableViewsCore.constant.UNCERTAINTY_THRESHOLD;

      if (resistance && (axis === "y" || axis === "y-reverse") && (sliderProperties.indexCurrent === 0 && sliderProperties.startX < touch.pageX || sliderProperties.indexCurrent === React__default["default"].Children.count(children) - 1 && sliderProperties.startX > touch.pageX)) {
        sliderProperties.isSwiping = false;
        return;
      }

      if (dx > dy) {
        event.preventDefault();
      }

      if (isSwiping === true || dy > reactSwipeableViewsCore.constant.UNCERTAINTY_THRESHOLD) {
        sliderProperties.isSwiping = isSwiping;
        sliderProperties.startX = touch.pageX;
        return;
      }
    }

    if (sliderProperties.isSwiping !== true) {
      return;
    }

    event.preventDefault();
    sliderProperties.vx = sliderProperties.vx * 0.5 + (touch.pageX - sliderProperties.lastX) * 0.5;
    sliderProperties.lastX = touch.pageX;

    var _computeIndex = reactSwipeableViewsCore.computeIndex({
      children: children,
      resistance: resistance,
      pageX: touch.pageX,
      startIndex: sliderProperties.startIndex,
      startX: sliderProperties.startX,
      viewLength: sliderProperties.viewLength
    }),
        index = _computeIndex.index,
        startX = _computeIndex.startX;

    if (nodeWhoClaimedTheScroll$1 === null && !ignoreNativeScroll) {
      var domTreeShapes = getDomTreeShapes(event.target, sliderProperties.rootNode);
      var hasFoundNativeHandler = findNativeHandler({
        domTreeShapes: domTreeShapes,
        startX: sliderProperties.startX,
        pageX: touch.pageX,
        axis: axis
      });

      if (hasFoundNativeHandler) {
        return;
      }
    }

    if (startX) {
      sliderProperties.startX = startX;
    }

    setIndexCurrent(index);

    var callback = function callback() {
      if (onSwitching) {
        onSwitching(index, "move");
      }
    };

    if (displaySameSlide || isDragging) {
      setDisplaySameSlide(false);
      isDragging(true);
    }

    callback();
  };
  /**
   * Handle the swipe end
   *
   * @param {Event} event
   */


  var handleSwipeEnd = function handleSwipeEnd(event) {
    nodeWhoClaimedTheScroll$1 = null;

    if (!sliderProperties.started) {
      return;
    }

    sliderProperties.started = false;

    if (sliderProperties.isSwiping !== true) {
      return;
    }

    var indexCurrent = sliderProperties.indexCurrent;
    var delta = indexLatest - indexCurrent;
    var indexNew;

    if (Math.abs(sliderProperties.vx) > threshold) {
      if (sliderProperties.vx > 0) {
        indexNew = Math.floor(indexCurrent);
      } else {
        indexNew = Math.ceil(indexCurrent);
      }
    } else if (Math.abs(delta) > hysteresis) {
      indexNew = delta > 0 ? Math.floor(indexCurrent) : Math.ceil(indexCurrent);
    } else {
      indexNew = indexLatest;
    }

    var indexMax = React__default["default"].Children.count(children) - 1;
    indexNew = indexNew < 0 ? 0 : indexMax;
    setIndexCurrent(indexNew);
    setIndexLatest(indexNew);
    setIsDragging(false);
  };
  /**
   * Handle touch start
   *
   * @param {Event} event
   */


  var handleTouchStart = function handleTouchStart(event) {
    if (onTouchStart) {
      onTouchStart(event);
    }

    handleSwipeStart(event);
  };
  /**
   * Handle touch end
   *
   * @param {Event} event
   */


  var handleTouchEnd = function handleTouchEnd(event) {
    if (onTouchEnd) {
      onTouchEnd(event);
    }

    handleSwipeEnd();
  };
  /**
   * Call onTransitionEnd listener
   */


  var handleTransitionEnd = function handleTransitionEnd() {
    if (!onTransitionEnd || displaySameSlide) {
      return;
    }

    if (isDragging) {
      onTransitionEnd();
    }
  };
  /**
   * Set active slide
   */


  var setActiveSlide = function setActiveSlide(node) {
    sliderProperties.activeSlide = node;
    updateHeight();
  };
  /**
   *  container node
   */


  var setContainerNode = function setContainerNode(node) {
    sliderProperties.containerNode = node;
  };
  /**
   * Set root node
   */


  var setRootNode = function setRootNode(node) {
    sliderProperties.rootNode = node;
  };
  /**
   * Update height
   */


  var updateHeight = function updateHeight() {
    if (sliderProperties.activeSlide !== null) {
      var child = sliderProperties.activeSlide.children[0];

      if (child !== undefined && child.offsetHeight !== undefined && heightLatest !== child.offsetHeight) {
        setHeightLatest(child.offsetHeight);
      }
    }
  };

  var touchEvents = !disabled ? {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd
  } : {};
  var mouseEvents = !disabled && enableMouseEvents ? {
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onMouseLeave: handleMouseLeave,
    onMouseMove: handleMouseMove
  } : {}; // There is no point to animate if we are already providing a height.

  warning__default["default"](!animateHeight || !containerStyleProp || !containerStyleProp.height, "react-swipeable-view: You are setting animateHeight to true but you are also providing a custom height. The custom height has a higher priority than the animateHeight property. So animateHeight is most likely having no effect at all.");
  var slideStyle = Object.assign({}, styles.slide, slideStyleProp);
  var transition;
  var WebkitTransition;

  if (isDragging || !animateTransitions || displaySameSlide) {
    transition = "all 0s ease 0s";
    WebkitTransition = "all 0s ease 0s";
  } else {
    transition = createTransition("transform", springConfig);
    WebkitTransition = createTransition("-webkit-transform", springConfig);

    if (heightLatest !== 0) {
      var additionalTranstion = ", ".concat(createTransition("height", springConfig));
      transition += additionalTranstion;
      WebkitTransition += additionalTranstion;
    }
  }

  var containerStyle = {
    height: null,
    WebkitFlexDirection: axisProperties$1.flexDirection[axis],
    flexDirection: axisProperties$1.flexDirection[axis],
    WebkitTransition: WebkitTransition,
    transition: transition
  }; // Apply the styles for SSR considerations

  if (!renderOnlyActive) {
    var transform = axisProperties$1.transform[axis](sliderProperties.indexCurrent * 100);
    containerStyle.WebkitTransform = transform;
    containerStyle.transform = transform;
  }

  if (animateHeight) {
    containerStyle.height = heightLatest;
  }

  return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(SwipeableViewsContext.Provider, {
    value: getSwipeableViewsContext()
  }, /*#__PURE__*/React__default["default"].createElement("div", _extends({
    ref: setRootNode,
    style: Object.assign({}, axisProperties$1.root[axis], style)
  }, other, touchEvents, mouseEvents, {
    onScroll: handleScroll
  }), /*#__PURE__*/React__default["default"].createElement("div", {
    ref: setContainerNode,
    style: Object.assign({}, containerStyle, styles.container, containerStyleProp),
    className: "react-swipeable-view-container"
  }, React__default["default"].Children.map(children, function (child, indexChild) {
    if (renderOnlyActive && indexChild !== indexLatest) {
      return null;
    }

    warning__default["default"]( /*#__PURE__*/React__default["default"].isValidElement(child), "react-swipeable-view: one of the children provided is invalid: ".concat(child, ". We are expecting a valid React Element"));
    var ref;
    var hidden = true;

    if (indexChild === indexLatest) {
      hidden = false;

      if (animateHeight) {
        ref = setActiveSlide;
        slideStyle.overflowY = "hidden";
      }
    }

    return /*#__PURE__*/React__default["default"].createElement("div", {
      ref: ref,
      style: slideStyle,
      className: slideClassName,
      "aria-hidden": hidden,
      "data-swipeable": "true"
    }, child);
  })))));
};
ReactSliderViews.propTypes = {
  /**
   * This is callback property. It's called by the component on mount.
   * This is useful when you want to trigger an action programmatically.
   * It currently only supports updateHeight() action.
   *
   * @param {object} actions This object contains all posible actions
   * that can be triggered programmatically.
   */
  action: PropTypes__default["default"].func,

  /**
   * If `true`, the height of the container will be animated to match the current slide height.
   * Animating another style property has a negative impact regarding performance.
   */
  animateHeight: PropTypes__default["default"].bool,

  /**
   * If `false`, changes to the index prop will not cause an animated transition.
   */
  animateTransitions: PropTypes__default["default"].bool,

  /**
   * The axis on which the slides will slide.
   */
  axis: PropTypes__default["default"].oneOf(["x", "x-reverse", "y", "y-reverse"]),

  /**
   * Use this property to provide your slides.
   */
  children: PropTypes__default["default"].node.isRequired,

  /**
   * This is the inlined style that will be applied
   * to each slide container.
   */
  containerStyle: PropTypes__default["default"].object,

  /**
   * If `true`, it will disable touch events.
   * This is useful when you want to prohibit the user from changing slides.
   */
  disabled: PropTypes__default["default"].bool,

  /**
   * This is the config used to disable lazyloding,
   * if `true` will render all the views in first rendering.
   */
  disableLazyLoading: PropTypes__default["default"].bool,

  /**
   * If `true`, it will enable mouse events.
   * This will allow the user to perform the relevant swipe actions with a mouse.
   */
  enableMouseEvents: PropTypes__default["default"].bool,

  /**
   * Configure hysteresis between slides. This value determines how far
   * should user swipe to switch slide.
   */
  hysteresis: PropTypes__default["default"].number,

  /**
   * If `true`, it will ignore native scroll container.
   * It can be used to filter out false positive that blocks the swipe.
   */
  ignoreNativeScroll: PropTypes__default["default"].bool,

  /**
   * This is the index of the slide to show.
   * This is useful when you want to change the default slide shown.
   * Or when you have tabs linked to each slide.
   */
  index: PropTypes__default["default"].number,

  /**
   * This is callback prop. It's call by the
   * component when the shown slide change after a swipe made by the user.
   * This is useful when you have tabs linked to each slide.
   *
   * @param {integer} index This is the current index of the slide.
   * @param {integer} indexLatest This is the oldest index of the slide.
   * @param {object} meta Meta data containing more information about the event.
   */
  onChangeIndex: PropTypes__default["default"].func,

  /**
   * @ignore
   */
  onMouseDown: PropTypes__default["default"].func,

  /**
   * @ignore
   */
  onMouseLeave: PropTypes__default["default"].func,

  /**
   * @ignore
   */
  onMouseMove: PropTypes__default["default"].func,

  /**
   * @ignore
   */
  onMouseUp: PropTypes__default["default"].func,

  /**
   * @ignore
   */
  onScroll: PropTypes__default["default"].func,

  /**
   * This is callback prop. It's called by the
   * component when the slide switching.
   * This is useful when you want to implement something corresponding
   * to the current slide position.
   *
   * @param {integer} index This is the current index of the slide.
   * @param {string} type Can be either `move` or `end`.
   */
  onSwitching: PropTypes__default["default"].func,

  /**
   * @ignore
   */
  onTouchEnd: PropTypes__default["default"].func,

  /**
   * @ignore
   */
  onTouchMove: PropTypes__default["default"].func,

  /**
   * @ignore
   */
  onTouchStart: PropTypes__default["default"].func,

  /**
   * The callback that fires when the animation comes to a rest.
   * This is useful to defer CPU intensive task.
   */
  onTransitionEnd: PropTypes__default["default"].func,

  /**
   * If `true`, it will add bounds effect on the edges.
   */
  resistance: PropTypes__default["default"].bool,

  /**
   * This is the className that will be applied
   * on the slide component.
   */
  slideClassName: PropTypes__default["default"].string,

  /**
   * This is the inlined style that will be applied
   * on the slide component.
   */
  slideStyle: PropTypes__default["default"].object,

  /**
   * This is the config used to create CSS transitions.
   * This is useful to change the dynamic of the transition.
   */
  springConfig: PropTypes__default["default"].shape({
    delay: PropTypes__default["default"].string,
    duration: PropTypes__default["default"].string,
    easeFunction: PropTypes__default["default"].string
  }),

  /**
   * This is the inlined style that will be applied
   * on the root component.
   */
  style: PropTypes__default["default"].object,

  /**
   * This is the threshold used for detecting a quick swipe.
   * If the computed speed is above this value, the index change.
   */
  threshold: PropTypes__default["default"].number
};

exports["default"] = ReactSliderViews;
//# sourceMappingURL=index.js.map
