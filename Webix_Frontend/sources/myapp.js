import "./styles/app.css";
import {JetApp, EmptyRouter, HashRouter, plugins } from "webix-jet";
import themeService from "./services/themeService";

// dynamic import of views
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
            // set custom view loader
            views
        };

        super({ ...defaults, ...config });
    }
}

if (!import.meta.env.VITE_BUILD_AS_MODULE){
    webix.ready(() => {
        // initialize theme before rendering app
        themeService.applyTheme();
        
        // Render app
        new MyApp().render();
    });
}
