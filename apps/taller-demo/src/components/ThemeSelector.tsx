"use client";

import { useTheme, ColorTheme } from "@/components/ThemeProvider";
import { Palette, Moon, Sun, Check, Zap } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const themes: { id: ColorTheme; label: string; color: string; icon: React.ReactNode }[] = [
  { id: "indigo", label: "Tecnología", color: "#6366f1", icon: null },
  { id: "emerald", label: "Ejecutivo", color: "#10b981", icon: null },
  { id: "violet", label: "Violeta", color: "#8b5cf6", icon: null },
  { id: "amber", label: "Clásico", color: "#f59e0b", icon: null },
  { id: "neon", label: "Modo Neón", color: "#00f5ff", icon: <Zap className="w-4 h-4" /> },
];

export default function ThemeSelector() {
  const { colorTheme, setColorTheme, isDark, toggleDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentTheme = themes.find(t => t.id === colorTheme);
  const isNeon = colorTheme === "neon";

  return (
    <div className="flex items-center gap-2">
      {/* Dark Mode Toggle - Oculto en modo neón (siempre oscuro) */}
      {!isNeon && (
        <button
          onClick={toggleDark}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          title={isDark ? "Modo claro" : "Modo oscuro"}
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-slate-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600" />
          )}
        </button>
      )}

      {/* Theme Selector Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
            isNeon 
              ? "bg-black/50 border border-cyan-500/50 text-cyan-400 hover:border-cyan-400" 
              : "hover:bg-white/10"
          }`}
        >
          {currentTheme?.icon || (
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ 
                backgroundColor: currentTheme?.color,
                boxShadow: isNeon ? `0 0 10px ${currentTheme?.color}` : 'none'
              }} 
            />
          )}
          <span className={`text-sm font-medium hidden sm:inline ${isNeon ? 'text-cyan-400' : ''}`}>
            {currentTheme?.label}
          </span>
          {isNeon && <Zap className="w-3 h-3 text-cyan-400 animate-pulse" />}
        </button>

        {isOpen && (
          <div className={`absolute right-0 top-full mt-2 w-56 rounded-xl shadow-xl z-50 py-2 ${
            isNeon 
              ? "bg-black/95 border border-cyan-500/30 backdrop-blur" 
              : "bg-slate-800 border border-slate-700"
          }`}>
            <p className={`px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
              isNeon ? "text-cyan-400" : "text-slate-400"
            }`}>
              Tema de color
            </p>
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  setColorTheme(theme.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 transition-colors ${
                  colorTheme === theme.id 
                    ? isNeon 
                      ? "bg-cyan-500/20 border-l-2 border-cyan-500" 
                      : "bg-white/10"
                    : "hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  {theme.icon || (
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ 
                        backgroundColor: theme.color,
                        boxShadow: theme.id === 'neon' ? `0 0 10px ${theme.color}` : 'none'
                      }}
                    />
                  )}
                  <span className={`text-sm ${
                    colorTheme === theme.id 
                      ? isNeon ? "text-cyan-400 font-semibold" : "text-white"
                      : isNeon ? "text-cyan-200/70" : "text-slate-300"
                  }`}>
                    {theme.label}
                  </span>
                </div>
                {colorTheme === theme.id && (
                  <Check className={`w-4 h-4 ${isNeon ? "text-cyan-400" : "text-slate-400"}`} />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
