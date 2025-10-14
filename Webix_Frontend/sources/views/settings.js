import { JetView } from "webix-jet";
import authService from "../services/auth";

export default class SettingsView extends JetView {
	config() {
		const user = authService.getCurrentUser();
		
		return {
			type: "clean",
			rows: [
				// settings geader
				{
					view: "template",
					type: "header",
					css: "settings_header",
					height: 80,
					template: `
						<div class="settings_header_content">
							<div>
								<h2>User Preferences</h2>
								<p>Manage your account and customize your experience</p>
							</div>
							<div class="user_info">
								<span class="user_name">${user ? user.fullName : "Guest"}</span>
								<span class="user_email">${user ? user.email : ""}</span>
							</div>
						</div>
					`
				},
				// tabbar with settings categories
				{
					view: "tabbar",
					id: "settingsTabbar",
					css: "settings_tabbar",
					multiview: true,
					options: [
						{ id: "account", value: "Account Settings", icon: "wxi-user" },
						{ id: "notifications", value: "Notifications", icon: "wxi-bell" },
						{ id: "theme", value: "Theme", icon: "wxi-palette" },
						{ id: "privacy", value: "Privacy", icon: "wxi-lock" }
					],
					height: 50
				},
				// Multiview for Tab Content
				{
					cells: [
						{
							id: "account",
							template: "<div class='placeholder_content'>Account Settings </div>",
							css: "settings_content"
						},
						{
							id: "notifications",
							template: "<div class='placeholder_content'>Notification Settings </div>",
							css: "settings_content"
						},
						{
							id: "theme",
							template: "<div class='placeholder_content'>Theme Settings </div>",
							css: "settings_content"
						},
						{
							id: "privacy",
							template: "<div class='placeholder_content'>Privacy Settings</div>",
							css: "settings_content"
						}
					]
				}
			]
		};
	}

	init() {
		// check authentication
		if (!authService.isAuthenticated()) {
			this.show("/login");
		}
	}
}
