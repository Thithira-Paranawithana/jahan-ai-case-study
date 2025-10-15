import { JetView } from "webix-jet";
import authService from "../services/auth";

export default class NotificationsView extends JetView {
	config() {
		const user = authService.getCurrentUser();
		const prefs = user?.notificationPreferences || {};
		
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
								template: "<h3>Notification Settings</h3><p>Manage how you receive notifications</p>",
								autoheight: true,
								borderless: true
							},
							{
								view: "form",
								id: "notificationForm",
								elements: [
									// Email Notifications Section
									{ 
										view: "template", 
										template: "<h4>Email Notifications</h4>", 
										autoheight: true, 
										borderless: true 
									},
									{
										view: "checkbox",
										labelRight: "Enable Email Notifications",
										name: "emailEnabled",
										id: "emailEnabledCheckbox",
										value: prefs.emailEnabled !== false ? 1 : 0,
										on: {
											onChange: (newValue) => this.toggleEmailOptions(newValue)
										}
									},
									{ height: 15 },
									{
										id: "emailOptions",
										hidden: prefs.emailEnabled === false,
										padding: { left: 30 },
										rows: [
											{
												view: "checkbox",
												labelRight: "Account activity (logins, password changes)",
												name: "emailAccountActivity",
												value: prefs.emailAccountActivity !== false ? 1 : 0
											},
											{ height: 8 },
											{
												view: "checkbox",
												labelRight: "Updates and announcements",
												name: "emailUpdates",
												value: prefs.emailUpdates !== false ? 1 : 0
											},
											{ height: 8 },
											{
												view: "checkbox",
												labelRight: "Weekly summary email",
												name: "emailWeeklyDigest",
												value: prefs.emailWeeklyDigest || 0
											}
										]
									},
									
									// Push Notifications Section
									{ height: 30 },
									{ 
										view: "template", 
										template: "<h4>Push Notifications</h4>", 
										autoheight: true, 
										borderless: true 
									},
									{
										view: "checkbox",
										labelRight: "Enable Push Notifications",
										name: "pushEnabled",
										id: "pushEnabledCheckbox",
										value: prefs.pushEnabled !== false ? 1 : 0,
										on: {
											onChange: (newValue) => this.togglePushOptions(newValue)
										}
									},
									{ height: 15 },
									{
										id: "pushOptions",
										hidden: prefs.pushEnabled === false,
										padding: { left: 30 },
										rows: [
											{
												view: "checkbox",
												labelRight: "Security alerts (important account changes)",
												name: "pushSecurityAlerts",
												value: prefs.pushSecurityAlerts !== false ? 1 : 0
											},
											{ height: 8 },
											{
												view: "checkbox",
												labelRight: "System notifications",
												name: "pushSystemNotifications",
												value: prefs.pushSystemNotifications !== false ? 1 : 0
											},
											{ height: 8 },
											{
												view: "checkbox",
												labelRight: "Activity updates",
												name: "pushActivityUpdates",
												value: prefs.pushActivityUpdates || 0
											}
										]
									},
									
									{ height: 30 },
									{
										cols: [
											{},
											{
												view: "button",
												value: "Save Preferences",
												width: 150,
												css: "webix_primary",
												click: () => this.savePreferences()
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
	
	toggleEmailOptions(enabled) {
		const emailOptions = this.$$("emailOptions");
		if (enabled) {
			emailOptions.show();
		} else {
			emailOptions.hide();
		}
	}
	
	togglePushOptions(enabled) {
		const pushOptions = this.$$("pushOptions");
		if (enabled) {
			pushOptions.show();
		} else {
			pushOptions.hide();
		}
	}
	
	savePreferences() {
		webix.message({ type: "success", text: "Preferences saved (functionality in next commits)" });
	}
}
