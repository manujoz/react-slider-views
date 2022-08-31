import pkg from "./package.json";
import babel from "@rollup/plugin-babel";
import copy from "rollup-plugin-copy";
import { terser } from "rollup-plugin-terser";

const isProduction = process.env.NODE_ENV === "production";

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
    plugins: [
        babel({ babelHelpers: "bundled" }),
        copy({
            targets: [{ src: "src/**/*.d.ts", dest: "build" }],
        }),
        isProduction && terser(),
    ],
    external: ["react", "react-dom", "warning", "react-swipeable-views-core"],
};
