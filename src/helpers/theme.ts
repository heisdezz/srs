import { useEffect, useState } from "react";

const theme_array = [
  "srs",
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
  "dim",
  "nord",
  "sunset",
  "caramellatte",
  "abyss",
  "silk",
] as const;

type Theme = (typeof theme_array)[number];

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document === "undefined") return "srs";
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("theme="))
      ?.split("=")[1];
    return (theme_array as readonly string[]).includes(cookieValue || "")
      ? (cookieValue as Theme)
      : "srs";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute("data-theme", theme);
    document.cookie = `theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;
  }, [theme]);

  return { theme, setTheme, theme_array };
};
