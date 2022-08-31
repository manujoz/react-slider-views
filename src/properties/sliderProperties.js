/** @type {{activeSlide: HTMLElement, containerNode: HTMLElement, firstRenderTimeout: Function, isSwiping: any, ignoreNextScrollEvents: boolean, indexCurrent: any, startX: number, startY: number, lastX: number, olderProps: object, rootNode: HTMLElement, startIndex: number, started: boolean, transitionListener: Function, touchMoveListener: Function, viewLength: number, vx: number}} */
const sliderProperties = {
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
    vx: 0,
};

export { sliderProperties };
