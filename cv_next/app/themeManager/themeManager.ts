import { StaticImageData } from "next/image"
import { darkTheme } from "./themes/dark"
import { lightTheme } from "./themes/light"
import { useEffect, useState } from "react"

export interface Theme {
    styleVariables: {[key: string] : string},
    icons: {
        logo: StaticImageData
    }
}

type themes = {[key: string] : Theme}

const themes: themes = {
    dark: darkTheme,
    light: lightTheme
} as const
type ThemeTypes = keyof typeof themes

const CSS_VARIABLES_PREFIX = '--'

export class ThemeManager {
    private currentTheme: ThemeTypes = "dark";

    constructor(defaultTheme: ThemeTypes) {
        this.setTheme(defaultTheme)
    }

    public setTheme(theme: ThemeTypes) {
        this.currentTheme = theme
        this.updateTheme()
    }

    public getIcons() {
        return this.getTheme(this.currentTheme).icons
    }

    private getTheme(theme: ThemeTypes) {
        return themes[theme]
    }

    private updateTheme() {
        this.setCssVariables(this.currentTheme)
    }

    private setCssVariables(theme: ThemeTypes) {
        Object.entries(this.getTheme(theme).styleVariables).forEach(([key, value]) => {
            document.documentElement.style.setProperty(`${CSS_VARIABLES_PREFIX}${key}`, value) 
        });
    }
}