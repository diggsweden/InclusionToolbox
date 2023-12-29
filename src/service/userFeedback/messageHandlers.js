/**
 * Message handlers for the embed iframe.
 *
 * Names must match the messageType sent from the iframed application.
 *
 * Each handler can be supplied with the params below:
 * @param {Object} data - The message payload
 * @param {HTMLIFrameElement} iframe - The iframe element
 * @param {Object} config - The configuration object
 */
const messageHandlers = {
	// Show the iframe
	loaded: (data) => {
		if (process.env.DEBUG) {
			console.info("iFrame loaded", data ? data : "");
		}
	},

	// Adjust the height of the iframe dynamically
	resize: ({ height }, iframe) => {
		if (height && iframe) {
			iframe.style.height = `${height}${
				height.includes(["%", "px", "em", "dvh", "vh"]) ? "" : "px"
			}`;
		}
	},
};

export default messageHandlers;
