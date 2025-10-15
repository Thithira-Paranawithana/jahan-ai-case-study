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
						{ id: "notifications", $subview: "notifications" },
						{
							id: "theme",
							$subview: "theme"
						},
						{
							id: "privacy",
							 $subview: "privacy"
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
