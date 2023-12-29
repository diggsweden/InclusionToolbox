import UserFeedback from "@src/service/userFeedback/userFeedback.js";

/**
 * Test Suite: UserFeedback
 *
 * Purpose:
 * This suite verifies the functionality of the UserFeedback class.
 * It ensures that the class correctly manages the lifecycle and configuration
 * of user feedback iframes, including their creation, loading, and destruction.
 *
 * Tests cover:
 * - Singleton pattern enforcement for UserFeedback instance.
 * - Initialization and setup with user configuration and options.
 * - Loading of feedback iframes into specified DOM elements.
 * - Destruction of individual and all iframes.
 */

describe("UserFeedback", () => {
	let userFeedback;
	const userConfig = { apiKey: "test-api-key" };
	const options = { src: "https://example-feedback-iframe.com/" };
	const iframeName = "test-iframe";
	const targetElement = document.createElement("div");

	afterEach(() => {
		// Reset UserFeedback.instance to null or undefined after each test
		UserFeedback.instance = null;
	});

	/**
	 * Test: Constructor Enforces Singleton Pattern
	 * Given: An existing UserFeedback instance
	 * When: Attempting to create a new instance
	 * Then: It should throw an error preventing multiple instances.
	 */
	test("constructor enforces singleton pattern", () => {
		// Given
		userFeedback = new UserFeedback(userConfig, options);

		// When / Then
		expect(() => new UserFeedback()).toThrow(
			"You cannot create multiple instances"
		);
	});

	/**
	 * Test: Setup Functionality
	 * Given: User configuration and options
	 * When: UserFeedback instance is initialized
	 * Then: It should correctly set up with the provided configuration and options.
	 */
	test("setup initializes instance with config and options", () => {
		// Given / When
		userFeedback = new UserFeedback(userConfig, options);

		// Then
		expect(userFeedback.config).toEqual(userConfig);
		expect(userFeedback.src.toString()).toBe(options.src);
	});

	/**
	 * Test: Load Method Functionality
	 * Given: A target DOM element
	 * When: 'load' method is called with an iframe name and target element
	 * Then: It should append an iframe to the target element.
	 */
	test("load method appends iframe to target", () => {
		// Given
		userFeedback = new UserFeedback(userConfig, options);

		// When
		userFeedback.load(iframeName, targetElement);

		// Then
		expect(targetElement.querySelector("iframe")).toBeDefined();
	});

	/**
	 * Test: Load Method Returns Correct Configuration
	 * Given: A target DOM element and expected configuration
	 * When: 'load' method is called
	 * Then: It should return an iframe with the correct configuration.
	 */
	test("load method appends iframe to target and returns iframe with correct config", () => {
		// Given
		userFeedback = new UserFeedback(userConfig, options);
		// When
		// eslint-disable-next-line jest/valid-expect-in-promise
		userFeedback.load(iframeName, targetElement).then((iframe) => {
			// Then: verify that load was called with the correct parameters
			expect(userFeedback.iframeHandler.load).toHaveBeenCalledWith(
				iframeName,
				expect.anything(), // Since the exact data structure is generated internally
				targetElement
			);

			// Then: verify the iframe element
			expect(iframe).toBeDefined();
			expect(iframe.tagName).toBe("IFRAME");
			expect(iframe.parentNode).toBe(targetElement);

			// Then: verify the configuration on the iframe element
			const config = JSON.parse(iframe.dataset.config);
			expect(config).toBeDefined();
			expect(config.config.apiKey).toBe(userConfig.apiKey);
		});
	});


	/**
	 * Test: Destroy Method Functionality
	 * Given: An iframe loaded in the DOM
	 * When: 'destroy' method is called for a specific iframe
	 * Then: It should remove the specified iframe from the DOM.
	 */
	test("destroy method removes specified iframe", () => {
		// Given
		userFeedback = new UserFeedback(userConfig, options);
		userFeedback.load(iframeName, targetElement);

		// When
		userFeedback.destroy(iframeName);

		// Then
		expect(targetElement.querySelector("iframe")).toBeNull();
	});

	/**
	 * Test: DestroyAll Method Functionality
	 * Given: Multiple iframes loaded in the DOM
	 * When: 'destroyAll' method is called
	 * Then: It should remove all iframes from the DOM.
	 */
	test("destroyAll method removes all iframes", () => {
		// Given
		userFeedback = new UserFeedback(userConfig, options);
		userFeedback.load("iframe1", targetElement);
		userFeedback.load("iframe2", targetElement);

		// When
		userFeedback.destroyAll();

		// Then
		expect(targetElement.children.length).toBe(0);
	});
});
