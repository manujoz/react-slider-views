import React, { useState, createContext, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import warning from "warning";
import { constant, computeIndex, getDisplaySameSlide } from "react-swipeable-views-core";

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

// First render
let isFirstRender = true;

const ReactSliderViews = (props) => {
    // Destructuring props
    const {
        action,
        animateHeight = false,
        animateTransitions = true,
        axis = "x",
        children,
        containerStyle: containerStyleProp,
        disabled = false,
        disableLazyLoading = false,
        enableMouseEvents = false,
        hysteresis = 0.6,
        ignoreNativeScroll = false,
        index = 0,
        onChangeIndex,
        onSwitching,
        onMouseDown,
        onMouseLeave,
        onMouseMove,
        onMouseUp,
        onScroll,
        onTouchEnd,
        onTouchStart,
        onTransitionEnd,
        resistance = false,
        style,
        slideStyle: slideStyleProp,
        springConfig = { duration: "0.35s", easeFunction: "cubic-bezier(0.15, 0.3, 0.25, 1)", delay: "0s" },
        slideClassName,
        threshold = 5,
        ...other
    } = props;

    // States
    const [indexLatest, setIndexLatest] = useState(index);
    const [isDragging, setIsDragging] = useState(false);
    const [renderOnlyActive, setRenderOnlyActive] = useState(!disableLazyLoading);
    const [heightLatest, setHeightLatest] = useState(0);
    const [displaySameSlide, setDisplaySameSlide] = useState(true);

    // Context
    const SwipeableViewsContext = createContext();
    if (process.env.NODE_ENV !== "production") {
        SwipeableViewsContext.displayName = "SwipeableViewsContext";
    }

    /**
     * Set index current
     */
    const setIndexCurrent = (indexCurrent) => {
        if (!animateTransitions && sliderProperties.indexCurrent !== indexCurrent) {
            handleTransitionEnd();
        }

        console.log("setIndexCurrent", indexCurrent);
        sliderProperties.indexCurrent = indexCurrent;

        if (sliderProperties.containerNode) {
            const transform = axisProperties.transform[axis](indexCurrent * 100);
            sliderProperties.containerNode.style.WebkitTransform = transform;
            sliderProperties.containerNode.style.transform = transform;
        }
    };

    /**
     * Behaivor similar to componentWillReceiveProps
     */
    const componentWillReceiveProps = () => {
        const aic = sliderProperties.indexCurrent !== null ? parseInt(sliderProperties.indexCurrent.toString()) : null;
        console.log("componentWillReceiveProps", index, sliderProperties.indexCurrent);
        if (typeof index === "number" && index !== aic && sliderProperties.olderProps) {
            console.log("Update componentWillReceiveProps");
            setDisplaySameSlide(getDisplaySameSlide(sliderProperties.olderProps, props));
            setIndexLatest(index);
            setIndexCurrent(index);
        }
        sliderProperties.olderProps = props;
    };

    // Constructor behaivor
    if (isFirstRender) {
        isFirstRender = false;
        setIndexCurrent(index);
    }

    // Call to componentWillReceiveProps
    componentWillReceiveProps();

    // Effects called on first render only for manage componentWillUnmount
    useEffect(() => {
        // componentWillUnmount in functional component is a return in useEffect
        return () => {
            sliderProperties.transitionListener.remove();
            sliderProperties.touchMoveListener.remove();
            clearTimeout(sliderProperties.firstRenderTimeout);
        };
    }, []);

    // Effects called each render similar to componentDidMount and componentDidUpdate
    useEffect(() => {
        sliderProperties.transitionListener = addEventListeners(sliderProperties.containerNode, "transitionend", (event) => {
            if (event.target !== sliderProperties.containerNode) {
                return;
            }

            handleTransitionEnd();
        });

        sliderProperties.touchMoveListener = addEventListeners(
            sliderProperties.rootNode,
            "touchmove",
            (event) => {
                if (disabled) {
                    return;
                }

                handleSwipeMove(event);
            },
            {
                passive: false,
            }
        );

        if (disableLazyLoading) {
            sliderProperties.firstRenderTimeout = setTimeout(() => {
                setRenderOnlyActive(false);
            }, 0);
        }

        if (action) {
            action({ updateHeight });
        }
    });

    // Effects called when indexLatest updated
    const didMountIl = useRef(false);
    useEffect(() => {
        if (!didMountIl.current) {
            didMountIl.current = true;
            return;
        }
        console.log("Cambia indexLatest", indexLatest);
        if (onSwitching) {
            onSwitching(indexLatest, "end");
        }

        if (onChangeIndex) {
            onChangeIndex(indexLatestm, { reason: "swipe" });
        }

        if (sliderProperties.indexCurrent === indexLatest) {
            handleTransitionEnd();
        }
    }, [indexLatest]);

    // Effect called when displaySameSlide updated
    const didMountSS = useRef(false);
    useEffect(() => {
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
    const getSwipeableViewsContext = () => {
        return {
            slideUpdateHeight: () => {
                updateHeight();
            },
        };
    };

    /**
     * Handle mouse down event
     *
     * @param {Event} event
     */
    const handleMouseDown = (event) => {
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
    const handleMouseLeave = (event) => {
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
    const handleMouseMove = (event) => {
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
    const handleMouseUp = (event) => {
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
    const handleScroll = (event) => {
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

        const indexNew = Math.ceil(event.target.scrollLeft / event.target.clientWidth) + indexLatest;

        sliderProperties.ignoreNextScrollEvents = true;
        event.target.scrollLeft = 0;

        if (onChangeIndex && indexNew !== indexLatest) {
            onChangeIndex(indexNew, indexLatest, { reason: "focus" });
        }
    };

    /**
     * Handle the swipe start
     *
     * @param {Event} event
     */
    const handleSwipeStart = (event) => {
        const touch = applyRotationMatrix(event.touches[0], axis);

        sliderProperties.viewLength = sliderProperties.rootNode.getBoundingClientRect()[axisProperties.length[axis]];
        sliderProperties.startX = touch.pageX;
        sliderProperties.lastX = touch.pageX;
        sliderProperties.vx = 0;
        sliderProperties.startY = touch.pageY;
        sliderProperties.isSwiping = undefined;
        sliderProperties.started = true;

        const computedStyle = window.getComputedStyle(sliderProperties.containerNode);
        const transform = computedStyle.getPropertyValue("-webkit-transform") || computedStyle.getPropertyValue("transform");

        if (transform && transform !== "none") {
            const transformValues = transform.split("(")[1].split(")")[0].split(",");
            const rootStyle = window.getComputedStyle(sliderProperties.rootNode);
            const transformNormalized = applyRotationMatrix(
                { pageX: parseInt(transformValues[4], 10), pageY: parseInt(transformValues[5], 10) },
                axis
            );

            sliderProperties.startIndex =
                -transformNormalized.pageX /
                    (sliderProperties.viewLength - parseInt(rootStyle.paddingLeft, 10) - parseInt(rootStyle.paddingRight, 10)) || 0;
        }
    };

    /**
     * Handle the swipe move
     *
     * @param {Event} event
     */
    const handleSwipeMove = (event) => {
        if (!sliderProperties.started) {
            handleTouchStart(event);
            return;
        }

        if (nodeWhoClaimedTheScroll !== null && nodeWhoClaimedTheScroll !== sliderProperties.rootNode) {
            return;
        }

        const touch = applyRotationMatrix(event.touches[0], axis);

        if (sliderProperties.isSwiping === undefined) {
            const dx = Math.abs(touch.pageX - sliderProperties.startX);
            const dy = Math.abs(touch.pageY - sliderProperties.startY);

            const isSwiping = dx > dy && dx > constant.UNCERTAINTY_THRESHOLD;

            if (
                resistance &&
                (axis === "y" || axis === "y-reverse") &&
                ((sliderProperties.indexCurrent === 0 && sliderProperties.startX < touch.pageX) ||
                    (sliderProperties.indexCurrent === React.Children.count(children) - 1 && sliderProperties.startX > touch.pageX))
            ) {
                sliderProperties.isSwiping = false;
                return;
            }

            if (dx > dy) {
                event.preventDefault();
            }

            if (isSwiping === true || dy > constant.UNCERTAINTY_THRESHOLD) {
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

        const { index, startX } = computeIndex({
            children,
            resistance,
            pageX: touch.pageX,
            startIndex: sliderProperties.startIndex,
            startX: sliderProperties.startX,
            viewLength: sliderProperties.viewLength,
        });

        if (nodeWhoClaimedTheScroll === null && !ignoreNativeScroll) {
            const domTreeShapes = getDomTreeShapes(event.target, sliderProperties.rootNode);
            const hasFoundNativeHandler = findNativeHandler({
                domTreeShapes,
                startX: sliderProperties.startX,
                pageX: touch.pageX,
                axis,
            });

            if (hasFoundNativeHandler) {
                return;
            }
        }

        if (startX) {
            sliderProperties.startX = startX;
        }

        setIndexCurrent(index);

        const callback = () => {
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
    const handleSwipeEnd = (event) => {
        nodeWhoClaimedTheScroll = null;

        if (!sliderProperties.started) {
            return;
        }

        sliderProperties.started = false;

        if (sliderProperties.isSwiping !== true) {
            return;
        }

        const indexCurrent = sliderProperties.indexCurrent;
        const delta = indexLatest - indexCurrent;

        let indexNew;

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

        const indexMax = React.Children.count(children) - 1;
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
    const handleTouchStart = (event) => {
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
    const handleTouchEnd = (event) => {
        if (onTouchEnd) {
            onTouchEnd(event);
        }

        handleSwipeEnd(event);
    };

    /**
     * Call onTransitionEnd listener
     */
    const handleTransitionEnd = () => {
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
    const setActiveSlide = (node) => {
        sliderProperties.activeSlide = node;
        updateHeight();
    };

    /**
     *  container node
     */
    const setContainerNode = (node) => {
        sliderProperties.containerNode = node;
    };

    /**
     * Set root node
     */
    const setRootNode = (node) => {
        sliderProperties.rootNode = node;
    };

    /**
     * Update height
     */
    const updateHeight = () => {
        if (sliderProperties.activeSlide !== null) {
            const child = sliderProperties.activeSlide.children[0];
            if (child !== undefined && child.offsetHeight !== undefined && heightLatest !== child.offsetHeight) {
                setHeightLatest(child.offsetHeight);
            }
        }
    };

    const touchEvents = !disabled
        ? {
              onTouchStart: handleTouchStart,
              onTouchEnd: handleTouchEnd,
          }
        : {};
    const mouseEvents =
        !disabled && enableMouseEvents
            ? {
                  onMouseDown: handleMouseDown,
                  onMouseUp: handleMouseUp,
                  onMouseLeave: handleMouseLeave,
                  onMouseMove: handleMouseMove,
              }
            : {};

    // There is no point to animate if we are already providing a height.
    warning(
        !animateHeight || !containerStyleProp || !containerStyleProp.height,
        `react-swipeable-view: You are setting animateHeight to true but you are also providing a custom height. The custom height has a higher priority than the animateHeight property. So animateHeight is most likely having no effect at all.`
    );

    const slideStyle = Object.assign({}, styles.slide, slideStyleProp);

    let transition;
    let WebkitTransition;

    if (isDragging || !animateTransitions || displaySameSlide) {
        transition = "all 0s ease 0s";
        WebkitTransition = "all 0s ease 0s";
    } else {
        transition = createTransition("transform", springConfig);
        WebkitTransition = createTransition("-webkit-transform", springConfig);

        if (heightLatest !== 0) {
            const additionalTranstion = `, ${createTransition("height", springConfig)}`;
            transition += additionalTranstion;
            WebkitTransition += additionalTranstion;
        }
    }

    const containerStyle = {
        height: null,
        WebkitFlexDirection: axisProperties.flexDirection[axis],
        flexDirection: axisProperties.flexDirection[axis],
        WebkitTransition,
        transition,
    };

    // Apply the styles for SSR considerations
    if (!renderOnlyActive) {
        const transform = axisProperties.transform[axis](sliderProperties.indexCurrent * 100);
        containerStyle.WebkitTransform = transform;
        containerStyle.transform = transform;
    }

    if (animateHeight) {
        containerStyle.height = heightLatest;
    }

    return (
        <>
            <SwipeableViewsContext.Provider value={getSwipeableViewsContext()}>
                <div
                    ref={setRootNode}
                    style={Object.assign({}, axisProperties.root[axis], style)}
                    {...other}
                    {...touchEvents}
                    {...mouseEvents}
                    onScroll={handleScroll}>
                    <div
                        ref={setContainerNode}
                        style={Object.assign({}, containerStyle, styles.container, containerStyleProp)}
                        className="react-swipeable-view-container">
                        {React.Children.map(children, (child, indexChild) => {
                            if (renderOnlyActive && indexChild !== indexLatest) {
                                return null;
                            }

                            warning(
                                React.isValidElement(child),
                                `react-swipeable-view: one of the children provided is invalid: ${child}. We are expecting a valid React Element`
                            );

                            let ref;
                            let hidden = true;

                            if (indexChild === indexLatest) {
                                hidden = false;

                                if (animateHeight) {
                                    ref = setActiveSlide;
                                    slideStyle.overflowY = "hidden";
                                }
                            }

                            return (
                                <div ref={ref} style={slideStyle} className={slideClassName} aria-hidden={hidden} data-swipeable="true">
                                    {child}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </SwipeableViewsContext.Provider>
        </>
    );
};

export default ReactSliderViews;

ReactSliderViews.propTypes = {
    /**
     * This is callback property. It's called by the component on mount.
     * This is useful when you want to trigger an action programmatically.
     * It currently only supports updateHeight() action.
     *
     * @param {object} actions This object contains all posible actions
     * that can be triggered programmatically.
     */
    action: PropTypes.func,
    /**
     * If `true`, the height of the container will be animated to match the current slide height.
     * Animating another style property has a negative impact regarding performance.
     */
    animateHeight: PropTypes.bool,
    /**
     * If `false`, changes to the index prop will not cause an animated transition.
     */
    animateTransitions: PropTypes.bool,
    /**
     * The axis on which the slides will slide.
     */
    axis: PropTypes.oneOf(["x", "x-reverse", "y", "y-reverse"]),
    /**
     * Use this property to provide your slides.
     */
    children: PropTypes.node.isRequired,
    /**
     * This is the inlined style that will be applied
     * to each slide container.
     */
    containerStyle: PropTypes.object,
    /**
     * If `true`, it will disable touch events.
     * This is useful when you want to prohibit the user from changing slides.
     */
    disabled: PropTypes.bool,
    /**
     * This is the config used to disable lazyloding,
     * if `true` will render all the views in first rendering.
     */
    disableLazyLoading: PropTypes.bool,
    /**
     * If `true`, it will enable mouse events.
     * This will allow the user to perform the relevant swipe actions with a mouse.
     */
    enableMouseEvents: PropTypes.bool,
    /**
     * Configure hysteresis between slides. This value determines how far
     * should user swipe to switch slide.
     */
    hysteresis: PropTypes.number,
    /**
     * If `true`, it will ignore native scroll container.
     * It can be used to filter out false positive that blocks the swipe.
     */
    ignoreNativeScroll: PropTypes.bool,
    /**
     * This is the index of the slide to show.
     * This is useful when you want to change the default slide shown.
     * Or when you have tabs linked to each slide.
     */
    index: PropTypes.number,
    /**
     * This is callback prop. It's call by the
     * component when the shown slide change after a swipe made by the user.
     * This is useful when you have tabs linked to each slide.
     *
     * @param {integer} index This is the current index of the slide.
     * @param {integer} indexLatest This is the oldest index of the slide.
     * @param {object} meta Meta data containing more information about the event.
     */
    onChangeIndex: PropTypes.func,
    /**
     * @ignore
     */
    onMouseDown: PropTypes.func,
    /**
     * @ignore
     */
    onMouseLeave: PropTypes.func,
    /**
     * @ignore
     */
    onMouseMove: PropTypes.func,
    /**
     * @ignore
     */
    onMouseUp: PropTypes.func,
    /**
     * @ignore
     */
    onScroll: PropTypes.func,
    /**
     * This is callback prop. It's called by the
     * component when the slide switching.
     * This is useful when you want to implement something corresponding
     * to the current slide position.
     *
     * @param {integer} index This is the current index of the slide.
     * @param {string} type Can be either `move` or `end`.
     */
    onSwitching: PropTypes.func,
    /**
     * @ignore
     */
    onTouchEnd: PropTypes.func,
    /**
     * @ignore
     */
    onTouchMove: PropTypes.func,
    /**
     * @ignore
     */
    onTouchStart: PropTypes.func,
    /**
     * The callback that fires when the animation comes to a rest.
     * This is useful to defer CPU intensive task.
     */
    onTransitionEnd: PropTypes.func,
    /**
     * If `true`, it will add bounds effect on the edges.
     */
    resistance: PropTypes.bool,
    /**
     * This is the className that will be applied
     * on the slide component.
     */
    slideClassName: PropTypes.string,
    /**
     * This is the inlined style that will be applied
     * on the slide component.
     */
    slideStyle: PropTypes.object,
    /**
     * This is the config used to create CSS transitions.
     * This is useful to change the dynamic of the transition.
     */
    springConfig: PropTypes.shape({
        delay: PropTypes.string,
        duration: PropTypes.string,
        easeFunction: PropTypes.string,
    }),
    /**
     * This is the inlined style that will be applied
     * on the root component.
     */
    style: PropTypes.object,
    /**
     * This is the threshold used for detecting a quick swipe.
     * If the computed speed is above this value, the index change.
     */
    threshold: PropTypes.number,
};
