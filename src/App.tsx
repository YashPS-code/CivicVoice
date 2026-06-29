import React, { useState } from "react";
import { CheckCircle2, Clock, ShieldAlert, Menu } from "lucide-react";

import Sidebar from "./components/sidebar/Sidebar";
import Widgets from "./components/widgets/Widgets";
import HomeFeed from "./components/feed/HomeFeed";
import Directory from "./components/directory/Directory";
import OfficialDesk from "./components/official/OfficialDesk";
import ProfileTab from "./components/profile/ProfileTab";
import ForumsPage from "./components/forums/ForumsPage";
import DashboardPage from "./components/dashboard/DashboardPage";
import CommentDrawer from "./components/shared/CommentDrawer";
import PollStatsDrawer from "./components/shared/PollStatsDrawer";
import VerifyModal from "./components/shared/VerifyModal";
import LoginSignup from "./components/shared/LoginSignup";
import Preferences from "./components/shared/Preferences";
import PostModal from "./components/shared/PostModal";

import {
  MOCK_USER,
  MOCK_CITIZENS,
  MOCK_COUNCILLORS,
  TRENDING_TOPICS,
  MOCK_REPORTS_COMMENTS,
  MOCK_POLL_COMMENTS,
  INITIAL_FEED_ITEMS,
} from "./mockData";
import { MOCK_FORUMS } from "./data/forums";
import { FeedItem, Comment, User, Role, City, Status, Severity } from "./types";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  React.useEffect(() => {
    const theme = localStorage.getItem("civic-theme") || "light";
    const density = localStorage.getItem("civic-density") || "comfortable";
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("density-compact", density === "compact");
  }, []);

  const [activeTab, setActiveTab] = useState("feed");
  const [selectedCity, setSelectedCity] = useState<City>("Mumbai");
  const [selectedWard, setSelectedWard] = useState("All Wards");
  const [searchQuery, setSearchQuery] = useState("");
  const [feedFilter, setFeedFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [currentUser, setCurrentUser] = useState<User>({
    ...MOCK_USER,
    following: [],
    followersCount: 142,
    followingCount: 56,
    bio: "Civic-minded resident. Passionate about local infrastructure, public parks, and ward greening initiatives.",
  });

  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [citizens, setCitizens] = useState<User[]>(
    MOCK_CITIZENS.map((c) => ({
      ...c,
      following: [],
      followersCount: Math.floor(Math.random() * 80) + 12,
      followingCount: Math.floor(Math.random() * 50) + 10,
      bio: c.role === "citizen"
        ? `Resident of ${c.ward}. Committed to a clean, transparent community.`
        : `Verified Official for ${c.ward}.`,
    }))
  );

  const [commentsMap, setCommentsMap] = useState<{ [key: string]: Comment[] }>({});

  const [selectedItem, setSelectedItem] = useState<FeedItem | null>(null);
  const [showDemographics, setShowDemographics] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [directorySearch, setDirectorySearch] = useState("");
  const [alertMsg, setAlertMsg] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  // Fetch feed items on load
  React.useEffect(() => {
    fetch("/api/feed")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFeedItems(data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch feed items:", err);
      });
  }, []);

  // Fetch comments when selected item changes
  React.useEffect(() => {
    if (selectedItem) {
      fetch(`/api/feed/${selectedItem.id}/comments`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setCommentsMap((p) => ({ ...p, [selectedItem.id]: data }));
          }
        })
        .catch((err) => {
          console.error("Failed to fetch comments:", err);
        });
    }
  }, [selectedItem?.id]);

  const showAlert = (text: string, type: "success" | "error" | "info" = "info") => {
    setAlertMsg({ type, text });
    setTimeout(() => setAlertMsg(null), 4500);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setSelectedCity(user.city);
    setSelectedWard("All Wards");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab("feed");
    showAlert("Logged out successfully.", "info");
  };

  const handleSwitchPersona = (role: Role) => {
    if (role === "official") {
      const c = MOCK_COUNCILLORS.find((c) => c.city === selectedCity) || MOCK_COUNCILLORS[0];
      setCurrentUser({ ...c, following: [], followersCount: 520, followingCount: 89, bio: "Elected Ward Councillor on BirdView." });
      showAlert(`Switched to Official view as ${c.displayName}`, "success");
    } else {
      const c = MOCK_CITIZENS.find((c) => c.city === selectedCity) || MOCK_CITIZENS[0];
      setCurrentUser({ ...c, following: [], followersCount: 142, followingCount: 56, bio: `Resident of ${c.ward}.` });
      showAlert(`Switched to Resident view as ${c.displayName}`, "success");
    }
  };

  const handleFollowUser = (userId: string) => {
    const isFollowing = currentUser.following?.includes(userId);
    const updated = isFollowing
      ? (currentUser.following || []).filter((id) => id !== userId)
      : [...(currentUser.following || []), userId];
    setCurrentUser((p) => ({ ...p, following: updated, followingCount: updated.length }));
    setCitizens((prev) => prev.map((c) => c.id === userId
      ? { ...c, followersCount: (c.followersCount || 0) + (isFollowing ? -1 : 1) }
      : c));
    showAlert(isFollowing ? "Unfollowed." : "Following user!", isFollowing ? "info" : "success");
  };

  const handleLikeFeedItem = async (itemId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    // Optimistic update
    setFeedItems((prev) => prev.map((item) => {
      if (item.id !== itemId) return item;
      const hasLiked = item.upvotedBy.includes(currentUser.id);
      const w = item.type === "report" && currentUser.isVerified ? 2 : 1;
      const newUpvotedBy = hasLiked
        ? item.upvotedBy.filter((id) => id !== currentUser.id)
        : [...item.upvotedBy, currentUser.id];
      const updated = { ...item, upvotes: Math.max(0, item.upvotes + (hasLiked ? -w : w)), upvotedBy: newUpvotedBy };
      if (selectedItem?.id === itemId) setSelectedItem(updated);
      return updated;
    }));

    try {
      const res = await fetch(`/api/feed/${itemId}/upvote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id, isVerified: currentUser.isVerified }),
      });
      const updatedItem = await res.json();
      setFeedItems((prev) => prev.map((item) => item.id === itemId ? updatedItem : item));
      if (selectedItem?.id === itemId) setSelectedItem(updatedItem);
    } catch (err) {
      console.error("Failed to upvote item on backend:", err);
    }
  };

  const handleAddComment = async (text: string): Promise<boolean> => {
    if (!selectedItem) return false;
    try {
      const res = await fetch(`/api/feed/${selectedItem.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author: currentUser, text }),
      });
      const data = await res.json();
      if (data.isFlagged) {
        showAlert("Comment flagged by AI moderation.", "error");
      } else {
        showAlert("Comment published!", "success");
      }
      
      const newComment = data.comment;
      const updatedItem = data.updatedItem;
      
      setCommentsMap((p) => ({
        ...p,
        [selectedItem.id]: [newComment, ...(p[selectedItem.id] || [])]
      }));
      setFeedItems((p) => p.map((item) => item.id === selectedItem.id ? updatedItem : item));
      setSelectedItem(updatedItem);
      return true;
    } catch (err) {
      console.error("Failed to add comment:", err);
      showAlert("Failed to post comment.", "error");
      return false;
    }
  };

  const handleAIDraftOfficialResponse = async (): Promise<string | null> => {
    if (!selectedItem) return null;
    try {
      const res = await fetch("/api/gemini/councillor-response", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: selectedItem.title, description: selectedItem.content, category: selectedItem.category, city: selectedItem.city, ward: selectedItem.ward, officialName: currentUser.displayName }),
      });
      const data = await res.json();
      showAlert("AI drafted a response!", "success");
      return data.text || null;
    } catch {
      showAlert("AI draft unavailable.", "error");
      return null;
    }
  };

  const handleSubmitOfficialResponse = async (text: string) => {
    if (!selectedItem) return;
    try {
      const res = await fetch(`/api/feed/${selectedItem.id}/official-response`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responder: currentUser, text }),
      });
      const updatedItem = await res.json();
      setFeedItems((p) => p.map((item) => item.id === selectedItem.id ? updatedItem : item));
      setSelectedItem(updatedItem);
      showAlert("Official response posted!", "success");
    } catch (err) {
      console.error("Failed to post official response:", err);
    }
  };

  const handleVotePoll = async (pollId: string, optionId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const item = feedItems.find((itm) => itm.id === pollId);
    if (item && (item.pollVotedBy || {})[currentUser.id]) {
      showAlert("Already voted.", "error");
      return;
    }

    try {
      const res = await fetch(`/api/feed/${pollId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id, optionId }),
      });
      const updatedItem = await res.json();
      setFeedItems((p) => p.map((itm) => itm.id === pollId ? updatedItem : itm));
      if (selectedItem?.id === pollId) setSelectedItem(updatedItem);
      showAlert("Vote registered!", "success");
    } catch (err) {
      console.error("Failed to register vote:", err);
    }
  };

  const handleVerifyReport = async (itemId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      const res = await fetch(`/api/feed/${itemId}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id }),
      });
      const updatedItem = await res.json();
      setFeedItems((prev) => prev.map((item) => item.id === itemId ? updatedItem : item));
      if (selectedItem?.id === itemId) setSelectedItem(updatedItem);
      showAlert("Verification recorded! +10 Civic Points", "success");
      setCurrentUser(p => ({ ...p, civicPoints: p.civicPoints + 10 }));
    } catch (err) {
      console.error("Failed to verify report:", err);
    }
  };

  const handlePublishFeedItem = async (payload: {
    type: "post" | "report" | "poll"; content: string; image?: string;
    title?: string; category?: any; severity?: Severity;
    locationName?: string; latitude?: number; longitude?: number;
    pollQuestion?: string; pollOptions?: string[];
  }) => {
    try {
      const res = await fetch("/api/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          author: currentUser,
          city: selectedCity,
          ward: selectedWard === "All Wards" ? currentUser.ward : selectedWard,
        }),
      });
      const newItem = await res.json();
      setFeedItems((prev) => [newItem, ...prev]);
      const pts = payload.type === "report" ? 25 : 10;
      setCurrentUser((p) => ({ ...p, civicPoints: p.civicPoints + pts }));
      showAlert(payload.type === "report" ? `Grievance filed! +${pts} Civic Points` : "Post published!", "success");
    } catch (err) {
      console.error("Failed to publish item:", err);
      showAlert("Failed to publish post.", "error");
    }
  };

  const handleUpdateStatus = async (itemId: string, status: Status) => {
    try {
      const res = await fetch(`/api/feed/${itemId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const updatedItem = await res.json();
      setFeedItems((p) => p.map((item) => item.id === itemId ? updatedItem : item));
      if (selectedItem?.id === itemId) setSelectedItem(updatedItem);
      showAlert(`Status → ${status.replace("_", " ")}`, "success");
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleVerifySuccess = () => {
    setCurrentUser((p) => ({ ...p, isVerified: true, badgeType: "verified_resident", civicPoints: p.civicPoints + 100 }));
    showAlert("Verified! Resident Badge unlocked — 2× vote power active.", "success");
  };

  const MAIN_HEADER_TITLES: Record<string, string> = {
    feed:        "Feed",
    forums:      "Forums",
    dashboard:   "Impact Dashboard",
    directory:   "Residents",
    official:    "Official Desk",
    preferences: "Preferences",
    profile:     "My Profile",
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-white text-slate-800 antialiased">
        <Alert msg={alertMsg} />
        <LoginSignup onLoginSuccess={handleLoginSuccess} showAlert={showAlert} />
      </div>
    );
  }

  return (
    <div className="flex bg-[#f0fdff] min-h-screen text-slate-800 antialiased selection:bg-twitter-light selection:text-twitter-blue">
      <Alert msg={alertMsg} />

      <div className="flex w-full relative">
        {/* Mobile backdrop */}
        {isMobileSidebarOpen && (
          <div
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          />
        )}

        {/* LEFT: Sidebar */}
        <Sidebar
          currentUser={currentUser}
          onSwitchPersona={handleSwitchPersona}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenPostModal={() => setIsPostModalOpen(true)}
          onOpenVerifyModal={() => setIsVerifyModalOpen(true)}
          onLogout={handleLogout}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* CENTRE: Main content */}
        <main
          id="main-content"
          className="flex-1 min-h-screen border-x border-slate-200 bg-white w-full flex flex-col overflow-x-hidden"
        >
          {/* Header */}
          <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-200 px-5 py-3.5 flex items-center gap-3 z-20">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-50 transition"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-display font-black text-xl text-slate-900 tracking-tight">
              {MAIN_HEADER_TITLES[activeTab] || "BirdView"}
            </h1>
            {activeTab === "feed" && (
              <span className="ml-auto text-[10px] font-bold text-twitter-blue bg-twitter-light px-2 py-0.5 rounded-full border border-twitter-blue/20">
                {selectedWard === "All Wards" ? selectedCity : selectedWard}
              </span>
            )}
          </header>

          <div className="flex-1 overflow-y-auto">
            {activeTab === "feed" && (
              <HomeFeed
                currentUser={currentUser}
                selectedCity={selectedCity}
                selectedWard={selectedWard}
                feedItems={feedItems}
                feedFilter={feedFilter}
                setFeedFilter={setFeedFilter}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onLikeItem={handleLikeFeedItem}
                onVotePoll={handleVotePoll}
                onSelectItem={setSelectedItem}
                onShowStats={(item) => { setSelectedItem(item); setShowDemographics(true); }}
                onVerifyReport={handleVerifyReport}
                showAlert={showAlert}
              />
            )}

            {activeTab === "forums" && (
              <ForumsPage selectedCity={selectedCity} />
            )}

            {activeTab === "dashboard" && (
              <DashboardPage selectedCity={selectedCity} currentUserId={currentUser.id} />
            )}

            {activeTab === "directory" && (
              <Directory
                currentUser={currentUser}
                citizens={citizens}
                directorySearch={directorySearch}
                setDirectorySearch={setDirectorySearch}
                onFollowUser={handleFollowUser}
              />
            )}

            {activeTab === "official" && (
              <OfficialDesk
                currentUser={currentUser}
                selectedCity={selectedCity}
                feedItems={feedItems}
                onUpdateStatus={handleUpdateStatus}
                onSelectItem={setSelectedItem}
              />
            )}

            {activeTab === "profile" && (
              <ProfileTab
                currentUser={currentUser}
                feedItems={feedItems}
                onOpenVerifyModal={() => setIsVerifyModalOpen(true)}
                onSelectItem={setSelectedItem}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === "preferences" && (
              <Preferences showAlert={showAlert} />
            )}
          </div>
        </main>

        {/* RIGHT: Widgets */}
        <Widgets
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          selectedWard={selectedWard}
          setSelectedWard={setSelectedWard}
          trendingTopics={TRENDING_TOPICS}
          forums={MOCK_FORUMS}
          currentUser={currentUser}
          onOpenVerifyModal={() => setIsVerifyModalOpen(true)}
          onSelectTag={(tag) => { setSearchQuery(tag); setActiveTab("feed"); }}
          isCurrentUserVerified={currentUser.isVerified}
          searchQuery={searchQuery}
          onSearch={(q) => { setSearchQuery(q); setActiveTab("feed"); }}
          onOpenForums={() => setActiveTab("forums")}
          onOpenDashboard={() => setActiveTab("dashboard")}
          onOpenProfile={() => setActiveTab("profile")}
        />
      </div>

      {/* Post modal overlay */}
      {isPostModalOpen && (
        <PostModal
          currentUser={currentUser}
          selectedCity={selectedCity}
          selectedWard={selectedWard}
          onClose={() => setIsPostModalOpen(false)}
          onPublish={handlePublishFeedItem}
          showAlert={showAlert}
        />
      )}

      {/* Comment drawer */}
      {selectedItem && !showDemographics && (
        <CommentDrawer
          currentUser={currentUser}
          selectedItem={selectedItem}
          comments={commentsMap[selectedItem.id] || []}
          onClose={() => setSelectedItem(null)}
          onLikeItem={() => handleLikeFeedItem(selectedItem.id)}
          onAddComment={handleAddComment}
          onDraftOfficialResponse={handleAIDraftOfficialResponse}
          onSubmitOfficialResponse={handleSubmitOfficialResponse}
        />
      )}

      {/* Poll stats drawer */}
      {selectedItem && showDemographics && (
        <PollStatsDrawer
          selectedItem={selectedItem}
          onClose={() => { setSelectedItem(null); setShowDemographics(false); }}
        />
      )}

      {/* Verify modal */}
      {isVerifyModalOpen && (
        <VerifyModal
          onClose={() => setIsVerifyModalOpen(false)}
          onVerifySuccess={handleVerifySuccess}
          showAlert={showAlert}
        />
      )}
    </div>
  );
}

function Alert({ msg }: { msg: { type: string; text: string } | null }) {
  if (!msg) return null;
  const icons: Record<string, React.ReactNode> = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    error: <ShieldAlert className="w-4 h-4 text-red-500" />,
    info: <Clock className="w-4 h-4 text-twitter-blue" />,
  };
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 px-5 py-3 rounded-2xl shadow-xl border bg-white border-slate-100 text-xs font-semibold animate-fade-in whitespace-nowrap">
      {icons[msg.type]}
      <span className="text-slate-700">{msg.text}</span>
    </div>
  );
}
