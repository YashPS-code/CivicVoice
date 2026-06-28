import React, { useState } from "react";
import {
  Home,
  Building2,
  User as UserIcon,
  Users,
  Settings,
  LogOut,
  ShieldCheck,
  MessageSquare,
  ChevronDown,
  X,
  Plus,
  BarChart2,
} from "lucide-react";
import { User, Role } from "../../types";

interface SidebarProps {
  currentUser: User;
  onSwitchPersona: (role: Role) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenPostModal: () => void;
  onOpenVerifyModal: () => void;
  onLogout: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const NAV_ITEMS = [
  { id: "feed",        label: "Feed",           icon: Home         },
  { id: "forums",      label: "Forums",         icon: MessageSquare },
  { id: "dashboard",   label: "Dashboard",      icon: BarChart2    },
  { id: "directory",   label: "Residents",      icon: Users        },
  { id: "official",    label: "Official Desk",  icon: Building2    },
  { id: "preferences", label: "Preferences",    icon: Settings     },
  { id: "profile",     label: "My Profile",     icon: UserIcon     },
];

export default function Sidebar({
  currentUser,
  onSwitchPersona,
  activeTab,
  setActiveTab,
  onOpenPostModal,
  onOpenVerifyModal,
  onLogout,
  isMobileOpen = false,
  onCloseMobile,
}: SidebarProps) {
  const [showMenu, setShowMenu] = useState(false);

  const navigate = (id: string) => {
    setActiveTab(id);
    onCloseMobile?.();
  };

  return (
    <aside
      id="sidebar-container"
      className={`flex flex-col h-screen fixed md:sticky top-0 left-0 z-50 justify-between
        p-4 md:p-5 border-r border-slate-200 bg-white select-none
        w-64 md:w-64 lg:w-72 transition-transform duration-300
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
    >
      {/* ── Top ── */}
      <div className="flex flex-col gap-5">
        {/* Logo row */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-twitter-blue to-cyan-400 flex items-center justify-center shadow-sm overflow-hidden">
              <img src="/logo.png" alt="CivicVoice" className="w-full h-full object-contain" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-twitter-blue to-cyan-500 bg-clip-text text-transparent">
              CivicVoice
            </span>
          </div>
          <button
            onClick={onCloseMobile}
            className="flex md:hidden items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => navigate(id)}
                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-medium transition-all duration-150 text-left ${
                  active
                    ? "bg-twitter-light text-twitter-blue font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 ${active ? "text-twitter-blue stroke-[2.5]" : "text-slate-400"}`}
                />
                <span className="text-[14px]">{label}</span>
                {(id === "forums" || id === "dashboard") && (
                  <span className="ml-auto text-[9px] font-extrabold bg-twitter-blue text-white px-1.5 py-0.5 rounded-full">
                    NEW
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Post CTA */}
        <button
          onClick={() => { onOpenPostModal(); onCloseMobile?.(); }}
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl
            bg-twitter-blue hover:bg-twitter-hover text-white font-semibold text-sm
            transition-all duration-200 active:scale-95 shadow-sm shadow-twitter-blue/30"
        >
          <Plus className="w-4 h-4" />
          Post
        </button>
      </div>

      {/* ── User footer ── */}
      <div className="border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="relative shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.displayName}
                className="w-9 h-9 rounded-full object-cover border-2 border-twitter-light"
              />
              {currentUser.isVerified && (
                <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-twitter-blue text-white ring-2 ring-white">
                  <ShieldCheck className="w-2.5 h-2.5" />
                </span>
              )}
            </div>
            <div className="hidden md:flex flex-col overflow-hidden">
              <span className="font-semibold text-sm text-slate-800 truncate leading-tight">
                {currentUser.displayName}
              </span>
              <span className="text-[11px] text-slate-400 truncate">@{currentUser.username}</span>
            </div>
          </div>

          {/* Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-50 transition"
            >
              <ChevronDown className={`w-4.5 h-4.5 text-slate-400 transition-transform duration-200 ${showMenu ? "rotate-180" : ""}`} />
            </button>

            {showMenu && (
              <div className="absolute bottom-10 right-0 w-48 rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden z-50">
                {currentUser.role !== "official" && (
                  <button
                    onClick={() => { onSwitchPersona("official"); setShowMenu(false); }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
                  >
                    <Building2 className="w-4 h-4 text-amber-500" />
                    Switch to Official
                  </button>
                )}
                {currentUser.role === "official" && (
                  <button
                    onClick={() => { onSwitchPersona("citizen"); setShowMenu(false); }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
                  >
                    <UserIcon className="w-4 h-4 text-twitter-blue" />
                    Switch to Resident
                  </button>
                )}
                <button
                  onClick={() => { onOpenVerifyModal(); setShowMenu(false); }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Verify Account
                </button>
                <div className="border-t border-slate-100" />
                <button
                  onClick={() => { onLogout(); setShowMenu(false); }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Civic points mini badge */}
        <div className="mt-3 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-twitter-light border border-twitter-blue/20">
          <span className="text-twitter-blue text-lg">⚡</span>
          <div className="flex flex-col leading-none">
            <span className="text-[11px] font-extrabold text-twitter-blue">{currentUser.civicPoints} pts</span>
            <span className="text-[10px] text-slate-500">Civic Score</span>
          </div>
          {currentUser.isVerified && (
            <span className="ml-auto text-[9px] font-extrabold bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">
              VERIFIED
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}
