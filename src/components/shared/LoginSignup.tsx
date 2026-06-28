import React, { useState } from "react";
import { Megaphone, ShieldCheck, ArrowRight, UserPlus, LogIn, Sparkles } from "lucide-react";
import { User, Role, City } from "../../types";
import { MOCK_CITIZENS, MOCK_COUNCILLORS } from "../../mockData";

interface LoginSignupProps {
  onLoginSuccess: (user: User) => void;
  showAlert: (text: string, type?: "success" | "error" | "info") => void;
}

export default function LoginSignup({ onLoginSuccess, showAlert }: LoginSignupProps) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<Role>("citizen");
  const [city, setCity] = useState<City>("Mumbai");
  const [ward, setWard] = useState("Ward 12 (Andheri West)");

  const handleDemoLogin = (type: "resident" | "official") => {
    if (type === "resident") {
      onLoginSuccess({
        id: "curr_user", username: "active_citizen_india", displayName: "Aarav Patel",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
        role: "citizen", isVerified: true, badgeType: "verified_resident", civicPoints: 180,
        city: "Mumbai", ward: "Ward 12 (Andheri West)", following: ["cit_1", "cit_2"],
        followersCount: 142, followingCount: 56,
        bio: "Civic-minded resident. Passionate about local infrastructure and public parks.",
      });
      showAlert("Welcome back, Aarav Patel!", "success");
    } else {
      onLoginSuccess({
        id: "off_2", username: "councillor_hsr", displayName: "Cllr. Sandeep Hegde",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
        role: "official", isVerified: true, badgeType: "verified_official", civicPoints: 1200,
        city: "Bengaluru", ward: "Ward 54 (HSR Layout)", following: [],
        followersCount: 520, followingCount: 89,
        bio: "Elected Ward Councillor. Ready to listen and issue administrative resolutions.",
      });
      showAlert("Welcome, Councillor Sandeep Hegde!", "success");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) { showAlert("Enter a username.", "error"); return; }

    if (isLoginMode) {
      const norm = username.toLowerCase().trim();
      if (norm === "active_citizen_india" || norm === "aarav") { handleDemoLogin("resident"); return; }
      if (norm === "councillor_hsr" || norm === "sandeep") { handleDemoLogin("official"); return; }
      const found = [...MOCK_CITIZENS, ...MOCK_COUNCILLORS].find((u) => u.username.toLowerCase() === norm);
      if (found) {
        onLoginSuccess({ ...found, following: [], followersCount: 10, followingCount: 10 });
        showAlert(`Welcome back, ${found.displayName}!`, "success");
      } else {
        onLoginSuccess({
          id: `usr_${Date.now()}`, username: norm, displayName: username,
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
          role: "citizen", isVerified: false, civicPoints: 20,
          city: "Mumbai", ward: "Ward 12 (Andheri West)",
          following: [], followersCount: 0, followingCount: 0, bio: "New to CivicVoice.",
        });
        showAlert("Logged in!", "success");
      }
    } else {
      if (!displayName.trim()) { showAlert("Enter your display name.", "error"); return; }
      onLoginSuccess({
        id: `usr_${Date.now()}`, username: username.toLowerCase().replace(/[^a-z0-9_]/g, ""),
        displayName: displayName.trim(),
        avatar: role === "official"
          ? "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150&q=80"
          : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
        role, isVerified: role === "official",
        badgeType: role === "official" ? "verified_official" : undefined,
        civicPoints: role === "official" ? 500 : 50,
        city, ward, following: [], followersCount: 0, followingCount: 0,
        bio: `Resident of ${ward}, ${city}.`,
      });
      showAlert(`Welcome to CivicVoice, ${displayName}!`, "success");
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-stretch">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-twitter-blue via-cyan-500 to-teal-400 p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="absolute rounded-full bg-white"
              style={{ width: `${60 + i * 30}px`, height: `${60 + i * 30}px`, top: `${(i * 80) % 100}%`, left: `${(i * 70 + 20) % 100}%`, opacity: 0.4 }} />
          ))}
        </div>
        <div className="relative z-10 max-w-xs text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center overflow-hidden shadow-lg">
            <img src="/logo.png" alt="CivicVoice" className="w-full h-full object-contain" />
          </div>
          <h1 className="font-display font-black text-4xl mb-2 tracking-tight">CivicVoice</h1>
          <p className="text-white/80 text-sm leading-relaxed font-medium">
            India's first civic social platform — connecting residents with their ward representatives.
          </p>
          <div className="mt-8 flex flex-col gap-3 text-left">
            {[
              { emoji: "📍", text: "Report local civic issues with GPS tagging" },
              { emoji: "🗳️", text: "Vote on community polls that shape policy" },
              { emoji: "⚡", text: "Earn Civic Points for active participation" },
              { emoji: "🛡️", text: "Verified residents get 2× vote priority" },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3 text-sm text-white/90">
                <span className="text-lg">{f.emoji}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right auth panel */}
      <div className="flex-1 flex items-center justify-center bg-white p-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-twitter-blue to-cyan-400 flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="" className="w-full h-full object-contain" />
            </div>
            <span className="font-display font-bold text-xl bg-gradient-to-r from-twitter-blue to-cyan-500 bg-clip-text text-transparent">
              CivicVoice
            </span>
          </div>

          <h2 className="font-display font-black text-2xl text-slate-900 mb-1">
            {isLoginMode ? "Sign in" : "Create account"}
          </h2>
          <p className="text-sm text-slate-400 mb-6">
            {isLoginMode ? "Access your civic workspace." : "Join India's civic movement."}
          </p>

          {/* Mode tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-5 gap-1">
            {[{ mode: true, label: "Sign In", icon: LogIn }, { mode: false, label: "Sign Up", icon: UserPlus }].map(({ mode, label, icon: Icon }) => (
              <button key={label} type="button" onClick={() => setIsLoginMode(mode)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                  isLoginMode === mode ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}>
                <Icon className="w-3.5 h-3.5" />{label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <Field label="Username" id="auth-username" type="text" value={username} onChange={setUsername} placeholder="active_citizen_india" />
            <Field label="Password" id="auth-password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />

            {!isLoginMode && (
              <div className="flex flex-col gap-3.5 border-t border-slate-100 pt-3.5 mt-1 animate-fade-in">
                <Field label="Full Name" id="auth-name" type="text" value={displayName} onChange={setDisplayName} placeholder="Aarav Patel" />
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">I am a</label>
                  <div className="grid grid-cols-2 gap-2">
                    {([["citizen", "🏡", "Resident"], ["official", "💼", "Councillor"]] as [Role, string, string][]).map(([r, e, l]) => (
                      <button key={r} type="button" onClick={() => setRole(r)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                          role === r ? "border-twitter-blue bg-twitter-light text-twitter-blue" : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
                        }`}>
                        <span className="text-base">{e}</span>{l}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">City</label>
                    <select value={city} onChange={(e) => setCity(e.target.value as City)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-twitter-blue/60 text-slate-700 font-medium">
                      {["Mumbai","Bengaluru","Delhi","Kolkata","Chennai"].map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Ward</label>
                    <input type="text" value={ward} onChange={(e) => setWard(e.target.value)} placeholder="Ward 12 (Andheri)"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-twitter-blue/60 text-slate-700 placeholder:text-slate-300" />
                  </div>
                </div>
              </div>
            )}

            <button type="submit"
              className="w-full py-3 mt-1 bg-twitter-blue hover:bg-twitter-hover text-white font-bold text-sm rounded-xl shadow-sm shadow-twitter-blue/30 transition active:scale-95 flex items-center justify-center gap-2">
              {isLoginMode ? "Sign In" : "Create Account"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Demo shortcuts */}
          <div className="mt-5 border-t border-slate-100 pt-5">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
              <Sparkles className="w-3 h-3 text-amber-400" />Demo Access
            </div>
            <div className="flex flex-col gap-2">
              {[
                { type: "resident" as const, name: "Aarav Patel", sub: "Mumbai · Resident", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80" },
                { type: "official" as const, name: "Cllr. Sandeep Hegde", sub: "Bengaluru · Official", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80" },
              ].map((d) => (
                <button key={d.type} type="button" onClick={() => handleDemoLogin(d.type)}
                  className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 hover:border-twitter-blue/30 hover:bg-twitter-light/40 transition text-left group">
                  <img src={d.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-white shadow-sm" />
                  <div>
                    <p className="text-xs font-bold text-slate-700 group-hover:text-twitter-blue transition">{d.name}</p>
                    <p className="text-[10px] text-slate-400">{d.sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, id, type, value, onChange, placeholder }: {
  label: string; id: string; type: string; value: string;
  onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
      <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full text-sm p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-twitter-blue/60 text-slate-800 placeholder:text-slate-300 transition" />
    </div>
  );
}
