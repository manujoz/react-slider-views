const sliderProperties = {
    rootNode: null,
    containerNode: null,
    ignoreNextScrollEvents: false,
    viewLength: 0,
    startX: 0,
    lastX: 0,
    vx: 0,
    startY: 0,
    isSwiping: undefined,
    started: false,
    startIndex: 0,
    transitionListener: null,
    touchMoveListener: null,
    activeSlide: null,
    indexCurrent: null,
    firstRenderTimeout: null,
};

export { sliderProperties };
