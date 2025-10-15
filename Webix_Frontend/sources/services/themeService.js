// sources/services/themeService.js

class ThemeService {
    constructor() {
        this.currentTheme = this.loadTheme();
        // Ensure theme is applied on initial load
        this.applyTheme(); 
    }

    // CORRECTED: Single, complete loadTheme method
    loadTheme() {
        const savedTheme = localStorage.getItem("userTheme");
        if (savedTheme) {
            return JSON.parse(savedTheme);
        }
        
        // Ensure highContrast default is here
        return {
            mode: "light",
            fontSize: 14,
            fontFamily: "system",
            highContrast: false 
        };
    }

    saveTheme(themeSettings) {
        this.currentTheme = { ...this.currentTheme, ...themeSettings };
        localStorage.setItem("userTheme", JSON.stringify(this.currentTheme));
        return this.currentTheme;
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    // CORRECTED: Single, complete applyTheme method
    applyTheme(theme = this.currentTheme) {
        const root = document.documentElement;
        
        // Apply theme mode
        if (theme.mode === "auto") {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            root.setAttribute("data-theme", prefersDark ? "dark" : "light");
        } else {
            root.setAttribute("data-theme", theme.mode);
        }
        
        // Apply font size
        if (theme.fontSize) {
            root.style.setProperty("--base-font-size", `${theme.fontSize}px`);
        }
        
        // Apply font family
        if (theme.fontFamily) {
            root.style.setProperty("--font-family", this.getFontFamily(theme.fontFamily));
        }

        // MERGED: High contrast logic is now included here
        if (theme.highContrast) {
            document.body.classList.add("high-contrast");
        } else {
            document.body.classList.remove("high-contrast");
        }
        
        this.currentTheme = theme;
    }

    getFontFamily(fontValue) {
        const fontMap = {
            system: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
            "sans-serif": "Arial, Helvetica, sans-serif",
            serif: "Georgia, 'Times New Roman', Times, serif",
            monospace: "'Courier New', Courier, monospace"
        };
        return fontMap[fontValue] || fontMap.system;
    }

    setThemeMode(mode) {
        this.applyTheme({ ...this.currentTheme, mode });
        this.saveTheme({ mode });
    }

    setFontSize(fontSize) {
        this.applyTheme({ ...this.currentTheme, fontSize });
        this.saveTheme({ fontSize });
    }

    setFontFamily(fontFamily) {
        this.applyTheme({ ...this.currentTheme, fontFamily });
        this.saveTheme({ fontFamily });
    }

    setHighContrast(enabled) {
        this.applyTheme({ ...this.currentTheme, highContrast: !!enabled });
        this.saveTheme({ highContrast: !!enabled });
    }

    // CORRECTED: Single, complete resetTheme method
    resetTheme() {
        // Ensure highContrast default is here
        const defaultTheme = {
            mode: "light",
            fontSize: 14,
            fontFamily: "system",
            highContrast: false 
        };
        
        localStorage.removeItem("userTheme");
        this.currentTheme = defaultTheme;
        this.applyTheme(defaultTheme);
        return defaultTheme;
    }

    watchSystemTheme() {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        
        mediaQuery.addEventListener("change", (e) => {
            if (this.currentTheme.mode === "auto") {
                const root = document.documentElement;
                root.setAttribute("data-theme", e.matches ? "dark" : "light");
            }
        });
    }
}

export default new ThemeService();