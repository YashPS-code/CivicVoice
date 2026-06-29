import React, { useState } from "react";
import { Megaphone, ShieldCheck, ArrowRight, UserPlus, LogIn, Sparkles } from "lucide-react";
import { User, Role, City } from "../../types";
import logoSvg from "../../assets/logo.svg";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) { showAlert("Enter a username.", "error"); return; }
    if (!password.trim()) { showAlert("Enter a password.", "error"); return; }

    if (isLoginMode) {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: username.trim(), password }),
        });
        const data = await res.json();
        if (!res.ok) {
          showAlert(data.error || "Failed to log in.", "error");
          return;
        }
        onLoginSuccess(data);
        showAlert(`Welcome back, ${data.displayName}!`, "success");
      } catch (err) {
        console.error("Login error:", err);
        showAlert("Failed to connect to authentication server.", "error");
      }
    } else {
      if (!displayName.trim()) { showAlert("Enter your display name.", "error"); return; }
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: username.trim(),
            password,
            displayName: displayName.trim(),
            role,
            city,
            ward: ward.trim(),
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          showAlert(data.error || "Failed to create account.", "error");
          return;
        }
        onLoginSuccess(data);
        showAlert(`Welcome to BirdView, ${data.displayName}! Account created.`, "success");
      } catch (err) {
        console.error("Registration error:", err);
        showAlert("Failed to connect to authentication server.", "error");
      }
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
        <div className="relative z-10 max-w-xs text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 mb-5 flex items-center justify-center overflow-hidden rounded-xl bg-slate-950/20 shadow-md">
            <img src={logoSvg} alt="BirdView" className="w-16 h-16 object-contain rounded-xl" referrerPolicy="no-referrer" />
          </div>
          <h1 className="font-display font-black text-4xl mb-2 tracking-tight">BirdView</h1>
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
            <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center">
              <img src={logoSvg} alt="BirdView" className="w-9 h-9 object-contain rounded-xl" referrerPolicy="no-referrer" />
            </div>
            <span className="font-display font-bold text-xl bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              BirdView
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
