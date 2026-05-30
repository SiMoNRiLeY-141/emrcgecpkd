import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { m } from "framer-motion";

const ThemeToggle = () => {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <m.button
      className="theme-toggle-btn fixed bottom-5 left-5 z-[1000] bg-glass-bg border border-glass-border text-accent-primary rounded-full w-[50px] h-[50px] flex items-center justify-center cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
    </m.button>
  );
};

export default ThemeToggle;
