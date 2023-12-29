import PostMessageHandler from "@src/embed/iframe/postMessageHandler.js";

/**
 * Test Suite: PostMessageHandler
 *
 * Purpose:
 * This suite verifies the functionality of the PostMessageHandler class,
 * ensuring it correctly handles communication between the parent page and iframes,
 * manages message event listeners, and processes message events accurately.
 *
 * Tests cover:
 * - Initialization of the PostMessageHandler instance with target origin and optional iframe element.
 * - Addition and removal of message event listeners in the DOM.
 * - Sending messages to a target window and handling incoming messages.
 * - Registration and deregistration of message handlers for specific message types.
 */
describe("PostMessageHandler", () => {
	const targetOrigin = "https://example.com";
	let messageHandler;
	let mockWindow;

	// Setup before each test
	beforeEach(() => {
		// Mock the window object
		mockWindow = {
			postMessage: jest.fn(),
		};

		// Initialize the PostMessageHandler
		messageHandler = new PostMessageHandler(targetOrigin, mockWindow);

		// Spy on window event listener methods
		jest.spyOn(window, "addEventListener");
		jest.spyOn(window, "removeEventListener");
	});

	// Cleanup after each test
	afterEach(() => {
		jest.restoreAllMocks();
	});

	/**
	 * Test: Constructor Functionality
	 * Given: A target origin and an optional iframe element
	 * When: Instantiating PostMessageHandler
	 * Then: It should correctly set the targetOrigin.
	 */
	test("constructor sets targetOrigin", () => {
		expect(messageHandler.targetOrigin).toBe(targetOrigin);
	});

	/**
	 * Test: Listener Management
	 * Given: A PostMessageHandler instance
	 * When: Calling listen and stopListening methods
	 * Then: It should add and remove event listeners from the window object.
	 */
	test("listen and stopListening handle event listeners", () => {
		// When
		messageHandler.listen();

		// Then
		expect(window.addEventListener).toHaveBeenCalledWith(
			"message",
			expect.any(Function),
			false
		);

		// When
		messageHandler.stopListening();

		// Then
		expect(window.removeEventListener).toHaveBeenCalledWith(
			"message",
			expect.any(Function),
			false
		);
	});

	/**
	 * Test: Send Method Functionality
	 * Given: A message and a mock window object
	 * When: Calling the send method of PostMessageHandler
	 * Then: It should use the mock window to post the message.
	 */
	test("send method posts a message", () => {
		// Given
		const message = { type: "test", data: {} };

		// When
		messageHandler.send(message, mockWindow);

		// Then
		expect(mockWindow.postMessage).toHaveBeenCalledWith(
			message,
			targetOrigin
		);
	});

	/**
	 * Test: Receive Method Functionality
	 * Given: A mock handler and a message event
	 * When: The receive method is triggered with an event
	 * Then: It should invoke the registered handler for that message type.
	 */
	test("receive method handles incoming messages", () => {
		// Given
		const mockHandler = jest.fn();
		const messageType = "test-type";
		const payload = { data: "sample-data" };

		const event = new MessageEvent("message", {
			origin: targetOrigin,
			data: { type: messageType, data: payload },
		});

		// When
		messageHandler.on(messageType, mockHandler);
		messageHandler.receive(event);

		// Then
		expect(mockHandler).toHaveBeenCalledWith(payload);
	});

	/**
	 * Test: Off Method Functionality
	 * Given: A registered message handler
	 * When: Calling the off method to deregister the handler
	 * Then: The handler should not be called for subsequent messages of that type.
	 */
	test("off method removes a message handler", () => {
		// Given
		const mockHandler = jest.fn();
		const messageType = "test-type";
		const event = new MessageEvent("message", {
			origin: targetOrigin,
			data: { type: messageType, data: {} },
		});

		jest.spyOn(console, 'warn').mockImplementation(() => {});

		// When
		messageHandler.on(messageType, mockHandler);
		messageHandler.off(messageType);
		messageHandler.receive(event);

		// Then
		expect(mockHandler).not.toHaveBeenCalled();
		expect(console.warn).toHaveBeenCalledWith("No handler registered for message type:", messageType);

		// Clean up
		console.warn.mockRestore();
	});
});
