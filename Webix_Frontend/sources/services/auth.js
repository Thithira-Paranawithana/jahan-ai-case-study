
class AuthService {
	constructor() {
		this.currentUser = null;
		// dummy user for testing 
		this.dummyUser = {
			email: "john@example.com",
			password: "Password@123",  
			fullName: "John Doe",
			id: 1
		};
	}

	login(email, password, remember = false) {
		// check against dummy user
		if (email === this.dummyUser.email && password === this.dummyUser.password) {
			this.currentUser = {
				id: this.dummyUser.id,
				fullName: this.dummyUser.fullName,
				email: this.dummyUser.email,
				password: this.dummyUser.password 
			};
			
			// store in storage
			const storage = remember ? localStorage : sessionStorage;
			storage.setItem("currentUser", JSON.stringify(this.currentUser));
			
			return { success: true, user: this.currentUser };
		}
		
		return { success: false, error: "Invalid email or password" };
	}

	register(fullName, email, password) {
		const newUser = {
			id: Date.now(),
			fullName: fullName,
			email: email,
			password: password
		};
		
		this.currentUser = newUser;
		sessionStorage.setItem("currentUser", JSON.stringify(newUser));
		
		return { success: true, user: newUser };
	}

	getCurrentUser() {
		if (this.currentUser) return this.currentUser;
		
		// check storage
		let user = sessionStorage.getItem("currentUser");
		if (!user) user = localStorage.getItem("currentUser");
		
		if (user) {
			this.currentUser = JSON.parse(user);
			return this.currentUser;
		}
		
		return null;
	}

	isAuthenticated() {
		return this.getCurrentUser() !== null;
	}

	logout() {
		this.currentUser = null;
		localStorage.removeItem("currentUser");
		sessionStorage.removeItem("currentUser");
		return { success: true };
	}

	updateProfile(userData) {
		const currentUser = this.getCurrentUser();
		if (!currentUser) {
			return { success: false, error: "Not authenticated" };
		}

		this.currentUser = { ...currentUser, ...userData };
		
		//  which storage to use
		const storage = localStorage.getItem("currentUser") ? localStorage : sessionStorage;
		storage.setItem("currentUser", JSON.stringify(this.currentUser));
		
		return { success: true, user: this.currentUser };
	}

	changePassword(currentPassword, newPassword) {
		const currentUser = this.getCurrentUser();
		if (!currentUser) {
			return { success: false, error: "Not authenticated" };
		}

		// verify current password
		if (currentUser.password !== currentPassword) {
			return { success: false, error: "Current password is incorrect" };
		}

		// update password
		this.currentUser = { ...currentUser, password: newPassword };
		
		const storage = localStorage.getItem("currentUser") ? localStorage : sessionStorage;
		storage.setItem("currentUser", JSON.stringify(this.currentUser));
		
		return { success: true, message: "Password changed successfully" };
	}

	updateNotificationPreferences(preferences) {
		const currentUser = this.getCurrentUser();
		if (!currentUser) {
			return { success: false, error: "Not authenticated" };
		}
	
		// Update notification preferences
		this.currentUser = { 
			...currentUser, 
			notificationPreferences: preferences 
		};
		
		//  which storage to use
		const storage = localStorage.getItem("currentUser") ? localStorage : sessionStorage;
		storage.setItem("currentUser", JSON.stringify(this.currentUser));
		
		return { success: true, preferences: preferences };
	}

	updatePrivacySettings(settings) {
		const currentUser = this.getCurrentUser();
		if (!currentUser) {
			return { success: false, error: "Not authenticated" };
		}
	
		// Update privacy settings
		this.currentUser = { 
			...currentUser, 
			privacySettings: settings 
		};
		
		//which storage to use
		const storage = localStorage.getItem("currentUser") ? localStorage : sessionStorage;
		storage.setItem("currentUser", JSON.stringify(this.currentUser));
		
		return { success: true, settings: settings };
	}

	deleteAccount() {
		try {
			// Remove user data
			localStorage.removeItem("currentUser");
			localStorage.removeItem("userTheme");
			
			return { 
				success: true 
			};
		} catch (error) {
			console.error("Delete account error:", error);
			return { 
				success: false, 
				error: "Failed to delete account" 
			};
		}
	}
	
	
	
}

export default new AuthService();
