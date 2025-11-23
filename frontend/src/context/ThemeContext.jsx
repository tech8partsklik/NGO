import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

const themes = [
  {
    name: "OceanGreen",
    // primary: "#1B8A5A",
    primary: "#16a34a",
    primaryLight: "#37C98B",
    accent: "#FFD54F",
    background: "#F1F7F5",
    text: "#12372A",
  },
  {
    name: "WarmSunset",
    primary: "#FF7F11",
    primaryLight: "#FFB53A",
    accent: "#FFE15D",
    background: "#FFF7EC",
    text: "#3D2C00",
  },
  {
    name: "SkyBlue",
    primary: "#3B82F6",
    primaryLight: "#60A5FA",
    accent: "#FCD34D",
    background: "#EFF6FF",
    text: "#1E293B",
  }
];

export const ThemeProvider = ({ children }) => {
  const [themeIndex, setThemeIndex] = useState(
    localStorage.getItem("themeIndex") || 0
  );

  useEffect(() => {
    localStorage.setItem("themeIndex", themeIndex);
  }, [themeIndex]);

  const theme = themes[themeIndex];

  const cycleTheme = () => {
    setThemeIndex((prev) => (prev + 1) % themes.length);
  };

  return (
    <ThemeContext.Provider value={{ theme, cycleTheme, themes, themeIndex }}>
      {children}
    </ThemeContext.Provider>
  );
};
