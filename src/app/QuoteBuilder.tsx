import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { ChevronRight, Home, ShoppingCart, Trash2, Filter, ChevronDown, Check, Info } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

// Image Imports from the provided file
// We will use these as fallbacks or for the initial state before fetching
import imgContainer1 from "figma:asset/6c7d481f3f7cfe8229c177224b89c13f95d87b39.png";
import imgContainer2 from "figma:asset/59b9f02bd1fa0bec28e88ffc81629937e084760c.png";
import imgContainer3 from "figma:asset/83c5749a94d22cad3d3bbd7b97c95837387110c9.png";
import imgContainer4 from "figma:asset/d278524ec8f760de9e682b836c42a7bfcbf43b3b.png";

const CONTAINER_TYPES = [
  { id: "standard", label: "Standard" },
  { id: "high-cube", label: "High Cube" },
  { id: "reefer", label: "Reefer" },
  { id: "flat-rack", label: "Flat Rack" },
];

const SIZES = [
    { id: "10", label: "10'" },
    { id: "20", label: "20'" },
    { id: "40", label: "40'" },
    { id: "45", label: "45'" }
];

const DOOR_CONFIGS = [
    { id: "standard", label: "Standard Doors" },
    { id: "double", label: "Double Doors" },
    { id: "open-side", label: "Open Side" }
];

const PRODUCTS = [
  {
    id: 1,
    name: "20' Standard Container",
    price: 2850,
    image: imgContainer1,
    description: "Wind and watertight, suitable for storage. Perfect for job sites or personal storage.",
    type: "Standard",
    size: "20",
    doorConfig: "Standard Doors"
  },
  {
    id: 2,
    name: "40' High Cube Container",
    price: 4200,
    image: imgContainer2,
    description: "Extra height for more storage capacity. Ideal for stacking large items.",
    type: "High Cube",
    size: "40",
    doorConfig: "Standard Doors"
  },
  {
    id: 3,
    name: "20' High Cube Double Door",
    price: 3500,
    image: imgContainer3,
    description: "Doors on both ends for easy access. Great for organizing inventory.",
    type: "High Cube",
    size: "20",
    doorConfig: "Double Doors"
  },
  {
    id: 4,
    name: "40' Standard Container",
    price: 3800,
    image: imgContainer4,
    description: "Standard 40ft shipping container. The industry standard for large cargo.",
    type: "Standard",
    size: "40",
    doorConfig: "Standard Doors"
  },
  {
    id: 5,
    name: "10' Standard Container",
    price: 2100,
    image: imgContainer1,
    description: "Compact storage solution. Fits in tight spaces like driveways.",
    type: "Standard",
    size: "10",
    doorConfig: "Standard Doors"
  },
  {
    id: 6,
    name: "20' Open Side Container",
    price: 4500,
    image: imgContainer2,
    description: "Full side access. Makes loading and unloading palletized goods easy.",
    type: "Standard",
    size: "20",
    doorConfig: "Open Side"
  },
  {
    id: 7,
    name: "45' High Cube Container",
    price: 5200,
    image: imgContainer3,
    description: "Maximum storage space. For when you need the absolute most room.",
    type: "High Cube",
    size: "45",
    doorConfig: "Standard Doors"
  },
  {
    id: 8,
    name: "20' Reefer Container",
    price: 8500,
    image: imgContainer4,
    description: "Refrigerated container. Temperature controlled for perishable goods.",
    type: "Reefer",
    size: "20",
    doorConfig: "Standard Doors"
  },
];

export default function QuoteBuilder() {
  const [cart, setCart] = useState<{product: typeof PRODUCTS[0], quantity: number}[]>([]);
  const [filters, setFilters] = useState({
    buying: "Buy",
    type: "All",
    doorConfig: "All",
    length: "All"
  });

  const addToCart = (product: typeof PRODUCTS[0]) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        toast.success(`Updated quantity for ${product.name}`);
        return prev.map(item => item.product.id === product.id ? {...item, quantity: item.quantity + 1} : item);
      }
      toast.success(`Added ${product.name} to quote`);
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    toast.info("Item removed from quote");
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prev => prev.map(item => {
        if (item.product.id === productId) {
            const newQuantity = Math.max(1, item.quantity + delta);
            return {...item, quantity: newQuantity};
        }
        return item;
    }));
  };

  const filteredProducts = PRODUCTS.filter(p => {
    if (filters.type !== "All" && p.type !== filters.type) return false;
    if (filters.length !== "All" && p.size !== filters.length) return false;
    if (filters.doorConfig !== "All" && p.doorConfig !== filters.doorConfig) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1440px] w-full mx-auto p-4 md:p-8">
        
        {/* Breadcrumb / Header */}
        <div className="mb-8">
            <div className="flex items-center gap-2 text-[var(--muted-foreground)] text-sm mb-2">
                <div className="w-8 h-8 bg-[#ede9e3] rounded-md flex items-center justify-center">
                    <Home className="w-4 h-4 text-[var(--foreground)]" />
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--muted-foreground)]" />
                <span className="text-[var(--foreground)] font-medium text-[length:var(--text-h3)] ml-2">Quote Builder</span>
            </div>
            <div className="h-px w-full bg-[var(--border)] mt-4" />
        </div>

        <div className="flex flex-col xl:flex-row gap-8 items-start">
            
            {/* Left Column: Builder Interface */}
            <div className="flex-1 w-full">
                
                {/* Filters Bar */}
                <div className="bg-white p-4 rounded-xl border border-[var(--border)] shadow-[var(--elevation-sm)] mb-8 flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-[var(--muted-foreground)]" />
                        <span className="font-medium text-[var(--foreground)] mr-4">Filters</span>
                    </div>
                    <div className="h-8 w-px bg-[var(--border)] hidden md:block" />
                    
                    {/* Buying Dropdown */}
                    <div className="flex flex-col gap-1 min-w-[140px] flex-1">
                        <label className="text-xs text-[var(--muted-foreground)] font-medium">Buying</label>
                        <div className="relative">
                            <select 
                                className="w-full bg-[var(--input-background)] border border-[var(--border)] rounded-lg py-2.5 pl-3 pr-8 appearance-none text-sm font-normal text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition-all"
                                value={filters.buying}
                                onChange={(e) => setFilters({...filters, buying: e.target.value})}
                            >
                                <option>Buy</option>
                                <option>Rent</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] pointer-events-none" />
                        </div>
                    </div>

                    {/* Type Dropdown */}
                    <div className="flex flex-col gap-1 min-w-[140px] flex-1">
                        <label className="text-xs text-[var(--muted-foreground)] font-medium">Type</label>
                        <div className="relative">
                            <select 
                                className="w-full bg-[var(--input-background)] border border-[var(--border)] rounded-lg py-2.5 pl-3 pr-8 appearance-none text-sm font-normal text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition-all"
                                value={filters.type}
                                onChange={(e) => setFilters({...filters, type: e.target.value})}
                            >
                                <option value="All">All Types</option>
                                {CONTAINER_TYPES.map(t => <option key={t.id} value={t.label}>{t.label}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] pointer-events-none" />
                        </div>
                    </div>

                    {/* Door Config Dropdown */}
                    <div className="flex flex-col gap-1 min-w-[140px] flex-1">
                        <label className="text-xs text-[var(--muted-foreground)] font-medium">Door Config</label>
                        <div className="relative">
                            <select 
                                className="w-full bg-[var(--input-background)] border border-[var(--border)] rounded-lg py-2.5 pl-3 pr-8 appearance-none text-sm font-normal text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition-all"
                                value={filters.doorConfig}
                                onChange={(e) => setFilters({...filters, doorConfig: e.target.value})}
                            >
                                <option value="All">All Configs</option>
                                {DOOR_CONFIGS.map(t => <option key={t.id} value={t.label}>{t.label}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] pointer-events-none" />
                        </div>
                    </div>

                    {/* Length Dropdown */}
                    <div className="flex flex-col gap-1 min-w-[140px] flex-1">
                        <label className="text-xs text-[var(--muted-foreground)] font-medium">Length</label>
                        <div className="relative">
                            <select 
                                className="w-full bg-[var(--input-background)] border border-[var(--border)] rounded-lg py-2.5 pl-3 pr-8 appearance-none text-sm font-normal text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition-all"
                                value={filters.length}
                                onChange={(e) => setFilters({...filters, length: e.target.value})}
                            >
                                <option value="All">All Lengths</option>
                                {SIZES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                {filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-[var(--border)]">
                        <div className="w-16 h-16 bg-[#f9f8f6] rounded-full flex items-center justify-center mb-4">
                            <Filter className="w-8 h-8 text-[var(--muted-foreground)]" />
                        </div>
                        <h3 className="text-lg font-medium text-[var(--foreground)]">No containers found</h3>
                        <p className="text-[var(--muted-foreground)]">Try adjusting your filters to see more options.</p>
                        <button 
                            onClick={() => setFilters({buying: "Buy", type: "All", doorConfig: "All", length: "All"})}
                            className="mt-4 text-[var(--primary)] font-medium hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                        {filteredProducts.map((product) => (
                            <motion.div 
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col group cursor-pointer"
                                onClick={() => addToCart(product)}
                            >
                                <div className="aspect-[4/3] bg-[#f9f8f6] relative p-6 flex items-center justify-center overflow-hidden">
                                    <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium text-[var(--foreground)] border border-[var(--border)]">
                                        {product.size}' {product.type}
                                    </div>
                                    <img 
                                        src={product.image} 
                                        alt={product.name} 
                                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500 ease-out" 
                                    />
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="text-[var(--foreground)] font-normal text-lg mb-2 leading-tight group-hover:text-[var(--primary)] transition-colors">{product.name}</h3>
                                    <p className="text-[var(--muted-foreground)] text-sm mb-6 leading-relaxed line-clamp-2">{product.description}</p>
                                    
                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-[var(--border)]">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-[var(--muted-foreground)]">Condition</span>
                                            <span className="text-sm font-medium text-[var(--foreground)]">New / One Trip</span>
                                        </div>
                                        <button 
                                            className="bg-[var(--primary)] text-white text-sm px-5 py-2.5 rounded-full font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-1.5"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addToCart(product);
                                            }}
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Right Column: Cart Summary (Sticky) */}
            <div className="w-full xl:w-[400px] shrink-0 xl:sticky xl:top-[100px] space-y-6">
                
                {/* Cart Card */}
                <div className="bg-white rounded-2xl border border-[var(--border)] shadow-[var(--elevation-sm)] overflow-hidden flex flex-col max-h-[calc(100vh-140px)]">
                    <div className="p-5 border-b border-[var(--border)] bg-white flex items-center justify-between sticky top-0 z-10">
                        <h2 className="text-xl font-normal text-[var(--foreground)] flex items-center gap-2">
                            Cart Summary
                        </h2>
                        <div className="bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-bold px-2 py-1 rounded-full">
                            {cart.reduce((a, b) => a + b.quantity, 0)} Items
                        </div>
                    </div>
                    
                    <div className="p-5 overflow-y-auto custom-scrollbar flex-1">
                        {cart.length === 0 ? (
                            <div className="text-center py-16 px-4">
                                <div className="w-16 h-16 bg-[#f9f8f6] rounded-full flex items-center justify-center mx-auto mb-4 border border-[var(--border)]">
                                    <ShoppingCart className="w-8 h-8 text-[var(--muted-foreground)]" />
                                </div>
                                <h3 className="text-[var(--foreground)] font-medium mb-1">Your cart is empty</h3>
                                <p className="text-sm text-[var(--muted-foreground)]">Select containers from the left to build your quote.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-6">
                                {cart.map((item) => (
                                    <motion.div 
                                        layout
                                        key={item.product.id} 
                                        className="flex gap-4 items-start group"
                                    >
                                        <div className="w-20 h-20 bg-[#f9f8f6] rounded-lg border border-[var(--border)] p-2 shrink-0 flex items-center justify-center">
                                            <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain mix-blend-multiply" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-medium text-[var(--foreground)] text-sm leading-tight pr-2">{item.product.name}</h4>
                                                <button 
                                                    onClick={() => removeFromCart(item.product.id)}
                                                    className="text-[var(--muted-foreground)] hover:text-[var(--destructive)] transition-colors opacity-0 group-hover:opacity-100 p-0.5"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <p className="text-xs text-[var(--muted-foreground)] mb-3">{item.product.size}' • {item.product.type}</p>
                                            
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center border border-[var(--border)] rounded-md bg-[var(--background)] h-8">
                                                    <button 
                                                        onClick={() => updateQuantity(item.product.id, -1)}
                                                        className="w-8 h-full flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--border)]/50 transition-colors"
                                                    >-</button>
                                                    <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                                                    <button 
                                                        onClick={() => updateQuantity(item.product.id, 1)}
                                                        className="w-8 h-full flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--border)]/50 transition-colors"
                                                    >+</button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {cart.length > 0 && (
                        <div className="p-5 bg-[#f9f8f6] border-t border-[var(--border)]">
                            {/* Zip Code Notice */}
                             <div className="flex gap-3 mb-6 bg-[#fef7e2] p-3 rounded-lg border border-[#ede9e3]">
                                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-900 leading-relaxed">
                                    No online pricing available for your region. Please request a quote and our team will get back to you with exact pricing including delivery.
                                </p>
                            </div>

                            <button className="w-full bg-[var(--primary)] text-white py-3.5 rounded-full font-medium text-base hover:bg-blue-700 transition-all shadow-sm mb-3 flex items-center justify-center gap-2 group">
                                Request Quote
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <p className="text-[10px] text-center text-[var(--muted-foreground)] uppercase tracking-wider font-medium">
                                No payment required
                            </p>
                        </div>
                    )}
                </div>
            </div>

        </div>
      </main>
    </div>
  );
}
