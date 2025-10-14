// validation helper functions

export const validators = {
	// check if value is not empty
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
	
	// validate phone number (digits only, 7-15 digits)
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
	
	// validate date of birth (must be in past and user must be above 13)
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
	}
};

// validate entire user info form
export const validateUserInfo = (formData) => {
	const errors = [];
	
	// validate full name
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
