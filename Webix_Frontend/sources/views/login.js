
import { JetView } from "webix-jet";
import "../styles/login.css";
import authService from "../services/auth";

export default class LoginView extends JetView {
    ready() {
        document.body.classList.remove("authenticated");
    }
    
    config() {
        const loginForm = {
            view: "form",
            id: "loginForm",
            borderless: true,
            width: 420,
            elements: [
                { 
                    view: "template", 
                    template: "<h1>Welcome Back</h1><p class='subtitle'>Sign in to continue to User Preferences</p>", 
                    borderless: true,
                    css: "login_header",
                    height: 100
                },
                { 
                    view: "text", 
                    name: "email",
                    id: "loginEmailField",
                    label: "Email Address", 
                    labelPosition: "top", 
                    placeholder: "your@email.com",
                    css: "input_field",
                    on: {
                        onChange: () => this.clearFieldError('email')
                    }
                },
                {
                    view: "template",
                    id: "loginEmailError",
                    template: "",
                    height: 0,
                    borderless: true
                },
                { 
                    view: "text", 
                    type: "password", 
                    name: "password",
                    id: "loginPasswordField",
                    label: `
                        <div class="label-with-icon">
                            <span>Password</span>
                            <span class="webix_icon wxi-eye password-toggle-icon"></span>
                        </div>
                    `,
                    labelPosition: "top", 
                    placeholder: "Enter your password",
                    css: "input_field",
                    on: {
                        onChange: () => this.clearFieldError('password')
                    }
                },
                {
                    view: "template",
                    id: "loginPasswordError",
                    template: "",
                    height: 0,
                    borderless: true
                },
                {
                    view: "template",
                    template: `
                        <div class="remember_forgot_container">
                            <label class="remember_label">
                                <input type="checkbox" id="rememberMe" class="remember_input">
                                <span>Remember me</span>
                            </label>
                            <a href="#" class="forgot-link" onclick="return false;">Forgot Password?</a>
                        </div>
                    `,
                    borderless: true,
                    height: 35,
                    css: "remember_forgot_wrapper"
                },
                { 
                    view: "button", 
                    value: "Sign In", 
                    css: "webix_primary login_button", 
                    height: 48,
                    hotkey: "enter", 
                    click: () => this.doLogin() 
                },
                {
                    view: "template",
                    template: "<div class='divider'><span>or</span></div>",
                    borderless: true,
                    height: 40,
                    css: "divider_template"
                },
                {
                    view: "template",
                    template: "<div class='signup-prompt'>Don't have an account? <a href='#!/register' class='signup-link'>Sign Up</a></div>",
                    borderless: true,
                    autoheight: true,
                    css: "text-center"
                }
            ]
        };

        const leftPanel = {
            view: "template",
            css: "login_left_panel",
            borderless: true,
            template: `
                <div class="brand_section">
                    <div class="brand_logo">
                        <span class="logo_icon">⚙️</span>
                        <h1>USER PREFERENCES</h1>
                    </div>
                    <div class="brand_content">
                        <h3>Customize Your Experience</h3>
                        <h4>Manage your account settings, notifications, themes, and privacy preferences all in one place.</h4>
                        <ul class="feature_list">
                            <li>✓ Personalized account settings</li>
                            <li>✓ Smart notification controls</li>
                            <li>✓ Customizable themes</li>
                            <li>✓ Advanced privacy options</li>
                        </ul>
                    </div>
                    <div class="demo_credentials">
                        <h4><strong>Demo Credentials:</strong></h4>
                        <h4>Email: john@example.com</h4>
                        <h4>Password: Password@123</h4>
                    </div>
                </div>
            `
        };

        const rightPanel = {
            css: "login_right_panel",
            rows: [
                {},
                {
                    cols: [
                        {},
                        loginForm,
                        {}
                    ]
                },
                {}
            ]
        };

        return {
            css: "login_layout",
            cols: [
                leftPanel,
                rightPanel
            ]
        };
    }

    init() {
        if (webix.$$("customLogoutConfirm")) {
            webix.$$("customLogoutConfirm").destructor();
        }
        if (webix.$$("logoutMenuPopup")) {
            webix.$$("logoutMenuPopup").destructor();
        }
        
        if (authService.isAuthenticated()) {
            this.show("/top/settings");
            return;
        }

        // Attach password toggle event listener
        this.attachPasswordToggle();
        
        setTimeout(() => {
            if (this.$$("loginEmailField")) {
                this.$$("loginEmailField").focus();
            }
        }, 100);
    }

    attachPasswordToggle() {
        // Use setTimeout to ensure DOM is ready
        setTimeout(() => {
            const icon = this.getRoot().$view.querySelector(".password-toggle-icon");
            if (icon) {
                // Remove old listener if exists
                icon.replaceWith(icon.cloneNode(true));
                
                // Get the new node and attach listener
                const newIcon = this.getRoot().$view.querySelector(".password-toggle-icon");
                newIcon.addEventListener("click", () => {
                    this.togglePasswordVisibility();
                });
            }
        }, 50);
    }

    togglePasswordVisibility() {
        const field = this.$$("loginPasswordField");
        
        if (!field) return;
        
        const isPassword = field.config.type === "password";

        if (isPassword) {
            field.define("type", "text");
        } else {
            field.define("type", "password");
        }
        
        field.refresh();
        
        // Re-attach event listener after refresh (since DOM is rebuilt)
        this.attachPasswordToggle();
        
        // Update icon class
        setTimeout(() => {
            const icon = this.getRoot().$view.querySelector(".password-toggle-icon");
            if (icon) {
                if (isPassword) {
                    icon.classList.remove("wxi-eye");
                    icon.classList.add("wxi-eye-slash");
                } else {
                    icon.classList.remove("wxi-eye-slash");
                    icon.classList.add("wxi-eye");
                }
            }
        }, 50);
    }

    clearFieldError(fieldName) {
        const errorTemplate = webix.$$("login" + fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + "Error");
        if (errorTemplate) {
            errorTemplate.setHTML("");
            errorTemplate.config.height = 0;
            errorTemplate.resize();
        }
        
        const field = webix.$$("login" + fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + "Field");
        if (field) {
            const inputNode = field.getNode().querySelector('input');
            if (inputNode) {
                inputNode.style.border = '';
            }
        }
    }

    showFieldError(fieldName, message) {
        const errorTemplate = webix.$$("login" + fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + "Error");
        if (errorTemplate) {
            errorTemplate.setHTML(`<span style="color: #e53e3e; font-size: 13px; display: block; margin-top: 4px;">${message}</span>`);
            errorTemplate.config.height = 28;
            errorTemplate.resize();
        }
        
        const field = webix.$$("login" + fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + "Field");
        if (field) {
            const inputNode = field.getNode().querySelector('input');
            if (inputNode) {
                inputNode.style.border = '2px solid #e53e3e';
                inputNode.style.borderRadius = '8px';
            }
        }
    }

    clearAllErrors() {
        this.clearFieldError('email');
        this.clearFieldError('password');
    }

    async doLogin() {
        const form = this.$$("loginForm");
        this.clearAllErrors();
        
        const values = form.getValues();
        const rememberMe = document.getElementById("rememberMe")?.checked || false;
        
        if (!values.email || values.email.trim() === "") {
            this.showFieldError('email', 'Email is required');
            webix.message({ type: "error", text: "Email is required" });
            return;
        }
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
            this.showFieldError('email', 'Please enter a valid email address');
            webix.message({ type: "error", text: "Please enter a valid email address" });
            return;
        }
        
        if (!values.password || values.password.trim() === "") {
            this.showFieldError('password', 'Password is required');
            webix.message({ type: "error", text: "Password is required" });
            return;
        }
        
        const loadingMessage = webix.message({ type: "info", text: "Signing in..." });
        
        const result = await authService.login(values.email, values.password, rememberMe);
        
        webix.message.hide(loadingMessage);
        
        if (result.success) {
            webix.message({ type: "success", text: `Welcome back, ${result.user.fullName}!` });
            
            setTimeout(() => {
                this.show("/top/settings");
            }, 500);
        } else {
            if (result.error) {
                this.showFieldError('password', result.error);
                webix.message({ type: "error", text: result.error });
            } else {
                webix.message({ type: "error", text: "Login failed" });
            }
        }
    }
}
