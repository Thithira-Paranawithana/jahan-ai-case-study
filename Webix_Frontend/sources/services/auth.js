
class AuthService {
	constructor() {
		this.currentUser = null;
		// dummy user for testing
		this.dummyUser = {
			email: "john@example.com",
			password: "password123",
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
				email: this.dummyUser.email
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
			email: email
		};
		
		this.currentUser = newUser;
		sessionStorage.setItem("currentUser", JSON.stringify(newUser));
		
		return { success: true, user: newUser };
	}

	getCurrentUser() {
		if (this.currentUser) return this.currentUser;
		
		// Check storage
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

		// Merge new data with existing user data
		this.currentUser = { ...currentUser, ...userData };
		
		// Determine which storage to use
		const storage = localStorage.getItem("currentUser") ? localStorage : sessionStorage;
		storage.setItem("currentUser", JSON.stringify(this.currentUser));
		
		return { success: true, user: this.currentUser };
	}
}

export default new AuthService();
