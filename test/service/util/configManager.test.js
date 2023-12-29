import ConfigManager from "@src/util/configManager.js";

/**
 * Test Suite: ConfigManager
 *
 * Purpose:
 * This suite verifies the functionality of the ConfigManager class.
 * It ensures that the class correctly manages in-memory configuration settings,
 * handling storage and retrieval of configurations, both in-memory and using localStorage.
 *
 * Tests cover:
 * - Singleton pattern enforcement for ConfigManager instance.
 * - Ability to set, get, and remove configuration settings.
 * - Correct handling of in-memory and localStorage based on configuration.
 */

describe("ConfigManager", () => {
	let configManager;

	afterEach(() => {
		// Reset ConfigManager.instance to null after each test
		ConfigManager.instance = null;
	});

	/**
	 * Test: Constructor Enforces Singleton Pattern
	 * Given: An existing ConfigManager instance
	 * When: Attempting to create a new instance
	 * Then: It should return the existing instance, enforcing the singleton pattern.
	 */
	test("constructor enforces singleton pattern", () => {
		// Given
		const firstInstance = new ConfigManager();

		// When
		const secondInstance = new ConfigManager();

		// Then
		expect(firstInstance).toBe(secondInstance);
	});

	/**
	 * Test: Set and Get Configuration
	 * Given: A key-value pair for configuration
	 * When: The 'set' method is called to store the configuration, and 'get' is called to retrieve it
	 * Then: The stored value should match the retrieved value.
	 */
	test("set and get configuration", () => {
		// Given
		configManager = new ConfigManager(false); // Use in-memory storage
		const key = "test-key";
		const value = "test-value";

		// When
		configManager.set(key, value);

		// Then
		expect(configManager.get(key)).toBe(value);
	});

	/**
	 * Test: Remove Configuration
	 * Given: A stored configuration setting
	 * When: The 'remove' method is called for a configuration key
	 * Then: The configuration for that key should be removed.
	 */
	test("remove configuration", () => {
		// Given
		configManager = new ConfigManager(false); // Use in-memory storage
		const key = "test-key";
		configManager.set(key, "value");

		// When
		configManager.remove(key);

		// Then
		expect(configManager.get(key)).toBeUndefined();
	});

	/**
	 * Test: localStorage Interaction
	 * Given: ConfigManager is configured to use localStorage
	 * When: Setting, getting, and removing configuration values
	 * Then: It should store, retrieve, and remove values correctly using localStorage, with the default prefix applied.
	 */
	test("localStorage interaction", () => {
		// Mock localStorage
		Storage.prototype.setItem = jest.fn();
		Storage.prototype.getItem = jest.fn();
		Storage.prototype.removeItem = jest.fn();

		// Given
		configManager = new ConfigManager(true);
		const key = "test-key";
		const value = "test-value";
		const expectedPrefix =
			process.env.CONFIG_PREFIX || "INCLUSION_TOOLBOX_";

		// When: Setting a value
		configManager.set(key, value);

		// Then: localStorage should be used with the prefixed key
		expect(localStorage.setItem).toHaveBeenCalledWith(
			expect.stringContaining(expectedPrefix),
			JSON.stringify(value)
		);

		// When: Getting the value
		configManager.get(key);

		// Then: localStorage should be used for retrieval
		expect(localStorage.getItem).toHaveBeenCalledWith(
			expect.stringContaining(expectedPrefix)
		);

		// When: Removing the value
		configManager.remove(key);

		// Then: localStorage should be used for removal
		expect(localStorage.removeItem).toHaveBeenCalledWith(
			expect.stringContaining(expectedPrefix)
		);
	});

	/**
	 * Test: Handling Null or Undefined Keys
	 * Given: Null or undefined key
	 * When: Attempting to get or remove configuration with such keys
	 * Then: It should handle these keys gracefully without errors.
	 */
	test("handles null or undefined keys gracefully", () => {
		// Given
		configManager = new ConfigManager(false);

		// When / Then
		expect(() => configManager.get(null)).not.toThrow();
		expect(() => configManager.remove(undefined)).not.toThrow();
	});

	/**
	 * Test: Default Prefix Application
	 * Given: A key for configuration
	 * When: Setting a configuration using ConfigManager with localStorage
	 * Then: The default prefix should be present in the keys used in localStorage.
	 */
	test("default prefix is applied to keys in localStorage", () => {
		// Given
		configManager = new ConfigManager(true); // Use localStorage
		const key = "testKey";
		const value = "testValue";
		const expectedPrefix =
			process.env.CONFIG_PREFIX || "INCLUSION_TOOLBOX_";

		// When: Setting a value
		configManager.set(key, value);

		// Then: The key used in localStorage should contain the default prefix
		expect(localStorage.setItem).toHaveBeenCalledWith(
			expect.stringContaining(expectedPrefix),
			JSON.stringify(value)
		);
	});
});
