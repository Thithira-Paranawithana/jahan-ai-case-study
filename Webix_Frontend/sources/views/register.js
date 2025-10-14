import { JetView } from "webix-jet";

export default class RegisterView extends JetView {
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
					label: "Full Name", 
					labelPosition: "top", 
					placeholder: "John Doe",
					css: "input_field"
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
					placeholder: "Create a strong password",
					css: "input_field"
				},
				{ 
					view: "text", 
					type: "password", 
					name: "confirmPassword", 
					label: "Confirm Password", 
					labelPosition: "top", 
					placeholder: "Re-enter your password",
					css: "input_field"
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
			],
			rules: {
				fullName: webix.rules.isNotEmpty,
				email: webix.rules.isEmail,
				password: webix.rules.isNotEmpty,
				confirmPassword: webix.rules.isNotEmpty
			}
		};

		const leftPanel = {
			view: "template",
			css: "register_left_panel",
			borderless: true,
			template: `
				<div class="brand_section">
					<div class="brand_logo">
						<span class="logo_icon">⚙️</span>
						<h2>User Preferences</h2>
					</div>
					<div class="brand_content">
						<h3>Join Us Today</h3>
						<p>Create your account and take control of your personalized experience.</p>
						<ul class="feature_list">
							<li>✓ Quick and easy setup</li>
							<li>✓ Secure account management</li>
							<li>✓ Full customization control</li>
							<li>✓ Privacy-first approach</li>
						</ul>
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
		this.$$("registerForm").elements.fullName.focus();
	}

	doRegister() {
		const form = this.$$("registerForm");
		const agreeTerms = document.getElementById("agreeTerms")?.checked;

		if (!agreeTerms) {
			webix.message({ type: "error", text: "Please agree to the Terms & Conditions" });
			return;
		}

		if (form.validate()) {
			const values = form.getValues();
			
			if (values.password !== values.confirmPassword) {
				webix.message({ type: "error", text: "Passwords do not match" });
				return;
			}

			webix.message({ 
				type: "success", 
				text: `Account created for ${values.email}!` 
			});
			
			console.log("Register values:", values);
			
            // Redirect to login after successful registration
			setTimeout(() => {
				this.show("/login");
			}, 1500);
			
		}
	}
}
