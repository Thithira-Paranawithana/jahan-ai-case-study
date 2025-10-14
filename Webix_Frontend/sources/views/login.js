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
					template: "<a route='/register' class='app-link'>Don't have an account? Sign Up</a>",
					borderless: true,
					css: "text-center"
				}
			],
			rules: {
				email: webix.rules.isEmail,
				password: webix.rules.isNotEmpty
			}
		};

		return {
			css: "login_layout",
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
	}

	init() {
		// focus first input field
		this.$$("loginForm").elements.email.focus();
	}

	doLogin() {
		const form = this.$$("loginForm");
		if (form.validate()) {
			const values = form.getValues();
			// perform login logic here
			webix.message(`Logging in with ${values.email}...`);
		}
	}
}