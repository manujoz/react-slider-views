/**
 * Add event listener
 *
 * @param {Node} node
 * @param {string} event
 * @param {EventListenerOrEventListenerObject} handler
 * @param {boolean|AddEventListenerOptions|undefined} options
 * @return {Function}
 */
const addEventListeners = (node, event, handler, options) => {
    node.addEventListener(event, handler, options);
    return {
        remove() {
            node.removeEventListener(event, handler, options);
        },
    };
};

/**
 * Create a css transition
 *
 * @param {string} property
 * @param {string} options
 * @returns {string}
 */
const createTransition = (property, options) => {
    const { duration, easeFunction, delay } = options;

    return `${property} ${duration} ${easeFunction} ${delay}`;
};

/**
 * Apply rotation Matrix, we arew using 2x2
 *
 * @param {Touch} touch
 * @param {object} axis
 * @param {import("../properties/axisProperties")["axisProperties"]} axisProperties
 * @returns
 */
const applyRotationMatrix = (touch, axis, axisProperties) => {
    const rotationMatrix = axisProperties.rotationMatrix[axis];

    return {
        pageX: rotationMatrix.x[0] * touch.pageX + rotationMatrix.x[1] * touch.pageY,
        pageY: rotationMatrix.y[0] * touch.pageX + rotationMatrix.y[1] * touch.pageY,
    };
};

/**
 * Adapt mouse event
 *
 * @param {Event} event
 * @returns
 */
const adaptMouse = (event) => {
    event.touches = [{ pageX: event.pageX, pageY: event.pageY }];
    return event;
};

/**
 * Get the dom tree shapes
 *
 * @param {HTMLElement} element
 * @param {HTMLElement} rootNode
 * @returns {Array<{ element: HTMLElement, scrollWidth: number, scrollHeight: number, clientWidth: number, clientHeight: number, scrollLeft: number, scrollTop: number }>}
 */
const getDomTreeShapes = (element, rootNode) => {
    let domTreeShapes = [];

    while (element && element !== rootNode && element !== document.body) {
        // We reach a Swipeable View, no need to look higher in the dom tree.
        if (element.hasAttribute("data-swipeable")) {
            break;
        }

        const style = window.getComputedStyle(element);

        if (
            // Ignore the scroll children if the element is absolute positioned.
            style.getPropertyValue("position") === "absolute" ||
            // Ignore the scroll children if the element has an overflowX hidden
            style.getPropertyValue("overflow-x") === "hidden"
        ) {
            domTreeShapes = [];
        } else if (
            (element.clientWidth > 0 && element.scrollWidth > element.clientWidth) ||
            (element.clientHeight > 0 && element.scrollHeight > element.clientHeight)
        ) {
            // Ignore the nodes that have no width.
            // Keep elements with a scroll
            domTreeShapes.push({
                element,
                scrollWidth: element.scrollWidth,
                scrollHeight: element.scrollHeight,
                clientWidth: element.clientWidth,
                clientHeight: element.clientHeight,
                scrollLeft: element.scrollLeft,
                scrollTop: element.scrollTop,
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
const findNativeHandler = (params) => {
    const { domTreeShapes, pageX, startX, axis } = params;

    return domTreeShapes.some((shape) => {
        // Determine if we are going backward or forward.
        let goingForward = pageX >= startX;
        if (axis === "x" || axis === "y") {
            goingForward = !goingForward;
        }

        // scrollTop is not always be an integer.
        // https://github.com/jquery/api.jquery.com/issues/608
        const scrollPosition = Math.round(shape[axisProperties.scrollPosition[axis]]);

        const areNotAtStart = scrollPosition > 0;
        const areNotAtEnd = scrollPosition + shape[axisProperties.clientLength[axis]] < shape[axisProperties.scrollLength[axis]];

        if ((goingForward && areNotAtEnd) || (!goingForward && areNotAtStart)) {
            nodeWhoClaimedTheScroll = shape.element;
            return true;
        }

        return false;
    });
};

/** Export functions */
export { addEventListeners, createTransition, applyRotationMatrix, adaptMouse, getDomTreeShapes, findNativeHandler };
