
import { JetView } from "webix-jet";
import AccountProfile from "./account-profile";
import AccountPassword from "./account-password";

export default class AccountView extends JetView {
    config() {
        this.profileHelper = new AccountProfile();
        this.passwordHelper = new AccountPassword();
        
        // Connect password button to password dialog
        this.profileHelper.setPasswordClickHandler(() => {
            this.passwordHelper.show();
        });
        
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
                                                template: "<h3>Personal Information</h3><p>View and manage your account details</p>",
                                                autoheight: true,
                                                borderless: true
                                            },
                                            { height: 10 },
                                            this.profileHelper.getUI()
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

    ready() {
        // Load profile data when view is ready
        this.profileHelper.loadProfile();
    }
}
