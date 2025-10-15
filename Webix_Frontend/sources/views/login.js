import { JetView } from "webix-jet";
import "../styles/login.css";
import authService from "../services/auth";

export default class LoginView extends JetView {

	ready() {
		// Remove authenticated class on login page
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
					label: "Email Address", 
					labelPosition: "top", 
					placeholder: "your@email.com",
					css: "input_field",
					value: "john@example.com"  // demo
				},
				{ 
					view: "text", 
					type: "password", 
					name: "password", 
					label: "Password", 
					labelPosition: "top", 
					placeholder: "Enter your password",
					css: "input_field",
					value: "Password@123"  // demo
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
		// Check if already logged in
		if (authService.isAuthenticated()) {
			this.show("/top/settings");
			return;
		}
		
		this.$$("loginForm").elements.email.focus();
	}

	doLogin() {
		const form = this.$$("loginForm");
		
		if (!form.validate()) {
			webix.message({ type: "error", text: "Please fill in all fields correctly" });
			return;
		}
		
		const values = form.getValues();
		const rememberMe = document.getElementById("rememberMe")?.checked || false;
		
		// call auth service
		const result = authService.login(values.email, values.password, rememberMe);
		
		if (result.success) {
			webix.message({ type: "success", text: `Welcome back, ${result.user.fullName}!` });
			
			// redirect to dashboard
			setTimeout(() => {
				this.show("/top/settings");
			}, 500);
		} else {
			webix.message({ type: "error", text: result.error });
		}
	}
}
