# react-slider-views

Mirror for **react-swipeable-views** because original component do not have a correct support. The component works exactly that **react-swipeable-views** and you can see the same documentation.

> A React component for swipeable views.

## Documentation

### Get started

-   [Installation](https://react-swipeable-views.com/getting-started/installation/)
-   [Usage](https://react-swipeable-views.com/getting-started/usage/)
-   [Example projects](https://react-swipeable-views.com/getting-started/example-projects/)
-   [Supported projects](https://react-swipeable-views.com/getting-started/example-projects/)

### Component API

-   [Component API](https://react-swipeable-views.com/api/api/)

### More

-   [Supported projects](https://react-swipeable-views.com/getting-started/example-projects/)
-   [Demos](https://react-swipeable-views.com/demos/demos/)

## Installation

### Browser

```sh
npm i --save react-slider-views
```

## The problem solved

Check out the [demos](https://react-swipeable-views.com/demos/demos/) from a mobile device (real or emulated).
It's tiny (<10 kB gzipped), it quickly renders the first slide, then lazy-loads the others.

## Simple example

![usage](/static/usage.gif)

### Browser

```jsx
import React from "react";
import SliderViews from "react-slider-views";

const styles = {
    slide: {
        padding: 15,
        minHeight: 100,
        color: "#fff",
    },
    slide1: {
        background: "#FEA900",
    },
    slide2: {
        background: "#B3DC4A",
    },
    slide3: {
        background: "#6AC0FF",
    },
};

const MyComponent = () => (
    <SliderViews>
        <div style={Object.assign({}, styles.slide, styles.slide1)}>slide n°1</div>
        <div style={Object.assign({}, styles.slide, styles.slide2)}>slide n°2</div>
        <div style={Object.assign({}, styles.slide, styles.slide3)}>slide n°3</div>
    </SliderViews>
);

export default MyComponent;
```

## Supported platforms

<p class="description">Learn about the platforms, from modern to old, that are supported by react-slider-views.</p>

The API is as consistent as possible between the three platforms so
the same component can be used independently on where it's running.

### Browser

| IE    | Edge | Windows Phone | Firefox | Chrome | Safari |
| :---- | :--- | :------------ | :------ | :----- | :----- |
| >= 10 | ✓    | x             | >= 28   | >= 29  | >= 8   |

#### Legacy browser support

react-slider-views supports modern browsers out-of-the-box, but requires additional CSS to support legacy browsers. To support IE 10 and older versions of Mobile Safari, include `react-slider-views/build/styles/legacy-browser-support.css`.

![browser](/static/platformBrowser.gif)

### iOS

![ios](/static/platformIOS.gif)

### Android

![android](/static/platformAndroid.gif)
