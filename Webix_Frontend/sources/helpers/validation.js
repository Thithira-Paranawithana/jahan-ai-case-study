// validation helpers for user info and password change forms
export const validators = {
	// check if value is empty or not
	required: (value, fieldName) => {
		if (!value || value.trim() === "") {
			return { valid: false, message: `${fieldName} is required` };
		}
		return { valid: true };
	},
	
	// validate full name (at least 2 characters, letters and spaces only)
	fullName: (value) => {
		if (!value || value.trim().length < 2) {
			return { valid: false, message: "Full name must be at least 2 characters" };
		}
		if (!/^[a-zA-Z\s]+$/.test(value)) {
			return { valid: false, message: "Full name should contain only letters and spaces" };
		}
		return { valid: true };
	},
	
	// phone number validation(digits only, 7-15 digits)
	phone: (value) => {
		if (!value || value.trim() === "") {
			return { valid: true }; // phone is optional
		}
		const cleaned = value.replace(/[\s\-\(\)]/g, ""); 
		if (!/^\d{7,15}$/.test(cleaned)) {
			return { valid: false, message: "Phone number must be 7-15 digits" };
		}
		return { valid: true };
	},
	
	// Validate date of birth (must be in past and user must be above 13)
	dateOfBirth: (value) => {
		if (!value) {
			return { valid: true }; // DOB is optional
		}
		const dob = new Date(value);
		const today = new Date();
		const age = today.getFullYear() - dob.getFullYear();
		
		if (dob > today) {
			return { valid: false, message: "Date of birth cannot be in the future" };
		}
		if (age < 13) {
			return { valid: false, message: "You must be at least 13 years old" };
		}
		if (age > 120) {
			return { valid: false, message: "Please enter a valid date of birth" };
		}
		return { valid: true };
	},
	
	//Validate password strength
	password: (value) => {
		if (!value || value.length < 8) {
			return { valid: false, message: "Password must be at least 8 characters" };
		}
		
		// Check for uppercase 
		if (!/[A-Z]/.test(value)) {
			return { valid: false, message: "Password must contain at least one uppercase letter" };
		}
		
		// Check for lowercase 
		if (!/[a-z]/.test(value)) {
			return { valid: false, message: "Password must contain at least one lowercase letter" };
		}
		
		// check for number
		if (!/[0-9]/.test(value)) {
			return { valid: false, message: "Password must contain at least one number" };
		}
		
		// Check for special character
		if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
			return { valid: false, message: "Password must contain at least one special character (!@#$%^&* etc.)" };
		}
		
		return { valid: true };
	},
	
	// check  passwords match or not
	passwordMatch: (password, confirmPassword) => {
		if (password !== confirmPassword) {
			return { valid: false, message: "Passwords do not match" };
		}
		return { valid: true };
	}
};

// validate user info form
export const validateUserInfo = (formData) => {
	const errors = [];
	
	// Validate full name
	const nameValidation = validators.fullName(formData.fullName);
	if (!nameValidation.valid) {
		errors.push({ field: "fullName", message: nameValidation.message });
	}
	
	// validate phone
	const phoneValidation = validators.phone(formData.phone);
	if (!phoneValidation.valid) {
		errors.push({ field: "phone", message: phoneValidation.message });
	}
	
	// validate date of birth
	const dobValidation = validators.dateOfBirth(formData.dateOfBirth);
	if (!dobValidation.valid) {
		errors.push({ field: "dateOfBirth", message: dobValidation.message });
	}
	
	return {
		valid: errors.length === 0,
		errors: errors
	};
};

// validate password change form
export const validatePasswordChange = (formData) => {
	const errors = [];
	
	// check current password
	const currentValidation = validators.required(formData.currentPassword, "Current password");
	if (!currentValidation.valid) {
		errors.push({ field: "currentPassword", message: currentValidation.message });
	}
	
	// validate new password strength
	const newPasswordValidation = validators.password(formData.newPassword);
	if (!newPasswordValidation.valid) {
		errors.push({ field: "newPassword", message: newPasswordValidation.message });
	}
	
	// check if new password is different from current
	if (formData.currentPassword && formData.newPassword && formData.currentPassword === formData.newPassword) {
		errors.push({ field: "newPassword", message: "New password must be different from current password" });
	}
	
	// validate confirm password
	const confirmValidation = validators.required(formData.confirmPassword, "Confirm password");
	if (!confirmValidation.valid) {
		errors.push({ field: "confirmPassword", message: confirmValidation.message });
	}
	
	// check if passwords match
	if (formData.newPassword && formData.confirmPassword) {
		const matchValidation = validators.passwordMatch(formData.newPassword, formData.confirmPassword);
		if (!matchValidation.valid) {
			errors.push({ field: "confirmPassword", message: matchValidation.message });
		}
	}
	
	return {
		valid: errors.length === 0,
		errors: errors
	};
};
