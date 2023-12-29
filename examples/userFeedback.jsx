import React, { useEffect, useRef } from "react";
import { UserFeedback } from "path/to/InclusionToolbox";

/**
 * It is possible to split the configuration and the frame(s) into separate components,
 * without having to pass around the class instance. For example:
 */
const App = () => {
	// Configuration for UserFeedback
	const config = {
		apiKey: "4f9ef8bb-3f8c-41f2-b294-b6d2f72b9597", // "123456-abcdef-7890", // API-key string
		defaultTags: ['example1', 'example2'], 			// (optional) Array of default tags for filters
		defaultLabels: ['example1', 'example2'], 		// (optional) Array of default labels for filters
	};

	// Options for UserFeedback (optional)
	const options = {
		styling: {
			align: "center", 		// Align frame: left|center|right (Default: center)
			theme: "auto", 			// Select theme: dark|light|auto (Default: auto)
		},
		useLocalStorage: true, 		// true|false (Default: true)
	};

	// Initialize global UserFeedback instance with the configuration
	UserFeedback.init(config, options);
};

const UserFeedbackFrame = ({ apiKey, name, tags, labels }) => {
	const containerRef = useRef(null);

	useEffect(() => {
		let feedback;
		// Embed the UserFeedback widget into the container
		if (containerRef.current) {
			const feedbackContainer = containerRef.current;

			// Instantiate UserFeedback with the configuration
			feedback = UserFeedback.getInstance();
			feedback.load(name, feedbackContainer, tags, labels);
		}

		// Cleanup
		return () => {
			if (feedback) {
				feedback.teardown(name);
			}
		};
	}, [apiKey, containerRef]);

	return (<div ref={containerRef}></div>);
};

export default { App, UserFeedbackFrame };
