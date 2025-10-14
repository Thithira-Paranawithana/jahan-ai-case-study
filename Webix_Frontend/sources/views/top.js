import {JetView} from "webix-jet";
import authService from "../services/auth";

export default class TopView extends JetView{
	config(){
		const user = authService.getCurrentUser();
		
		var toolbar = {
			view:"toolbar",
			height: 60,
			cols:[
				{
					view:"label",
					label:"⚙️ User Preferences",
					css:"app_title"
				},
				{},
				{
					view:"label",
					label: user ? user.fullName : "Guest",
					width: 150
				},
				{
					view:"button",
					value:"Logout",
					width:100,
					click: () => this.doLogout()
				}
			]
		};

		var ui = {
			rows:[
				toolbar,
				{ $subview:true }
			]
		};

		return ui;
	}
	
	doLogout() {
		authService.logout();
		webix.message({ type: "success", text: "Logged out successfully" });
		this.show("/login");
	}
}
