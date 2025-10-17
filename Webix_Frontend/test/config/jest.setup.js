import '@testing-library/jest-dom';

// Mock webix globally
global.webix = {
  $$: jest.fn(),
  message: jest.fn(() => ({ hide: jest.fn() })),
  ui: jest.fn(),
  ready: jest.fn((callback) => callback()),
  rules: {
    isEmail: jest.fn(),
    isNotEmpty: jest.fn(),
  },
};

// Mock document.body methods
document.body.classList = {
  add: jest.fn(),
  remove: jest.fn(),
  contains: jest.fn(),
};

// Mock setTimeout and clearTimeout
global.setTimeout = jest.fn((fn) => fn());
global.clearTimeout = jest.fn();
