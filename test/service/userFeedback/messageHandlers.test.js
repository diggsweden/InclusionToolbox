// SPDX-FileCopyrightText: 2023 Digg - Agency for Digital Government
//
// SPDX-License-Identifier: MIT

import messageHandlers from "@src/service/userFeedback/messageHandlers.js";

/**
 * Test Suite: Message Handlers
 *
 * Purpose:
 * This suite verifies the functionality of the message handlers used in
 * the embed iframe. It ensures that each handler correctly processes
 * incoming messages and performs the appropriate actions.
 *
 * Tests cover:
 * - The 'loaded' handler's ability to log information about iframe load events.
 * - The 'resize' handler's functionality in adjusting the iframe's height.
 */
describe("Message Handlers", () => {
	// Mock global environment variable
	const originalEnv = process.env;

	beforeEach(() => {
		jest.resetModules();
		process.env = { ...originalEnv, DEBUG: true };
	});

	afterEach(() => {
		process.env = originalEnv;
	});

	/**
	 * Test: Loaded Handler Functionality
	 * Given: An environment with DEBUG set to true
	 * When: The 'loaded' handler is triggered with a payload
	 * Then: It should log the iframe load information.
	 */
	test("loaded handler logs iframe load info", () => {
		// Given
		console.info = jest.fn();

		// When
		messageHandlers.loaded({ someData: "data" });

		// Then
		expect(console.info).toHaveBeenCalledWith("iFrame loaded", {
			someData: "data",
		});
	});

	/**
	 * Test: Resize Handler Functionality
	 * Given: An iframe element and a new height value
	 * When: The 'resize' handler is called with height and iframe
	 * Then: The iframe's height should be adjusted to the new value.
	 */
	test("resize handler adjusts iframe height", () => {
		// Given
		const iframe = document.createElement("iframe");
		const newHeight = "300";

		// When
		messageHandlers.resize({ height: newHeight }, iframe);

		// Then
		expect(iframe.style.height).toBe(newHeight + "px");
	});
});
