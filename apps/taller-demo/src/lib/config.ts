// ============================================================
// CONFIGURACIÓN PERSONALIZABLE - Demo AppJeez
// Permite personalizar tipos de dispositivos, marcas, etc.
// ============================================================

export interface DeviceTypeConfig {
  id: string;
  label: string;
  emoji: string;
  color: string; // Clase de Tailwind para el color
  enabled: boolean;
}

export interface AppConfig {
  deviceTypes: DeviceTypeConfig[];
  businessName: string;
  businessSlogan: string;
  updatedAt: string;
}

const CONFIG_KEY = "appjeez_config";

// Configuración por defecto
export const DEFAULT_CONFIG: AppConfig = {
  deviceTypes: [
    { id: "celular", label: "Celular", emoji: "📱", color: "bg-blue-500", enabled: true },
    { id: "tablet", label: "Tablet", emoji: "📱", color: "bg-purple-500", enabled: true },
    { id: "tv", label: "TV / Smart", emoji: "📺", color: "bg-cyan-500", enabled: true },
    { id: "otros", label: "Otros", emoji: "🔧", color: "bg-orange-500", enabled: true },
  ],
  businessName: "AppJeez",
  businessSlogan: "Demo para Service Tecnicos",
  updatedAt: new Date().toISOString(),
};

// Obtener configuración
export function getConfig(): AppConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  
  try {
    const stored = localStorage.getItem(CONFIG_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Mergear con defaults para asegurar que todos los campos existan
      return {
        ...DEFAULT_CONFIG,
        ...parsed,
        deviceTypes: DEFAULT_CONFIG.deviceTypes.map(dt => {
          const custom = parsed.deviceTypes?.find((d: DeviceTypeConfig) => d.id === dt.id);
          return custom ? { ...dt, ...custom } : dt;
        }),
      };
    }
  } catch (e) {
    console.error("Error loading config:", e);
  }
  
  return DEFAULT_CONFIG;
}

// Guardar configuración
export function saveConfig(config: AppConfig): void {
  if (typeof window === "undefined") return;
  
  try {
    const toSave = {
      ...config,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(CONFIG_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error("Error saving config:", e);
  }
}

// Obtener tipos de dispositivos habilitados
export function getEnabledDeviceTypes(): DeviceTypeConfig[] {
  const config = getConfig();
  return config.deviceTypes.filter(dt => dt.enabled);
}

// Obtener labels para los tipos
export function getDeviceTypeLabels(): Record<string, string> {
  const config = getConfig();
  const labels: Record<string, string> = {};
  config.deviceTypes.forEach(dt => {
    labels[dt.id] = dt.label;
  });
  return labels;
}

// Resetear configuración a defaults
export function resetConfig(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CONFIG_KEY);
}
