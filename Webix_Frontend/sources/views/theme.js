
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
														template: "<p style='margin: 5px 0 10px 0; color: var(--text-secondary);'>Choose how the app looks to you.</p>",
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
													
													// Font Size Section with Slider
                                                    { height: 20 },
                                                    { 
                                                        view: "template", 
                                                        template: "<h4 style='margin-bottom: 5px;'>Font Size</h4>", 
                                                        autoheight: true, 
                                                        borderless: true 
                                                    },
                                                    {
                                                        view: "template",
                                                        template: "<p style='margin: 5px 0 10px 0; color: var(--text-secondary);'>Adjust text size for better readability.</p>",
                                                        autoheight: true,
                                                        borderless: true
                                                    },
                                                    {
                                                        view: "slider",
                                                        id: "fontSizeSlider",
                                                        name: "fontSize",
                                                        value: currentTheme.fontSize || 14,
                                                        min: 12,
                                                        max: 24,
                                                        step: 2,
                                                        title: webix.template("#value#px"),
                                                        on: {
                                                            onChange: (newValue) => this.changeFontSize(newValue),
                                                            onSliding: (newValue) => this.changeFontSize(newValue)
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
                                                        template: "<p style='margin: 5px 0 10px 0; color: var(--text-secondary);'>Choose your preferred font family.</p>",
                                                        autoheight: true,
                                                        borderless: true
                                                    },
                                                    {
                                                        view: "select",
                                                        id: "fontFamilySelector",
                                                        name: "fontFamily",
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

                                                    // High Contrast Section
                                                    { height: 20 },
                                                    { 
                                                        view: "template", 
                                                        template: "<h4 style='margin-bottom: 5px;'>Accessibility</h4>", 
                                                        autoheight: true, 
                                                        borderless: true 
                                                    },
                                                    {
                                                        view: "template",
                                                        template: "<p style='margin: 5px 0 10px 0; color: var(--text-secondary);'>Enable high contrast mode for better visibility.</p>",
                                                        autoheight: true,
                                                        borderless: true
                                                    },
                                                    {
                                                        css: "privacy-setting-row",
                                                        borderless: false,
                                                        padding: 15,
                                                        cols: [
                                                            {
                                                                view: "template",
                                                                template: "<span style='line-height: 40px;'>High Contrast Mode</span>",
                                                                borderless: true,
                                                                autoheight: true
                                                            },
                                                            {
                                                                view: "switch",
                                                                name: "highContrast",
                                                                id: "highContrastSwitch",
                                                                value: currentTheme.highContrast ? 1 : 0,
                                                                width: 60,
                                                                on: {
                                                                    onChange: (newValue) => this.toggleHighContrast(newValue)
                                                                }
                                                            }
                                                        ]
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
        // Trigger Webix to refresh all views
        this.getRoot().refresh();
    }
    
    changeFontFamily(family) {
        themeService.setFontFamily(family);
        // Trigger Webix to refresh all views
        this.getRoot().refresh();
        
        const familyNames = {
            "system": "System Default",
            "sans-serif": "Sans-serif",
            "serif": "Serif",
            "monospace": "Monospace"
        };
        webix.message({ type: "success", text: `Font: ${familyNames[family]}`, expire: 2000 });
    }

    toggleHighContrast(enabled) {
        themeService.setHighContrast(enabled);
        webix.message({ 
            type: "success", 
            text: enabled ? "High contrast enabled" : "High contrast disabled", 
            expire: 2000 
        });
    }
    
    
    
	
	resetTheme() {
        const defaultTheme = themeService.resetTheme();
        
        this.$$("themeModeSelector").setValue(defaultTheme.mode);
        this.$$("fontSizeSlider").setValue(defaultTheme.fontSize);
        this.$$("fontFamilySelector").setValue(defaultTheme.fontFamily);
        this.$$("highContrastSwitch").setValue(defaultTheme.highContrast ? 1 : 0);
        
        webix.message({ type: "info", text: "All theme settings reset to default" });
    }
    
}
