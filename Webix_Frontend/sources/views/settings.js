import { JetView } from "webix-jet";
import "../styles/settings.css";
import authService from "../services/auth";

export default class SettingsView extends JetView {
	config() {
		// check authentication before rendering
		if (!authService.isAuthenticated()) {
			this.show("/login");
			return {};
		}
		
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
							template: "Account Settings - Coming Soon"
						},
						{
							id: "notifications",
							template: "Notification Settings - Coming Soon"
						},
						{
							id: "theme",
							template: "Theme Settings - Coming Soon"
						},
						{
							id: "privacy",
							template: "Privacy Settings - Coming Soon"
						}
					]
				}
			]
		};
	}

	init() {
		// double check on init
		if (!authService.isAuthenticated()) {
			this.show("/login");
		}
	}
}
