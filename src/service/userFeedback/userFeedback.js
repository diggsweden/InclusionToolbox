import IframeHandler from "@embed/iframe/iframeHandler.js";
import getFingerprint from "@util/fingerprint.js";
import messageHandlers from "./messageHandlers.js";

const DEFAULT_SRC = new URL(process.env.FEEDBACK_IFRAME_SRC) || null;
const DEFAULT_LOCALE = process.env.DEFAULT_LOCALE || "en";
const ALIGNMENT_OPTIONS = ["left", "right", "center"];
const THEME_OPTIONS = ["dark", "light", "auto"];

/**
 * UserFeedback class.
 *
 * @param {Object} userConfig - The user configuration
 * @param {Object} options - The options
 * @param {Object} options.styling - (Optional) Styling options for the iframe
 * @param {string} options.src - (Optional) The iframe url
 */
class UserFeedback {
	static instance = null;

	/**
	 * Create a new UserFeedback instance.
	 * @param {Object} config - (Optional) The configuration. If supplied, setup will be automatically called.
	 * @param {Object} options - (Optional) The options
	 * @param {string} options.src - (Optional) The iframe url
	 *
	 * @returns {UserFeedback} The UserFeedback instance
	 */
	constructor(config = {}, options = {}) {
		// Ensure the class is not instantiated directly
		if (UserFeedback.instance) {
			throw new Error(
				"You cannot create multiple instances of UserFeedback. Please use UserFeedback.getInstance()"
			);
		}

		this.iframeHandler = null;
		this.src = DEFAULT_SRC;
		this.config = null;

		this.styling = {
			align: "center",
			theme: "auto",
		};

		// Optionally call Setup if config is provided
		if (Object.keys(config).length > 0) {
			return this.setup(config, options);
		}
	}

	/**
	 * Initialize the UserFeedback instance.
	 *
	 * @param {Object} configuration - The user configuration
	 * @param {Object} options - The options
	 *
	 * @returns {UserFeedback} The UserFeedback instance
	 */
	#init() {
		if (!UserFeedback.instance) {
			UserFeedback.instance = this;
		}
		return UserFeedback.instance;
	}

	/**
	 * Get the UserFeedback instance.
	 *
	 * @returns {UserFeedback} The UserFeedback instance
	 */
	static getInstance() {
		if (!UserFeedback.instance) {
			throw new Error(
				"Instance not configured. See UserFeedback.setup()"
			);
		}

		return UserFeedback.instance;
	}

	#verifyStringArray(array) {
		return (
			Object.prototype.toString.call(array) == "[object Array]" &&
			array.every((i) => typeof i === "string")
		);
	}

	/**
	 * Generate the config object to send to the iframe on load.
	 *
	 * @param {string} name - The name of the iframe
	 * @param {Array} tags - (Optional) The tags to filter the feedback
	 * @param {Array} labels - (Optional) The labels to filter the feedback
	 *
	 * @returns {Object} The config object
	 */
	async #generateDataObject(name, tags = [], labels = []) {
		const { apiKey } = this.config;
		const fingerprint = await getFingerprint();
		const domain =
			window.location.hostname || (process.env.DEBUG ? "localhost" : "");
		const path = window.location.pathname;
		const locale = navigator.language || DEFAULT_LOCALE;

		return {
			config: {
				apiKey,
				tags: [...this.config.defaultTags, ...tags],
				labels: [...this.config.defaultLabels, ...labels],
			},
			context: { fingerprint, domain, path, locale, name },
			styling: this.styling,
		};
	}

	/**
	 * Setup the UserFeedback plugin.
	 *
	 * @param {Object} config - The configuration
	 * @param {Object} options - The options
	 *
	 */
	setup(config, options = {}) {
		try {
			// Validate & set config
			if (Object.keys(config).length) {
				this.#validateConfig(config);

				this.config = config;
			}

			// Validate & set options
			if (Object.keys(options).length) {
				this.#setOptions(options);
			}

			// Initialize iframeHandler
			this.iframeHandler = new IframeHandler(
				this.src,
				config,
				options,
				messageHandlers
			);

			return this.#init();
		} catch (err) {
			// Report error
			console.error(err);
		}
	}

	/**
	 * Load the iframe into the target element.
	 * @param {string} name - The name of the iframe
	 * @param {HTMLElement|string} target - The target element or selector
	 * @param {Array} tags - (Optional) The tags to filter the feedback
	 * @param {Array} labels - (Optional) The labels to filter the feedback
	 * @param {boolean} forceReinitialize - (Optional) Force reinitialization of the iframe handler
	 *
	 * @returns {HTMLIFrameElement} The iframe element
	 */
	load(name, target, tags = [], labels = []) {
		// If the iframe handler is not initialized, initialize it
		if (!this.iframeHandler) {
			throw new Error(
				"IframeHandler is not initialized or configured. Please provide config or call Setup first."
			);
		}

		// Verify that target is an HTML element, else if string provided, query the element
		if (typeof target === "string") {
			target = document.querySelector(target);
		}

		if (!(target instanceof HTMLElement)) {
			throw new Error(
				"Please provide a valid HTML element or selector to load the iframe into."
			);
		}

		return this.#generateDataObject(name, tags, labels).then((data) => {
			// Load an iframe into the target element
			this.iframeHandler.load(name, data, target);
		});
	}

	#validateConfig(config) {
		if (!config || !config.apiKey) {
			throw new Error("API Key is required. Missing config >> apiKey");
		}

		if (Object.prototype.hasOwnProperty.call(config, "defaultTags")) {
			if (!this.#verifyStringArray(config.defaultTags)) {
				throw new Error(
					"Invalid config >> defaultTags. Tags must be an Array of Strings."
				);
			}
		}

		if (Object.prototype.hasOwnProperty.call(config, "defaultLabels")) {
			if (!this.#verifyStringArray(config.defaultLabels)) {
				throw new Error(
					"Invalid config >> defaultLabels. Labels must be an Array of Strings."
				);
			}
		}
	}

	#setOptions(options) {
		if (
			Object.prototype.hasOwnProperty.call(options, "src") &&
			options.src
		) {
			// Verify valid source
			try {
				const newSrc = new URL(options.src);
				this.src = newSrc;
			} catch (err) {
				throw new Error("Invalid option >> src");
			}
		}

		if (
			Object.prototype.hasOwnProperty.call(options, "styling") &&
			options.styling
		) {
			if (
				Object.prototype.hasOwnProperty.call(
					options.styling,
					"align"
				) &&
				options.styling.align
			) {
				// Verify valid alignment. Default to 'center' if invalid.
				let newAlignment = options.styling.align;
				this.styling.align = ALIGNMENT_OPTIONS.includes(newAlignment)
					? newAlignment
					: "center";
			}

			if (
				Object.prototype.hasOwnProperty.call(
					options.styling,
					"theme"
				) &&
				options.styling.theme
			) {
				// Verify valid theme. Default to 'auto' if invalid.
				let newTheme = options.styling.theme;
				this.styling.theme = THEME_OPTIONS.includes(newTheme)
					? newTheme
					: "auto";
			}
		}
	}

	/**
	 * Remove the frame for a given name.
	 * @param {string} name - The name of the iframe
	 *
	 * @returns {void}
	 */
	destroy(name) {
		if (!name) {
			throw new Error(
				"Please select the instance you'd like to destroy. Missing 'name'."
			);
		}

		if (this.iframeHandler) {
			this.iframeHandler.teardown(name);
		}
	}

	/**
	 * Remove all frames.
	 *
	 * @returns {void}
	 */
	destroyAll() {
		if (this.iframeHandler) {
			this.iframeHandler.teardownAll();
		}
	}
}

export default UserFeedback;
