import { JetView } from "webix-jet";
import "../styles/settings.css";
import authService from "../services/auth";

export default class SettingsView extends JetView {
	config() {
		if (!authService.isAuthenticated()) {
			this.show("/login");
			return {};
		}
		
		const user = authService.getCurrentUser();
		
		return {
			rows: [
				{
					view: "tabbar",
					id: "settingsTabbar",
					multiview: true,
					options: [
						{ id: "account", value: "Account Settings" },
						{ id: "notifications", value: "Notifications" },
						{ id: "theme", value: "Theme" },
						{ id: "privacy", value: "Privacy" }
					]
				},
				{
					cells: [
						{
							id: "account",
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
													
													{ height: 20 },
													{
														cols: [
															{},
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
						},
						{
							id: "notifications",
							template: "<div style='padding:30px'>Notification preferences will be configured here.</div>"
						},
						{
							id: "theme",
							template: "<div style='padding:30px'>Theme customization options will be available here.</div>"
						},
						{
							id: "privacy",
							template: "<div style='padding:30px'>Privacy settings and data management options.</div>"
						}
					]
				}
			]
		};
	}

	init() {
		if (!authService.isAuthenticated()) {
			this.show("/login");
		}
	}
}
