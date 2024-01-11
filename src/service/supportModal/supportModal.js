// SPDX-FileCopyrightText: 2023 Digg - Agency for Digital Government
//
// SPDX-License-Identifier: MIT

import IframeHandler from "@embed/iframe/iframeHandler.js";
import ConfigManager from "@util/configManager.js";
import getFingerprint from "@util/fingerprint.js";
import messageHandlers from "./messageHandlers.js";
import SupportModalElement from "../../assets/components/supportModalElement.js";

const DEFAULT_SRC = new URL(process.env.SUPPORTMODAL_IFRAME_SRC) || null;
const DEFAULT_LOCALE = process.env.DEFAULT_LOCALE || "en";
const DEFAULT_LOCALSTORAGE = process.env.USE_LOCAL_STORAGE || true;
const ALIGNMENT_OPTIONS = ["bottomLeft", "bottomRight", "topLeft", "topRight"];
const THEME_OPTIONS = ["auto", "dark", "light"];
const LINK_OPTIONS = ["chat", "support", "faq", "contact"];
/**
 * SupportModal class.
 *
 * @param {Object} userConfig - The user configuration
 * @param {Object} options - The options
 * @param {boolean} options.useLocalStorage - (Optional) Enable/disable local storage
 * @param {Object} options.styling - (Optional) Styling options for the iframe
 * @param {string} options.src - (Optional) The iframe url
 */
class SupportModal {
	static instance = null;

	/**
	 * Create a new SupportModal instance.
	 * @param {Object} config - The configuration
	 * @param {Object} options - The options
	 * @param {string} options.src - (Optional) The iframe url
	 * @param {boolean} options.useLocalStorage - (Optional) Enable/disable local storage
	 *
	 * @returns {SupportModal} The SupportModal instance
	 */
	constructor(config = {}, options = {}) {
		//
		if (SupportModal.instance) {
			return SupportModal.instance;
		}

		this.iframeHandler = null;
		this.configManager = null;

		this.src = DEFAULT_SRC;
		this.useLocalStorage = DEFAULT_LOCALSTORAGE;
		this.config = null;
		this.styling = {
			align: ALIGNMENT_OPTIONS[0],
			theme: THEME_OPTIONS[0],
			colors: {
				primary: null,
				secondary: null,
				tertiary: null,
			},
		};

		// Optionally call Setup if config is provided
		if (Object.keys(config).length > 0) {
			return this.setup(config, options);
		}
	}

	#init() {
		if (!SupportModal.instance) {
			SupportModal.instance = this;
		}
		return SupportModal.instance;
	}

	async #generateDataObject(config) {
		const { links } = config;
		const fingerprint = await getFingerprint();
		const domain =
			window.location.hostname || (process.env.DEBUG ? "localhost" : "");
		const path = window.location.pathname;
		const locale = navigator.language || DEFAULT_LOCALE;

		return {
			features: {
				support: {
					openChat: !!(links && links.chat) || false,
					toSupportPage: !!(links && links.support) || false,
					toFAQ: !!(links && links.faq) || false,
					contactUs: !!(links && links.contact) || false,
				},
			},
			context: { fingerprint, domain, path, locale },
		};
	}

	#buildMessageHandlerConfig(config) {
		const { links } = config;

		return {
			links: {
				openChat: links && links.chat ? links.chat : null,
				toSupportPage: links && links.support ? links.support : null,
				toFAQ: links && links.faq ? links.faq : null,
				contactUs: links && links.contact ? links.contact : null,
			},
		};
	}

	/**
	 * Initialize the SupportModal instance.
	 * @param {Object} configuration - The user configuration
	 * @param {Object} options - The options
	 *
	 * @returns {SupportModal} The SupportModal instance
	 */
	setup(config, options) {
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

			// Initialize configManager if there is none
			if (!this.configManager) {
				this.configManager = new ConfigManager(this.useLocalStorage);
			}

			const messageHandlerConfig = this.#buildMessageHandlerConfig(config);

			// Initialize iframeHandler
			this.iframeHandler = new IframeHandler(
				this.src,
				this.config,
				{},
				messageHandlers,
				messageHandlerConfig
			);

			return this.#init();
		} catch (err) {
			// Report error
			console.error(err);
		}
	}

	/**
	 * Load the support modal iframe.
	 */
	async load() {
		// If the iframe handler is not initialized, initialize it
		if (!this.iframeHandler) {
			throw new Error(
				"IframeHandler is not initialized or configured. Call SupportModal.setup() first."
			);
		}

		const { align, colors } = this.styling;
		const name = "SupportModalApp";

		this.#generateDataObject(this.config).then((data) => {
			const iframe = this.iframeHandler.load(name, data);
			const modal = new SupportModalElement({
				id: "SupportModal",
				iframe,
				styling: {
					colors,
					position: align,
				},
			});

			// add modal to document
			document.body.appendChild(modal);
		});
	}

	#validateConfig(config) {
		if (!config || !Object.keys(config).length) {
			throw new Error(
				"Invalid config. Please provide a valid config object."
			);
		}

		if (
			Object.prototype.hasOwnProperty.call(config, "links") &&
			config.links
		) {
			// Verify valid links
			for (const [key, value] of Object.entries(config.links)) {
				if (!value || !["string", "function"].includes(typeof value)) {
					throw new Error(
						"Invalid config >> links. Link must be of type 'string' or 'function'."
					);
				}

				if (!LINK_OPTIONS.includes(key)) {
					throw new Error(
						`Invalid config >> links. Link must be one of the following: ${LINK_OPTIONS.join(
							", "
						)}.`
					);
				}

				if (typeof value === "string") {
					try {
						new URL(value, window.location.origin);
					} catch (err) {
						throw new Error(
							`Invalid config >> links. Link must be a valid URL. (${key}: ${value})`
						);
					}
				}
			}
		}
	}

	#setOptions(options) {
		if (Object.prototype.hasOwnProperty.call(options, "useLocalStorage")) {
			// Verify valid useLocalStorage
			if (!(typeof options.useLocalStorage === "boolean")) {
				throw new Error(
					"Invalid option >> useLocalStorage. Option must be of type Bool."
				);
			}

			this.useLocalStorage = options.useLocalStorage;
		}

		if (Object.prototype.hasOwnProperty.call(options,"src")) {
			// Verify valid source
			try {
				const newSrc = new URL(options.src);
				this.src = newSrc;
			} catch (err) {
				throw new Error("Invalid option >> src");
			}
		}

		if (Object.prototype.hasOwnProperty.call(options, "styling")) {
			if (
				Object.prototype.hasOwnProperty.call(options.styling, "align")
			) {
				// Verify valid alignment. Default to 'bottomLeft' if invalid.
				let newAlignment = options.styling.align;
				this.styling.align = ALIGNMENT_OPTIONS.includes(newAlignment)
					? newAlignment
					: ALIGNMENT_OPTIONS[0];
			}

			if (
				Object.prototype.hasOwnProperty.call(options.styling, "theme")
			) {
				// Verify valid theme. Default to 'auto' if invalid.
				let newTheme = options.styling.theme;
				this.styling.theme = THEME_OPTIONS.includes(newTheme)
					? newTheme
					: THEME_OPTIONS[0];
			}

			if (
				Object.prototype.hasOwnProperty.call(options.styling, "colors")
			) {
				// Verify valid colors
				if (typeof options.styling.colors !== "object") {
					throw new Error(
						"Invalid option >> styling >> colors. Option must be of type Object."
					);
				}

				if (
					Object.prototype.hasOwnProperty.call(
						options.styling.colors,
						"primary"
					) &&
					options.styling.colors.primary
				) {
					// Verify valid primary color
					if (
						typeof options.styling.colors.primary !== "string" ||
						!options.styling.colors.primary.match(
							/^#([0-9a-fA-F]{3}){1,2}$/i
						)
					) {
						throw new Error(
							"Invalid option >> styling >> colors >> primary. Option must be of type String and must be a valid hex color code."
						);
					}

					this.styling.colors.primary =
						options.styling.colors.primary;
				}

				if (
					Object.prototype.hasOwnProperty.call(options.styling.colors, "secondary") &&
					options.styling.colors.secondary
				) {
					// Verify valid secondary color
					if (
						typeof options.styling.colors.secondary !== "string" ||
						!options.styling.colors.secondary.match(
							/^#([0-9a-fA-F]{3}){1,2}$/i
						)
					) {
						throw new Error(
							"Invalid option >> styling >> colors >> secondary. Option must be of type String and must be a valid hex color code."
						);
					}

					this.styling.colors.secondary =
						options.styling.colors.secondary;
				}

				if (
					Object.prototype.hasOwnProperty.call(options.styling.colors, "tertiary") &&
					options.styling.colors.tertiary
				) {
					// Verify valid tertiary color
					if (
						typeof options.styling.colors.tertiary !== "string" ||
						!options.styling.colors.tertiary.match(
							/^#([0-9a-fA-F]{3}){1,2}$/i
						)
					) {
						throw new Error(
							"Invalid option >> styling >> colors >> tertiary. Option must be of type String and must be a valid hex color code."
						);
					}

					this.styling.colors.tertiary =
						options.styling.colors.tertiary;
				}
			}
		}
	}
}

export default SupportModal;
