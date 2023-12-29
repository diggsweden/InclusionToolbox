/* PostMessageHandler
 * A class to handle communication via postMessage
 *
 * Usage:
 *  const messageHandler = new PostMessageHandler('https://example.com');
 *
 *  messageHandler.on('messageType', (payload) => {
 *   // Handle the message
 *  });
 *
 * @param {string} targetOrigin - The origin of the target window
 * @param {HTMLIFrameElement} element - The iframe element
 *
 * @returns {PostMessageHandler} - A PostMessageHandler instance
 */
class PostMessageHandler {
	constructor(targetOrigin, element = null, handlerConfig = {}) {
		this.targetOrigin = targetOrigin;
		this.messageHandlers = {};
		this.element = element || null;
		this.handlerConfig = handlerConfig || {};
	}

	// Listen for messages from the iframe
	listen() {
		window.addEventListener("message", this.receive.bind(this), false);
	}

	// Cleanup listener
	stopListening() {
		window.removeEventListener("message", this.receive.bind(this), false);
	}

	// Send a message to the iframe
	send(message, targetWindow) {
		targetWindow.postMessage(message, this.targetOrigin);
	}

	// Handle incoming messages
	receive(event) {
		// Check the origin of the message
		if (event.origin === this.targetOrigin) {
			const { type, data } = event.data;

			const handler = this.messageHandlers[type];
			if (handler) {
				const validConfig = Object.keys(this.handlerConfig).length > 0;
				const validElement = this.#validateIframeElement(this.element);
				if (validElement && validConfig) {
					handler(data, this.element, this.handlerConfig);
				} else if (validElement) {
					handler(data, this.element);
				} else if (validConfig) {
					handler(data, null, this.handlerConfig);
				} else {
					handler(data);
				}
			} else {
				console.warn("No handler registered for message type:", type);
			}
		}
	}

	// Register a message handler
	on(type, handler) {
		this.messageHandlers[type] = handler;
	}

	// Deregister a message handler
	off(type) {
		delete this.messageHandlers[type];
	}

	#validateIframeElement = (iframe) => {
		return iframe && iframe instanceof HTMLIFrameElement;
	}
}

export default PostMessageHandler;
