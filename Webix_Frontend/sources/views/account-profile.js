import authService from "../services/auth";
import { validateUserInfo } from "../helpers/validation";

export default class AccountProfile {
    constructor() {
        this.isEditMode = false;
    }

    getUI() {
        return {
            view: "form",
            id: "userInfoForm",
            elements: [
                { 
                    view: "template", 
                    template: "<h4 style='margin-bottom: 5px;'>Basic Information</h4>", 
                    autoheight: true, 
                    borderless: true 
                },
                { 
                    view: "text", 
                    label: "Full Name", 
                    name: "fullName", 
                    labelWidth: 150,
                    disabled: true,
                    id: "fullNameField"
                },
                {
                    view: "template",
                    id: "fullNameError",
                    template: "",
                    height: 0,
                    borderless: true,
                    css: "error_message"
                },
                { 
                    view: "combo", 
                    label: "Country", 
                    name: "country", 
                    labelWidth: 150,
                    placeholder: "Select country",
                    disabled: true,
                    id: "countryField",
                    options: [
                        "United States", "United Kingdom", "Canada", "Australia",
                        "Germany", "France", "India", "Japan", "China", "Brazil", "Sri Lanka"
                    ]
                },
                
                { height: 20 },
                { 
                    view: "template", 
                    template: "<h4 style='margin-bottom: 5px;'>Contact Information</h4>", 
                    autoheight: true, 
                    borderless: true 
                },
                { 
                    view: "text", 
                    label: "Email", 
                    name: "email", 
                    labelWidth: 150,
                    disabled: true,
                    id: "emailField"
                },
                {
                    cols: [
                        {
                            view: "combo",
                            label: "Phone Number",
                            name: "countryCode",
                            labelWidth: 150,
                            width: 300,
                            disabled: true,
                            id: "countryCodeField",
                            options: [
                                { id: "+1", value: "+1 (US/Canada)" },
                                { id: "+44", value: "+44 (UK)" },
                                { id: "+61", value: "+61 (Australia)" },
                                { id: "+49", value: "+49 (Germany)" },
                                { id: "+33", value: "+33 (France)" },
                                { id: "+91", value: "+91 (India)" },
                                { id: "+81", value: "+81 (Japan)" },
                                { id: "+86", value: "+86 (China)" },
                                { id: "+55", value: "+55 (Brazil)" },
                                { id: "+94", value: "+94 (Sri Lanka)" }
                            ]
                        },
                        {
                            view: "text",
                            name: "phone",
                            placeholder: "Enter phone number",
                            disabled: true,
                            id: "phoneField"
                        }
                    ]
                },
                {
                    view: "template",
                    id: "phoneError",
                    template: "",
                    height: 0,
                    borderless: true,
                    css: "error_message"
                },
                
                { height: 20 },
                { 
                    view: "template", 
                    template: "<h4 style='margin-bottom: 5px;'>Personal Details</h4>", 
                    autoheight: true, 
                    borderless: true 
                },
                { 
                    view: "datepicker", 
                    label: "Date of Birth", 
                    name: "dateOfBirth", 
                    labelWidth: 150,
                    format: "%Y-%m-%d",
                    placeholder: "Select date",
                    disabled: true,
                    id: "dateOfBirthField"
                },
                {
                    view: "template",
                    id: "dateOfBirthError",
                    template: "",
                    height: 0,
                    borderless: true,
                    css: "error_message"
                },
                { 
                    view: "radio", 
                    label: "Gender", 
                    name: "gender", 
                    labelWidth: 150,
                    disabled: true,
                    id: "genderField",
                    options: [
                        { id: "male", value: "Male" },
                        { id: "female", value: "Female" },
                        { id: "prefer_not_to_say", value: "Prefer not to say" }
                    ]
                },
                
                { height: 30 },
                {
                    id: "viewModeButtons",
                    cols: [
                        {
                            view: "button",
                            value: "Change Password",
                            width: 160,
                            css: "webix_primary",
                            click: () => this.onPasswordClick()
                        },
                        {},
                        {
                            view: "button",
                            value: "Edit Profile",
                            width: 130,
                            css: "webix_primary",
                            click: () => this.enableEditMode()
                        }
                    ]
                },
                {
                    id: "editModeButtons",
                    hidden: true,
                    cols: [
                        {
                            view: "button",
                            value: "Cancel",
                            width: 100,
                            click: () => this.cancelEdit()
                        },
                        {},
                        {
                            view: "button",
                            value: "Save Changes",
                            width: 130,
                            css: "webix_primary",
                            click: () => this.saveUserInfo()
                        }
                    ]
                }
            ]
        };
    }

    async loadProfile() {
        console.log('Loading user profile...');
        
        const user = authService.getCurrentUser();
        
        if (user) {
            webix.$$("userInfoForm").setValues({
                fullName: user.fullName || "",
                country: user.country || "",
                email: user.email || "",
                countryCode: user.countryCode || "+1",
                phone: user.phone || "",
                dateOfBirth: user.dateOfBirth || "",
                gender: user.gender || "prefer_not_to_say"
            });
            
            console.log('Profile loaded:', user);
        }
    }

    clearErrors() {
        webix.$$("fullNameError").setHTML("");
        webix.$$("fullNameError").config.height = 0;
        webix.$$("phoneError").setHTML("");
        webix.$$("phoneError").config.height = 0;
        webix.$$("dateOfBirthError").setHTML("");
        webix.$$("dateOfBirthError").config.height = 0;
        webix.$$("userInfoForm").resize();
    }

    showError(fieldId, message) {
        const errorTemplate = webix.$$(fieldId + "Error");
        if (errorTemplate) {
            errorTemplate.setHTML(`<span style="color: #e53e3e;">${message}</span>`);
            errorTemplate.config.height = 25;
            webix.$$("userInfoForm").resize();
        }
    }

    enableEditMode() {
        this.isEditMode = true;
        this.clearErrors();
        
        webix.$$("fullNameField").enable();
        webix.$$("countryField").enable();
        webix.$$("countryCodeField").enable();
        webix.$$("phoneField").enable();
        webix.$$("dateOfBirthField").enable();
        webix.$$("genderField").enable();
        
        webix.$$("viewModeButtons").hide();
        webix.$$("editModeButtons").show();
        
        webix.message("Edit mode enabled");
    }

    cancelEdit() {
        this.isEditMode = false;
        this.clearErrors();
        this.loadProfile();
        
        webix.$$("fullNameField").disable();
        webix.$$("countryField").disable();
        webix.$$("countryCodeField").disable();
        webix.$$("phoneField").disable();
        webix.$$("dateOfBirthField").disable();
        webix.$$("genderField").disable();
        
        webix.$$("editModeButtons").hide();
        webix.$$("viewModeButtons").show();
        
        webix.message("Changes discarded");
    }

    async saveUserInfo() {
        const form = webix.$$("userInfoForm");
        const values = form.getValues();
        
        this.clearErrors();
        
        // Client-side validation
        const validation = validateUserInfo(values);
        
        if (!validation.valid) {
            validation.errors.forEach(error => {
                this.showError(error.field, error.message);
            });
            webix.message({ type: "error", text: "Please fix the errors before saving" });
            return;
        }
        
        // Show loading
        const loadingMessage = webix.message({ type: "info", text: "Saving profile..." });
        
        // Call API
        const result = await authService.updateProfile(values);
        
        webix.message.hide(loadingMessage);
        
        if (result && result.success) {
            this.isEditMode = false;
            
            webix.$$("fullNameField").disable();
            webix.$$("countryField").disable();
            webix.$$("countryCodeField").disable();
            webix.$$("phoneField").disable();
            webix.$$("dateOfBirthField").disable();
            webix.$$("genderField").disable();
            
            webix.$$("editModeButtons").hide();
            webix.$$("viewModeButtons").show();
            
            webix.message({ 
                type: "success", 
                text: "Profile updated successfully",
                expire: 3000
            });
        } else {
            // Handle backend errors
            if (result.errors) {
                for (let field in result.errors) {
                    this.showError(field, result.errors[field].join(', '));
                }
            }
            webix.message({ type: "error", text: result.error || "Failed to update profile" });
        }
    }

    onPasswordClick() {
        if (this.onPasswordClickHandler) {
            this.onPasswordClickHandler();
        }
    }

    setPasswordClickHandler(handler) {
        this.onPasswordClickHandler = handler;
    }
}
