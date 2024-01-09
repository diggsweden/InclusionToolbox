// SPDX-FileCopyrightText: 2023 Digg - Agency for Digital Government
//
// SPDX-License-Identifier: MIT

import "../css/iframeElement.css";

function IframeElement({
	name,
	src,
	title = null,
	width = "100%",
	height = "100%",
}) {
	const iframe = document.createElement("iframe");

	// Setting attributes to the iframe
	iframe.src = src;
	iframe.name = name;
	iframe.id = name;
	iframe.className = "inclusion-toolbox-iframe";
	iframe.title = title || name;

	// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attr-sandbox
	iframe.setAttribute(
		"sandbox",
		"allow-scripts allow-same-origin allow-forms"
	);
	iframe.setAttribute("allowTransparency", "true");
	iframe.setAttribute("scrolling", "no");
	iframe.setAttribute("frameBorder", "0");

	iframe.style.border = "none";
	iframe.style.width = width;
	iframe.style.height = height;
	iframe.style.overflow = "hidden";

	return iframe;
}

export default IframeElement;
