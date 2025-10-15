
// class ThemeService {
// 	constructor() {
// 		this.currentTheme = this.loadTheme();
// 	}

// 	loadTheme() {
// 		const savedTheme = localStorage.getItem("userTheme");
// 		if (savedTheme) {
// 			return JSON.parse(savedTheme);
// 		}
		
// 		// Default theme
// 		return {
// 			mode: "light"
// 		};
// 	}

// 	saveTheme(themeSettings) {
// 		this.currentTheme = { ...this.currentTheme, ...themeSettings };
// 		localStorage.setItem("userTheme", JSON.stringify(this.currentTheme));
// 		return this.currentTheme;
// 	}

// 	getCurrentTheme() {
// 		return this.currentTheme;
// 	}

// 	applyTheme(theme = this.currentTheme) {
// 		const root = document.documentElement;
		
// 		// Apply theme mode
// 		if (theme.mode === "auto") {
// 			// Detect system preference
// 			const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
// 			root.setAttribute("data-theme", prefersDark ? "dark" : "light");
// 		} else {
// 			root.setAttribute("data-theme", theme.mode);
// 		}
		
// 		// Save to service
// 		this.currentTheme = theme;
// 	}

// 	setThemeMode(mode) {
// 		this.applyTheme({ ...this.currentTheme, mode });
// 		this.saveTheme({ mode });
// 	}

// 	resetTheme() {
// 		const defaultTheme = {
// 			mode: "light"
// 		};
		
// 		localStorage.removeItem("userTheme");
// 		this.currentTheme = defaultTheme;
// 		this.applyTheme(defaultTheme);
// 		return defaultTheme;
// 	}

// 	// Watch for system theme changes when in auto mode
// 	watchSystemTheme() {
// 		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		
// 		mediaQuery.addEventListener("change", (e) => {
// 			if (this.currentTheme.mode === "auto") {
// 				const root = document.documentElement;
// 				root.setAttribute("data-theme", e.matches ? "dark" : "light");
// 			}
// 		});
// 	}
// }

// export default new ThemeService();


class ThemeService {
	constructor() {
		this.currentTheme = this.loadTheme();
	}

	loadTheme() {
		const savedTheme = localStorage.getItem("userTheme");
		if (savedTheme) {
			return JSON.parse(savedTheme);
		}
		
		// Default theme
		return {
			mode: "light",
			fontSize: "medium",
			fontFamily: "system"
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
			root.setAttribute("data-font-size", theme.fontSize);
		}
		
		// Apply font family
		if (theme.fontFamily) {
			root.setAttribute("data-font-family", theme.fontFamily);
		}
		
		// Save to service
		this.currentTheme = theme;
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

	resetTheme() {
		const defaultTheme = {
			mode: "light",
			fontSize: "medium",
			fontFamily: "system"
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
