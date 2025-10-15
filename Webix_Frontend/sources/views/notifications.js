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
							{ height: 10 },
							{
								view: "form",
								id: "notificationForm",
								elements: [
									// Email Notifications Section
									{ 
										view: "template", 
										template: "<h4 style='margin-bottom: 5px;'>Email Notifications</h4>", 
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
									{ height: 8 },
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
											{ height: 5 },
											{
												view: "checkbox",
												labelRight: "Updates and announcements",
												name: "emailUpdates",
												value: prefs.emailUpdates !== false ? 1 : 0
											},
											{ height: 5 },
											{
												view: "checkbox",
												labelRight: "Weekly summary email",
												name: "emailWeeklyDigest",
												value: prefs.emailWeeklyDigest || 0
											}
										]
									},
									
									// Push Notifications Section
									{ height: 15 },
									{ 
										view: "template", 
										template: "<h4 style='margin-bottom: 5px;'>Push Notifications</h4>", 
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
									{ height: 8 },
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
											{ height: 5 },
											{
												view: "checkbox",
												labelRight: "System notifications",
												name: "pushSystemNotifications",
												value: prefs.pushSystemNotifications !== false ? 1 : 0
											},
											{ height: 5 },
											{
												view: "checkbox",
												labelRight: "Activity updates",
												name: "pushActivityUpdates",
												value: prefs.pushActivityUpdates || 0
											}
										]
									},
									
									// Notification Frequency Section
									{ height: 15 },
									{ 
										view: "template", 
										template: "<h4 style='margin-bottom: 5px;'>Notification Frequency</h4>", 
										autoheight: true, 
										borderless: true 
									},
									{
										view: "radio",
										name: "frequency",
										value: prefs.frequency || "instant",
										options: [
											{ id: "instant", value: "Instant (as they happen)" },
											{ id: "hourly", value: "Hourly digest" },
											{ id: "daily", value: "Daily digest" }
										]
									},
									
									// Notification Sound Section
                                    { height: 15 },
                                    { 
                                        view: "template", 
                                        template: "<h4 style='margin-bottom: 5px;'>Notification Sound</h4>", 
                                        autoheight: true, 
                                        borderless: true 
                                    },
                                    {
                                        view: "checkbox",
                                        labelRight: "Play sound for notifications",
                                        name: "soundEnabled",
                                        id: "soundEnabledCheckbox",
                                        value: prefs.soundEnabled !== false ? 1 : 0,
                                        on: {
                                            onChange: (newValue) => this.toggleSoundOptions(newValue)
                                        }
                                    },
                                    { height: 8 },
                                    {
                                        id: "soundOptions",
                                        hidden: prefs.soundEnabled === false,
                                        padding: { left: 30 },
                                        rows: [
                                            { 
                                                view: "template", 
                                                template: "<p style='margin: 0 0 8px 0; font-size: 13px; color: #666;'>Select notification tone:</p>", 
                                                autoheight: true, 
                                                borderless: true 
                                            },
                                            {
                                                cols: [
                                                    {
                                                        view: "combo",
                                                        name: "notificationSound",
                                                        id: "soundSelector",
                                                        width: 200,
                                                        value: prefs.notificationSound || "default",
                                                        options: [
                                                            { id: "default", value: "🔊 Default" },
                                                            { id: "bell", value: "🔔 Bell" },
                                                            { id: "chime", value: "🎵 Chime" },
                                                            { id: "pop", value: "🎶 Pop" },
                                                            { id: "none", value: "🔇 Silent" }
                                                        ]
                                                    },
                                                    {
                                                        view: "button",
                                                        value: "Preview",
                                                        width: 90,
                                                        click: () => this.previewSound()
                                                    },
                                                    {}
                                                ]
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
	
	toggleSoundOptions(enabled) {
		const soundOptions = this.$$("soundOptions");
		if (enabled) {
			soundOptions.show();
		} else {
			soundOptions.hide();
		}
	}
	
	previewSound() {
		const soundSelector = this.$$("soundSelector");
		const selectedSound = soundSelector.getValue();
		
		if (selectedSound === "none") {
			webix.message("Silent mode - no sound");
			return;
		}
		
		// Sound URLs mapping
		const soundUrls = {
			default: "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
			bell: "https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3",
			chime: "https://assets.mixkit.co/active_storage/sfx/2357/2357-preview.mp3",
			pop: "https://assets.mixkit.co/active_storage/sfx/2356/2356-preview.mp3"
		};
		
		const soundUrl = soundUrls[selectedSound];
		
		if (soundUrl) {
			const audio = new Audio(soundUrl);
			audio.volume = 0.5;
			audio.play().catch(error => {
				console.error("Error playing sound:", error);
				webix.message({ type: "error", text: "Could not play sound preview" });
			});
		}
	}
	
	savePreferences() {
		webix.message({ type: "success", text: "Preferences saved (save functionality coming soon)" });
	}
}
