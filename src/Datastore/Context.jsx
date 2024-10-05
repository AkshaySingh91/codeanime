import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();
export const ThemeContextProvider = (props) => {
    const [theme, setTheme] = useState('light');

    const toggleTheme = () => {
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