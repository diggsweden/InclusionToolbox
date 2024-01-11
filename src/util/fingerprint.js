// SPDX-FileCopyrightText: 2023 Digg - Agency for Digital Government
//
// SPDX-License-Identifier: MIT

import { getCurrentBrowserFingerPrint } from "@rajesh896/broprint.js";

/**
 * Get the current browser fingerprint.
 *
 * @returns {string} The current browser fingerprint.
 */
const getFingerprint = async () => {
	try {
		const fingerprint = await getCurrentBrowserFingerPrint();
		return `${fingerprint}`;
	} catch (error) {
		console.warn(
			"Could not retrieve fingerprint. Rating may not be accurate."
		);
		return "";
	}
};

export default getFingerprint;
