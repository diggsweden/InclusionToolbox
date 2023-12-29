import IframeHandler from "@src/embed/iframe/iframeHandler.js";

/**
 * Test Suite: IframeHandler
 *
 * Purpose:
 * This suite verifies the functionality of the IframeHandler class,
 * ensuring it correctly handles the creation, loading, and lifecycle
 * management of iframes, as well as communication via postMessage.
 *
 * Tests cover:
 * - Initialization of the IframeHandler instance with proper configurations.
 * - Creation of iframes and insertion into the DOM.
 * - Loading of iframes with specified data.
 * - Teardown of individual and all iframes from the DOM.
 */
describe("IframeHandler", () => {
	const src = "https://example-iframe.com";
	const config = { someKey: "some-value" };
	const options = { width: "300px", height: "200px" };
	let iframeHandler;

	beforeEach(() => {
		// Initialize IframeHandler before each test
		iframeHandler = new IframeHandler(src, config, options);
	});

	/**
	 * Test: Constructor Functionality
	 * Given: src, config, and options for an iframe
	 * When: Creating a new IframeHandler instance
	 * Then: It should initialize the instance with the provided properties.
	 */
	test("constructor initializes properties", () => {
		expect(iframeHandler.src).toBe(src);
		expect(iframeHandler.config).toEqual(config);
		expect(iframeHandler.options.width).toBe(options.width);
		expect(iframeHandler.options.height).toBe(options.height);
	});

	/**
	 * Test: Create Method Functionality
	 * Given: A container element and iframe name
	 * When: Using 'create' method to create an iframe
	 * Then: The iframe should be created and appended to the container with a postMessage handler set up.
	 */
	test("create method creates an iframe", () => {
		// Given
		const name = "test-iframe";
		const container = document.createElement("div");

		// When
		const iframeObj = iframeHandler.load(name, {}, container);

		// Then
		expect(iframeObj.element).toBeDefined();
		expect(iframeObj.postMessageHandler).toBeDefined();
		expect(container.contains(iframeObj.element)).toBe(true);
	});

	/**
	 * Test: Load Method Functionality
	 * Given: A container element, iframe name, and data
	 * When: Calling 'load' method to append an iframe to the container
	 * Then: The iframe should be appended to the container and set up to send data.
	 */
	test("load method appends iframe to container and sends data", () => {
		// Given
		const name = "test-iframe";
		const container = document.createElement("div");

		// When
		const iframeObj = iframeHandler.load(
			name,
			{ customData: "data" },
			container
		);

		// Then
		expect(container.contains(iframeObj.element)).toBe(true);
		expect(typeof iframeObj.postMessageHandler.send).toBe("function");
	});

	/**
	 * Test: Teardown Method Functionality
	 * Given: An iframe loaded in the DOM
	 * When: Calling 'teardown' method for the iframe
	 * Then: The specified iframe should be removed from the DOM.
	 */
	test("teardown method removes iframe from DOM", () => {
		// Given
		const name = "test-iframe";
		const container = document.createElement("div");

		// When
		const iframeObj = iframeHandler.load(name, {}, container);
		iframeHandler.teardown(name);

		// Then
		expect(container.contains(iframeObj.element)).toBe(false);
	});

	/**
	 * Test: TeardownAll Method Functionality
	 * Given: Multiple iframes loaded in the DOM
	 * When: Using 'teardownAll' method
	 * Then: All iframes managed by IframeHandler should be removed from the DOM.
	 */
	test("teardownAll method removes all iframes", () => {
		// Given
		const container = document.createElement("div");
		iframeHandler.load("iframe1", {}, container);
		iframeHandler.load("iframe2", {}, container);

		// When
		iframeHandler.teardownAll();

		// Then
		expect(container.children.length).toBe(0);
	});
});
