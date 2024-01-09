// SPDX-FileCopyrightText: 2023 Digg - Agency for Digital Government
//
// SPDX-License-Identifier: MIT

import path from "path";
import { fileURLToPath } from "url";
import Dotenv from "dotenv-webpack";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import { LicenseWebpackPlugin } from "license-webpack-plugin";
import webpack from 'webpack';

// Convert the module URL to a directory path
const directoryPath = path.dirname(fileURLToPath(import.meta.url));

const config = {
	// Development mode for better debugging
	mode: "production",

	// Entry point of the library
	entry: "./src/index.js",

	// Output configuration
	output: {
		path: path.resolve(directoryPath, "dist"),
		filename: "InclusionToolbox.js",
		library: {
			name: "InclusionToolbox",
			type: "umd", // Supports CommonJS, AMD and as a browser global
		},
		globalObject: "this", // Ensures compatibility with both browser and Node.js
	},

	// Enable source maps
	// devtool: "source-map",

	module: {
		rules: [
			{
				test: /\.js?$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env"], // Transpile modern JavaScript
					},
				},
			},
			{
				test: /\.css$/,
				use: [
					"style-loader",
					{
						loader: "css-loader",
						options: {
							modules: {
								auto: true,
							},
						},
					},
				],
			},
			{
				test: /\.ttf$/,
				use: [
					{
						loader: "url-loader",
						options: {
							limit: Infinity,
						},
					},
				],
			},
		],
	},

	resolve: {
		extensions: [".js"],
		alias: {
			"@embed": path.resolve(directoryPath, "src/embed"),
			"@service": path.resolve(directoryPath, "src/service"),
			"@util": path.resolve(directoryPath, "src/util"),
		},
	},

	// Optimization settings
	optimization: {
		usedExports: true, // Enable tree shaking
	},

	plugins: [
		new Dotenv(),
		new CleanWebpackPlugin(),
		new LicenseWebpackPlugin({}),
		new webpack.BannerPlugin({
			banner: "Copyright (c) 2023 Digg - Agency for Digital Government. See LICENSE file for details.",
		}),
	],
};

export default config;
