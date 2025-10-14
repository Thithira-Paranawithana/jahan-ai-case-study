import { JetView } from "webix-jet";
import "../styles/login.css";

export default class LoginView extends JetView {
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
                    label: "Email Address", 
                    labelPosition: "top", 
                    placeholder: "your@email.com",
                    css: "input_field"
                },
                { 
                    view: "text", 
                    type: "password", 
                    name: "password", 
                    label: "Password", 
                    labelPosition: "top", 
                    placeholder: "Enter your password",
                    css: "input_field"
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
            ],
            rules: {
                email: webix.rules.isEmail,
                password: webix.rules.isNotEmpty
            }
        };
        

		const leftPanel = {
			view: "template",
			css: "login_left_panel",
			borderless: true,
			template: `
				<div class="brand_section">
					<div class="brand_logo">
						<span class="logo_icon">⚙️</span>
						<h2>User Preferences</h2>
					</div>
					<div class="brand_content">
						<h3>Customize Your Experience</h3>
						<p>Manage your account settings, notifications, themes, and privacy preferences all in one place.</p>
						<ul class="feature_list">
							<li>✓ Personalized account settings</li>
							<li>✓ Smart notification controls</li>
							<li>✓ Customizable themes</li>
							<li>✓ Advanced privacy options</li>
						</ul>
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
		this.$$("loginForm").elements.email.focus();
	}

	doLogin() {
		const form = this.$$("loginForm");
		if (form.validate()) {
			const values = form.getValues();
			webix.message(`Logging in with ${values.email}...`);
		}
	}
}
