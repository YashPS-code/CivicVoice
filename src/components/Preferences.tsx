import React, { useState, useEffect } from "react";
import { Settings, Moon, Sun, Monitor, Bell, Volume2, Globe, Layout, Check, Sparkles } from "lucide-react";

interface PreferencesProps {
  showAlert: (text: string, type?: "success" | "error" | "info") => void;
}

export default function Preferences({ showAlert }: PreferencesProps) {
  // Theme state
  const [theme, setTheme] = useState<"light" | "dark">(
    (localStorage.getItem("civic-theme") as any) === "dark" ? "dark" : "light"
  );

  // Density state
  const [density, setDensity] = useState<"comfortable" | "compact">(
    (localStorage.getItem("civic-density") as any) || "comfortable"
  );

  // Notification Toggles
  const [notifyGrievances, setNotifyGrievances] = useState(true);
  const [notifyOfficialOrders, setNotifyOfficialOrders] = useState(true);
  const [notifyReputation, setNotifyReputation] = useState(false);

  // Auto-translate option
  const [autoTranslate, setAutoTranslate] = useState<"none" | "hindi" | "marathi" | "kannada" | "tamil">("none");

  // Load state on mount
  useEffect(() => {
    // Apply theme
    applyThemeClass(theme);
    // Apply density
    applyDensityClass(density);
  }, []);

  const applyThemeClass = (selectedTheme: "light" | "dark") => {
    const root = document.documentElement;
    root.classList.remove("dark", "high-contrast-blue");
    
    if (selectedTheme === "dark") {
      root.classList.add("dark");
    }
    localStorage.setItem("civic-theme", selectedTheme);
  };

  const applyDensityClass = (selectedDensity: "comfortable" | "compact") => {
    const root = document.documentElement;
    root.classList.remove("density-compact");
    if (selectedDensity === "compact") {
      root.classList.add("density-compact");
    }
    localStorage.setItem("civic-density", selectedDensity);
  };

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    applyThemeClass(newTheme);
    showAlert(`Visual theme updated to ${newTheme} mode!`, "success");
  };

  const handleDensityChange = (newDensity: "comfortable" | "compact") => {
    setDensity(newDensity);
    applyDensityClass(newDensity);
    showAlert(`Layout spacing set to ${newDensity} density.`, "info");
  };

  const handleSavePreferences = () => {
    showAlert("All civic settings & accessibility preferences saved successfully!", "success");
  };

  return (
    <div className="p-4 md:p-6 text-left max-w-2xl mx-auto">
      {/* Title & Description */}
      <div className="mb-6">
        <div className="flex items-center gap-1.5 text-twitter-blue dark:text-blue-400 font-extrabold text-xs mb-1">
          <Settings className="w-4 h-4 animate-spin-slow" />
          <span>ACCESSIBILITY & SYSTEM PREFERENCES</span>
        </div>
        <h2 className="font-display font-black text-slate-900 dark:text-white text-lg md:text-xl">
          Personalize Your Dashboard
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5 font-medium">
          Customize high-fidelity layout parameters, theme presets, language overlays, and real-time notification triggers.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* SECTION 1: VISUAL THEME PREFERENCES */}
        <div className="p-4 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center gap-2 mb-3.5">
            <Moon className="w-4 h-4 text-slate-400" />
            <h3 className="font-display font-extrabold text-sm text-slate-800 dark:text-slate-200">
              Appearance & Theme
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Light Mode */}
            <button
              onClick={() => handleThemeChange("light")}
              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between h-24 transition ${
                theme === "light"
                  ? "bg-blue-50/50 border-twitter-blue dark:border-blue-400 ring-1 ring-twitter-blue"
                  : "bg-slate-50/50 hover:bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800"
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <Sun className={`w-5 h-5 ${theme === "light" ? "text-twitter-blue" : "text-slate-400"}`} />
                {theme === "light" && <Check className="w-4 h-4 text-twitter-blue" />}
              </div>
              <div className="text-left leading-tight">
                <span className="text-xs font-black text-slate-800 dark:text-slate-200 block">Light Theme</span>
                <span className="text-[10px] text-slate-400">Eye-safe day mode</span>
              </div>
            </button>

            {/* Dark Mode */}
            <button
              onClick={() => handleThemeChange("dark")}
              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between h-24 transition ${
                theme === "dark"
                  ? "bg-slate-800 border-slate-600 ring-1 ring-slate-400"
                  : "bg-slate-50/50 hover:bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800"
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <Moon className={`w-5 h-5 ${theme === "dark" ? "text-slate-200" : "text-slate-400"}`} />
                {theme === "dark" && <Check className="w-4 h-4 text-slate-200" />}
              </div>
              <div className="text-left leading-tight">
                <span className="text-xs font-black text-slate-800 dark:text-slate-200 block">Dark Night Theme</span>
                <span className="text-[10px] text-slate-400">Dim twilight mode</span>
              </div>
            </button>
          </div>
        </div>

        {/* SECTION 2: SPACING & DENSITY PREFERENCES */}
        <div className="p-4 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center gap-2 mb-3.5">
            <Layout className="w-4 h-4 text-slate-400" />
            <h3 className="font-display font-extrabold text-sm text-slate-800 dark:text-slate-200">
              Layout Spacing Density
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => handleDensityChange("comfortable")}
              className={`p-3 rounded-2xl border text-left flex items-center justify-between transition ${
                density === "comfortable"
                  ? "bg-blue-50/50 border-twitter-blue dark:border-blue-400"
                  : "bg-slate-50/50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800"
              }`}
            >
              <div className="flex flex-col text-left leading-tight">
                <span className="text-xs font-black text-slate-800 dark:text-slate-200">Comfortable Density</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Spacious paddings, readable text</span>
              </div>
              {density === "comfortable" && <Check className="w-4 h-4 text-twitter-blue shrink-0 ml-2" />}
            </button>

            <button
              onClick={() => handleDensityChange("compact")}
              className={`p-3 rounded-2xl border text-left flex items-center justify-between transition ${
                density === "compact"
                  ? "bg-blue-50/50 border-twitter-blue dark:border-blue-400"
                  : "bg-slate-50/50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800"
              }`}
            >
              <div className="flex flex-col text-left leading-tight">
                <span className="text-xs font-black text-slate-800 dark:text-slate-200">Compact Density</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Smaller paddings, higher data count</span>
              </div>
              {density === "compact" && <Check className="w-4 h-4 text-twitter-blue shrink-0 ml-2" />}
            </button>
          </div>
        </div>

        {/* SECTION 3: REAL-TIME NOTIFICATION PREFERENCES */}
        <div className="p-4 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center gap-2 mb-3.5">
            <Bell className="w-4 h-4 text-slate-400" />
            <h3 className="font-display font-extrabold text-sm text-slate-800 dark:text-slate-200">
              Notification Triggers
            </h3>
          </div>

          <div className="flex flex-col gap-3">
            {/* Toggle 1 */}
            <label className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer">
              <div className="flex flex-col text-left leading-snug">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">New Ward Grievances</span>
                <span className="text-[10px] text-slate-400">Receive alert when a neighbor posts an issue in your ward.</span>
              </div>
              <input
                type="checkbox"
                checked={notifyGrievances}
                onChange={(e) => setNotifyGrievances(e.target.checked)}
                className="w-4 h-4 text-twitter-blue bg-gray-100 border-gray-300 rounded-lg focus:ring-blue-500"
              />
            </label>

            {/* Toggle 2 */}
            <label className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer">
              <div className="flex flex-col text-left leading-snug">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Official Municipal Directives</span>
                <span className="text-[10px] text-slate-400">Immediate alert when councillor issues a resolution or road advisory.</span>
              </div>
              <input
                type="checkbox"
                checked={notifyOfficialOrders}
                onChange={(e) => setNotifyOfficialOrders(e.target.checked)}
                className="w-4 h-4 text-twitter-blue bg-gray-100 border-gray-300 rounded-lg focus:ring-blue-500"
              />
            </label>

            {/* Toggle 3 */}
            <label className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer">
              <div className="flex flex-col text-left leading-snug">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Reputation Milestones</span>
                <span className="text-[10px] text-slate-400">Notification when upvotes grant you extra civic points.</span>
              </div>
              <input
                type="checkbox"
                checked={notifyReputation}
                onChange={(e) => setNotifyReputation(e.target.checked)}
                className="w-4 h-4 text-twitter-blue bg-gray-100 border-gray-300 rounded-lg focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        {/* SECTION 4: TRANSLATION PREFERENCES */}
        <div className="p-4 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center gap-2 mb-3.5">
            <Globe className="w-4 h-4 text-slate-400" />
            <h3 className="font-display font-extrabold text-sm text-slate-800 dark:text-slate-200">
              Translation Overlay
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-left leading-snug">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Auto-Translate Reports</span>
              <span className="text-[10px] text-slate-400">Automatically translate bilingual posts into your preferred language context.</span>
            </div>

            <select
              value={autoTranslate}
              onChange={(e) => {
                setAutoTranslate(e.target.value as any);
                showAlert(`Preferred translation updated.`, "success");
              }}
              className="text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none font-semibold text-slate-700 dark:text-slate-200"
            >
              <option value="none">No Auto-Translation</option>
              <option value="hindi">Hindi (हिन्दी)</option>
              <option value="marathi">Marathi (मराठी)</option>
              <option value="kannada">Kannada (ಕನ್ನಡ)</option>
              <option value="tamil">Tamil (தமிழ்)</option>
            </select>
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSavePreferences}
          className="w-full py-3 bg-twitter-blue hover:bg-twitter-hover text-white font-extrabold text-xs rounded-xl shadow-md transition duration-150 flex items-center justify-center gap-2 mt-2 cursor-pointer"
        >
          <Settings className="w-4 h-4" />
          <span>Save Preference Overrides</span>
        </button>
      </div>
    </div>
  );
}
