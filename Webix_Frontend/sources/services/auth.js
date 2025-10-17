
import { API_CONFIG, apiRequest, getTokens, setTokens, clearTokens } from '../config/api';

//  transform backend user data to frontend format (camelCase)
 
const transformUserFromBackend = (backendUser) => {
    if (!backendUser) return null;
    
    return {
        id: backendUser.id,
        fullName: backendUser.full_name,
        email: backendUser.email,
        country: backendUser.country,
        countryCode: backendUser.country_code,
        phone: backendUser.phone,
        dateOfBirth: backendUser.date_of_birth,
        gender: backendUser.gender,
        dateJoined: backendUser.date_joined
    };
};


const transformUserToBackend = (frontendUser) => {
    if (!frontendUser) return null;
    
    return {
        full_name: frontendUser.fullName,
        email: frontendUser.email,
        country: frontendUser.country,
        country_code: frontendUser.countryCode,
        phone: frontendUser.phone,
        date_of_birth: frontendUser.dateOfBirth,
        gender: frontendUser.gender
    };
};

class AuthService {
    constructor() {
        this.currentUser = null;
    }

    /**
     * Login user with email and password
     * @param {string} email 
     * @param {string} password 
     * @param {boolean} remember 
     * @returns {Promise<Object>}
     */
    
	async login(email, password, remember = false) {
		try {
			const response = await apiRequest(API_CONFIG.ENDPOINTS.LOGIN, {
				method: 'POST',
				body: JSON.stringify({ email, password }),
				skipAuth: true
			});
	
			if (response.success && response.data.success) {
				// Store tokens
				setTokens(response.data.tokens, remember);
				
				// Transform and store user data
				const user = transformUserFromBackend(response.data.user);
				this.currentUser = user;
				const storage = remember ? localStorage : sessionStorage;
				storage.setItem('currentUser', JSON.stringify(user));
				
				return { 
					success: true, 
					user: user 
				};
			} else {
				return { 
					success: false, 
					error: response.data.error || 'Login failed' 
				};
			}
		} catch (error) {
			console.error('Login error:', error);
			return { 
				success: false, 
				error: error.message || 'An error occurred during login' 
			};
		}
	}
	

    /**
     * Register new user
     * @param {string} fullName 
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<Object>}
     */
    
	async register(fullName, email, password) {
		try {
			const response = await apiRequest(API_CONFIG.ENDPOINTS.REGISTER, {
				method: 'POST',
				body: JSON.stringify({ 
					full_name: fullName,
					email, 
					password 
				}),
				skipAuth: true
			});
	
			if (response.success && response.data.success) {
				// Store tokens
				setTokens(response.data.tokens, false);
				
				// Transform and store user data
				const user = transformUserFromBackend(response.data.user);
				this.currentUser = user;
				sessionStorage.setItem('currentUser', JSON.stringify(user));
				
				return { 
					success: true, 
					user: user 
				};
			} else {
				if (response.data.errors) {
					return { 
						success: false, 
						errors: response.data.errors 
					};
				}
				return { 
					success: false, 
					error: response.data.error || 'Registration failed' 
				};
			}
		} catch (error) {
			console.error('Register error:', error);
			return { 
				success: false, 
				error: error.message || 'An error occurred during registration' 
			};
		}
	}
	

    /**
     * Logout user
     * @returns {Promise<Object>}
     */
    async logout() {
        try {
            const tokens = getTokens();
            
            if (tokens && tokens.refresh) {
                // Call logout API to blacklist token
                await apiRequest(API_CONFIG.ENDPOINTS.LOGOUT, {
                    method: 'POST',
                    body: JSON.stringify({ refresh_token: tokens.refresh })
                });
            }
            
            // Clear local data
            this.currentUser = null;
            clearTokens();
            
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            // Even if API call fails, clear local data
            this.currentUser = null;
            clearTokens();
            return { success: true };
        }
    }

    /**
     * Get current logged in user
     * @returns {Object|null}
     */
    getCurrentUser() {
        if (this.currentUser) return this.currentUser;
        
        // Check storage
        let userStr = sessionStorage.getItem('currentUser');
        if (!userStr) userStr = localStorage.getItem('currentUser');
        
        if (userStr) {
            this.currentUser = JSON.parse(userStr);
            return this.currentUser;
        }
        
        return null;
    }

    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    isAuthenticated() {
        const tokens = getTokens();
        return tokens !== null && tokens.access !== null;
    }

	/**
	 * Fetch user profile from backend
	 * @returns {Promise<Object>}
	 */
	async getProfile() {
		console.log('Fetching user profile from backend...');
		
		try {
			const response = await apiRequest(API_CONFIG.ENDPOINTS.PROFILE, {
				method: 'GET'
			});

			if (response.success && response.data.success) {
				// Transform backend response to frontend format
				const user = transformUserFromBackend(response.data.user);
				this.currentUser = user;
				
				// Update in storage
				const storage = localStorage.getItem('currentUser') ? localStorage : sessionStorage;
				storage.setItem('currentUser', JSON.stringify(user));
				
				console.log('Profile fetched successfully:', user);
				
				return { 
					success: true, 
					user: user 
				};
			} else {
				console.warn('Failed to fetch profile:', response.data.error);
				return { 
					success: false, 
					error: response.data.error || 'Failed to fetch profile' 
				};
			}
		} catch (error) {
			console.error('Get profile error:', error);
			return { 
				success: false, 
				error: error.message || 'An error occurred while fetching profile' 
			};
		}
	}


    // Placeholder methods (to be implemented in next steps)
    async updateProfile(userData) {
		try {
			// Transform frontend data to backend format
			const backendData = transformUserToBackend(userData);
			
			const response = await apiRequest(API_CONFIG.ENDPOINTS.PROFILE, {
				method: 'PUT',
				body: JSON.stringify(backendData)
			});
	
			if (response.success && response.data.success) {
				console.log('Updated successfully');
				// Transform backend response to frontend format
				const user = transformUserFromBackend(response.data.user);
				this.currentUser = user;
				
				// Update in storage
				const storage = localStorage.getItem('currentUser') ? localStorage : sessionStorage;
				storage.setItem('currentUser', JSON.stringify(user));
				
				return { 
					success: true, 
					user: user 
				};
			} else {
				if (response.data.errors) {
					return { 
						success: false, 
						errors: response.data.errors 
					};
				}
				return { 
					success: false, 
					error: response.data.error || 'Update failed' 
				};
			}
		} catch (error) {
			console.error('Update profile error:', error);
			return { 
				success: false, 
				error: error.message || 'An error occurred while updating profile' 
			};
		}
	}
	

    /**
	 * Change user password
	 * @param {string} currentPassword 
	 * @param {string} newPassword 
	 * @param {string} confirmPassword 
	 * @returns {Promise<Object>}
	 */
	async changePassword(currentPassword, newPassword, confirmPassword) {
		console.log('Changing password');
		
		try {
			const response = await apiRequest(API_CONFIG.ENDPOINTS.CHANGE_PASSWORD, {
				method: 'POST',
				body: JSON.stringify({
					current_password: currentPassword,
					new_password: newPassword,
					confirm_password: confirmPassword
				})
			});

			if (response.success && response.data.success) {
				console.log('Password changed successfully');
				
				return { 
					success: true, 
					message: response.data.message || 'Password changed successfully'
				};
			} else {
				console.warn('Password change failed:', response.data.errors || response.data.error);
				
				// Handle validation errors
				if (response.data.errors) {
					// Extract first error message
					const firstField = Object.keys(response.data.errors)[0];
					const errorMessage = response.data.errors[firstField][0];
					
					return { 
						success: false, 
						error: errorMessage,
						errors: response.data.errors
					};
				}
				
				return { 
					success: false, 
					error: response.data.error || 'Failed to change password' 
				};
			}
		} catch (error) {
			console.error('Change password error:', error);
			return { 
				success: false, 
				error: error.message || 'An error occurred while changing password' 
			};
		}
	}


    /**
	 * Delete user account (permanent deletion)
	 * @param {string} password - User's password for confirmation
	 * @param {string} confirmation - Must be "DELETE"
	 * @returns {Promise<Object>}
	 */
	async deleteAccount(password, confirmation) {
		console.log('Deleting account');
		
		try {
			const tokens = getTokens();
			
			const response = await apiRequest(API_CONFIG.ENDPOINTS.DELETE_ACCOUNT, {
				method: 'DELETE',
				body: JSON.stringify({
					password: password,
					confirmation: confirmation,
					refresh_token: tokens?.refresh
				})
			});

			if (response.success && response.data.success) {
				console.log('Account deleted successfully');
				
				// Clear all local data
				this.currentUser = null;
				clearTokens();
				
				return { 
					success: true, 
					message: response.data.message || 'Account deleted successfully'
				};
			} else {
				console.warn('Account deletion failed:', response.data.errors || response.data.error);
				
				// Handle validation errors
				if (response.data.errors) {
					return { 
						success: false, 
						errors: response.data.errors
					};
				}
				
				return { 
					success: false, 
					error: response.data.error || 'Failed to delete account' 
				};
			}
		} catch (error) {
			console.error('Delete account error:', error);
			return { 
				success: false, 
				error: error.message || 'An error occurred while deleting account' 
			};
		}
	}


    // Keep these for backwards compatibility (notifications/privacy stored locally for now)
    updateNotificationPreferences(preferences) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) {
            return { success: false, error: "Not authenticated" };
        }
    
        this.currentUser = { 
            ...currentUser, 
            notificationPreferences: preferences 
        };
        
        const storage = localStorage.getItem("currentUser") ? localStorage : sessionStorage;
        storage.setItem("currentUser", JSON.stringify(this.currentUser));
        
        return { success: true, preferences: preferences };
    }

    updatePrivacySettings(settings) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) {
            return { success: false, error: "Not authenticated" };
        }
    
        this.currentUser = { 
            ...currentUser, 
            privacySettings: settings 
        };
        
        const storage = localStorage.getItem("currentUser") ? localStorage : sessionStorage;
        storage.setItem("currentUser", JSON.stringify(this.currentUser));
        
        return { success: true, settings: settings };
    }
}

export default new AuthService();
