import '@util/i18n.js';
import UserFeedback from '@service/userFeedback/userFeedback.js';
import SupportModal from '@service/supportModal/supportModal.js';
// Add more tools to include

/**
 * Main entry point for the library.

 * A collection of tools to help make your website more inclusive.
 * @see {@link https://github.com/diggsweden/SupportModalApp SupportModalApp}
 * @see {@link https://github.com/diggsweden/UserFeedbackApp UserFeedbackApp}
 * @see {@link https://github.com/diggsweden/UserFeedbackAPI UserFeedbackAPI}
 *
 * @module InclusionToolbox
 *
 * @exports UserFeedback - UserFeedback tool
 * @exports SupportModal - SupportModal tool
 */

/**
 * TODO: Possibly add a main handler class that handles the setup of all tools.
 * 		 This would allow for a single setup method that takes a config object.
 */

// Export tools
export {
	UserFeedback,
	SupportModal,
};
