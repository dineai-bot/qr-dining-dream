import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type ThemeId =
  | "emerald" | "noir" | "sapphire" | "aubergine" | "copper"
  | "blush" | "mint" | "sky" | "lavender";

export const lightThemes: ThemeId[] = ["emerald", "blush", "mint", "sky", "lavender"];
export const pastelThemes: ThemeId[] = ["blush", "mint", "sky", "lavender"];

export const themes: { id: ThemeId; name: string; note: string; swatch: string[] }[] = [
  { id: "emerald", name: "Marigold Emerald", note: "Ivory · emerald · gold", swatch: ["#f7f5ee", "#1f4b3a", "#d8ae5c"] },
  { id: "blush", name: "Blush Petal", note: "Pastel rose · cream", swatch: ["#fdf3f4", "#f6d3da", "#c9748c"] },
  { id: "mint", name: "Mint Meringue", note: "Pastel mint · butter", swatch: ["#f1fbf6", "#cdece0", "#5f9f8c"] },
  { id: "sky", name: "Powder Sky", note: "Pastel blue · pearl", swatch: ["#f2f6fd", "#d3e0f6", "#6c8fd2"] },
  { id: "lavender", name: "Lilac Haze", note: "Pastel lilac · honey", swatch: ["#f7f3fd", "#e0d3f4", "#8f74cb"] },
  { id: "noir", name: "Noir & Gold", note: "Black · champagne gold", swatch: ["#0c0c0d", "#1b1a18", "#e0bd77"] },
  { id: "sapphire", name: "Midnight Sapphire", note: "Deep navy · platinum", swatch: ["#0a1024", "#1b2a55", "#cfd8ea"] },
  { id: "aubergine", name: "Aubergine Rosé", note: "Plum · rose gold", swatch: ["#1a0d18", "#3b1c36", "#e4a79a"] },
  { id: "copper", name: "Ember Copper", note: "Charcoal · burnt copper", swatch: ["#141210", "#2a231e", "#c8763c"] },
];

const ThemeCtx = createContext<{ theme: ThemeId; setTheme: (t: ThemeId) => void }>({
  theme: "emerald",
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeId>("emerald");

  useEffect(() => {
    const saved = localStorage.getItem("dineai-theme") as ThemeId | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("dineai-theme", theme);
  }, [theme]);

  return <ThemeCtx.Provider value={{ theme, setTheme }}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => useContext(ThemeCtx);
