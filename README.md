<!--
SPDX-FileCopyrightText: 2023 Digg - Agency for Digital Government

SPDX-License-Identifier: MIT
-->

![Logo](https://docs.swedenconnect.se/technical-framework/latest/img/digg_centered.png)

# InclusionToolbox lib

[![License: MIT](https://img.shields.io/badge/Licence-MIT-yellow)](https://img.shields.io/badge/Licence-MIT-yellow) [![Standard commitment](https://img.shields.io/badge/Standard_for_public_code-commitment-green)](https://img.shields.io/badge/Standard_for_public_code-commitment-green)

[![Node: 18.17.0](https://img.shields.io/badge/Node-18.17.0-red)](https://img.shields.io/badge/Node-18.17.0-red)

[![Build system: NPM](https://img.shields.io/badge/Build_system-NPM_9.6-purple)](https://img.shields.io/badge/Build_system-NPM_9.6-purple)

<br />

## About
In the spring of 2023, the extension of the Covid project determined that to combat the challenge of digital inclusion
and to provide a more citizen-centric approach to the development of digital services, 14 directives was issued.
One of these directives was data-driven development. Since resources like time and funding is limited the perspective
of **measure first, then improve** was adopted. Providing a tool for this, a feedback system
[see also UserFeedbackAPI](https://github.com/diggsweden/UserFeedbackAPI) was introduced to collect anonymous rating
data from users of digital services.

To support a model where a drop-in library (e.g. this library) is a driver for tools ~ applications, we chose a
plugin-based architecture. Each plugin or application uses the same communication interface, **postMessage**, and is
loaded in an iFrame. This architecture coupled with the fact that each component and subcomponents are configuration
driven (no config, no display) supports a model where future changes can be fetched and configured on demand.

Currently the following plugins are available:
- [userFeedback](examples/userFeedback.html)
- [supportModal](examples/supportModal.html)

Please review the [achitecture diagram](docs/Component_diagram_feedback_app_module_in_drop_in_lib.drawio.svg) for an
overview of how the different parts are intended to work together.

**Note:** The support modal is not mainly intended to be used as a tool for collecting feedback, but rather as a tool
for collecting information and functionality usually spread out over a number of different pages in services. The
support modal as a concept is in its early stages.

## Table of Contents

- [InclusionToolbox lib](#inclusiontoolbox-lib)
	- [About](#about)
	- [Table of Contents](#table-of-contents)
	- [Installation and Requirements](#installation-and-requirements)
	- [Quick start](#quick-start)
	- [Known issues](#known-issues)
	- [Support](#support)
	- [Contributing](#contributing)
	- [Development](#development)
	- [License](#license)


## Installation and Requirements

<br/>**Steps to install**

**1.** ```git clone git@github.com:diggsweden/InclusionToolbox.git```

**2.** ```cd InclusionToolbox```

**3.** ```npm install```

**4.** ```npm run build```

**5.** Copy built JS file, **InclusionToolbox.js**, from the **./dist** folder and include the library in your project.
<br/>

- See the [sample use userFeedback](examples/userFeedback.html) for an example of how the library is imported
and the userFeedback module is invoked.
- See the [sample use supportModal](examples/supportModal.html) for an example of how the library is invoked and the
support modal is invoked.

<br/>**Requirements**

The **InclusionToolbox.js** in itself is not intended to serve the userFeedback or supportModal applications. <br/>It is
intended for the developer to configure the [.env](.env) file properties:
- **FEEDBACK_IFRAME_SRC**
- **SUPPORT_IFRAME_SRC**
<br/>(with URLs to the respective application's hosting).

The applications are available in the following repositories:
- [UserFeedbackApp](https://github.com/diggsweden/UserFeedbackApp)
- [SupportModalApp](https://github.com/diggsweden/SupportModalApp)

The library can, when hosting is solved, be released as a NPM package.

**Node 18** or above is required to build the library.

## Quick start
This library can be used within any service that is **JavaScript compatible**.

It can be used in its most simplistic form as follows (*e.g. UserFeedback*):
```JavaScript
import { UserFeedback } from 'path/to/library';

const config = {
	apiKey: "",
};

const Feedback = new UserFeedback(config);

// Embed the UserRating widget into the target element
Feedback.load(
	"ExampleFeedback",	// Name of the feedback collection
	"#feedback",		// Target element, HTMLElement|String
);
```

## Known issues

* Currently there is no support for native mobile applications for iOS/Android.

## Support

If you have questions, concerns, bug reports, etc, please file an issue in this repository's Issue Tracker.

## Contributing

General instructions on how to [contribute](CONTRIBUTING.adoc).

## Development
1. ```git clone git@github.com:diggsweden/InclusionToolbox.git```
2. ```cd InclusionToolbox```
3. ```npm install```
4. ```npm run build```

The JS file can be found in ./dist/InclusionToolbox.js
## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<br/>

----

Copyright &copy;
2021-2023, [Myndigheten för digital förvaltning - Swedish Agency for Digital Government (DIGG)](http://www.digg.se).
Licensed under the MIT license.
