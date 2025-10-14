import { JetView } from "webix-jet";
import "../styles/settings.css";
import authService from "../services/auth";

export default class SettingsView extends JetView {
	config() {
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
							template: "Account Settings "
						},
						{
							id: "notifications",
							template: "Notification Settings"
						},
						{
							id: "theme",
							template: "Theme Settings "
						},
						{
							id: "privacy",
							template: "Privacy Settings "
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
