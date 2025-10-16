// Mock fetch globally
global.fetch = jest.fn();

// Mock localStorage and sessionStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

const mockSessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

global.localStorage = mockLocalStorage;
global.sessionStorage = mockSessionStorage;

// Mock console methods to reduce test output noise
const originalConsole = global.console;
global.console = {
  ...originalConsole,
  group: jest.fn(),
  groupEnd: jest.fn(),
  log: jest.fn(),
  time: jest.fn(),
  timeEnd: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Import the module after setting up mocks
const {
  API_CONFIG,
  apiRequest,
  getTokens,
  setTokens,
  clearTokens,
} = require('../../sources/config/api');

describe('API Configuration', () => {
  test('should have correct base URL', () => {
    expect(API_CONFIG.BASE_URL).toBe('http://127.0.0.1:8000/api');
  });

  test('should have correct timeout', () => {
    expect(API_CONFIG.TIMEOUT).toBe(30000);
  });

  test('should have all required endpoints', () => {
    expect(API_CONFIG.ENDPOINTS.LOGIN).toBe('/auth/login/');
    expect(API_CONFIG.ENDPOINTS.REGISTER).toBe('/auth/register/');
    expect(API_CONFIG.ENDPOINTS.LOGOUT).toBe('/auth/logout/');
    expect(API_CONFIG.ENDPOINTS.PROFILE).toBe('/auth/profile/');
    expect(API_CONFIG.ENDPOINTS.CHANGE_PASSWORD).toBe('/auth/change-password/');
    expect(API_CONFIG.ENDPOINTS.DELETE_ACCOUNT).toBe('/auth/delete-account/');
    expect(API_CONFIG.ENDPOINTS.TOKEN_REFRESH).toBe('/auth/token/refresh/');
  });
});

describe('Token Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTokens', () => {
    

    test('should return null if no tokens found', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      mockSessionStorage.getItem.mockReturnValue(null);

      const result = getTokens();

      expect(result).toBe(null);
    });
  });

  

  
});

describe('apiRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(
      JSON.stringify({ access: 'token123', refresh: 'refresh123' })
    );
  });

  describe('Successful Requests', () => {
   
    test('should make successful POST request with body', async () => {
      const requestBody = { email: 'test@test.com', password: 'pass123' };
      const mockResponse = { success: true, user: { id: 1 } };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      const result = await apiRequest('/auth/login/', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        skipAuth: true,
      });

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(requestBody),
        })
      );
    });

    test('should not add Authorization header when skipAuth is true', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      await apiRequest('/auth/login/', { skipAuth: true });

      const callArgs = global.fetch.mock.calls[0][1];
      expect(callArgs.headers.Authorization).toBeUndefined();
    });
  });

  describe('Failed Requests', () => {
    test('should handle 400 error response', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({ error: 'Invalid data' }),
      });

      const result = await apiRequest('/test/', { method: 'POST' });

      expect(result.success).toBe(false);
      expect(result.status).toBe(400);
      expect(result.data.error).toBe('Invalid data');
    });

    test('should handle 404 error response', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ error: 'Not found' }),
      });

      const result = await apiRequest('/not-found/', {});

      expect(result.success).toBe(false);
      expect(result.status).toBe(404);
    });

    test('should handle network errors', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network failure'));

      const result = await apiRequest('/test/', {});

      expect(result.success).toBe(false);
      expect(result.status).toBe(0);
      expect(result.data.error).toBe('Network failure');
    });
  });

  describe('Authorization Header', () => {  

    test('should not add Authorization header when no tokens', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      mockSessionStorage.getItem.mockReturnValue(null);

      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      await apiRequest('/test/', {});

      const callArgs = global.fetch.mock.calls[0][1];
      expect(callArgs.headers.Authorization).toBeUndefined();
    });
  });

  describe('Custom Headers', () => {
    test('should merge custom headers with default headers', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      await apiRequest('/test/', {
        headers: { 'X-Custom-Header': 'CustomValue' },
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-Custom-Header': 'CustomValue',
          }),
        })
      );
    });
  });
});
