// plugin-node-resolve and plugin-commonjs are required for a rollup bundled project
// to resolve dependencies from node_modules. See the documentation for these plugins
// for more details.
import typescript from "@rollup/plugin-typescript"
import path from "path"

export default [{
		input: "src/index.ts",
		output: {
			exports: "named",
			format: "es",
			file: "dist/index.mjs",
			sourcemap: true,
			sourcemapPathTransform: (relativeSourcePath, _) => path.resolve(__dirname, relativeSourcePath.replace(/^(..\/)+/, ""))
		},
		plugins: [typescript({ tsconfig: "./tsconfig.json" }), ],
	},
]
