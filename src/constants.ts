import { Category } from "./types";

export const CATEGORIES: { value: Category; label: string; icon: string; color: string }[] = [
  { value: "potholes", label: "Potholes & Roads", icon: "🛣️", color: "from-amber-400 to-amber-600" },
  { value: "streetlights", label: "Streetlights", icon: "💡", color: "from-yellow-400 to-yellow-600" },
  { value: "water_leakage", label: "Water Leakage", icon: "💧", color: "from-blue-400 to-blue-600" },
  { value: "garbage", label: "Garbage Pile", icon: "🗑️", color: "from-emerald-400 to-emerald-600" },
  { value: "encroachments", label: "Encroachments", icon: "🚧", color: "from-red-400 to-red-600" },
  { value: "traffic", label: "Traffic Jams", icon: "🚗", color: "from-indigo-400 to-indigo-600" },
  { value: "pollution", label: "Air/Noise Pollution", icon: "🌫️", color: "from-teal-400 to-teal-600" },
  { value: "others", label: "Other Services", icon: "📋", color: "from-slate-400 to-slate-600" }
];
