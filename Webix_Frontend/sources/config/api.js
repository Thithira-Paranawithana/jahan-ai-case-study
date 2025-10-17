// API Configuration
export const API_CONFIG = {
    BASE_URL: 'http://127.0.0.1:8000/api',
    TIMEOUT: 30000, // 30 seconds
    ENDPOINTS: {
        // Auth endpoints
        LOGIN: '/auth/login/',
        REGISTER: '/auth/register/',
        LOGOUT: '/auth/logout/',
        PROFILE: '/auth/profile/',
        CHANGE_PASSWORD: '/auth/change-password/',
        DELETE_ACCOUNT: '/auth/delete-account/',
        TOKEN_REFRESH: '/auth/token/refresh/',
    }
};

//  function to make API calls 
export const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    // Log request
    console.group(`API Request: ${options.method || 'GET'} ${endpoint}`);
    console.log('Request URL:', url);
    console.log('Request Options:', {
        method: options.method || 'GET',
        headers: options.headers,
        body: options.body ? JSON.parse(options.body) : null
    });
    console.time('Request Duration');
    
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };
    
    // Add authorization token if available
    const tokens = getTokens();
    if (tokens && tokens.access && !options.skipAuth) {
        defaultHeaders['Authorization'] = `Bearer ${tokens.access}`;
        console.log('Authorization token added');
    }
    
    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };
    
    try {
        const response = await fetch(url, config);
        const data = await response.json();
        
        console.timeEnd('Request Duration');
        console.log('Response Status:', response.status, response.statusText);
        console.log('Response Data:', data);
        
        // Handle token expiration (401)
        if (response.status === 401 && !options.skipAuth) {
            console.warn('Token expired, attempting refresh...');
            
            const refreshed = await refreshAccessToken();
            if (refreshed) {
                console.log('Token refreshed successfully, retrying request...');
                console.groupEnd();
                return apiRequest(endpoint, options);
            } else {
                console.error('Token refresh failed, logging out...');
                logout();
                console.groupEnd();
                throw new Error('Session expired. Please login again.');
            }
        }
        
        if (response.ok) {
            console.log('Request successful');
        } else {
            console.error('Request failed:', data.error || data);
        }
        
        console.groupEnd();
        
        return {
            success: response.ok,
            status: response.status,
            data: data
        };
        
    } catch (error) {
        console.timeEnd('Request Duration');
        console.error('Network Error:', error.message);
        console.groupEnd();
        
        return {
            success: false,
            status: 0,
            data: { error: error.message || 'Network error occurred' }
        };
    }
};


// token management 
export const getTokens = () => {
    const tokensStr = localStorage.getItem('authTokens') || sessionStorage.getItem('authTokens');
    return tokensStr ? JSON.parse(tokensStr) : null;
};

export const setTokens = (tokens, remember = false) => {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('authTokens', JSON.stringify(tokens));
};

export const clearTokens = () => {
    localStorage.removeItem('authTokens');
    sessionStorage.removeItem('authTokens');
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
};

// Refresh access token
const refreshAccessToken = async () => {
    const tokens = getTokens();
    if (!tokens || !tokens.refresh) {
        return false;
    }
    
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TOKEN_REFRESH}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                refresh: tokens.refresh
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            const newTokens = {
                access: data.access,
                refresh: tokens.refresh 
            };
            
            // Update tokens in storage
            const remember = !!localStorage.getItem('authTokens');
            setTokens(newTokens, remember);
            
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('Token refresh error:', error);
        return false;
    }
};

// Logout helper
const logout = () => {
    console.log('Clearing tokens and redirecting to login');
    clearTokens();
    document.body.classList.remove("authenticated");
    
    // Force full reload to login
    window.location.href = window.location.origin + window.location.pathname + '#!/login';
    window.location.reload();
};


