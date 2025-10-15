import { JetView } from "webix-jet";
import authService from "../services/auth";

export default class PrivacyView extends JetView {
	config() {
		const user = authService.getCurrentUser();
		const privacy = user?.privacySettings || {};
		
		return {
			rows: [
				{
					view: "scrollview",
					scroll: "y",
					body: {
						padding: 20,
						rows: [
							{
								cols: [
									{ gravity: 0.2 },
									{
										gravity: 0.6,
										rows: [
											{
												view: "template",
												template: "<h3>Privacy Settings</h3><p>Control your privacy and data sharing preferences</p>",
												autoheight: true,
												borderless: true
											},
											{ height: 10 },
											{
												view: "form",
												id: "privacyForm",
												css: "privacy-settings-form",
												scroll: false,
												elements: [
													// Account Privacy Section
                                                    { 
                                                        view: "template", 
                                                        template: "<h4 style='margin-bottom: 5px;'>Account Privacy</h4>", 
                                                        autoheight: true, 
                                                        borderless: true 
                                                    },
                                                    {
                                                        cols: [
                                                            {
                                                                view: "segmented",
                                                                name: "profileVisibility",
                                                                value: privacy.profileVisibility || "public",
                                                                width: 250,
                                                                options: [
                                                                    { id: "public", value: "🌐 Public" },
                                                                    { id: "private", value: "🔒 Private" }
                                                                ]
                                                            },
                                                            {}
                                                        ]
                                                    },

													// Online Status Section
                                                    { height: 15 },
                                                    { 
                                                        view: "template", 
                                                        template: "<h4 style='margin-bottom: 5px;'>Activity Status</h4>", 
                                                        autoheight: true, 
                                                        borderless: true 
                                                    },
                                                    {
                                                        css: "privacy-setting-row",
                                                        borderless: false,
                                                        padding: 15,
                                                        cols: [
                                                            {
                                                                view: "template",
                                                                template: "<span style='line-height: 40px; font-size: 14px;'>Show when you're online</span>",
                                                                borderless: true,
                                                                autoheight: true
                                                            },
                                                            {
                                                                view: "switch",
                                                                name: "showOnlineStatus",
                                                                value: privacy.showOnlineStatus !== false ? 1 : 0,
                                                                width: 60
                                                            }
                                                        ]
                                                    },

                                                    // Data Sharing Section
                                                    { height: 15 },
                                                    { 
                                                        view: "template", 
                                                        template: "<h4 style='margin-bottom: 5px;'>Data & Analytics</h4>", 
                                                        autoheight: true, 
                                                        borderless: true 
                                                    },
                                                    {
                                                        css: "privacy-setting-row",
                                                        borderless: false,
                                                        padding: 15,
                                                        cols: [
                                                            {
                                                                view: "template",
                                                                template: "<span style='line-height: 40px; font-size: 14px;'>Share usage data to improve the service</span>",
                                                                borderless: true,
                                                                autoheight: true
                                                            },
                                                            {
                                                                view: "switch",
                                                                name: "shareUsageData",
                                                                value: privacy.shareUsageData !== false ? 1 : 0,
                                                                width: 60
                                                            }
                                                        ]
                                                    },
                                                    { height: 1 },
                                                    {
                                                        css: "privacy-setting-row",
                                                        borderless: false,
                                                        padding: 15,
                                                        cols: [
                                                            {
                                                                view: "template",
                                                                template: "<span style='line-height: 40px; font-size: 14px;'>Allow personalized recommendations</span>",
                                                                borderless: true,
                                                                autoheight: true
                                                            },
                                                            {
                                                                view: "switch",
                                                                name: "personalizedRecommendations",
                                                                value: privacy.personalizedRecommendations !== false ? 1 : 0,
                                                                width: 60
                                                            }
                                                        ]
                                                    },

                                                    // Search Visibility Section
                                                    { height: 15 },
                                                    { 
                                                        view: "template", 
                                                        template: "<h4 style='margin-bottom: 5px;'>Search & Discovery</h4>", 
                                                        autoheight: true, 
                                                        borderless: true 
                                                    },
                                                    {
                                                        css: "privacy-setting-row",
                                                        borderless: false,
                                                        padding: 15,
                                                        cols: [
                                                            {
                                                                view: "template",
                                                                template: "<span style='line-height: 40px; font-size: 14px;'>Allow others to find you by email</span>",
                                                                borderless: true,
                                                                autoheight: true
                                                            },
                                                            {
                                                                view: "switch",
                                                                name: "searchByEmail",
                                                                value: privacy.searchByEmail !== false ? 1 : 0,
                                                                width: 60
                                                            }
                                                        ]
                                                    },

                                                    // Two-Factor Authentication Section
                                                    { height: 15 },
                                                    { 
                                                        view: "template", 
                                                        template: "<h4 style='margin-bottom: 5px;'>Two-Factor Authentication</h4>", 
                                                        autoheight: true, 
                                                        borderless: true 
                                                    },
                                                    {
                                                        css: "privacy-setting-row",
                                                        borderless: false,
                                                        padding: 15,
                                                        cols: [
                                                            {
                                                                view: "template",
                                                                template: "<span style='line-height: 40px; font-size: 14px;'>Enable two-factor authentication (2FA)</span>",
                                                                borderless: true,
                                                                autoheight: true
                                                            },
                                                            {
                                                                view: "switch",
                                                                name: "twoFactorEnabled",
                                                                id: "twoFactorSwitch",
                                                                value: privacy.twoFactorEnabled || 0,
                                                                width: 60,
                                                                on: {
                                                                    onChange: (newValue) => this.toggle2FAOptions(newValue)
                                                                }
                                                            }
                                                        ]
                                                    },
                                                    { height: 10 },
                                                    {
                                                        id: "twoFactorOptions",
                                                        hidden: !privacy.twoFactorEnabled,
                                                        padding: { left: 30 },
                                                        rows: [
                                                            { 
                                                                view: "template", 
                                                                template: "<p style='margin: 0 0 8px 0; font-size: 13px; color: #666;'>Select authentication method:</p>", 
                                                                autoheight: true, 
                                                                borderless: true 
                                                            },
                                                            {
                                                                view: "radio",
                                                                name: "twoFactorMethod",
                                                                value: privacy.twoFactorMethod || "sms",
                                                                options: [
                                                                    { id: "sms", value: "📱 SMS" },
                                                                    { id: "email", value: "📧 Email" },
                                                                    { id: "app", value: "🔐 Authenticator App" }
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
                                                                value: "Save Settings",
                                                                width: 150,
                                                                css: "webix_primary",
                                                                click: () => this.savePrivacySettings()
                                                            }
                                                        ]
                                                    }

												]
											}
										]
									},
									{ gravity: 0.2 }
								]
							}
						]
					}
				}
			]
		};
	}
	
	toggle2FAOptions(enabled) {
		const options = this.$$("twoFactorOptions");
		if (enabled) {
			options.show();
		} else {
			options.hide();
		}
	}
	
	savePrivacySettings() {
        const form = this.$$("privacyForm");
        
        if (!form) {
            webix.message({ type: "error", text: "Form not found" });
            return;
        }
        
        try {
            // Get all form values
            const values = form.getValues();
            
            // If 2FA is disabled, clear the method
            if (!values.twoFactorEnabled) {
                values.twoFactorMethod = null;
            }
            
            // Save to auth service
            const result = authService.updatePrivacySettings(values);
            
            if (result && result.success) {
                webix.message({ 
                    type: "success", 
                    text: "Privacy settings saved successfully",
                    expire: 3000
                });
                
                console.log("Saved privacy settings:", result.settings);
            } else {
                webix.message({ 
                    type: "error", 
                    text: result.error || "Failed to save settings",
                    expire: 4000
                });
            }
        } catch (error) {
            console.error("Error saving privacy settings:", error);
            webix.message({ 
                type: "error", 
                text: "An error occurred while saving settings",
                expire: 4000
            });
        }
    }
    
}
