import pkg from "./package.json";
import babel from "@rollup/plugin-babel";

export default {
    input: "./src/index.js",
    output: [
        {
            file: pkg.main,
            format: "cjs",
            exports: "named",
            sourcemap: true,
            strict: false,
        },
    ],
    plugins: [babel({ babelHelpers: "bundled" })],
    external: ["react", "react-dom", "warning", "react-swipeable-views-core"],
};
