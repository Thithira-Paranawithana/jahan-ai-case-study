import { JetView } from "webix-jet";
import "../styles/settings.css";
import authService from "../services/auth";

export default class SettingsView extends JetView {
	config() {
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
						{ id: "account", $subview: "account" },
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
