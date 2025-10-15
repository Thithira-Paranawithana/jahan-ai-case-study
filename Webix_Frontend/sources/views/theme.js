// import { JetView } from "webix-jet";
// import themeService from "../services/themeService";

// export default class ThemeView extends JetView {
// 	config() {
// 		const currentTheme = themeService.getCurrentTheme();
		
// 		return {
// 			rows: [
// 				{
// 					view: "scrollview",
// 					scroll: "y",
// 					body: {
// 						padding: 20,
// 						rows: [
// 							{
// 								cols: [
// 									{ gravity: 0.2 },
// 									{
// 										gravity: 0.6,
// 										rows: [
// 											{
// 												view: "template",
// 												template: "<h3>Theme Settings</h3><p>Customize the appearance of your application</p>",
// 												autoheight: true,
// 												borderless: true
// 											},
// 											{ height: 10 },
// 											{
// 												view: "form",
// 												id: "themeForm",
// 												css: "theme-settings-form",
// 												scroll: false,
// 												elements: [
// 													// Theme Mode Section
// 													{ 
// 														view: "template", 
// 														template: "<h4 style='margin-bottom: 5px;'>Appearance</h4>", 
// 														autoheight: true, 
// 														borderless: true 
// 													},
// 													{
// 														view: "template",
// 														template: "<p style='margin: 5px 0 10px 0; font-size: 13px; color: #666;'>Choose how the app looks to you.</p>",
// 														autoheight: true,
// 														borderless: true
// 													},
// 													{
// 														view: "segmented",
// 														name: "themeMode",
// 														id: "themeModeSelector",
// 														value: currentTheme.mode || "light",
// 														options: [
// 															{ id: "light", value: "☀️ Light" },
// 															{ id: "dark", value: "🌙 Dark" },
//                                                             { id: "auto", value: "🔄 Auto" }
//                                                         ],
//                                                         on: {
//                                                             onChange: (newValue) => this.changeTheme(newValue)
//                                                         }
// 													},
													
// 													{ height: 30 },
// 													{
// 														cols: [
// 															{
// 																view: "button",
// 																value: "Reset to Default",
// 																width: 150,
// 																click: () => this.resetTheme()
// 															},
// 															{}
// 														]
// 													}
// 												]
// 											}
// 										]
// 									},
// 									{ gravity: 0.2 }
// 								]
// 							}
// 						]
// 					}
// 				}
// 			]
// 		};
// 	}
	
	

//     changeTheme(mode) {
//         // Apply theme immediately
//         themeService.setThemeMode(mode);
        
//         let message = "";
//         if (mode === "auto") {
//             const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
//             message = `Auto mode enabled (currently ${prefersDark ? "dark" : "light"} based on system)`;
//         } else {
//             message = `Switched to ${mode} theme`;
//         }
        
//         webix.message({ type: "success", text: message, expire: 2000 });
//     }
    
	
// 	resetTheme() {
// 		themeService.resetTheme();
// 		const selector = this.$$("themeModeSelector");
// 		selector.setValue("light");
// 		webix.message({ type: "info", text: "Theme reset to Light mode" });
// 	}
// }



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
														template: "<p style='margin: 5px 0 10px 0; font-size: 13px; color: var(--text-secondary);'>Choose how the app looks to you.</p>",
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
															{ id: "dark", value: "🌙 Dark" },
															{ id: "auto", value: "🔄 Auto" }
														],
														on: {
															onChange: (newValue) => this.changeTheme(newValue)
														}
													},
													
													// Font Size Section
													{ height: 20 },
													{ 
														view: "template", 
														template: "<h4 style='margin-bottom: 5px;'>Font Size</h4>", 
														autoheight: true, 
														borderless: true 
													},
													{
														view: "template",
														template: "<p style='margin: 5px 0 10px 0; font-size: 13px; color: var(--text-secondary);'>Adjust text size for better readability.</p>",
														autoheight: true,
														borderless: true
													},
													{
														view: "segmented",
														name: "fontSize",
														id: "fontSizeSelector",
														value: currentTheme.fontSize || "medium",
														options: [
															{ id: "small", value: "Small" },
															{ id: "medium", value: "Medium" },
															{ id: "large", value: "Large" },
															{ id: "extra-large", value: "Extra Large" }
														],
														on: {
															onChange: (newValue) => this.changeFontSize(newValue)
														}
													},
													
													// Font Family Section
													{ height: 20 },
													{ 
														view: "template", 
														template: "<h4 style='margin-bottom: 5px;'>Font Style</h4>", 
														autoheight: true, 
														borderless: true 
													},
													{
														view: "template",
														template: "<p style='margin: 5px 0 10px 0; font-size: 13px; color: var(--text-secondary);'>Choose your preferred font family.</p>",
														autoheight: true,
														borderless: true
													},
													{
														view: "radio",
														name: "fontFamily",
														id: "fontFamilySelector",
														value: currentTheme.fontFamily || "system",
														options: [
															{ id: "system", value: "System Default (Recommended)" },
															{ id: "sans-serif", value: "Sans-serif (Arial, Helvetica)" },
															{ id: "serif", value: "Serif (Georgia, Times New Roman)" },
															{ id: "monospace", value: "Monospace (Courier New)" }
														],
														on: {
															onChange: (newValue) => this.changeFontFamily(newValue)
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
		themeService.setThemeMode(mode);
		
		let message = "";
		if (mode === "auto") {
			const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
			message = `Auto mode enabled (currently ${prefersDark ? "dark" : "light"})`;
		} else {
			message = `Switched to ${mode} theme`;
		}
		
		webix.message({ type: "success", text: message, expire: 2000 });
	}
	
	changeFontSize(size) {
		themeService.setFontSize(size);
		webix.message({ type: "success", text: `Font size changed to ${size}`, expire: 2000 });
	}
	
	changeFontFamily(family) {
		themeService.setFontFamily(family);
		const familyNames = {
			"system": "System Default",
			"sans-serif": "Sans-serif",
			"serif": "Serif",
			"monospace": "Monospace"
		};
		webix.message({ type: "success", text: `Font changed to ${familyNames[family]}`, expire: 2000 });
	}
	
	resetTheme() {
		const defaultTheme = themeService.resetTheme();
		
		// Reset all selectors
		this.$$("themeModeSelector").setValue(defaultTheme.mode);
		this.$$("fontSizeSelector").setValue(defaultTheme.fontSize);
		this.$$("fontFamilySelector").setValue(defaultTheme.fontFamily);
		
		webix.message({ type: "info", text: "All theme settings reset to default" });
	}
}
