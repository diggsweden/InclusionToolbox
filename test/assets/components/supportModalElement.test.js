import SupportModalElement from "@src/assets/components/supportModalElement.js";

/**
 * Test Suite: SupportModalElement
 *
 * Purpose:
 * This suite verifies the functionality of the SupportModalElement,
 * ensuring it correctly handles UI interactions and displays the support modal
 * with configurable options.
 *
 * Tests cover:
 * - Creation and rendering of the modal element.
 * - Configuration of the modal's styling and positioning.
 * - User interactions like opening and closing the modal.
 * - Integration and display of the iframe within the modal.
 */
describe("SupportModalElement", () => {
	let iframe;

	beforeEach(() => {
		// Setup a mock iframe for testing
		iframe = {
			element: document.createElement("iframe"),
			postMessageHandler: {
				on: jest.fn(),
			},
		};
	});

	/**
	 * Test: Modal Element Creation
	 * Given: Configuration options for the modal
	 * When: Creating a new SupportModalElement
	 * Then: It should create and render the modal element with specified configurations.
	 */
	test("modal element creation with configurations", () => {
		// Given
		const config = {
			id: "test-modal",
			iframe,
			styling: {
				colors: {
					primary: "#1C691B",
					secondary: "#00ff00",
					tertiary: "#000000",
				},
				position: "bottomRight",
			},
		};

		// When
		const modalElement = SupportModalElement(config);

		// Then
		expect(modalElement).toBeDefined();
		expect(
			modalElement.querySelector(".support-modal-button")
		).toBeDefined();
		expect(
			modalElement.querySelector(".support-modal-element")
		).toBeDefined();
		// Additional checks for styling, positioning, etc.
	});

	/**
	 * Test: Modal Opening and Closing
	 * Given: A SupportModalElement in the document
	 * When: Triggering open and close actions
	 * Then: The modal should display or hide accordingly.
	 */
	test("modal opening and closing", () => {
		// Given
		document.body.appendChild(
			SupportModalElement({ id: "test-modal", iframe })
		);

		// When: Opening the modal
		document.querySelector("#test-modal-button").click();

		// Then
		expect(document.querySelector("#test-modal-modal").style.display).toBe(
			"block"
		);

		// When: Closing the modal
		document.querySelector("#test-modal-modal").click(); // Assuming this triggers closeModal

		// Then
		expect(document.querySelector("#test-modal-modal").style.display).toBe(
			"none"
		);
	});

	/**
	 * Test: Button Icon Creation
	 * Given: Configuration with color options
	 * When: Creating a SupportModalElement with a custom button icon
	 * Then: The button icon should be created with the specified colors.
	 */
	test("button icon creation with custom colors", () => {
		// Given
		const config = {
			id: "test-modal",
			iframe,
			styling: {
				colors: {
					primary: "#1C691B", // Custom color
				},
			},
		};

		// When
		const modalElement = SupportModalElement(config);
		const buttonIcon = modalElement.querySelector("#test-modal-button svg");

		// Then
		expect(buttonIcon).toBeDefined();
		// Check if the fill attribute of the SVG path is the custom color
		expect(buttonIcon.querySelector("path").getAttribute("fill")).toBe(
			config.styling.colors.primary
		);
	});

	/**
	 * Test: Modal Styling and Positioning
	 * Given: Configuration with styling options
	 * When: Creating a SupportModalElement with custom styling
	 * Then: The modal should reflect the specified styling and positioning.
	 */
	test("modal styling and positioning", () => {
		// Given
		const config = {
			id: "test-modal",
			iframe,
			styling: {
				position: "topRight", // Custom position
			},
		};

		// When
		const modalElement = SupportModalElement(config);
		const modalButton = modalElement.querySelector("#test-modal-button");

		// Then
		expect(modalButton.classList.contains("topRight")).toBe(true);
	});

	/**
	 * Test: Iframe Integration within Modal
	 * Given: An iframe element to embed
	 * When: Creating a SupportModalElement with the iframe
	 * Then: The modal should contain the provided iframe.
	 */
	test("iframe integration within modal", () => {
		// Given
		const config = {
			id: "test-modal",
			iframe, // Embedding the mock iframe
		};

		// When
		const modalElement = SupportModalElement(config);
		const embeddedIframe = modalElement.querySelector("iframe");

		// Then
		expect(embeddedIframe).toBe(iframe.element);
	});
});
