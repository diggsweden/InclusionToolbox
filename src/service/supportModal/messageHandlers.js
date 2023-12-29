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
	// iframe loaded
	loaded: (data) => {
		if (process.env.DEBUG) {
			console.info("iFrame loaded", data ? data : "");
		}
	},
	// Adjust the size of the iframe dynamically
	resize: ({ height, width }, iframe, config) => {
		if (height && iframe) {
			iframe.style.height = `${height}${
				height.includes(["%", "px", "em", "dvh", "vh"]) ? "" : "px"
			}`;
		}
	},
	// Redirect to a new page/run callback function
	redirectTo: (data, iframe, config) => {
		if (Object.keys(config.links).includes(data)) {
			const link = config.links[data];

			try {
				switch (typeof link) {
				case "object": {
					const { url , target } = link;
					const urlObj = new URL(url, window.location.origin);
					window.open(urlObj.href, target);
				}
					break;
				case "string": {
					const urlObj = new URL(link, window.location.origin);
					window.location.assign(urlObj.href);
				}
					break;
				case "function":
					link();
					break;
				default:
					throw new Error(
						`Invalid link type: ${typeof link}. Expected string or function.`
					);
				}
			} catch (err) {
				console.error(err);
			}
		} else {
			console.warn(`Unable to redirect. Link not found: ${data}`);
		}
	},
};

export default messageHandlers;
