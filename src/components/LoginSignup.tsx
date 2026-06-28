import React, { useState } from "react";
import { Megaphone, ShieldCheck, ShieldAlert, ArrowRight, UserPlus, LogIn, Sparkles } from "lucide-react";
import { User, Role, City } from "../types";
import { MOCK_CITIZENS, MOCK_COUNCILLORS } from "../mockData";

interface LoginSignupProps {
  onLoginSuccess: (user: User) => void;
  showAlert: (text: string, type?: "success" | "error" | "info") => void;
}

export default function LoginSignup({
  onLoginSuccess,
  showAlert
}: LoginSignupProps) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  
  // Form fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<Role>("citizen");
  const [city, setCity] = useState<City>("Mumbai");
  const [ward, setWard] = useState("Ward 12 (Andheri West)");

  const handleDemoLogin = (demoUser: "resident" | "official") => {
    if (demoUser === "resident") {
      const aarav: User = {
        id: "curr_user",
        username: "active_citizen_india",
        displayName: "Aarav Patel",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
        role: "citizen",
        isVerified: true,
        badgeType: "verified_resident",
        civicPoints: 180,
        city: "Mumbai",
        ward: "Ward 12 (Andheri West)",
        following: ["cit_1", "cit_2"],
        followersCount: 142,
        followingCount: 56,
        bio: "Civic-minded resident. Passionate about local infrastructure, public parks, and ward greening initiatives."
      };
      onLoginSuccess(aarav);
      showAlert("Logged in successfully as Resident Aarav Patel!", "success");
    } else {
      const councillor: User = {
        id: "off_2",
        username: "councillor_hsr",
        displayName: "Cllr. Sandeep Hegde",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
        role: "official",
        isVerified: true,
        badgeType: "verified_official",
        civicPoints: 1200,
        city: "Bengaluru",
        ward: "Ward 54 (HSR Layout)",
        following: [],
        followersCount: 520,
        followingCount: 89,
        bio: "Elected Ward Councillor. Ready to listen to grievances and issue administrative resolutions on CivicVoice."
      };
      onLoginSuccess(councillor);
      showAlert("Logged in successfully as Councillor Sandeep Hegde!", "success");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      showAlert("Please enter a username.", "error");
      return;
    }

    if (isLoginMode) {
      // Find matches in existing citizen/councillor pools, or accept anything if they type standard demo accounts
      const normUser = username.toLowerCase().trim();
      let matchedUser: User | undefined;

      if (normUser === "active_citizen_india" || normUser === "aarav") {
        handleDemoLogin("resident");
        return;
      }
      if (normUser === "councillor_hsr" || normUser === "sandeep") {
        handleDemoLogin("official");
        return;
      }

      // Check Mock lists
      matchedUser = MOCK_CITIZENS.find(c => c.username.toLowerCase() === normUser);
      if (!matchedUser) {
        matchedUser = MOCK_COUNCILLORS.find(c => c.username.toLowerCase() === normUser);
      }

      if (matchedUser) {
        onLoginSuccess({
          ...matchedUser,
          following: [],
          followersCount: matchedUser.followersCount || 10,
          followingCount: matchedUser.followingCount || 10,
          bio: matchedUser.bio || "CivicVoice Member."
        });
        showAlert(`Welcome back, ${matchedUser.displayName}!`, "success");
      } else {
        // Safe auto-creation fallback for non-empty custom credentials to avoid lockout!
        const generatedUser: User = {
          id: `usr_${Date.now()}`,
          username: username.toLowerCase().replace(/\s+/g, ""),
          displayName: username,
          avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random()*900000)}?auto=format&fit=crop&w=150&h=150&q=80`,
          role: "citizen",
          isVerified: false,
          civicPoints: 20,
          city: "Mumbai",
          ward: "Ward 12 (Andheri West)",
          following: [],
          followersCount: 0,
          followingCount: 0,
          bio: "Just joined CivicVoice."
        };
        onLoginSuccess(generatedUser);
        showAlert(`Authenticated & logged in as ${username}!`, "success");
      }
    } else {
      // Sign Up mode
      if (!displayName.trim()) {
        showAlert("Please specify your display name.", "error");
        return;
      }

      const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_]/g, "");
      const generatedUser: User = {
        id: `usr_${Date.now()}`,
        username: cleanUsername,
        displayName: displayName.trim(),
        avatar: role === "official" 
          ? "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150&q=80"
          : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
        role: role,
        isVerified: role === "official", // Officials automatically verified for testing convenience
        badgeType: role === "official" ? "verified_official" : undefined,
        civicPoints: role === "official" ? 500 : 50,
        city: city,
        ward: ward,
        following: [],
        followersCount: 0,
        followingCount: 0,
        bio: role === "official" 
          ? `Verified representative for ${ward}, ${city}.` 
          : `Resident of ${ward}, ${city}. Active participant in local social concerns.`
      };

      onLoginSuccess(generatedUser);
      showAlert(`Welcome to CivicVoice, ${displayName.trim()}! Account created.`, "success");
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-slate-50 p-4">
      {/* Container with empty outer background for uncluttered aesthetic */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 md:p-8 text-left transition-all duration-300">
        
        {/* Brand Icon & Label */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex items-center justify-center w-14 h-14">
            <img src="/logo.png" alt="CivicVoice" className="w-full h-full object-contain" />
          </div>
          <h1 className="font-display font-black text-2xl tracking-tight bg-gradient-to-r from-blue-600 to-twitter-blue bg-clip-text text-transparent">
            BirdView
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium max-w-xs leading-relaxed">
            Organically connecting active residents with local municipal ward councillors.
          </p>
        </div>

        {/* Tab switch for Login / Signup */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-6 border border-slate-200/50">
          <button
            type="button"
            onClick={() => setIsLoginMode(true)}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all duration-200 flex items-center justify-center gap-1.5 ${
              isLoginMode ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => setIsLoginMode(false)}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all duration-200 flex items-center justify-center gap-1.5 ${
              !isLoginMode ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Action Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Username Input */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Username Handle
            </label>
            <input
              id="auth-username"
              type="text"
              placeholder="e.g. active_citizen_india"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-twitter-blue font-medium text-slate-700"
            />
          </div>

          {/* Password Input (Simulated) */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Security Password
            </label>
            <input
              id="auth-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-twitter-blue font-medium text-slate-700"
            />
          </div>

          {/* Extended fields for Sign Up Mode */}
          {!isLoginMode && (
            <div className="flex flex-col gap-4 animate-fade-in border-t border-slate-100 pt-3 mt-1">
              {/* Display Name */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Full Display Name
                </label>
                <input
                  id="auth-fullname"
                  type="text"
                  placeholder="e.g. Aarav Patel"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-twitter-blue font-medium text-slate-700"
                />
              </div>

              {/* Persona Role Selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  I am registering as:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("citizen")}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                      role === "citizen"
                        ? "bg-blue-50/70 border-twitter-blue text-twitter-blue"
                        : "border-slate-100 bg-slate-50/50 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-base">🏡</span>
                    <span>Local Resident</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("official")}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                      role === "official"
                        ? "bg-amber-50/70 border-amber-500 text-amber-700"
                        : "border-slate-100 bg-slate-50/50 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-base">💼</span>
                    <span>Ward Councillor</span>
                  </button>
                </div>
              </div>

              {/* City Selection */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  City
                </label>
                <select
                  id="auth-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value as City)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-twitter-blue font-semibold text-slate-700"
                >
                  <option value="Mumbai">Mumbai</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Kolkata">Kolkata</option>
                  <option value="Chennai">Chennai</option>
                </select>
              </div>

              {/* Ward Input */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Ward Block Name
                </label>
                <input
                  id="auth-ward"
                  type="text"
                  placeholder="e.g. Ward 12 (Andheri West)"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-twitter-blue font-medium text-slate-700"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            id="auth-submit-btn"
            type="submit"
            className="w-full py-3 bg-twitter-blue hover:bg-twitter-hover text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-100 transition duration-150 flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            <span>{isLoginMode ? "Enter Workspace" : "Register Credentials"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Accounts Helper to bypass tedious typing */}
        <div className="mt-6 border-t border-slate-100 pt-5">
          <div className="flex items-center gap-1.5 text-slate-400 font-extrabold text-[10px] uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>Interactive Demo Shortcuts</span>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin("resident")}
              className="w-full p-2.5 rounded-xl border border-slate-100 hover:border-blue-200 bg-slate-50/50 hover:bg-blue-50/20 text-left transition duration-150 flex items-center gap-2.5"
            >
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80"
                alt="Aarav avatar"
                className="w-7 h-7 rounded-full object-cover border border-white shrink-0 shadow-sm"
              />
              <div className="flex flex-col leading-none">
                <span className="text-xs font-bold text-slate-700">Resident: Aarav Patel</span>
                <span className="text-[9.5px] text-slate-400 mt-0.5">Mumbai Ward 12 · 180 rep points</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin("official")}
              className="w-full p-2.5 rounded-xl border border-slate-100 hover:border-amber-200 bg-slate-50/50 hover:bg-amber-50/20 text-left transition duration-150 flex items-center gap-2.5"
            >
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80"
                alt="Councillor avatar"
                className="w-7 h-7 rounded-full object-cover border border-white shrink-0 shadow-sm"
              />
              <div className="flex flex-col leading-none">
                <span className="text-xs font-bold text-slate-700">Councillor: Sandeep Hegde</span>
                <span className="text-[9.5px] text-slate-400 mt-0.5">Bengaluru Ward 54 · 1200 rep points</span>
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
