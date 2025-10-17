
import { JetView } from "webix-jet";
import "../styles/register.css";
import authService from "../services/auth";
import { validators } from "../helpers/validation";

export default class RegisterView extends JetView {
    ready() {
        document.body.classList.remove("authenticated");
    }
    
    config() {
        const registerForm = {
            view: "form",
            id: "registerForm",
            borderless: true,
            width: 420,
            elements: [
                { 
                    view: "template", 
                    template: "<h1>Create Account</h1><p class='subtitle'>Sign up to start managing your preferences</p>", 
                    borderless: true,
                    css: "register_header",
                    height: 100
                },
                { 
                    view: "text", 
                    name: "fullName",
                    id: "registerFullNameField",
                    label: "Full Name", 
                    labelPosition: "top", 
                    placeholder: "John Doe",
                    css: "input_field",
                    on: {
                        onChange: () => this.clearFieldError('fullName')
                    }
                },
                {
                    view: "template",
                    id: "registerFullNameError",
                    template: "",
                    height: 0,
                    borderless: true
                },
                { 
                    view: "text", 
                    name: "email",
                    id: "registerEmailField",
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
                    id: "registerEmailError",
                    template: "",
                    height: 0,
                    borderless: true
                },
                { 
                    view: "text", 
                    type: "password", 
                    name: "password",
                    id: "registerPasswordField",
                    label: `
                        <div class="label-with-icon">
                            <span>Password</span>
                            <span class="webix_icon wxi-eye password-toggle-icon" data-field="password"></span>
                        </div>
                    `,
                    labelPosition: "top", 
                    placeholder: "Create a strong password",
                    css: "input_field",
                    on: {
                        onChange: (newValue) => {
                            this.clearFieldError('password');
                            this.updatePasswordStrength(newValue);
                        },
                        onKeyPress: () => {
                            setTimeout(() => {
                                const value = this.$$("registerPasswordField").getValue();
                                this.updatePasswordStrength(value);
                            }, 0);
                        }
                    }
                },
                {
                    view: "template",
                    id: "registerPasswordError",
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
                { 
                    view: "text", 
                    type: "password", 
                    name: "confirmPassword",
                    id: "registerConfirmPasswordField",
                    label: `
                        <div class="label-with-icon">
                            <span>Confirm Password</span>
                            <span class="webix_icon wxi-eye password-toggle-icon" data-field="confirmPassword"></span>
                        </div>
                    `,
                    labelPosition: "top", 
                    placeholder: "Re-enter your password",
                    css: "input_field",
                    on: {
                        onChange: () => this.clearFieldError('confirmPassword')
                    }
                },
                {
                    view: "template",
                    id: "registerConfirmPasswordError",
                    template: "",
                    height: 0,
                    borderless: true
                },
                {
                    view: "template",
                    template: `
                        <label class="terms_label">
                            <input type="checkbox" id="agreeTerms" class="terms_input">
                            <span>I agree to the <a href="#" class="terms-link">Terms & Conditions</a></span>
                        </label>
                    `,
                    borderless: true,
                    height: 40,
                    css: "terms_wrapper"
                },
                { 
                    view: "button", 
                    value: "Create Account", 
                    css: "webix_primary register_button", 
                    height: 48,
                    hotkey: "enter", 
                    click: () => this.doRegister() 
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
                    template: "<div class='signin-prompt'>Already have an account? <a href='#!/login' class='signin-link'>Sign In</a></div>",
                    borderless: true,
                    autoheight: true,
                    css: "text-center"
                }
            ]
        };

        const leftPanel = {
            view: "template",
            css: "register_left_panel",
            borderless: true,
            template: `
                <div class="brand_section">
                    <div class="brand_logo">
                        <span class="logo_icon">⚙️</span>
                        <h1>User Preferences</h1>
                    </div>
                    <div class="brand_content">
                        <h3>Join Us Today</h3>
                        <h4>Manage your account settings, notifications, themes, and privacy preferences all in one place.</h4>
                        <ul class="feature_list">
                            <li>✓ Personalized account settings</li>
                            <li>✓ Smart notification controls</li>
                            <li>✓ Customizable themes</li>
                            <li>✓ Advanced privacy options</li>
                        </ul>
                    </div>
                    <div class="testimonial_section">
						<div class="testimonial active">
							<div class="quote">"The best preference management system I've used. Simple and powerful."</div>
							<div class="author">- Sarah Johnson</div>
						</div>
						<div class="testimonial">
							<div class="quote">"Intuitive interface with all the customization options I need."</div>
							<div class="author">- Michael Chen</div>
						</div>
						<div class="testimonial">
							<div class="quote">"Great control over privacy settings. Highly recommended!"</div>
							<div class="author">- Emma Wilson</div>
						</div>
						<div class="dots">
							<span class="dot active"></span>
							<span class="dot"></span>
							<span class="dot"></span>
						</div>
					</div>
                </div>
            `
        };

        const rightPanel = {
            css: "register_right_panel",
            rows: [
                {},
                {
                    cols: [
                        {},
                        registerForm,
                        {}
                    ]
                },
                {}
            ]
        };

        return {
            css: "register_layout",
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

        this.attachPasswordToggles();
        
        setTimeout(() => {
            if (this.$$("registerFullNameField")) {
                this.$$("registerFullNameField").focus();
            }
        }, 100);

		this.startTestimonialRotation();		

    }

	destructor() {
		if (this.testimonialInterval) {
			clearInterval(this.testimonialInterval);
		}
		super.destructor();
	}
	
	
	startTestimonialRotation() {
		setTimeout(() => {
			const testimonials = this.getRoot().$view.querySelectorAll('.testimonial');
			const dots = this.getRoot().$view.querySelectorAll('.dot');
			
			if (!testimonials.length || !dots.length) return;
			
			let currentIndex = 0;
			
			this.testimonialInterval = setInterval(() => {
				testimonials[currentIndex].classList.remove('active');
				dots[currentIndex].classList.remove('active');
				
				currentIndex = (currentIndex + 1) % testimonials.length;
				
				testimonials[currentIndex].classList.add('active');
				dots[currentIndex].classList.add('active');
			}, 3000);
		}, 200);
	}

    attachPasswordToggles() {
        setTimeout(() => {
            const icons = this.getRoot().$view.querySelectorAll(".password-toggle-icon");
            icons.forEach(icon => {
                icon.replaceWith(icon.cloneNode(true));
            });
            
            const newIcons = this.getRoot().$view.querySelectorAll(".password-toggle-icon");
            newIcons.forEach(icon => {
                icon.addEventListener("click", () => {
                    const fieldName = icon.getAttribute('data-field');
                    this.togglePasswordVisibility(fieldName);
                });
            });
        }, 50);
    }

    togglePasswordVisibility(fieldName) {
        const fieldId = `register${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}Field`;
        const field = this.$$(fieldId);
        
        if (!field) return;
        
        const isPassword = field.config.type === "password";

        if (isPassword) {
            field.define("type", "text");
        } else {
            field.define("type", "password");
        }
        
        field.refresh();
        this.attachPasswordToggles();
        
        setTimeout(() => {
            const icon = this.getRoot().$view.querySelector(`[data-field="${fieldName}"]`);
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

    updatePasswordStrength(password) {
        if (!password || password.trim() === "") {
            const container = document.getElementById('strengthContainer');
            const template = this.$$("passwordStrengthBar");
            if (container) container.style.display = 'none';
            if (template) {
                template.config.height = 0;
                template.resize();
            }
            return;
        }

        const container = document.getElementById('strengthContainer');
        const strengthBar = document.getElementById('strengthBar');
        const strengthLabel = document.getElementById('strengthLabel');
        const template = this.$$("passwordStrengthBar");
        
        if (container) container.style.display = 'block';
        if (template) {
            template.config.height = 45;
            template.resize();
        }

        const validation = validators.password(password);
        const isStrong = validation.valid;

        let strength = 0;
        let label = "Weak";
        let color = "#e53e3e";

        if (isStrong) {
            strength = 100;
            label = "Strong";
            color = "#4caf50";
        } else {
            if (password.length >= 8) strength += 25;
            if (/[a-z]/.test(password)) strength += 15;
            if (/[A-Z]/.test(password)) strength += 15;
            if (/[0-9]/.test(password)) strength += 15;
            if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 15;
            strength = Math.min(strength, 85);
            label = "Weak";
            color = "#e53e3e";
        }

        if (strengthBar) {
            strengthBar.style.width = strength + '%';
            strengthBar.style.background = color;
        }
        
        if (strengthLabel) {
            strengthLabel.textContent = label;
            strengthLabel.style.color = color;
        }
    }

    clearFieldError(fieldName) {
        const errorTemplate = this.$$("register" + fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + "Error");
        if (errorTemplate) {
            errorTemplate.setHTML("");
            errorTemplate.config.height = 0;
            errorTemplate.resize();
        }
        
        const field = this.$$("register" + fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + "Field");
        if (field) {
            const inputNode = field.getNode().querySelector('input');
            if (inputNode) {
                inputNode.style.border = '';
            }
        }
    }

    showFieldError(fieldName, message) {
        const errorTemplate = this.$$("register" + fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + "Error");
        if (errorTemplate) {
            errorTemplate.setHTML(`<span style="color: #e53e3e; font-size: 13px; display: block; margin-top: 4px;">${message}</span>`);
            errorTemplate.config.height = 28;
            errorTemplate.resize();
        }
        
        const field = this.$$("register" + fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + "Field");
        if (field) {
            const inputNode = field.getNode().querySelector('input');
            if (inputNode) {
                inputNode.style.border = '2px solid #e53e3e';
                inputNode.style.borderRadius = '8px';
            }
        }
    }

    clearAllErrors() {
        this.clearFieldError('fullName');
        this.clearFieldError('email');
        this.clearFieldError('password');
        this.clearFieldError('confirmPassword');
    }

    async doRegister() {
        const form = this.$$("registerForm");
        this.clearAllErrors();
        
        const values = form.getValues();
        const agreeTerms = document.getElementById("agreeTerms")?.checked;

        // Client-side validation
        if (!values.fullName || values.fullName.trim() === "") {
            this.showFieldError('fullName', 'Full name is required');
            webix.message({ type: "error", text: "Full name is required" });
            return;
        }

        const nameValidation = validators.fullName(values.fullName);
        if (!nameValidation.valid) {
            this.showFieldError('fullName', nameValidation.message);
            webix.message({ type: "error", text: nameValidation.message });
            return;
        }

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

        const passwordValidation = validators.password(values.password);
        if (!passwordValidation.valid) {
            this.showFieldError('password', passwordValidation.message);
            webix.message({ type: "error", text: passwordValidation.message });
            return;
        }

        if (!values.confirmPassword || values.confirmPassword.trim() === "") {
            this.showFieldError('confirmPassword', 'Please confirm your password');
            webix.message({ type: "error", text: "Please confirm your password" });
            return;
        }

        if (values.password !== values.confirmPassword) {
            this.showFieldError('confirmPassword', 'Passwords do not match');
            webix.message({ type: "error", text: "Passwords do not match" });
            return;
        }

        if (!agreeTerms) {
            webix.message({ type: "error", text: "Please agree to the Terms & Conditions" });
            return;
        }

        const loadingMessage = webix.message({ type: "info", text: "Creating account..." });

        const result = await authService.register(values.fullName, values.email, values.password);
        
        webix.message.hide(loadingMessage);
        
        if (result.success) {
            webix.message({ type: "success", text: "Account created successfully!" });
            
            setTimeout(() => {
                this.show("/top/settings");
            }, 1000);
        } else {
            if (result.errors) {
                for (let field in result.errors) {
                    let fieldName = field === 'full_name' ? 'fullName' : field;
                    this.showFieldError(fieldName, result.errors[field][0]);
                }
                webix.message({ type: "error", text: "Please fix the errors", expire: 4000 });
            } else {
                webix.message({ type: "error", text: result.error });
            }
        }
    }
}
