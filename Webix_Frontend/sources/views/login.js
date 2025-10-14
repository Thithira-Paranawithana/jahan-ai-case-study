import { JetView } from "webix-jet";

export default class LoginView extends JetView {
	config() {
		const loginForm = {
			view: "form",
			id: "loginForm",
			width: 400,
			borderless: true,
			margin: 10,
			rows: [
				{ type: "header", template: "Welcome Back!", css: "webix_header app_header" },
				{ view: "text", name: "email", label: "Email", labelPosition: "top", placeholder: "your@email.com" },
				{ view: "text", type: "password", name: "password", label: "Password", labelPosition: "top", placeholder: "Your password" },
				{ view: "button", value: "Login", css: "webix_primary", hotkey: "enter", click: () => this.doLogin() },
				{
					template: "<a href='#!/register' class='app-link'>Don't have an account? Sign Up</a>",
					borderless: true,
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
