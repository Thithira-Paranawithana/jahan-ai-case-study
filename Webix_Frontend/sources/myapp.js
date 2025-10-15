import "./styles/app.css";
import {JetApp, EmptyRouter, HashRouter, plugins } from "webix-jet";
import themeService from "./services/themeService";
import authService from "./services/auth";

const modules = import.meta.glob("./views/**/*.js");
const views = name => modules[`./views/${name}.js`]().then(x => x.default);

export default class MyApp extends JetApp{
    constructor(config){
        const defaults = {
            id      : import.meta.env.VITE_APPNAME,
            version : import.meta.env.VITE_VERSION,
            router  : import.meta.env.VITE_BUILD_AS_MODULE ? EmptyRouter : HashRouter,
            debug   : !import.meta.env.PROD,
            start   : "/login",
            views
        };

        super({ ...defaults, ...config });
    }
}

if (!import.meta.env.VITE_BUILD_AS_MODULE){
    webix.ready(() => {
        // Add authenticated class if logged in
        if (authService.isAuthenticated()) {
            document.body.classList.add("authenticated");
        }
        
        // Apply theme after adding authenticated class
        setTimeout(() => {
            themeService.applyTheme();
            themeService.watchSystemTheme();
        }, 0);
        
        new MyApp().render();
    });
}
