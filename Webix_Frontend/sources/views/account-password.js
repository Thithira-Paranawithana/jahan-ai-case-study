
import authService from "../services/auth";
import { validatePasswordChange, validators } from "../helpers/validation";

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
            width: 480,
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
                                        placeholder: "Enter current password",
                                        on: {
                                            onChange: () => this.clearFieldError('currentPassword')
                                        }
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
                            {
                                view: "template",
                                id: "currentPasswordError",
                                template: "",
                                height: 0,
                                borderless: true
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
                                        placeholder: "Enter new password",
                                        on: {
                                            onChange: (newValue) => {
                                                this.clearFieldError('newPassword');
                                                this.updatePasswordStrength(newValue);
                                            },
                                            onKeyPress: () => {
                                                // Show strength bar on first keypress
                                                setTimeout(() => {
                                                    const value = webix.$$("newPasswordField").getValue();
                                                    this.updatePasswordStrength(value);
                                                }, 0);
                                            }
                                        }
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
                            {
                                view: "template",
                                id: "newPasswordError",
                                template: "",
                                height: 0,
                                borderless: true
                            },
                            {
                                view: "template",
                                id: "passwordStrengthBar",
                                template: `
                                    <div id="strengthContainer" style="margin-top: 8px; display: none;">
                                        <div style="font-size: 12px; color: #666; margin-bottom: 4px;">
                                            Password Strength: <span id="strengthLabel" style="font-weight: 600;">-</span>
                                        </div>
                                        <div style="width: 100%; height: 6px; background: #e0e0e0; border-radius: 3px; overflow: hidden;">
                                            <div id="strengthBar" style="width: 0%; height: 100%; transition: all 0.3s ease; background: #ccc;"></div>
                                        </div>
                                    </div>
                                `,
                                height: 0,
                                borderless: true
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
                                        placeholder: "Confirm new password",
                                        on: {
                                            onChange: () => this.clearFieldError('confirmPassword')
                                        }
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
                            {
                                view: "template",
                                id: "confirmPasswordError",
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
            this.clearAllErrors();
            this.resetPasswordStrength();
            webix.$$("currentPasswordField").define("type", "password");
            webix.$$("newPasswordField").define("type", "password");
            webix.$$("confirmPasswordField").define("type", "password");
            this.passwordWindow.hide();
        }
    }

    clearAllErrors() {
        this.clearFieldError('currentPassword');
        this.clearFieldError('newPassword');
        this.clearFieldError('confirmPassword');
    }

    clearFieldError(fieldName) {
        const errorTemplate = webix.$$(fieldName + "Error");
        if (errorTemplate) {
            errorTemplate.setHTML("");
            errorTemplate.config.height = 0;
            errorTemplate.resize();
        }
        
        // Clear red border
        const field = webix.$$(fieldName + "Field");
        if (field) {
            const inputNode = field.getNode().querySelector('input');
            if (inputNode) {
                inputNode.style.border = '';
            }
        }
    }

    showFieldError(fieldName, message) {
        const errorTemplate = webix.$$(fieldName + "Error");
        if (errorTemplate) {
            errorTemplate.setHTML(`<span style="color: #e53e3e; font-size: 13px; margin-top: 4px;">${message}</span>`);
            errorTemplate.config.height = 20;
            errorTemplate.resize();
        }
        
        // Add red border
        const field = webix.$$(fieldName + "Field");
        if (field) {
            const inputNode = field.getNode().querySelector('input');
            if (inputNode) {
                inputNode.style.border = '2px solid #e53e3e';
                inputNode.style.borderRadius = '4px';
            }
        }
    }

    updatePasswordStrength(password) {
        const strengthContainer = document.getElementById('strengthContainer');
        const strengthBar = document.getElementById('strengthBar');
        const strengthLabel = document.getElementById('strengthLabel');
        const strengthTemplate = webix.$$("passwordStrengthBar");
        
        if (!password || password.trim() === "") {
            // Hide strength bar when empty
            if (strengthContainer) {
                strengthContainer.style.display = 'none';
            }
            if (strengthTemplate) {
                strengthTemplate.config.height = 0;
                strengthTemplate.resize();
            }
            return;
        }

        // Show strength bar
        if (strengthContainer) {
            strengthContainer.style.display = 'block';
        }
        if (strengthTemplate) {
            strengthTemplate.config.height = 45;
            strengthTemplate.resize();
        }

        // Check if password meets all requirements
        const validation = validators.password(password);
        const isStrong = validation.valid;

        let strength = 0;
        let label = "Weak";
        let color = "#e53e3e"; // red

        if (isStrong) {
            // Strong password - meets all requirements
            strength = 100;
            label = "Strong";
            color = "#4caf50"; // green
        } else {
            // Weak password - calculate partial strength
            if (password.length >= 8) strength += 25;
            if (/[a-z]/.test(password)) strength += 15;
            if (/[A-Z]/.test(password)) strength += 15;
            if (/[0-9]/.test(password)) strength += 15;
            if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 15;
            
            // Cap at 85% for weak passwords
            strength = Math.min(strength, 85);
            label = "Weak";
            color = "#e53e3e"; // red
        }

        // Update UI
        if (strengthBar) {
            strengthBar.style.width = strength + '%';
            strengthBar.style.background = color;
        }
        
        if (strengthLabel) {
            strengthLabel.textContent = label;
            strengthLabel.style.color = color;
        }
    }

    resetPasswordStrength() {
        const strengthContainer = document.getElementById('strengthContainer');
        const strengthBar = document.getElementById('strengthBar');
        const strengthLabel = document.getElementById('strengthLabel');
        const strengthTemplate = webix.$$("passwordStrengthBar");
        
        if (strengthContainer) {
            strengthContainer.style.display = 'none';
        }
        
        if (strengthBar) {
            strengthBar.style.width = '0%';
            strengthBar.style.background = '#ccc';
        }
        
        if (strengthLabel) {
            strengthLabel.textContent = '-';
            strengthLabel.style.color = '#666';
        }
        
        if (strengthTemplate) {
            strengthTemplate.config.height = 0;
            strengthTemplate.resize();
        }
    }

    async changePassword() {
        const form = webix.$$("passwordForm");
        const values = form.getValues();
        
        // Clear all errors
        this.clearAllErrors();
        
        // Client-side validation
        const validation = validatePasswordChange(values);
        
        if (!validation.valid) {
            // Show each error inline
            validation.errors.forEach(error => {
                this.showFieldError(error.field, error.message);
            });
            
            // Also show toast with first error
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
            // Handle backend errors
            if (result.errors) {
                // Map backend errors to fields
                for (let field in result.errors) {
                    let fieldName = field;
                    
                    // Map backend field names to frontend
                    if (field === 'current_password') fieldName = 'currentPassword';
                    if (field === 'new_password') fieldName = 'newPassword';
                    if (field === 'confirm_password') fieldName = 'confirmPassword';
                    
                    this.showFieldError(fieldName, result.errors[field][0]);
                }
            } else if (result.error) {
                // Generic error - show on current password field
                this.showFieldError('currentPassword', result.error);
            }
            
            webix.message({ 
                type: "error", 
                text: result.error || "Failed to change password",
                expire: 4000
            });
        }
    }
}
