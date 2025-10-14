import { JetView } from "webix-jet";
import authService from "../../services/auth";

export default class UserInfoView extends JetView {
	config() {
		const user = authService.getCurrentUser();
		
		return {
			padding: 20,
			rows: [
				{
					cols: [
						{
							view: "template",
							template: "<h3>Personal Information</h3><p>View and manage your account details</p>",
							autoheight: true,
							borderless: true
						},
						{},
						{
							view: "button",
							value: "Edit",
							width: 100,
							id: "editButton",
							click: () => this.toggleEditMode()
						}
					]
				},
				{
					view: "form",
					id: "userInfoForm",
					elements: [
						{ 
							view: "text", 
							label: "Full Name", 
							name: "fullName", 
							value: user?.fullName || "", 
							labelWidth: 150,
							disabled: true
						},
						{ 
							view: "text", 
							label: "Email", 
							name: "email", 
							value: user?.email || "", 
							labelWidth: 150,
							disabled: true
						}
					]
				}
			]
		};
	}

	toggleEditMode() {
		webix.message("Edit mode - Coming in next commit");
	}
}
