import { JetView } from "webix-jet";
import authService from "../services/auth";

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
										view: "combo", 
										label: "Country", 
										name: "country", 
										value: user?.country || "", 
										labelWidth: 150,
										placeholder: "Not set",
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
										view: "text", 
										label: "Phone Number", 
										name: "phone", 
										value: user?.phone || "", 
										labelWidth: 150,
										placeholder: "Not set",
										disabled: true
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
										placeholder: "Not set",
										disabled: true
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
											{ id: "other", value: "Other" },
											{ id: "prefer_not_to_say", value: "Prefer not to say" }
										]
									},
									
									{ height: 30 },
									{
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
												id: "editButton"
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
	
	openPasswordDialog() {
		webix.message("Password change dialog will open here");
	}
}
