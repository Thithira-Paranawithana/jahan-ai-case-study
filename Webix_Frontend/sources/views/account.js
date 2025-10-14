import { JetView } from "webix-jet";
import authService from "../services/auth";
import { validateUserInfo } from "../helpers/validation";

export default class AccountView extends JetView {
	config() {
		const user = authService.getCurrentUser();
		
		return {
			rows: [
				{
					view: "scrollview",
					scroll: "y",
					body: {
						padding: 20,
						rows: [
							{
								view: "template",
								template: "<h3>Personal Information</h3><p>View and manage your account details</p>",
								autoheight: true,
								borderless: true
							},
							{
								view: "form",
								id: "userInfoForm",
								elements: [
									// Basic Information
									{ 
										view: "template", 
										template: "<h4>Basic Information</h4>", 
										autoheight: true, 
										borderless: true 
									},
									{ 
										view: "text", 
										label: "Full Name", 
										name: "fullName", 
										value: user?.fullName || "", 
										labelWidth: 150,
										disabled: true
									},
									{
										view: "template",
										id: "fullNameError",
										template: "",
										height: 0,
										borderless: true,
										css: "error_message"
									},
									{ 
										view: "combo", 
										label: "Country", 
										name: "country", 
										value: user?.country || "", 
										labelWidth: 150,
										placeholder: "Select country",
										disabled: true,
										options: [
											"United States",
											"United Kingdom",
											"Canada",
											"Australia",
											"Germany",
											"France",
											"India",
											"Japan",
											"China",
											"Brazil",
											"Sri Lanka"
										]
									},
									
									// Contact Information
									{ height: 20 },
									{ 
										view: "template", 
										template: "<h4>Contact Information</h4>", 
										autoheight: true, 
										borderless: true 
									},
									{ 
										view: "text", 
										label: "Email", 
										name: "email", 
										value: user?.email || "", 
										labelWidth: 150,
										disabled: true
									},
									{
										cols: [
											{
												view: "combo",
												label: "Phone Number",
												name: "countryCode",
												value: user?.countryCode || "+1",
												labelWidth: 150,
												width: 300,
												disabled: true,
												options: [
													{ id: "+1", value: "+1 (US/Canada)" },
													{ id: "+44", value: "+44 (UK)" },
													{ id: "+61", value: "+61 (Australia)" },
													{ id: "+49", value: "+49 (Germany)" },
													{ id: "+33", value: "+33 (France)" },
													{ id: "+91", value: "+91 (India)" },
													{ id: "+81", value: "+81 (Japan)" },
													{ id: "+86", value: "+86 (China)" },
													{ id: "+55", value: "+55 (Brazil)" },
													{ id: "+94", value: "+94 (Sri Lanka)" }
												]
											},
											{
												view: "text",
												name: "phone",
												value: user?.phone || "",
												placeholder: "Enter phone number",
												disabled: true
											}
										]
									},
									{
										view: "template",
										id: "phoneError",
										template: "",
										height: 0,
										borderless: true,
										css: "error_message"
									},
									
									// Personal Details
									{ height: 20 },
									{ 
										view: "template", 
										template: "<h4>Personal Details</h4>", 
										autoheight: true, 
										borderless: true 
									},
									{ 
										view: "datepicker", 
										label: "Date of Birth", 
										name: "dateOfBirth", 
										value: user?.dateOfBirth || "", 
										labelWidth: 150,
										format: "%Y-%m-%d",
										placeholder: "Select date",
										disabled: true
									},
									{
										view: "template",
										id: "dateOfBirthError",
										template: "",
										height: 0,
										borderless: true,
										css: "error_message"
									},
									{ 
										view: "radio", 
										label: "Gender", 
										name: "gender", 
										value: user?.gender || "prefer_not_to_say", 
										labelWidth: 150,
										disabled: true,
										options: [
											{ id: "male", value: "Male" },
											{ id: "female", value: "Female" },
											{ id: "prefer_not_to_say", value: "Prefer not to say" }
										]
									},
									
									{ height: 30 },
									{
										id: "viewModeButtons",
										cols: [
											{},
											{
												view: "button",
												value: "Change Password",
												width: 160,
												id: "passwordButton",
												click: () => this.openPasswordDialog()
											},
											{
												view: "button",
												value: "Edit Profile",
												width: 130,
												id: "editButton",
												click: () => this.enableEditMode()
											}
										]
									},
									{
										id: "editModeButtons",
										hidden: true,
										cols: [
											{},
											{
												view: "button",
												value: "Cancel",
												width: 100,
												click: () => this.cancelEdit()
											},
											{
												view: "button",
												value: "Save Changes",
												width: 130,
												css: "webix_primary",
												click: () => this.saveUserInfo()
											}
										]
									}
								]
							}
						]
					}
				}
			]
		};
	}
	
	clearErrors() {
		this.$$("fullNameError").setHTML("");
		this.$$("fullNameError").config.height = 0;
		this.$$("phoneError").setHTML("");
		this.$$("phoneError").config.height = 0;
		this.$$("dateOfBirthError").setHTML("");
		this.$$("dateOfBirthError").config.height = 0;
		this.$$("userInfoForm").resize();
	}
	
	showError(fieldId, message) {
		const errorTemplate = this.$$(fieldId + "Error");
		errorTemplate.setHTML(`<span style="color: #e53e3e; font-size: 12px;">${message}</span>`);
		errorTemplate.config.height = 25;
		this.$$("userInfoForm").resize();
	}
	
	enableEditMode() {
		const form = this.$$("userInfoForm");
		this.clearErrors();
		
		// Enable all fields except email
		form.elements.fullName.enable();
		form.elements.country.enable();
		form.elements.countryCode.enable();
		form.elements.phone.enable();
		form.elements.dateOfBirth.enable();
		form.elements.gender.enable();
		
		// Toggle buttons
		this.$$("viewModeButtons").hide();
		this.$$("editModeButtons").show();
		
		webix.message("Edit mode enabled");
	}
	
	cancelEdit() {
		const user = authService.getCurrentUser();
		const form = this.$$("userInfoForm");
		this.clearErrors();
		
		// Reset form to original values
		form.setValues({
			fullName: user?.fullName || "",
			country: user?.country || "",
			email: user?.email || "",
			countryCode: user?.countryCode || "+1",
			phone: user?.phone || "",
			dateOfBirth: user?.dateOfBirth || "",
			gender: user?.gender || "prefer_not_to_say"
		});
		
		// Disable all fields
		form.elements.fullName.disable();
		form.elements.country.disable();
		form.elements.countryCode.disable();
		form.elements.phone.disable();
		form.elements.dateOfBirth.disable();
		form.elements.gender.disable();
		
		// Toggle buttons
		this.$$("editModeButtons").hide();
		this.$$("viewModeButtons").show();
		
		webix.message("Changes discarded");
	}
	
	saveUserInfo() {
		const form = this.$$("userInfoForm");
		const values = form.getValues();
		
		// Clear previous errors
		this.clearErrors();
		
		// Validate form
		const validation = validateUserInfo(values);
		
		if (!validation.valid) {
			// Show errors
			validation.errors.forEach(error => {
				this.showError(error.field, error.message);
			});
			webix.message({ type: "error", text: "Please fix the errors before saving" });
			return;
		}
		
		// Update auth service
		const result = authService.updateProfile(values);
		
		if (result && result.success) {
			// Disable all fields
			form.elements.fullName.disable();
			form.elements.country.disable();
			form.elements.countryCode.disable();
			form.elements.phone.disable();
			form.elements.dateOfBirth.disable();
			form.elements.gender.disable();
			
			// Toggle buttons
			this.$$("editModeButtons").hide();
			this.$$("viewModeButtons").show();
			
			webix.message({ 
				type: "success", 
				text: "Profile updated successfully",
				expire: 3000
			});
		} else {
			webix.message({ type: "error", text: result.error || "Failed to update profile" });
		}
	}
	
	openPasswordDialog() {
		if (this.passwordWindow) {
			this.passwordWindow.show();
			return;
		}
		
		this.passwordWindow = webix.ui({
			view: "window",
			id: "passwordWindow",
			head: "Change Password",
			modal: true,
			position: "center",
			width: 450,
			body: {
				padding: 20,
				rows: [
					{
						view: "form",
						id: "passwordForm",
						elements: [
							{
								view: "text",
								type: "password",
								label: "Current Password",
								name: "currentPassword",
								labelWidth: 150,
								placeholder: "Enter current password"
							},
							{ height: 10 },
							{
								view: "text",
								type: "password",
								label: "New Password",
								name: "newPassword",
								labelWidth: 150,
								placeholder: "Enter new password"
							},
							{ height: 10 },
							{
								view: "text",
								type: "password",
								label: "Confirm Password",
								name: "confirmPassword",
								labelWidth: 150,
								placeholder: "Confirm new password"
							},
							{ height: 20 },
							{
								cols: [
									{},
									{
										view: "button",
										value: "Cancel",
										width: 100,
										click: () => {
											this.passwordWindow.hide();
											webix.$$("passwordForm").clear();
										}
									},
									{
										view: "button",
										value: "Update Password",
										width: 150,
										css: "webix_primary",
										click: () => this.changePassword()
									}
								]
							}
						]
					}
				]
			}
		});
		
		this.passwordWindow.show();
	}
	
	changePassword() {
		webix.message("Password change logic will be implemented in next commit");
	}
}
