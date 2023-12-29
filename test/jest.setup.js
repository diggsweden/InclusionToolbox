import {
	jest,
	describe,
	beforeEach,
	beforeAll,
	afterAll,
	afterEach,
	test,
	expect,
} from "@jest/globals";

// Set up Jest globals
global.afterAll = afterAll;
global.afterEach = afterEach;
global.beforeAll = beforeAll;
global.beforeEach = beforeEach;
global.describe = describe;
global.test = test;
global.expect = expect;
global.jest = jest;

// Set up fake timers
jest.useFakeTimers();

// Mocked values for test suite
process.env.FEEDBACK_IFRAME_SRC = "https://example-feedback-iframe.com";
process.env.SUPPORTMODAL_IFRAME_SRC = "https://example-support-iframe.com";
