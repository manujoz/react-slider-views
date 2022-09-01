import "../../App.css";

import { useState } from "react";

import SliderViews from "react-slider-views";
import SwipeableViews from "react-swipeable-views";

const Container = () => {
    const [index, setIndex] = useState(2);

    const nextView = () => {
        if (index < 2) {
            setIndex(index + 1);
        }
    };
    const previousView = () => {
        if (index > 0) {
            setIndex(index - 1);
        }
    };

    return (
        <>
            <SliderViews index={index} animateTransitions>
                <div className="slide slide1">Slide 1</div>
                <div className="slide slide2">Slide 2</div>
                <div className="slide slide3">Slide 3</div>
            </SliderViews>
            <div className="navigation">
                <div className="left" onClick={previousView}>
                    Previous
                </div>
                <div className="right" onClick={nextView}>
                    Next
                </div>
            </div>
        </>
    );
};

export default Container;
