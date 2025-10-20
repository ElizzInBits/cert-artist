import React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";
import { Button } from "./button";

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const next = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const icon = theme === "dark" ? <Moon className="w-4 h-4" /> : theme === "light" ? <Sun className="w-4 h-4" /> : <Laptop className="w-4 h-4" />;

  return (
    <Button variant="ghost" size="sm" onClick={next} aria-label="Alternar tema">
      {icon}
    </Button>
  );
};

export default ThemeToggle;
