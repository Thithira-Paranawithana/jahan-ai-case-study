export const createMockWebixView = (id, config = {}) => {
    return {
      id,
      config: config,
      getNode: jest.fn(() => ({
        querySelector: jest.fn(() => ({
          style: {},
          addEventListener: jest.fn(),
          classList: {
            add: jest.fn(),
            remove: jest.fn(),
          },
        })),
      })),
      getValue: jest.fn(),
      setValue: jest.fn(),
      getValues: jest.fn(() => ({})),
      setValues: jest.fn(),
      validate: jest.fn(() => true),
      focus: jest.fn(),
      define: jest.fn(),
      refresh: jest.fn(),
      resize: jest.fn(),
      setHTML: jest.fn(),
      elements: {
        email: { focus: jest.fn() },
        password: { focus: jest.fn() },
      },
    };
  };
  
  export const mockWebix = {
    $$: jest.fn((id) => createMockWebixView(id)),
    message: jest.fn(() => ({ hide: jest.fn() })),
    ui: jest.fn(),
    rules: {
      isEmail: jest.fn(() => true),
      isNotEmpty: jest.fn(() => true),
    },
  };
  