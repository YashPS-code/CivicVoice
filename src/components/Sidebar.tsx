import React, { useState } from "react";
import {
  Home,
  Building2,
  User as UserIcon,
  Plus,
  ShieldCheck,
  TrendingUp,
  Users,
  LogOut,
  Settings,
  X,
  ChevronDown
} from "lucide-react";
import { User, Role } from "../types";

interface SidebarProps {
  currentUser: User;
  onSwitchPersona: (role: Role) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenReportModal: () => void;
  onOpenVerifyModal: () => void;
  onLogout: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({
  currentUser,
  onSwitchPersona,
  activeTab,
  setActiveTab,
  onOpenReportModal,
  onOpenVerifyModal,
  onLogout,
  isMobileOpen = false,
  onCloseMobile,
}: SidebarProps) {
  const isOfficial = currentUser.role === "official";

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navItems = [
    { id: "feed", label: "Feed", icon: Home },
    { id: "trending", label: "Trending", icon: TrendingUp },
    { id: "directory", label: "Residents", icon: Users },
    { id: "official", label: "Official Desk", icon: Building2 },
    { id: "preferences", label: "Preferences", icon: Settings },
    { id: "profile", label: "My Profile", icon: UserIcon },
  ];

  return (
    <aside
      id="sidebar-container"
      className={`flex flex-col h-screen fixed md:sticky top-0 left-0 z-50 justify-between p-4 md:p-6 border-r border-slate-100 bg-white select-none w-64 md:w-64 lg:w-72 transition-transform duration-300 ${
        isMobileOpen
          ? "translate-x-0"
          : "-translate-x-full md:translate-x-0"
      }`}
    >
      {/* Top Section */}
      <div className="flex flex-col gap-6">
        {/* Logo */}
        <div className="relative flex items-center justify-center w-full">
          {/* Logo + Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 overflow-hidden p-1">
              <img
                src="/logo.png"
                alt="BirdView logo"
                className="w-full h-full object-contain"
              />
            </div>

            <span className="font-sans font-bold text-xl tracking-tight bg-gradient-to-r from-blue-600 to-twitter-blue bg-clip-text text-transparent">
              BirdView
            </span>
          </div>

          {/* Close Button */}
          <button
            onClick={onCloseMobile}
            className="absolute right-0 flex md:hidden items-center justify-center p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            title="Close Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  onCloseMobile?.();
                }}
                className={`flex items-center gap-4 p-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 text-twitter-blue font-bold"
                    : "text-slate-600 hover:cursor-pointer hover:text-slate-100"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive
                      ? "text-twitter-blue stroke-[2.5]"
                      : "text-slate-500"
                  }`}
                />

                <span className="text-[15px]">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Post Button */}
        <button
          id="btn-sidebar-report-issue"
          onClick={() => {
            onOpenReportModal();
            onCloseMobile?.();
          }}
          className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-twitter-blue text-white font-semibold hover:bg-twitter-hover transition-all duration-200 active:scale-95 mt-2"
        >
          <span className="text-sm">Post</span>
        </button>
      </div>

      {/* User Info Footer */}
      <div className="flex flex-col gap-4 border-t border-slate-100 pt-4">
        <div className="flex flex-col gap-2">
          {/* User Row */}
          <div className="flex items-center justify-between">
            {/* Left: Avatar & User Info */}
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="relative shrink-0">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.displayName}
                  className="w-10 h-10 rounded-full object-cover border border-slate-100"
                />

                {currentUser.isVerified && (
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-white">
                    <ShieldCheck className="w-3 h-3" />
                  </span>
                )}
              </div>

              <div className="hidden md:flex flex-col overflow-hidden">
                <span className="font-bold text-sm text-slate-800 truncate">
                  {currentUser.displayName}
                </span>

                <span className="text-xs text-slate-400 truncate">
                  @{currentUser.username}
                </span>
              </div>
            </div>

            {/* Right: Dropdown Button */}
<div className="relative flex items-center">
  <button
  onClick={() => setShowProfileMenu(!showProfileMenu)}
  className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-slate-100 transition"
>
  <ChevronDown
    className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${
      showProfileMenu ? "rotate-180" : ""
    }`}
  />
</button>

  {showProfileMenu && (
    <div className="absolute bottom-12 right-0 w-44 rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden z-50">
      <button
        onClick={onOpenVerifyModal}
        className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-slate-50"
      >
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        Verify Account
      </button>

      <button
        onClick={onLogout}
        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50"
      >
        <LogOut className="w-4 h-4" />
        Log Out
      </button>
    </div>
  )}
</div>
          </div>
        </div>
      </div>
    </aside>
  );
}