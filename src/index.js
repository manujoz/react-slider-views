import React, { useState, createContext } from "react";
import PropTypes from "prop-types";
import warning from "warning";
import { constant, checkIndexBounds, computeIndex, getDisplaySameSlide } from "react-swipeable-views-core";

// External functions
import { addEventListeners, createTransition, adaptMouse, applyRotationMatrix, getDomTreeShapes, findNativeHandler } from "./helpers/functions";

// Common properties
import { styles } from "./properties/styles";
import { axisProperties } from "./properties/axisProperties";
import { sliderProperties } from "./properties/sliderProperties";

// We can only have one node at the time claiming ownership for handling the swipe.
// Otherwise, the UX would be confusing.
// That's why we use a singleton here.
let nodeWhoClaimedTheScroll = null;

const ReactSliderViews = () => {
    // States
    const [rootNode, setRootNode] = useState(null);
    // const [containerNode, setContainerNode] = useState(null);
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
    const SwipeableViewsContext = createContext();
    if (process.env.NODE_ENV !== "production") {
        SwipeableViewsContext.displayName = "SwipeableViewsContext";
    }

    return <>Mi componente</>;
};

export default ReactSliderViews;
