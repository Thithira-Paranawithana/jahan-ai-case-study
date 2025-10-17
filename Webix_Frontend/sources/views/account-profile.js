import authService from "../services/auth";
import { validateUserInfo } from "../helpers/validation";
import themeService from "../services/themeService";


export default class AccountProfile {
    constructor() {
        this.isEditMode = false;
        this.userInitials = "";

    }

    init() {
        window.addEventListener('themeChanged', () => {
            this.updateProfilePicColor();
        });
    }
    

    getUI() {
        return {
            view: "form",
            id: "userInfoForm",
            elements: [
                {
                    rows: [
                        {
                            view: "template",
                            id: "profilePicTemplate",
                            template: `
                                <div style="text-align: center; padding: 20px 0 10px;">
                                    <div id="profilePicContainer" style="position: relative; display: inline-block;">
                                        <div id="profilePic" style="
                                            width: 120px; 
                                            height: 120px; 
                                            border-radius: 50%; 
                                            background: ${themeService.getCurrentTheme().primaryColor || '#33618f'};
                                            display: flex;
                                            align-items: center;
                                            justify-content: center;
                                            font-size: 48px;
                                            color: white;
                                            font-weight: 600;
                                            margin: 0 auto;
                                            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                                        ">
                                           
                                        </div>
                                    </div>
                                </div>
                            `,
                            autoheight: true,
                            borderless: true
                        },
                        
                        {
                            cols: [
                                {},
                                {
                                    view: "button",
                                    id: "editPicBtn",
                                    value: "Edit Photo",
                                    width: 110,
                                    click: () => this.editProfilePic()
                                },
                                { width: 10 },
                                {
                                    view: "button",
                                    id: "deletePicBtn",
                                    value: "Remove",
                                    width: 100,
                                    css: "delete-account-button",
                                    click: () => this.deleteProfilePic()
                                },
                                {}
                            ]
                        },
                        { height: 20 }
                    ]
                },
                
                // { height: 20 },
                
                
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
                            placeholder: "Country Code",
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

    updateProfilePicColor() {
        const primaryColor = themeService.getCurrentTheme().primaryColor || '#33618f';
        const profilePic = document.getElementById('profilePic');
        
        if (profilePic && !localStorage.getItem('profilePic')) {
            profilePic.style.background = primaryColor;
        }
    }
    

    async loadProfile() {
        console.log('Loading user profile from backend...');
        
        // Show loading state
        // const loadingMessage = webix.message({ type: "info", text: "Loading profile..." });
        
        // Fetch from backend
        const result = await authService.getProfile();
        
        // webix.message.hide(loadingMessage);
        
        if (result.success) {
            const user = result.user;
            
            webix.$$("userInfoForm").setValues({
                fullName: user.fullName || "",
                country: user.country || "",
                email: user.email || "",
                countryCode: user.countryCode || "",
                phone: user.phone || "",
                dateOfBirth: user.dateOfBirth || "",
                gender: user.gender || "prefer_not_to_say"
            });
            
            console.log('Profile loaded from backend:', user);
        } else {
            // Fallback to localStorage if API fails
            console.warn('Failed to load from backend, using cached data');
            
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
            }
            
            webix.message({ 
                type: "warning", 
                text: "Using cached profile data",
                expire: 2000
            });
        }

        const user = result.success ? result.user : authService.getCurrentUser();
        this.userInitials = user.fullName ? this.getInitials(user.fullName) : "JD";

        const savedPic = localStorage.getItem('profilePic');
        const profilePic = document.getElementById('profilePic');

        if (savedPic && profilePic) {
            profilePic.style.backgroundImage = `url(${savedPic})`;
            profilePic.style.backgroundSize = 'cover';
            profilePic.style.backgroundPosition = 'center';
            profilePic.innerHTML = '';
        } else if (profilePic) {
            profilePic.innerHTML = this.userInitials;
            this.updateProfilePicColor();
        }
        


        setTimeout(() => {
            const editBtn = document.getElementById('editPicBtn');
            const deleteBtn = document.getElementById('deletePicBtn');
            
            if (editBtn) {
                editBtn.onclick = () => this.editProfilePic();
            }
            
            if (deleteBtn) {
                deleteBtn.onclick = () => this.deleteProfilePic();
            }
        }, 100);
        
        
    }

    getInitials(name) {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    }
    

    editProfilePic() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const profilePic = document.getElementById('profilePic');
                    const imageData = event.target.result;
                    
                    profilePic.style.backgroundImage = `url(${imageData})`;
                    profilePic.style.backgroundSize = 'cover';
                    profilePic.style.backgroundPosition = 'center';
                    profilePic.innerHTML = '';
                    
                    localStorage.setItem('profilePic', imageData);
                    
                    webix.message({ type: "success", text: "Profile picture updated" });
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }
    
    
    deleteProfilePic() {
        webix.ui({
            view: "window",
            id: "deletePicWarning",
            head: "Remove Profile Picture",
            modal: true,
            position: "center",
            width: 420,
            body: {
                padding: 20,
                rows: [
                    {
                        view: "template",
                        template: "Are you sure you want to remove your profile picture?<br><br>Your initials will be displayed instead.",
                        autoheight: true,
                        borderless: true
                    },
                    { height: 20 },
                    {
                        cols: [
                            {},
                            {
                                view: "button",
                                value: "Cancel",
                                width: 100,
                                click: () => {
                                    webix.$$("deletePicWarning").close();
                                }
                            },
                            {
                                view: "button",
                                value: "Yes, Remove",
                                width: 130,
                                css: "delete-account-button",
                                click: () => {
                                    webix.$$("deletePicWarning").close();
                                    
                                    const profilePic = document.getElementById('profilePic');
                                    if (profilePic) {
                                        profilePic.style.backgroundImage = '';
                                        profilePic.innerHTML = this.userInitials;
                                    }
                                    
                                    localStorage.removeItem('profilePic');
                                    
                                    webix.message({ 
                                        type: "success", 
                                        text: "Profile picture removed",
                                        expire: 2000
                                    });
                                }
                            }
                        ]
                    }
                ]
            }
        }).show();
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

            this.loadProfile();

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
