import React, { useState, useEffect } from "react";
import { Settings, Moon, Sun, Bell, Globe, Layout, Check } from "lucide-react";

interface PreferencesProps {
  showAlert: (text: string, type?: "success" | "error" | "info") => void;
}

export default function Preferences({ showAlert }: PreferencesProps) {
  const [theme, setTheme] = useState<"light" | "dark">(
    localStorage.getItem("civic-theme") === "dark" ? "dark" : "light"
  );
  const [density, setDensity] = useState<"comfortable" | "compact">(
    (localStorage.getItem("civic-density") as any) || "comfortable"
  );
  const [notifyGrievances, setNotifyGrievances] = useState(true);
  const [notifyOfficialOrders, setNotifyOfficialOrders] = useState(true);
  const [notifyReputation, setNotifyReputation] = useState(false);
  const [autoTranslate, setAutoTranslate] = useState<"none" | "hindi" | "marathi" | "kannada" | "tamil">("none");

  useEffect(() => {
    applyThemeClass(theme);
    applyDensityClass(density);
  }, []);

  const applyThemeClass = (t: "light" | "dark") => {
    document.documentElement.classList.toggle("dark", t === "dark");
    localStorage.setItem("civic-theme", t);
  };

  const applyDensityClass = (d: "comfortable" | "compact") => {
    document.documentElement.classList.toggle("density-compact", d === "compact");
    localStorage.setItem("civic-density", d);
  };

  const handleThemeChange = (t: "light" | "dark") => {
    setTheme(t);
    applyThemeClass(t);
    showAlert(`Switched to ${t} mode`, "success");
  };

  const handleDensityChange = (d: "comfortable" | "compact") => {
    setDensity(d);
    applyDensityClass(d);
    showAlert(`Layout density set to ${d}`, "info");
  };

  return (
    <div className="p-4 md:p-6 text-left max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-1.5 text-twitter-blue font-extrabold text-xs mb-1">
          <Settings className="w-4 h-4" />
          PREFERENCES
        </div>
        <h2 className="font-display font-black text-slate-900 text-lg md:text-xl">
          Personalize CivicVoice
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
          Control your theme, layout density, notifications, and language settings.
        </p>
      </div>

      <div className="flex flex-col gap-5">

        {/* ── Appearance ── */}
        <Section icon={<Moon className="w-4 h-4 text-slate-400" />} title="Appearance">
          <div className="grid grid-cols-2 gap-3">
            {/* Light */}
            <button
              onClick={() => handleThemeChange("light")}
              className={`h-24 p-3.5 rounded-2xl border text-left flex flex-col justify-between transition ${
                theme === "light"
                  ? "bg-twitter-light border-twitter-blue ring-1 ring-twitter-blue"
                  : "bg-slate-50 border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <Sun className={`w-5 h-5 ${theme === "light" ? "text-twitter-blue" : "text-slate-400"}`} />
                {theme === "light" && <Check className="w-4 h-4 text-twitter-blue" />}
              </div>
              <div>
                <p className={`text-xs font-black ${theme === "light" ? "text-twitter-blue" : "text-slate-700"}`}>Light Mode</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Eye-safe day theme</p>
              </div>
            </button>

            {/* Dark — preview shown as a mini dark card, text always readable */}
            <button
              onClick={() => handleThemeChange("dark")}
              className={`h-24 p-3.5 rounded-2xl border text-left flex flex-col justify-between transition ${
                theme === "dark"
                  ? "bg-slate-800 border-slate-600 ring-1 ring-slate-500"
                  : "bg-slate-50 border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <Moon className={`w-5 h-5 ${theme === "dark" ? "text-slate-300" : "text-slate-400"}`} />
                {theme === "dark" && <Check className="w-4 h-4 text-slate-300" />}
              </div>
              <div>
                <p className={`text-xs font-black ${theme === "dark" ? "text-slate-100" : "text-slate-700"}`}>Dark Mode</p>
                <p className={`text-[10px] mt-0.5 ${theme === "dark" ? "text-slate-400" : "text-slate-400"}`}>Dim twilight theme</p>
              </div>
            </button>
          </div>
        </Section>

        {/* ── Density ── */}
        <Section icon={<Layout className="w-4 h-4 text-slate-400" />} title="Layout Density">
          <div className="grid grid-cols-2 gap-3">
            {(["comfortable", "compact"] as const).map((d) => (
              <button
                key={d}
                onClick={() => handleDensityChange(d)}
                className={`p-3 rounded-2xl border text-left flex items-center justify-between transition ${
                  density === d
                    ? "bg-twitter-light border-twitter-blue ring-1 ring-twitter-blue"
                    : "bg-slate-50 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div>
                  <p className={`text-xs font-black capitalize ${density === d ? "text-twitter-blue" : "text-slate-700"}`}>
                    {d}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {d === "comfortable" ? "Spacious, readable layout" : "More info per screen"}
                  </p>
                </div>
                {density === d && <Check className="w-4 h-4 text-twitter-blue shrink-0 ml-2" />}
              </button>
            ))}
          </div>
        </Section>

        {/* ── Notifications ── */}
        <Section icon={<Bell className="w-4 h-4 text-slate-400" />} title="Notification Triggers">
          <div className="flex flex-col divide-y divide-slate-100">
            <ToggleRow
              label="New Ward Grievances"
              description="Alert when a neighbour posts an issue in your ward"
              checked={notifyGrievances}
              onChange={setNotifyGrievances}
            />
            <ToggleRow
              label="Official Municipal Directives"
              description="Alert when a councillor issues a resolution or advisory"
              checked={notifyOfficialOrders}
              onChange={setNotifyOfficialOrders}
            />
            <ToggleRow
              label="Reputation Milestones"
              description="Notification when upvotes grant you extra Civic Points"
              checked={notifyReputation}
              onChange={setNotifyReputation}
            />
          </div>
        </Section>

        {/* ── Language ── */}
        <Section icon={<Globe className="w-4 h-4 text-slate-400" />} title="Translation Overlay">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-slate-700">Auto-Translate Reports</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Translate bilingual posts into your preferred language.</p>
            </div>
            <select
              value={autoTranslate}
              onChange={(e) => {
                setAutoTranslate(e.target.value as any);
                showAlert("Translation preference updated", "success");
              }}
              className="shrink-0 text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:border-twitter-blue/60 font-semibold transition"
            >
              <option value="none">No Auto-Translation</option>
              <option value="hindi">Hindi (हिन्दी)</option>
              <option value="marathi">Marathi (मराठी)</option>
              <option value="kannada">Kannada (ಕನ್ನಡ)</option>
              <option value="tamil">Tamil (தமிழ்)</option>
            </select>
          </div>
        </Section>

        {/* Save */}
        <button
          onClick={() => showAlert("All preferences saved!", "success")}
          className="w-full py-3 bg-twitter-blue hover:bg-twitter-hover text-white font-extrabold text-sm rounded-xl shadow-sm shadow-twitter-blue/20 transition active:scale-95 flex items-center justify-center gap-2"
        >
          <Settings className="w-4 h-4" />
          Save Preferences
        </button>
      </div>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="font-display font-extrabold text-sm text-slate-800">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function ToggleRow({ label, description, checked, onChange }: {
  label: string; description: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between py-3 gap-4 cursor-pointer group">
      <div>
        <p className="text-xs font-bold text-slate-700 group-hover:text-slate-900 transition">{label}</p>
        <p className="text-[10px] text-slate-400 mt-0.5">{description}</p>
      </div>
      {/* Custom toggle */}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative shrink-0 w-10 h-5.5 rounded-full transition-colors duration-200 focus:outline-none ${
          checked ? "bg-twitter-blue" : "bg-slate-200"
        }`}
        style={{ height: "22px" }}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </label>
  );
}
