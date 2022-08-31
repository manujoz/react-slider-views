import "./App.css";

import SliderViews from "react-slider-views";
import { useEffect, useState } from "react";

function App() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            console.log("Cambiamos el índice");
            setIndex(1);
        }, 1000);
    }, []);

    return (
        <div className="App">
            <SliderViews index={index}>
                <div>1</div>
                <div>2</div>
            </SliderViews>
        </div>
    );
}

export default App;
