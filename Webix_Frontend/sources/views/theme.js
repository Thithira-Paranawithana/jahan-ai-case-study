import { JetView } from "webix-jet";
import themeService from "../services/themeService";

export default class ThemeView extends JetView {
	config() {
		const currentTheme = themeService.getCurrentTheme();
		
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
												template: "<h3>Theme Settings</h3><p>Customize the appearance of your application</p>",
												autoheight: true,
												borderless: true
											},
											{ height: 10 },
											{
												view: "form",
												id: "themeForm",
												css: "theme-settings-form",
												scroll: false,
												elements: [
													// Theme Mode Section
													{ 
														view: "template", 
														template: "<h4 style='margin-bottom: 5px;'>Appearance</h4>", 
														autoheight: true, 
														borderless: true 
													},
													{
														view: "template",
														template: "<p style='margin: 5px 0 10px 0; font-size: 13px; color: #666;'>Choose how the app looks to you.</p>",
														autoheight: true,
														borderless: true
													},
													{
														view: "segmented",
														name: "themeMode",
														id: "themeModeSelector",
														value: currentTheme.mode || "light",
														options: [
															{ id: "light", value: "☀️ Light" },
															{ id: "dark", value: "🌙 Dark" }
														],
														on: {
															onChange: (newValue) => this.changeTheme(newValue)
														}
													},
													
													{ height: 30 },
													{
														cols: [
															{
																view: "button",
																value: "Reset to Default",
																width: 150,
																click: () => this.resetTheme()
															},
															{}
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
	
	changeTheme(mode) {
		// Apply theme immediately
		themeService.setThemeMode(mode);
		webix.message({ type: "success", text: `Switched to ${mode} theme`, expire: 2000 });
	}
	
	resetTheme() {
		themeService.resetTheme();
		const selector = this.$$("themeModeSelector");
		selector.setValue("light");
		webix.message({ type: "info", text: "Theme reset to Light mode" });
	}
}
