import PostMessageHandler from "./postMessageHandler.js";
import IframeElement from "../../assets/components/iframeElement.js";

/**
 * A class to handle the creation and loading of an iframe.
 *
 * @param {string} src - The iframe src
 * @param {Object} config - The plugin configuration
 * @param {Object} options - The iframe options
 * @param {Object} messageHandlers - (optional) Extra message handlers
 */
class IframeHandler {
	constructor(src, config, options = {}, messageHandlers = {}, messageHandlerConfig = {}) {
		// Validate 'src' and ensure it's provided
		if (!src) {
			throw new Error('Missing "src".');
		}

		if (!config) {
			throw new Error('Missing "configuration"');
		}

		this.config = config;
		this.messageHandlers = messageHandlers;
		this.messageHandlerConfig = messageHandlerConfig;

		// Store initial settings
		this.src = src;
		this.options = {
			width: options.width || "100%",
			height: options.height || "100%",
		};

		this.iframes = new Map();
	}

	/**
	 * Create an iframe.
	 * @param {string} name - The name of the iframe
	 * @param {HTMLElement} container - The container element
	 *
	 * @returns {Object} The iframe object
	 */
	#create(name, container) {
		if (this.iframes.has(name)) {
			throw new Error(`An iFrame with the name ${name} already exists.`);
		}

		// Create the iframe element
		const iframeElement = IframeElement({
			name: name,
			src: this.src.href,
			width: this.options.width,
			height: this.options.height,
		});

		// Setup handlers for the iframe
		const postMessageHandler = new PostMessageHandler(
			this.src.origin,
			iframeElement,
			this.messageHandlerConfig,
		);

		// Bind any extra messageHandlers supplied
		if (Object.keys(this.messageHandlers).length) {
			Object.entries(this.messageHandlers).forEach(
				([eventType, handler]) => {
					postMessageHandler.on(eventType, handler);
				}
			);
		}

		const iframeObj = {
			element: iframeElement,
			container,
			postMessageHandler,
		};

		// store the iframe
		this.iframes.set(name, iframeObj);

		return iframeObj;
	}

	/**
	 * Load an iframe into the container.
	 *
	 * @param {string} name - The name of the iframe
	 * @param {Object} data - (Optional) The data to send to the iframe
	 * @param {HTMLElement} target - (Optional) The target container element
	 *
	 * @returns {Object} The iframe object
	 */
	load(name, data = {}, target = null) {
		let iframe = this.iframes.has(name)
			? this.iframes.get(name)
			: this.#create(name, target);
		if (!iframe) {
			throw new Error(
				`Could not load iframe with name: ${name}. Please review configuration.`
			);
		}

		if (target) {
			// Append the iframe to the target element
			target.appendChild(iframe.element);
		}

		if (!Object.keys(data).length) {
			data = this.config;
		}

		iframe.postMessageHandler.on("ready", () => {
			// Send the config to the iframe on load
			iframe.postMessageHandler.send(
				{ type: "load", data },
				iframe.element.contentWindow
			);
		});

		// Listen for messages from the iframe
		iframe.postMessageHandler.listen();

		return iframe;
	}

	/**
	 * Get an iframe element by name.
	 * @param {string} name - The name of the iframe
	 * @returns {HTMLIFrameElement} The iframe element
	 * @returns {null} If the iframe does not exist
	 */
	getElement(name) {
		let iframeElement = null;
		if (this.iframes.has(name)) {
			iframeElement = this.iframes.get(name).element;
		}

		return iframeElement;
	}


	/**
	 * Remove an iframe from the DOM.
	 * @param {string} name - The name of the iframe
	 */
	teardown(name) {
		const iframe = this.iframes.get(name);
		if (iframe && iframe.element.parentNode) {
			iframe.postMessageHandler.stopListening();
			iframe.element.parentNode.removeChild(iframe.element);
		}

		this.iframes.delete(name);
	}

	/**
	 * Remove all iframes from the DOM.
	 */
	teardownAll() {
		this.iframes.forEach((iframeObj) => {
			if (iframeObj.element.parentNode) {
				iframeObj.postMessageHandler.stopListening();
				iframeObj.element.parentNode.removeChild(iframeObj.element);
			}
		});

		this.iframes.clear();
	}
}

export default IframeHandler;
