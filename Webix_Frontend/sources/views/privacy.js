import { JetView } from "webix-jet";
import authService from "../services/auth";

export default class PrivacyView extends JetView {
	config() {
		const user = authService.getCurrentUser();
		const privacy = user?.privacySettings || {};
		
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
												template: "<h3>Privacy Settings</h3><p>Control your privacy and data sharing preferences</p>",
												autoheight: true,
												borderless: true
											},
											{ height: 10 },
											{
												view: "form",
												id: "privacyForm",
												css: "privacy-settings-form",
												scroll: false,
												elements: [
													// Account Privacy Section
													{ 
														view: "template", 
														template: "<h4 style='margin-bottom: 5px;'>Account Privacy</h4>", 
														autoheight: true, 
														borderless: true 
													},
													{
														view: "segmented",
														name: "profileVisibility",
														value: privacy.profileVisibility || "public",
														options: [
															{ id: "public", value: "🌐 Public" },
															{ id: "private", value: "🔒 Private" }
														]
													},
													
													// Online Status Section
													{ height: 15 },
													{ 
														view: "template", 
														template: "<h4 style='margin-bottom: 5px;'>Activity Status</h4>", 
														autoheight: true, 
														borderless: true 
													},
													{
														cols: [
															{
																view: "template",
																template: "<span style='line-height: 40px;'>Show when you're online</span>",
																borderless: true,
																autoheight: true
															},
															{
																view: "switch",
																name: "showOnlineStatus",
																value: privacy.showOnlineStatus !== false ? 1 : 0,
																width: 60
															}
														]
													},
													
													// Data Sharing Section
													{ height: 15 },
													{ 
														view: "template", 
														template: "<h4 style='margin-bottom: 5px;'>Data & Analytics</h4>", 
														autoheight: true, 
														borderless: true 
													},
													{
														cols: [
															{
																view: "template",
																template: "<span style='line-height: 40px;'>Share usage data to improve the service</span>",
																borderless: true,
																autoheight: true
															},
															{
																view: "switch",
																name: "shareUsageData",
																value: privacy.shareUsageData !== false ? 1 : 0,
																width: 60
															}
														]
													},
													{ height: 10 },
													{
														cols: [
															{
																view: "template",
																template: "<span style='line-height: 40px;'>Allow personalized recommendations</span>",
																borderless: true,
																autoheight: true
															},
															{
																view: "switch",
																name: "personalizedRecommendations",
																value: privacy.personalizedRecommendations !== false ? 1 : 0,
																width: 60
															}
														]
													},
													
													// Search Visibility Section
													{ height: 15 },
													{ 
														view: "template", 
														template: "<h4 style='margin-bottom: 5px;'>Search & Discovery</h4>", 
														autoheight: true, 
														borderless: true 
													},
													{
														cols: [
															{
																view: "template",
																template: "<span style='line-height: 40px;'>Allow others to find you by email</span>",
																borderless: true,
																autoheight: true
															},
															{
																view: "switch",
																name: "searchByEmail",
																value: privacy.searchByEmail !== false ? 1 : 0,
																width: 60
															}
														]
													},
													
													{ height: 30 },
													{
														cols: [
															{},
															{
																view: "button",
																value: "Save Settings",
																width: 150,
																css: "webix_primary",
																click: () => this.savePrivacySettings()
															}
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
	
	savePrivacySettings() {
		webix.message({ type: "success", text: "Privacy settings saved (save functionality coming soon)" });
	}
}
