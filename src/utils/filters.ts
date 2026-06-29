import { FeedItem, City } from "../types";

export function filterFeedItems(
  items: FeedItem[],
  opts: {
    city: City;
    ward: string;
    feedFilter: string;
    categoryFilter: string;
    statusFilter: string;
    searchQuery: string;
  }
): FeedItem[] {
  const { city, ward, feedFilter, categoryFilter, statusFilter, searchQuery } = opts;

  return items.filter((item) => {
    if (item.city !== city) return false;
    if (ward !== "All Wards" && item.ward !== ward) return false;
    if (feedFilter !== "all" && item.type !== feedFilter) return false;

    if (categoryFilter !== "all" && (feedFilter === "all" || feedFilter === "report" || feedFilter === "poll")) {
      if (item.category !== categoryFilter) return false;
    }

    if (statusFilter !== "all" && (feedFilter === "all" || feedFilter === "report")) {
      if (item.type !== "report" || item.status !== statusFilter) return false;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        (item.content || "").toLowerCase().includes(q) ||
        (item.title || "").toLowerCase().includes(q) ||
        (item.pollQuestion || "").toLowerCase().includes(q) ||
        item.author.displayName.toLowerCase().includes(q) ||
        item.author.username.toLowerCase().includes(q)
      );
    }

    return true;
  });
}
