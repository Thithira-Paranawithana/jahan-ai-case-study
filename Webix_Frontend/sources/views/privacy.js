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
                                                                template: "<span style='line-height: 40px; '>Show when you're online</span>",
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
                                                                template: "<span style='line-height: 40px; '>Share usage data to improve the service</span>",
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
                                                                template: "<span style='line-height: 40px; '>Allow personalized recommendations</span>",
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
                                                                template: "<span style='line-height: 40px; '>Allow others to find you by email</span>",
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
                                                                template: "<span style='line-height: 40px; '>Enable two-factor authentication (2FA)</span>",
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
                                                                template: "<p style='margin: 0 0 8px 0; color: #666;'>Select authentication method:</p>", 
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
                                                            {
                                                                view: "button",
                                                                value: "Delete Account",
                                                                width: 150,
                                                                css: "delete-account-button",
                                                                click: () => this.confirmDeleteAccount()
                                                            },
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

    confirmDeleteAccount() {
        webix.ui({
            view: "window",
            id: "deleteWarning1",
            head: "⚠️ Delete Account",
            modal: true,
            position: "center",
            width: 450,
            body: {
                padding: 20,
                rows: [
                    {
                        view: "template",
                        template: "Are you absolutely sure you want to delete your account?<br><br>This action cannot be undone and all your data will be permanently deleted.",
                        autoheight: true,
                        borderless: true
                    },
                    { height: 20 },
                    {
                        cols: [
                            {},
                            {
                                view: "button",
                                value: "Cancel",
                                width: 100,
                                click: () => {
                                    webix.$$("deleteWarning1").close();
                                    webix.message("Account deletion cancelled");
                                }
                            },
                            {
                                view: "button",
                                value: "Yes, Delete My Account",
                                width: 180,
                                css: "delete-account-button",
                                click: () => {
                                    webix.$$("deleteWarning1").close();
                                    this.finalDeleteConfirmation();
                                }
                            }
                        ]
                    }
                ]
            }
        }).show();
    }
    
    finalDeleteConfirmation() {
        webix.ui({
            view: "window",
            id: "deleteWarning2",
            head: "🚨 Final Warning",
            modal: true,
            position: "center",
            width: 500,
            body: {
                padding: 20,
                rows: [
                    {
                        view: "template",
                        template: "This is your last chance! Deleting your account will:<br><br>• Remove all your personal data<br>• Delete your profile permanently<br>• Cancel all subscriptions<br><br><strong>Enter your password and type DELETE to confirm:</strong>",
                        autoheight: true,
                        borderless: true
                    },
                    { height: 15 },
                    {
                        view: "text",
                        type: "password",
                        id: "deletePasswordInput",
                        placeholder: "Enter your password",
                        label: "Password",
                        labelPosition: "top"
                    },
                    {
                        view: "template",
                        id: "deletePasswordError",
                        template: "",
                        height: 0,
                        borderless: true
                    },
                    { height: 10 },
                    {
                        view: "text",
                        id: "deleteConfirmInput",
                        placeholder: "Type DELETE here",
                        label: "Confirmation",
                        labelPosition: "top"
                    },
                    {
                        view: "template",
                        id: "deleteConfirmError",
                        template: "",
                        height: 0,
                        borderless: true
                    },
                    { height: 20 },
                    {
                        cols: [
                            {},
                            {
                                view: "button",
                                value: "Cancel",
                                width: 100,
                                click: () => {
                                    this.clearDeleteErrors();
                                    webix.$$("deleteWarning2").close();
                                }
                            },
                            {
                                view: "button",
                                value: "DELETE MY ACCOUNT",
                                width: 180,
                                css: "delete-account-button",
                                click: () => {
                                    const password = webix.$$("deletePasswordInput").getValue();
                                    const confirmation = webix.$$("deleteConfirmInput").getValue();
                                    
                                    // Clear previous errors
                                    this.clearDeleteErrors();
                                    
                                    // Validate password
                                    if (!password) {
                                        this.showDeleteError('deletePassword', 'Password is required');
                                        webix.message({ 
                                            type: "error", 
                                            text: "Please enter your password" 
                                        });
                                        return;
                                    }
                                    
                                    // Validate confirmation
                                    if (confirmation !== "DELETE") {
                                        this.showDeleteError('deleteConfirm', 'You must type DELETE exactly');
                                        webix.message({ 
                                            type: "error", 
                                            text: "You must type DELETE to confirm" 
                                        });
                                        return;
                                    }
                                    
                                    webix.$$("deleteWarning2").close();
                                    this.deleteAccount(password, confirmation);
                                }
                            }
                        ]
                    }
                ]
            }
        }).show();
    }
    
    clearDeleteErrors() {
        // Clear error messages
        if (webix.$$("deletePasswordError")) {
            webix.$$("deletePasswordError").setHTML("");
            webix.$$("deletePasswordError").config.height = 0;
            webix.$$("deletePasswordError").resize();
        }
        
        if (webix.$$("deleteConfirmError")) {
            webix.$$("deleteConfirmError").setHTML("");
            webix.$$("deleteConfirmError").config.height = 0;
            webix.$$("deleteConfirmError").resize();
        }
        
        // Reset input borders
        if (webix.$$("deletePasswordInput")) {
            webix.$$("deletePasswordInput").getNode().querySelector('input').style.border = '';
        }
        
        if (webix.$$("deleteConfirmInput")) {
            webix.$$("deleteConfirmInput").getNode().querySelector('input').style.border = '';
        }
    }
    
    showDeleteError(field, message) {
        if (field === 'deletePassword') {
            // Show error message
            const errorTemplate = webix.$$("deletePasswordError");
            errorTemplate.setHTML(`<span style="color: #e53e3e; font-size: 13px; margin-top: 4px;">${message}</span>`);
            errorTemplate.config.height = 20;
            errorTemplate.resize();
            
            // Red border on input
            const inputNode = webix.$$("deletePasswordInput").getNode().querySelector('input');
            inputNode.style.border = '2px solid #e53e3e';
            inputNode.style.borderRadius = '4px';
        } else if (field === 'deleteConfirm') {
            // Show error message
            const errorTemplate = webix.$$("deleteConfirmError");
            errorTemplate.setHTML(`<span style="color: #e53e3e; font-size: 13px; margin-top: 4px;">${message}</span>`);
            errorTemplate.config.height = 20;
            errorTemplate.resize();
            
            // Red border on input
            const inputNode = webix.$$("deleteConfirmInput").getNode().querySelector('input');
            inputNode.style.border = '2px solid #e53e3e';
            inputNode.style.borderRadius = '4px';
        }
    }
    
    async deleteAccount(password, confirmation) {
        console.log('Attempting to delete account...');
        
        // Show loading
        const loadingMessage = webix.message({ type: "info", text: "Deleting account..." });
        
        // Call auth service with password and confirmation
        const result = await authService.deleteAccount(password, confirmation);
        
        webix.message.hide(loadingMessage);
        
        if (result && result.success) {
            webix.message({ 
                type: "success", 
                text: "Your account has been deleted. Goodbye!",
                expire: 2000
            });
            
            // Redirect to login after brief delay
            setTimeout(() => {
                window.location.href = window.location.origin + window.location.pathname + '#!/login';
            }, 2000);
        } else {
            // Re-open dialog to show errors
            this.finalDeleteConfirmation();
            
            // Wait for dialog to render
            setTimeout(() => {
                // Restore values
                webix.$$("deletePasswordInput").setValue(password);
                webix.$$("deleteConfirmInput").setValue(confirmation);
                
                // Handle backend validation errors
                if (result.errors) {
                    if (result.errors.password) {
                        this.showDeleteError('deletePassword', result.errors.password[0]);
                    }
                    if (result.errors.confirmation) {
                        this.showDeleteError('deleteConfirm', result.errors.confirmation[0]);
                    }
                } else if (result.error) {
                    // Generic error - show on password field
                    this.showDeleteError('deletePassword', result.error);
                }
            }, 100);
            
            // Also show toast notification
            let errorMessage = "Failed to delete account";
            if (result.errors) {
                if (result.errors.password) {
                    errorMessage = result.errors.password[0];
                } else if (result.errors.confirmation) {
                    errorMessage = result.errors.confirmation[0];
                }
            } else if (result.error) {
                errorMessage = result.error;
            }
            
            webix.message({ 
                type: "error", 
                text: errorMessage,
                expire: 4000
            });
        }
    }
    
    
    
    
    
    
}
