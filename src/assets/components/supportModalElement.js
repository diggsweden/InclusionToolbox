import "../css/base.css";
import "../css/supportModalElement.css";
import "../fonts/Lato-Regular.ttf";
import i18next from "i18next";
import ColorContrastChecker from "color-contrast-checker";

const prefersDarkMode = () => {
	return (
		window.matchMedia &&
		window.matchMedia("(prefers-color-scheme: dark)").matches
	);
};

const createButtonIcon = (color = "#124562", enableDarkMode = false) => {
	const svgNamespace = "http://www.w3.org/2000/svg";
	const svg = document.createElementNS(svgNamespace, "svg");
	const darkMode = enableDarkMode && prefersDarkMode();

	svg.setAttributeNS(null, "fill", "none");
	svg.setAttributeNS(null, "width", "30");
	svg.setAttributeNS(null, "height", "30");
	svg.setAttributeNS(null, "viewBox", "0 0 30 30");
	const textColor = darkMode ? "#15191F" : "#FFF";
	svg.innerHTML = `
        <g clipPath='url(#clip0_1467_414)'>
            <path fill='${darkMode ? "#D4DADF" : color}' d='M15 30c8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15C6.716 0 0 6.716 0 15c0 8.284 6.716 15 15 15z'></path>
            <path fill='${textColor}' d='M14.864 20.686h-.014c-.968 0-1.745.791-1.745 1.746 0 .954.804 1.745 1.759 1.745.954 0 1.745-.79 1.745-1.745 0-.955-.79-1.746-1.745-1.746z'></path>
            <path fill='${textColor}' d='M16.898 6.343c-3.188-1.11-6.693.56-7.806 3.736-.293.794.14 1.657.938 1.938.796.292 1.664-.14 1.945-.934a3.05 3.05 0 013.903-1.857 3.058 3.058 0 012.051 2.884c0 1.576-2.637 2.825-3.551 3.129a1.53 1.53 0 00-1.032 1.366v1.354c0 .852.692 1.541 1.548 1.541.187 0 .363-.035.539-.093.164-.059.316-.152.457-.269.129-.117.246-.257.34-.409.093-.151.152-.326.187-.502 0-.058.024-.105.024-.163 0-.023 0-.058.011-.082a.84.84 0 01.106-.233c.058-.082.129-.14.2-.199.034-.023.07-.046.128-.081C18.574 16.605 21 14.9 21 12.11c0-2.592-1.64-4.892-4.09-5.767h-.012z'></path>
        </g>
        <defs>
            <clipPath id='clip0_1467_414'>
                <path fill='${textColor}' d='M0 0H30V30H0z'></path>
            </clipPath>
        </defs>
    `;

	return svg;
};

const SupportModalElement = ({ id, iframe, styling = {} }) => {
	let position = "bottomLeft";
	let hideText = false;
	let primaryColor = "#124562";
	let theme = "auto";

	// Override colors and border colors from styling if provided
	if (
		!prefersDarkMode() &&
		styling &&
		Object.prototype.hasOwnProperty.call(styling, "colors") &&
		styling.colors
	) {
		const r = document.querySelector(":root");
		const ccc = new ColorContrastChecker();

		if (
			Object.prototype.hasOwnProperty.call(styling.colors, "primary") &&
			styling.colors.primary &&
			Object.prototype.hasOwnProperty.call(styling.colors, "secondary") &&
			styling.colors.secondary
		) {
			// Has both primary and secondary colors
			if (
				ccc.isLevelAA(styling.colors.primary, styling.colors.secondary)
			) {
				r.style.setProperty(
					"--inclusion-toolbox-primary-color",
					styling.colors.primary
				);
				r.style.setProperty(
					"--inclusion-toolbox-secondary-color",
					styling.colors.secondary
				);

				primaryColor = styling.colors.primary;
			} else {
				console.warn(
					"Primary and secondary colors do not meet the minimum contrast ratio of 4.5:1. Using default colors instead."
				);
			}
		} else if (
			Object.prototype.hasOwnProperty.call(styling.colors, "primary") &&
			styling.colors.primary
		) {
			// Has only primary color
			if (
				ccc.isLevelAA(
					styling.colors.primary,
					r.style.getPropertyValue(
						"--inclusion-toolbox-secondary-color"
					)
				)
			) {
				r.style.setProperty(
					"--inclusion-toolbox-primary-color",
					styling.colors.primary
				);

				primaryColor = styling.colors.primary;
			} else {
				console.warn(
					"Primary color does not meet the minimum contrast ratio of 4.5:1. Using default colors instead."
				);
			}
		} else if (
			Object.prototype.hasOwnProperty.call(styling.colors, "secondary") &&
			styling.colors.secondary
		) {
			// Has only secondary color
			if (
				ccc.isLevelAA(
					r.style.getPropertyValue(
						"--inclusion-toolbox-primary-color"
					),
					styling.colors.secondary
				)
			) {
				r.style.setProperty(
					"--inclusion-toolbox-secondary-color",
					styling.colors.secondary
				);
			} else {
				console.warn(
					"Secondary color does not meet the minimum contrast ratio of 4.5:1. Using default colors instead."
				);
			}
		}

		if (
			Object.prototype.hasOwnProperty.call(styling.colors, "tertiary") &&
			styling.colors.tertiary
		) {
			if (ccc.isLevelCustom(styling.colors.tertiary, "#FFF", 3)) {
				r.style.setProperty(
					"--inclusion-toolbox-tertiary-color",
					styling.colors.tertiary
				);
			} else {
				console.warn(
					"Tertiary color does not meet the minimum contrast ratio of 3:1. Using default colors instead."
				);
			}
		}
	}

	if (
		styling &&
		Object.prototype.hasOwnProperty.call(styling, "position") &&
		styling.position
	) {
		position = styling.position;
	}

	if (
		styling &&
		Object.prototype.hasOwnProperty.call(styling, "iconOnly") &&
		styling.iconOnly
	) {
		hideText = styling.iconOnly;
	}

	const container = document.createElement("div");
	container.id = id;
	container.className = "support-modal-container";

	const button = document.createElement("button");
	button.id = `${id}-button`;
	button.className = "support-modal-button " + position;
	button.addEventListener("click", openModal);
	const buttonIcon = createButtonIcon(
		primaryColor,
		["dark", "auto"].includes(theme)
	);
	button.appendChild(buttonIcon);

	if (!hideText) {
		const buttonText = document.createElement("span");
		buttonText.className = "support-modal-button-text";
		buttonText.innerText = i18next.t("help") || "Help";
		button.appendChild(buttonText);
	}

	const modal = document.createElement("div");
	modal.id = `${id}-modal`;
	modal.className = "support-modal-element " + position;
	modal.style.display = "none"; // Initially hidden

	const modalContent = document.createElement("div");
	modalContent.className = "support-modal-content";

	if (iframe && iframe.element) {
		modalContent.appendChild(iframe.element);
	}

	modal.appendChild(modalContent);
	container.appendChild(button);
	container.appendChild(modal);

	// Event listeners for postMessage, if applicable
	if (iframe && iframe.postMessageHandler) {
		iframe.postMessageHandler.on("closeModal", closeModal);
	}

	function getModalElement() {
		return document.getElementById(`${id}-modal`);
	}

	function getButtonElement() {
		return document.getElementById(`${id}-button`);
	}

	function openModal() {
		const modal = getModalElement();
		modal.style.display = "block";

		const button = getButtonElement();
		button.style.display = "none";

		// Add event listeners
		document.addEventListener("click", handleOutsideClick, true);
		document.addEventListener("keydown", handleKeyPress, true);
	}

	function closeModal() {
		const modal = getModalElement();
		modal.style.display = "none";

		const button = getButtonElement();
		button.style.display = "flex";

		// Remove event listeners
		document.removeEventListener("keydown", handleKeyPress, true);
		document.removeEventListener("click", handleOutsideClick, true);
	}

	function handleOutsideClick(event) {
		const modalContent = document.querySelector(
			`#${id}-modal .support-modal-content`
		);
		if (modalContent && !modalContent.contains(event.target)) {
			closeModal();
		}
	}

	function handleKeyPress(event) {
		if (event.key === "Escape") {
			const modal = getModalElement();
			if (modal.style.display === "block") {
				closeModal();
			}
		}
	}

	return container;
};

export default SupportModalElement;
