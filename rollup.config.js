import path from "path"
import typescript from "@rollup/plugin-typescript"

export default [{
	input: "src/index.ts",
	output: {
		exports: "named",
		format: "es",
		file: "dist/index.mjs",
		sourcemap: true,
		sourcemapPathTransform: (relativeSourcePath, _) => path.resolve(__dirname, relativeSourcePath.replace(/^(..\/)+/, ""))
	},
	plugins: [typescript({ tsconfig: "./tsconfig.json" })],
},
]