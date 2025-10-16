
// import {JetView} from "webix-jet";
// import authService from "../services/auth";
// import themeService from "../services/themeService";

// export default class TopView extends JetView{

//     ready() {
//         document.body.classList.add("authenticated");
//         themeService.applyTheme();
//     }
    
//     getInitials(name) {
//         return name
//             .split(' ')
//             .map(word => word[0])
//             .join('')
//             .substring(0, 2)
//             .toUpperCase();
//     }

//     updateHeaderColors() {
//         const primaryColor = themeService.getCurrentTheme().primaryColor || "#33618f";
//         const initials = this.getInitials(authService.getCurrentUser().fullName);
        
//         // Update title
//         this.getRoot().queryView({css: "custom-app-header"}).getChildViews()[1].setHTML(
//             `<div style='font-size: 20px; font-weight: 700; color: ${primaryColor}; letter-spacing: 0.5px; line-height: 60px;'>⚙️ USER PREFERENCES</div>`
//         );
        
//         // Update avatar
//         this.$$("userAvatarBtn").setHTML(
//             `<div class="avatarClick" style='width: 45px; height: 45px; border-radius: 50%; background: ${primaryColor}; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 16px; cursor: pointer; border: 3px solid ${primaryColor}20; transition: all 0.2s; box-shadow: 0 2px 6px ${primaryColor}30;' onmouseover="this.style.transform='scale(1.08)'; this.style.boxShadow='0 4px 10px ${primaryColor}40';" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 2px 6px ${primaryColor}30';">${initials}</div>`
//         );
//     }

//     showLogoutMenu() {
//         if (webix.$$("logoutMenuPopup")) {
//             webix.$$("logoutMenuPopup").show(this.$$("userAvatarBtn").$view);
//             return;
//         }
    
//         webix.ui({
//             view: "popup",
//             id: "logoutMenuPopup",
//             width: 160,
//             body: {
//                 view: "list",
//                 borderless: true,
//                 autoheight: true,
//                 type: {
//                     height: 50
//                 },
//                 template: "<div style='padding: 12px 20px; cursor: pointer; transition: background 0.2s;' onmouseover=\"this.style.background='#F5F5F5'\" onmouseout=\"this.style.background='transparent'\"><span style='font-size: 15px;'>#icon#</span> <span style='margin-left: 10px; font-size: 14px;'>#label#</span></div>",
//                 data: [
//                     { id: "logout", icon: "➜]", label: "Logout" }
//                 ],
//                 on: {
//                     onItemClick: (id) => {
//                         if (id === "logout") {
//                             webix.$$("logoutMenuPopup").hide();
//                             this.confirmLogout();
//                         }
//                     }
//                 }
//             }
//         }).show(this.$$("userAvatarBtn").$view);
//     }
    
//     config(){
//         const user = authService.getCurrentUser();
        
//         if (!user) {
//             this.show("/login");
//             return {};
//         }
        
//         const initials = this.getInitials(user.fullName);
//         const primaryColor = themeService.getCurrentTheme().primaryColor || "#33618f";
        
//         var customHeader = {
//             height: 60,
//             css: "custom-app-header",
//             style: "box-shadow: 0 2px 6px rgba(0,0,0,0.08);",
//             cols:[
//                 { width: 25 },
//                 // App title with primary color
//                 {
//                     template:`<div style='font-size: 20px; font-weight: 700; color: ${primaryColor}; letter-spacing: 0.5px; line-height: 60px;'>⚙️ USER PREFERENCES</div>`,
//                     borderless: true
//                 },
//                 {},
//                 // Avatar with primary color - clickable for menu
//                 {
//                     view: "template",
//                     id: "userAvatarBtn",
//                     template:`<div class="avatarClick" style='width: 45px; height: 45px; border-radius: 50%; background: ${primaryColor}; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 16px; cursor: pointer; border: 3px solid ${primaryColor}20; transition: all 0.2s; box-shadow: 0 2px 6px ${primaryColor}30;' onmouseover="this.style.transform='scale(1.08)'; this.style.boxShadow='0 4px 10px ${primaryColor}40';" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 2px 6px ${primaryColor}30';">${initials}</div>`,
//                     width: 65,
//                     borderless: true,
//                     onClick: {
//                         "avatarClick": () => this.showLogoutMenu()
//                     }
//                 },
//                 { width: 20 }
//             ]
//         };

//         var ui = {
//             rows:[
//                 customHeader,
//                 { $subview:true }
//             ]
//         };

//         return ui;
//     }
    
//     init(){
//         if (!authService.isAuthenticated()) {
//             this.show("/login");
//         }
//     }
    
//     confirmLogout() {
//         webix.ui({
//             view: "window",
//             id: "customLogoutConfirm",
//             head: false,
//             modal: true,
//             position: "center",
//             width: 420,
//             body: {
//                 padding: 35,
//                 style: "background: white; border-radius: 8px;",
//                 rows: [
//                     {
//                         template: "<div style='text-align: center; font-size: 18px; font-weight: 600; color: #333;'>Confirm Logout</div>",
//                         autoheight: true,
//                         borderless: true
//                     },
//                     { height: 15 },
//                     {
//                         template: "<div style='text-align: center; font-size: 14px; color: #666; line-height: 1.5;'>Are you sure you want to logout from your account?</div>",
//                         autoheight: true,
//                         borderless: true
//                     },
//                     { height: 30 },
//                     {
//                         cols: [
//                             {},
//                             {
//                                 view: "button",
//                                 value: "Cancel",
//                                 width: 110,
//                                 style: "background: #F5F5F5 !important; color: #333 !important; border: 1px solid #DDD !important; border-radius: 6px !important; font-weight: 500 !important;",
//                                 click: () => {
//                                     webix.$$("customLogoutConfirm").close();
//                                 }
//                             },
//                             { width: 15 },
//                             {
//                                 view: "button",
//                                 value: "Yes, Logout",
//                                 width: 130,
//                                 css: "webix_primary",
//                                 style: "border-radius: 6px !important; font-weight: 500 !important;",
//                                 click: () => {
//                                     webix.$$("customLogoutConfirm").close();
//                                     this.doLogout();
//                                 }
//                             },
//                             {}
//                         ]
//                     }
//                 ]
//             }
//         }).show();
//     }
    
//     doLogout() {
//         authService.logout();
//         webix.message({ type: "success", text: "Logged out successfully" });
//         this.show("/login");
//     }
// }




//////////////////



import {JetView} from "webix-jet";
import authService from "../services/auth";
import themeService from "../services/themeService";

export default class TopView extends JetView{

    ready() {
        document.body.classList.add("authenticated");
        themeService.applyTheme();
    }
    
    getInitials(name) {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    }

    updateHeaderColors() {
        const primaryColor = themeService.getCurrentTheme().primaryColor || "#33618f";
        const initials = this.getInitials(authService.getCurrentUser().fullName);
        
        // Update title
        this.getRoot().queryView({css: "custom-app-header"}).getChildViews()[1].setHTML(
            `<div style='font-size: 20px; font-weight: 700; color: ${primaryColor}; letter-spacing: 0.5px; line-height: 60px;'>⚙️ USER PREFERENCES</div>`
        );
        
        // Update avatar
        this.$$("userAvatarBtn").setHTML(
            `<div class="avatarClick" style='width: 45px; height: 45px; border-radius: 50%; background: ${primaryColor}; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 16px; cursor: pointer; border: 3px solid ${primaryColor}20; transition: all 0.2s; box-shadow: 0 2px 6px ${primaryColor}30;' onmouseover="this.style.transform='scale(1.08)'; this.style.boxShadow='0 4px 10px ${primaryColor}40';" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 2px 6px ${primaryColor}30';">${initials}</div>`
        );
    }

    showLogoutMenu() {
        if (webix.$$("logoutMenuPopup")) {
            webix.$$("logoutMenuPopup").show(this.$$("userAvatarBtn").$view);
            return;
        }
    
        webix.ui({
            view: "popup",
            id: "logoutMenuPopup",
            width: 160,
            body: {
                view: "list",
                borderless: true,
                autoheight: true,
                type: {
                    height: 50
                },
                template: "<div style='padding: 12px 20px; cursor: pointer; transition: background 0.2s;' onmouseover=\"this.style.background='#F5F5F5'\" onmouseout=\"this.style.background='transparent'\"><span style='font-size: 15px;'>#icon#</span> <span style='margin-left: 10px; font-size: 14px;'>#label#</span></div>",
                data: [
                    { id: "logout", icon: "➜]", label: "Logout" }
                ],
                on: {
                    onItemClick: (id) => {
                        if (id === "logout") {
                            webix.$$("logoutMenuPopup").hide();
                            this.confirmLogout();
                        }
                    }
                }
            }
        }).show(this.$$("userAvatarBtn").$view);
    }
    
    config(){
        const user = authService.getCurrentUser();
        
        if (!user) {
            this.show("/login");
            return {};
        }
        
        const initials = this.getInitials(user.fullName);
        const primaryColor = themeService.getCurrentTheme().primaryColor || "#33618f";
        
        var customHeader = {
            height: 60,
            css: "custom-app-header",
            style: "box-shadow: 0 2px 6px rgba(0,0,0,0.08);",
            cols:[
                { width: 25 },
                // App title with primary color
                {
                    template:`<div style='font-size: 20px; font-weight: 700; color: ${primaryColor}; letter-spacing: 0.5px; line-height: 60px;'>⚙️ USER PREFERENCES</div>`,
                    borderless: true
                },
                {},
                // Avatar with primary color - clickable for menu
                {
                    view: "template",
                    id: "userAvatarBtn",
                    template:`<div class="avatarClick" style='width: 45px; height: 45px; border-radius: 50%; background: ${primaryColor}; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 16px; cursor: pointer; border: 3px solid ${primaryColor}20; transition: all 0.2s; box-shadow: 0 2px 6px ${primaryColor}30;' onmouseover="this.style.transform='scale(1.08)'; this.style.boxShadow='0 4px 10px ${primaryColor}40';" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 2px 6px ${primaryColor}30';">${initials}</div>`,
                    width: 65,
                    borderless: true,
                    onClick: {
                        "avatarClick": () => this.showLogoutMenu()
                    }
                },
                { width: 20 }
            ]
        };

        var ui = {
            rows:[
                customHeader,
                { $subview:true }
            ]
        };

        return ui;
    }
    
    init(){
        if (!authService.isAuthenticated()) {
            this.show("/login");
        }
    }
    
    confirmLogout() {
        webix.ui({
            view: "window",
            id: "customLogoutConfirm",
            head: false,
            modal: true,
            position: "center",
            width: 420,
            body: {
                padding: 35,
                style: "background: white; border-radius: 8px;",
                rows: [
                    {
                        template: "<div style='text-align: center; font-size: 18px; font-weight: 600; color: #333;'>Confirm Logout</div>",
                        autoheight: true,
                        borderless: true
                    },
                    { height: 15 },
                    {
                        template: "<div style='text-align: center; font-size: 14px; color: #666; line-height: 1.5;'>Are you sure you want to logout from your account?</div>",
                        autoheight: true,
                        borderless: true
                    },
                    { height: 30 },
                    {
                        cols: [
                            {},
                            {
                                view: "button",
                                value: "Cancel",
                                width: 110,
                                style: "background: #F5F5F5 !important; color: #333 !important; border: 1px solid #DDD !important; border-radius: 6px !important; font-weight: 500 !important;",
                                click: () => {
                                    webix.$$("customLogoutConfirm").close();
                                }
                            },
                            { width: 15 },
                            {
                                view: "button",
                                value: "Yes, Logout",
                                width: 130,
                                css: "webix_primary",
                                style: "border-radius: 6px !important; font-weight: 500 !important;",
                                click: () => {
                                    webix.$$("customLogoutConfirm").close();
                                    this.doLogout();
                                }
                            },
                            {}
                        ]
                    }
                ]
            }
        }).show();
    }
    
    async doLogout() {
		console.log('Logout initiated');
		
		// Show loading
		const loadingMessage = webix.message({ type: "info", text: "Logging out..." });
		
		try {
			// Call logout API
			await authService.logout();
			
			webix.message.hide(loadingMessage);
			
			// Remove authenticated class
			document.body.classList.remove("authenticated");
			
			// Show success message
			webix.message({ type: "success", text: "Logged out successfully" });
			
			console.log('Logout successful, redirecting to login');
			
			// Force full page reload to login page 
			setTimeout(() => {
				window.location.href = window.location.origin + window.location.pathname + '#!\/login';
				// window.location.reload();
			}, 500);
			
		} catch (error) {
			console.error('Logout error:', error);
			webix.message.hide(loadingMessage);
			webix.message({ type: "error", text: "Logout failed" });
		}
	}
	
	
}


