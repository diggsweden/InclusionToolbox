import SupportModal from "@src/service/supportModal/supportModal.js";
import IframeHandler from "@embed/iframe/iframeHandler.js";
import ConfigManager from "@util/configManager.js";
// eslint-disable-next-line no-unused-vars
import SupportModalElement from "@src/assets/components/supportModalElement.js";

/**
 * Test Suite: SupportModal
 *
 * Purpose:
 * This suite verifies the functionality of the SupportModal class,
 * ensuring it correctly manages the lifecycle of support modal iframes,
 * including setup, loading, and configuration.
 *
 * Tests cover:
 * - Initialization and setup of the SupportModal instance.
 * - Loading of the support modal iframe with configuration data.
 * - Correct handling of options and configuration.
 */
describe("SupportModal", () => {
	let supportModal;
	const config = { links: { chat: "https://chat-link.com" } };
	const options = {
		src: "https://support-modal-iframe.com/",
		useLocalStorage: true,
	};

	beforeEach(() => {
		supportModal = new SupportModal(config, options);
	});

	/**
	 * Test: Constructor Functionality
	 * Given: User configuration and options
	 * When: Instantiating the SupportModal class
	 * Then: It should initialize with the given configuration and options.
	 */
	test("constructor initializes with configuration and options", () => {
		expect(supportModal.config).toEqual(config);
		expect(supportModal.src.toString()).toBe(options.src);
		expect(supportModal.useLocalStorage).toBe(options.useLocalStorage);
	});

	/**
	 * Test: Setup Method Functionality
	 * Given: Configuration and options for the support modal
	 * When: Setting up the SupportModal instance
	 * Then: It should correctly set up the iframeHandler and configManager.
	 */
	test("setup method initializes iframeHandler and configManager", () => {
		// When
		const instance = supportModal.setup(config, options);

		// Then
		expect(instance.iframeHandler).toBeInstanceOf(IframeHandler);
		expect(instance.configManager).toBeInstanceOf(ConfigManager);
	});
});
