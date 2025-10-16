export const mockAuthService = {
    login: jest.fn(() => Promise.resolve({
      success: true,
      user: {
        id: 1,
        fullName: 'John Doe',
        email: 'john@example.com',
      },
    })),
    register: jest.fn(),
    logout: jest.fn(),
    getCurrentUser: jest.fn(() => null),
    isAuthenticated: jest.fn(() => false),
    updateProfile: jest.fn(),
    changePassword: jest.fn(),
    deleteAccount: jest.fn(),
  };
  