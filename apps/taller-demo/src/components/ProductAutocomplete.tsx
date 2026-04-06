"use client";

import { useState, useRef, useEffect } from "react";
import { StockItem } from "@/lib/types";
import { Search, Package, AlertCircle } from "lucide-react";

interface ProductAutocompleteProps {
  products: StockItem[];
  onSelect: (product: StockItem) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function ProductAutocomplete({
  products,
  onSelect,
  placeholder = "Buscar producto...",
  disabled = false,
}: ProductAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filtrar productos basados en la búsqueda
  const filteredProducts = products.filter((product) => {
    if (query.length < 2) return false;
    const searchTerm = query.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchTerm) ||
      product.sku?.toLowerCase().includes(searchTerm) ||
      product.description?.toLowerCase().includes(searchTerm)
    );
  }).slice(0, 10); // Máximo 10 resultados

  useEffect(() => {
    // Cerrar dropdown al hacer click fuera
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Resetear índice destacado cuando cambian los resultados
    setHighlightedIndex(0);
  }, [filteredProducts.length]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredProducts.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (filteredProducts[highlightedIndex]) {
          handleSelect(filteredProducts[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelect = (product: StockItem) => {
    onSelect(product);
    setQuery("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const formatPrice = (price?: number) => {
    if (!price) return "$0";
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const isLowStock = (product: StockItem) => {
    return product.quantity <= (product.minQuantity || 3);
  };

  const isCriticalStock = (product: StockItem) => {
    return product.quantity <= 2;
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(e.target.value.length >= 2);
          }}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="input pl-10 pr-4"
        />
      </div>

      {isOpen && filteredProducts.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl max-h-80 overflow-y-auto">
          <div className="p-2 text-xs text-slate-400 border-b border-slate-700">
            {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""} encontrado
            {filteredProducts.length === 10 ? " (máx)" : ""}
          </div>
          
          {filteredProducts.map((product, index) => (
            <button
              key={product.id}
              onClick={() => handleSelect(product)}
              className={`w-full flex items-center gap-3 p-3 text-left transition-colors border-b border-slate-700/50 last:border-0
                ${index === highlightedIndex ? "bg-slate-700" : "hover:bg-slate-700/50"}
                ${isCriticalStock(product) ? "border-l-4 border-l-red-500" : ""}
                ${isLowStock(product) && !isCriticalStock(product) ? "border-l-4 border-l-yellow-500" : ""}
              `}
            >
              {/* Foto del producto con marco temático */}
              <div className="w-12 h-12 stock-photo-frame flex items-center justify-center flex-shrink-0 bg-slate-800">
                {product.photoUrl ? (
                  <img
                    src={product.photoUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="w-6 h-6 text-slate-500" />
                )}
              </div>

              {/* Info del producto */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-white truncate">{product.name}</p>
                  {isCriticalStock(product) && (
                    <div title="Stock crítico">
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-400 font-mono">{product.sku}</span>
                  <span className="text-slate-600">•</span>
                  <span className={`font-medium ${
                    isCriticalStock(product) 
                      ? "text-red-400" 
                      : isLowStock(product) 
                        ? "text-yellow-400" 
                        : "text-green-400"
                  }`}>
                    {product.quantity} unid.
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-primary-400 font-medium">{formatPrice(product.price)}</span>
                </div>
                
                {product.location && (
                  <p className="text-xs text-slate-500 mt-0.5">📍 {product.location}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && query.length >= 2 && filteredProducts.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl p-4 text-center">
          <Package className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-slate-400">No se encontraron productos</p>
          <p className="text-sm text-slate-500 mt-1">Intenta con otras palabras</p>
        </div>
      )}
    </div>
  );
}
