"use client";

import { useState, useEffect } from "react";
import { Save, RotateCcw, Settings, Smartphone, Monitor, Tv, Wrench } from "lucide-react";
import { 
  AppConfig, 
  DeviceTypeConfig, 
  getConfig, 
  saveConfig, 
  resetConfig,
  DEFAULT_CONFIG 
} from "@/lib/config";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";

export default function ConfiguracionPage() {
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setConfig(getConfig());
  }, []);

  const handleSave = () => {
    saveConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (confirm("¿Restaurar configuración por defecto?")) {
      resetConfig();
      setConfig(DEFAULT_CONFIG);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const updateDeviceType = (id: string, field: keyof DeviceTypeConfig, value: string | boolean) => {
    setConfig(prev => ({
      ...prev,
      deviceTypes: prev.deviceTypes.map(dt => 
        dt.id === id ? { ...dt, [field]: value } : dt
      ),
    }));
  };

  const getIcon = (id: string) => {
    switch (id) {
      case "celular": return <Smartphone className="w-5 h-5" />;
      case "tablet": return <Monitor className="w-5 h-5" />;
      case "tv": return <Tv className="w-5 h-5" />;
      default: return <Wrench className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-20">
      <Navbar />
      
      <main className="main-container py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-3">
            <Settings className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Configuración</h1>
            <p className="text-gray-400 text-sm">Personaliza tu app según tu negocio</p>
          </div>
        </div>

        {/* Mensaje de guardado */}
        {saved && (
          <div className="bg-green-900/30 border border-green-600 rounded-xl p-4 mb-6 flex items-center gap-3">
            <Save className="w-5 h-5 text-green-400" />
            <span className="text-green-300 font-semibold">Configuración guardada correctamente</span>
          </div>
        )}

        {/* Datos del negocio */}
        <section className="card mb-6">
          <h2 className="text-lg font-bold text-orange-400 mb-4 flex items-center gap-2">
            🏪 Datos del Negocio
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="label">Nombre del Negocio</label>
              <input
                type="text"
                className="input"
                value={config.businessName}
                onChange={e => setConfig(prev => ({ ...prev, businessName: e.target.value }))}
                placeholder="Ej: Mi Servicio Técnico"
              />
            </div>
            
            <div>
              <label className="label">Eslogan / Descripción</label>
              <input
                type="text"
                className="input"
                value={config.businessSlogan}
                onChange={e => setConfig(prev => ({ ...prev, businessSlogan: e.target.value }))}
                placeholder="Ej: Servicio técnico profesional"
              />
            </div>
          </div>
        </section>

        {/* Tipos de Dispositivos */}
        <section className="card mb-6">
          <h2 className="text-lg font-bold text-orange-400 mb-4 flex items-center gap-2">
            📱 Tipos de Dispositivos
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Personaliza los nombres y emojis de los tipos de dispositivos que reparas
          </p>

          <div className="space-y-4">
            {config.deviceTypes.map(dt => (
              <div 
                key={dt.id} 
                className={`p-4 rounded-xl border transition-all ${
                  dt.enabled 
                    ? "bg-gray-800 border-gray-700" 
                    : "bg-gray-900 border-gray-800 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${dt.color}`}>
                      {getIcon(dt.id)}
                    </div>
                    <span className="font-bold text-white capitalize">{dt.id}</span>
                  </div>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs text-gray-400">Activo</span>
                    <div
                      onClick={() => updateDeviceType(dt.id, "enabled", !dt.enabled)}
                      className={`w-12 h-6 rounded-full border-2 transition-colors relative
                        ${dt.enabled
                          ? "bg-green-500 border-green-500"
                          : "bg-gray-700 border-gray-600"
                        }`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform
                        ${dt.enabled ? "translate-x-[22px]" : "translate-x-0.5"}`}
                      />
                    </div>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label text-xs">Nombre visible</label>
                    <input
                      type="text"
                      className="input input-sm"
                      value={dt.label}
                      onChange={e => updateDeviceType(dt.id, "label", e.target.value)}
                      disabled={!dt.enabled}
                    />
                  </div>
                  
                  <div>
                    <label className="label text-xs">Emoji</label>
                    <input
                      type="text"
                      className="input input-sm text-center"
                      value={dt.emoji}
                      onChange={e => updateDeviceType(dt.id, "emoji", e.target.value)}
                      disabled={!dt.enabled}
                      maxLength={2}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Botones de acción */}
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="btn-secondary flex-1 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Restaurar
          </button>
          
          <button
            onClick={handleSave}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Guardar Cambios
          </button>
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700 rounded-xl">
          <p className="text-blue-300 text-sm">
            💡 <strong>Tip:</strong> Los cambios se guardan en tu navegador. 
            Para sincronizar entre dispositivos, conecta tu base de datos Supabase.
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
