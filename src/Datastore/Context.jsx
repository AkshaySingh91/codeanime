import { createContext, useContext, useState } from "react";

export const ThemeContext = createContext();
export const ThemeContextProvider = (props) => {
    const [theme, setTheme] = useState('light');

    const toggleTheme = () => {
        let navbarBackgroundColor, bodyBackgroundColor, cardBackgroundColor, footerBackgroundColor, footerTextColor, themeToggleColor, themeToggleBgcolor, toogleBoxShadow, textColor
            , descriptionColor, sliderBorder, slideBgColor
            , visulationContainerBgcolor, sidebarBgcolor, controllerBarBgcolor, consoleBgcolor, visulationText, activeTabBgcolor, sidebarHovercolor, svgBgcolor, sidebarAlgoColor
            , sidebarAlgoBgcolor

        if (theme === 'Dark') {
            bodyBackgroundColor = 'linear-gradient(to bottom, #f0f4ff, #e9efff)'
            cardBackgroundColor = 'linear-gradient(to bottom, #c5c3ff, #b7d0e9)';
            navbarBackgroundColor = "#dadbff";
            cardBackgroundColor = '#e5e5ff';
            footerBackgroundColor = "#e0e0e0";
            footerTextColor = "#000000";
            themeToggleColor = '#ffdd00';
            toogleBoxShadow = 'inset 0px 0px 10px black';
            themeToggleBgcolor = 'rgb(75, 75, 75)';

            textColor = '#1e375a';
            descriptionColor = 'rgba(30, 55, 90, 0.7)'
            sliderBorder = 'rgba(62, 127, 255, 1)'
            slideBgColor = 'rgba(62, 127, 255, 0.32)'

            visulationContainerBgcolor = '#f4f3f3';
            sidebarBgcolor = '#FFFFFF';
            controllerBarBgcolor = '#EAEAEA'
            consoleBgcolor = '#F1F1F1';
            visulationText = '#4e4c4c'
            activeTabBgcolor = '#f4f3f3'
            svgBgcolor = 'rgb(224, 226, 234)'
            sidebarHovercolor = 'rgba(205, 205, 205, 0.646)'
            sidebarAlgoColor = '#EAEAEA'
            sidebarAlgoBgcolor = '#EAEAEA'
        }
        else if (theme === 'light') {
            bodyBackgroundColor = 'linear-gradient(to bottom, #2a2a2a, #1f1f1f)'
            navbarBackgroundColor = "#c6c4c4";
            cardBackgroundColor = '#2e2e3e';
            footerBackgroundColor = "#282d32";
            footerTextColor = "#f0f0f0";
            themeToggleColor = '#ffdd00';
            toogleBoxShadow = 'inset 0px 0px 10px rgb(97, 96, 96)';
            themeToggleBgcolor = 'rgb(184, 184, 184)';
            textColor = 'white';
            descriptionColor = 'rgb(184, 184, 184)';
            sliderBorder = 'grey';
            slideBgColor = 'rgba(0, 5, 91, 0.32)';

            sidebarBgcolor = '#353232';
            visulationText = 'white'
            sidebarHovercolor = '#555'
            visulationContainerBgcolor = '#242424';
            sidebarAlgoColor = '#EAEAEA'
            sidebarAlgoBgcolor = '#201f1f'
            activeTabBgcolor = '#242424'
            controllerBarBgcolor = '#252522'
            consoleBgcolor = '#F1F1F1';
            svgBgcolor = '#010101'
        }
        document.documentElement.style.setProperty('--bodyBackgroundColor', bodyBackgroundColor);
        document.documentElement.style.setProperty('--navbarBackgroundColor', navbarBackgroundColor);
        document.documentElement.style.setProperty('--cardBackgroundColor', cardBackgroundColor);
        document.documentElement.style.setProperty('--footerBackgroundColor', footerBackgroundColor);
        document.documentElement.style.setProperty('--footerTextColor', footerTextColor);
        document.documentElement.style.setProperty('--themeToggleColor', themeToggleColor);
        document.documentElement.style.setProperty('--toogleBoxShadow', toogleBoxShadow);
        document.documentElement.style.setProperty('--themeToggleBgcolor', themeToggleBgcolor);

        document.documentElement.style.setProperty('--textColor', textColor);
        document.documentElement.style.setProperty('--descriptionColor', descriptionColor);
        document.documentElement.style.setProperty('--sliderBorder', sliderBorder);
        document.documentElement.style.setProperty('--slideBgColor', slideBgColor);

        document.documentElement.style.setProperty('--visulationContainerBgcolor', visulationContainerBgcolor);
        document.documentElement.style.setProperty('--sidebarBgcolor', sidebarBgcolor);
        document.documentElement.style.setProperty('--controllerBarBgcolor', controllerBarBgcolor);
        document.documentElement.style.setProperty('--consoleBgcolor', consoleBgcolor);
        document.documentElement.style.setProperty('--visulationText', visulationText);
        document.documentElement.style.setProperty('--activeTabBgcolor', activeTabBgcolor);
        document.documentElement.style.setProperty('--svgBgcolor', svgBgcolor);
        document.documentElement.style.setProperty('--sidebarHovercolor', sidebarHovercolor);
        document.documentElement.style.setProperty('--sidebarAlgoColor', sidebarAlgoColor);
        document.documentElement.style.setProperty('--sidebarAlgoBgcolor', sidebarAlgoBgcolor);

        setTheme(prevTheme => prevTheme === 'Dark' ? 'light' : 'Dark');
    }
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {props.children}
        </ThemeContext.Provider>
    )
}
// to use theme value either we have to use ThemeContext or we can create custom hook
export const useTheme = () => useContext(ThemeContext);