const DEFAULT_CONFIG_PREFIX = process.env.CONFIG_PREFIX || "INCLUSION_TOOLBOX_";
/*
 * This is a singleton class that manages long lived configuration for the application.
 *
 * It is mainly built to store user configuration for the support modals later stages.
 */
class ConfigManager {
	constructor(useLocalStorage = true) {
		this.useLocalStorage = useLocalStorage;

		if (!ConfigManager.instance) {
			this.config = {};
			ConfigManager.instance = this;
		}

		return ConfigManager.instance;
	}

	#buildKey(key) {
		return `${DEFAULT_CONFIG_PREFIX}${key}`;
	}

	// Set configuration
	set(key, value) {
		let fullKey = this.#buildKey(key);

		if (this.useLocalStorage) {
			localStorage.setItem(fullKey, JSON.stringify(value));
			return;
		}

		this.config[fullKey] = value;
	}

	// Get configuration
	get(key = null) {
		let fullKey = this.#buildKey(key);

		if (this.useLocalStorage) {
			const item = localStorage.getItem(fullKey);
			return item ? JSON.parse(item) : null;
		}

		return key ? this.config[fullKey] : this.config;
	}

	// Remove a configuration setting
	remove(key) {
		let fullKey = this.#buildKey(key);

		if (this.useLocalStorage) {
			localStorage.removeItem(fullKey);
			return;
		}

		delete this.config[fullKey];
	}
}

export default ConfigManager;
