"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type ColorTheme = "indigo" | "emerald" | "violet" | "amber" | "neon";

interface ThemeContextType {
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
  isDark: boolean;
  toggleDark: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Tema Neón Profundo - El nuevo modo espectacular
const neonTheme = {
  // Fondos - Negro puro para máximo contraste
  "--bg-primary": "#000000",
  "--bg-secondary": "#0a0a0a",
  "--bg-card": "#0d0d0d",
  "--bg-hover": "#1a1a1a",
  
  // Colores Neón
  "--neon-cyan": "#00f5ff",
  "--neon-pink": "#ff00ff",
  "--neon-green": "#39ff14",
  "--neon-yellow": "#ffff00",
  "--neon-orange": "#ff6b35",
  
  // Primario - Cyan neón
  "--primary-50": "#e0ffff",
  "--primary-100": "#b3ffff",
  "--primary-200": "#80ffff",
  "--primary-300": "#4dffff",
  "--primary-400": "#1affff",
  "--primary-500": "#00f5ff",
  "--primary-600": "#00c4cc",
  "--primary-700": "#009399",
  "--primary-800": "#006266",
  "--primary-900": "#003133",
  "--primary-950": "#00191a",
  
  // Texto
  "--text-primary": "#e0ffff",
  "--text-secondary": "#a3b8c8",
  "--text-muted": "#5a6b7a",
  
  // Bordes con glow
  "--border-color": "rgba(0, 245, 255, 0.3)",
  "--border-glow": "0 0 10px rgba(0, 245, 255, 0.5), 0 0 20px rgba(0, 245, 255, 0.3)",
};

const colorThemes: Record<ColorTheme, Record<string, string>> = {
  indigo: {
    "--bg-primary": "#0f172a",
    "--bg-secondary": "#1e293b",
    "--bg-card": "#1e293b",
    "--bg-hover": "#334155",
    "--primary-50": "#eef2ff",
    "--primary-100": "#e0e7ff",
    "--primary-200": "#c7d2fe",
    "--primary-300": "#a5b4fc",
    "--primary-400": "#818cf8",
    "--primary-500": "#6366f1",
    "--primary-600": "#4f46e5",
    "--primary-700": "#4338ca",
    "--primary-800": "#3730a3",
    "--primary-900": "#312e81",
    "--primary-950": "#1e1b4b",
    "--text-primary": "#f8fafc",
    "--text-secondary": "#cbd5e1",
    "--text-muted": "#64748b",
    "--border-color": "rgba(99, 102, 241, 0.2)",
    "--border-glow": "none",
    "--neon-cyan": "#6366f1",
    "--neon-pink": "#6366f1",
    "--neon-green": "#6366f1",
    "--neon-yellow": "#6366f1",
    "--neon-orange": "#6366f1",
  },
  emerald: {
    "--bg-primary": "#064e3b",
    "--bg-secondary": "#065f46",
    "--bg-card": "#065f46",
    "--bg-hover": "#047857",
    "--primary-50": "#ecfdf5",
    "--primary-100": "#d1fae5",
    "--primary-200": "#a7f3d0",
    "--primary-300": "#6ee7b7",
    "--primary-400": "#34d399",
    "--primary-500": "#10b981",
    "--primary-600": "#059669",
    "--primary-700": "#047857",
    "--primary-800": "#065f46",
    "--primary-900": "#064e3b",
    "--primary-950": "#022c22",
    "--text-primary": "#f0fdf4",
    "--text-secondary": "#bbf7d0",
    "--text-muted": "#6ee7b7",
    "--border-color": "rgba(16, 185, 129, 0.2)",
    "--border-glow": "none",
    "--neon-cyan": "#10b981",
    "--neon-pink": "#10b981",
    "--neon-green": "#10b981",
    "--neon-yellow": "#10b981",
    "--neon-orange": "#10b981",
  },
  violet: {
    "--bg-primary": "#2e1065",
    "--bg-secondary": "#4c1d95",
    "--bg-card": "#4c1d95",
    "--bg-hover": "#5b21b6",
    "--primary-50": "#f5f3ff",
    "--primary-100": "#ede9fe",
    "--primary-200": "#ddd6fe",
    "--primary-300": "#c4b5fd",
    "--primary-400": "#a78bfa",
    "--primary-500": "#8b5cf6",
    "--primary-600": "#7c3aed",
    "--primary-700": "#6d28d9",
    "--primary-800": "#5b21b6",
    "--primary-900": "#4c1d95",
    "--primary-950": "#2e1065",
    "--text-primary": "#faf5ff",
    "--text-secondary": "#e9d5ff",
    "--text-muted": "#c4b5fd",
    "--border-color": "rgba(139, 92, 246, 0.2)",
    "--border-glow": "none",
    "--neon-cyan": "#8b5cf6",
    "--neon-pink": "#8b5cf6",
    "--neon-green": "#8b5cf6",
    "--neon-yellow": "#8b5cf6",
    "--neon-orange": "#8b5cf6",
  },
  amber: {
    "--bg-primary": "#451a03",
    "--bg-secondary": "#78350f",
    "--bg-card": "#78350f",
    "--bg-hover": "#92400e",
    "--primary-50": "#fffbeb",
    "--primary-100": "#fef3c7",
    "--primary-200": "#fde68a",
    "--primary-300": "#fcd34d",
    "--primary-400": "#fbbf24",
    "--primary-500": "#f59e0b",
    "--primary-600": "#d97706",
    "--primary-700": "#b45309",
    "--primary-800": "#92400e",
    "--primary-900": "#78350f",
    "--primary-950": "#451a03",
    "--text-primary": "#fffbeb",
    "--text-secondary": "#fef3c7",
    "--text-muted": "#fcd34d",
    "--border-color": "rgba(245, 158, 11, 0.2)",
    "--border-glow": "none",
    "--neon-cyan": "#f59e0b",
    "--neon-pink": "#f59e0b",
    "--neon-green": "#f59e0b",
    "--neon-yellow": "#f59e0b",
    "--neon-orange": "#f59e0b",
  },
  neon: neonTheme,
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorTheme, setColorThemeState] = useState<ColorTheme>("indigo");
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("appjeez-color-theme") as ColorTheme | null;
    const savedDark = localStorage.getItem("appjeez-dark-mode");
    
    if (savedTheme && colorThemes[savedTheme]) {
      setColorThemeState(savedTheme);
    }
    
    if (savedDark !== null) {
      setIsDark(savedDark === "true");
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const root = document.documentElement;
    const theme = colorThemes[colorTheme];
    
    // Aplicar todas las variables CSS de colores
    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    
    // Aplicar clase de tema al body para fuentes específicas
    document.body.classList.remove("theme-neon", "theme-executive", "theme-violet", "theme-classic", "theme-tech");
    
    // Mapear nombres de temas a clases de fuente
    const fontClassMap: Record<ColorTheme, string> = {
      neon: "theme-neon",
      indigo: "theme-tech",
      emerald: "theme-executive",
      violet: "theme-violet",
      amber: "theme-classic",
    };
    
    document.body.classList.add(fontClassMap[colorTheme]);
    
    // Aplicar border-radius según el tema
    const radiusMap: Record<ColorTheme, string> = {
      neon: "4px",      // Más recto, técnico
      indigo: "8px",    // Estándar
      emerald: "12px",  // Corporativo suave
      violet: "16px",   // Muy redondeado, amigable
      amber: "10px",    // Clásico
    };
    
    root.style.setProperty("--border-radius", radiusMap[colorTheme]);
    
    localStorage.setItem("appjeez-color-theme", colorTheme);
  }, [colorTheme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
    
    localStorage.setItem("appjeez-dark-mode", String(isDark));
  }, [isDark, mounted]);

  const setColorTheme = (theme: ColorTheme) => {
    setColorThemeState(theme);
  };

  const toggleDark = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ colorTheme, setColorTheme, isDark, toggleDark }}>
      <div className="min-h-screen transition-colors duration-300"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
