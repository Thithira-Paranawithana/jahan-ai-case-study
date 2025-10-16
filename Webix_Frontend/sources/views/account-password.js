import authService from "../services/auth";
import { validatePasswordChange } from "../helpers/validation";

export default class AccountPassword {
    show() {
        if (this.passwordWindow) {
            this.passwordWindow.show();
            return;
        }
        
        this.passwordWindow = webix.ui({
            view: "window",
            id: "passwordWindow",
            head: "Change Password",
            modal: true,
            position: "center",
            width: 450,
            body: {
                padding: 20,
                rows: [
                    {
                        view: "form",
                        id: "passwordForm",
                        elements: [
                            {
                                cols: [
                                    {
                                        view: "text",
                                        type: "password",
                                        label: "Current Password",
                                        name: "currentPassword",
                                        id: "currentPasswordField",
                                        labelWidth: 150,
                                        placeholder: "Enter current password"
                                    },
                                    {
                                        view: "icon",
                                        icon: "wxi-eye",
                                        width: 40,
                                        click: function() {
                                            const field = webix.$$("currentPasswordField");
                                            const isPassword = field.config.type === "password";
                                            field.define("type", isPassword ? "text" : "password");
                                            field.refresh();
                                            this.define("icon", isPassword ? "wxi-eye-slash" : "wxi-eye");
                                            this.refresh();
                                        }
                                    }
                                ]
                            },
                            { height: 10 },
                            {
                                cols: [
                                    {
                                        view: "text",
                                        type: "password",
                                        label: "New Password",
                                        name: "newPassword",
                                        id: "newPasswordField",
                                        labelWidth: 150,
                                        placeholder: "Enter new password"
                                    },
                                    {
                                        view: "icon",
                                        icon: "wxi-eye",
                                        width: 40,
                                        click: function() {
                                            const field = webix.$$("newPasswordField");
                                            const isPassword = field.config.type === "password";
                                            field.define("type", isPassword ? "text" : "password");
                                            field.refresh();
                                            this.define("icon", isPassword ? "wxi-eye-slash" : "wxi-eye");
                                            this.refresh();
                                        }
                                    }
                                ]
                            },
                            { height: 10 },
                            {
                                cols: [
                                    {
                                        view: "text",
                                        type: "password",
                                        label: "Confirm Password",
                                        name: "confirmPassword",
                                        id: "confirmPasswordField",
                                        labelWidth: 150,
                                        placeholder: "Confirm new password"
                                    },
                                    {
                                        view: "icon",
                                        icon: "wxi-eye",
                                        width: 40,
                                        click: function() {
                                            const field = webix.$$("confirmPasswordField");
                                            const isPassword = field.config.type === "password";
                                            field.define("type", isPassword ? "text" : "password");
                                            field.refresh();
                                            this.define("icon", isPassword ? "wxi-eye-slash" : "wxi-eye");
                                            this.refresh();
                                        }
                                    }
                                ]
                            },
                            { height: 20 },
                            {
                                cols: [
                                    {},
                                    {
                                        view: "button",
                                        value: "Cancel",
                                        width: 100,
                                        click: () => this.close()
                                    },
                                    {
                                        view: "button",
                                        value: "Update Password",
                                        width: 150,
                                        css: "webix_primary",
                                        click: () => this.changePassword()
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        });
        
        this.passwordWindow.show();
    }

    close() {
        if (this.passwordWindow) {
            webix.$$("passwordForm").clear();
            webix.$$("currentPasswordField").define("type", "password");
            webix.$$("newPasswordField").define("type", "password");
            webix.$$("confirmPasswordField").define("type", "password");
            this.passwordWindow.hide();
        }
    }

    async changePassword() {
        const form = webix.$$("passwordForm");
        const values = form.getValues();
        
        // Client-side validation
        const validation = validatePasswordChange(values);
        
        if (!validation.valid) {
            const firstError = validation.errors[0];
            webix.message({ 
                type: "error", 
                text: firstError.message,
                expire: 4000
            });
            return;
        }
        
        // Show loading
        const loadingMessage = webix.message({ type: "info", text: "Changing password..." });
        
        // Call API
        const result = await authService.changePassword(
            values.currentPassword, 
            values.newPassword,
            values.confirmPassword
        );
        
        webix.message.hide(loadingMessage);
        
        if (result.success) {
            webix.message({ 
                type: "success", 
                text: "Password changed successfully!",
                expire: 3000
            });
            
            this.close();
        } else {
            webix.message({ 
                type: "error", 
                text: result.error || "Failed to change password",
                expire: 4000
            });
        }
    }
}
