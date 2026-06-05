import { useEffect, useState } from "react";
import type { Bookmark } from "./types/bookmark";
import {
  getBookmarks,
  saveBookmark,
  deleteBookmark,
} from "./storage/bookmarks";

export default function App() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [search, setSearch] = useState("");

  function loadBookmarks() {
    setBookmarks(getBookmarks());
  }

  useEffect(() => {
    loadBookmarks();
  }, []);

 async function handleAddBookmark() {
  const tabs = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  const currentTab = tabs[0];

  if (!currentTab?.url) {
    return;
  }

  const bookmark: Bookmark = {
    id: crypto.randomUUID(),
    title: currentTab.title || "Untitled",
    url: currentTab.url,
    favicon: currentTab.favIconUrl,
    createdAt: Date.now(),
  };

  saveBookmark(bookmark);
  loadBookmarks();
 }
  function handleDelete(id: string) {
    deleteBookmark(id);
    loadBookmarks();
  }

  const filteredBookmarks = bookmarks.filter(
    (bookmark) =>
      bookmark.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      bookmark.url
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        width: "350px",
        minHeight: "500px",
        background: "#111",
        color: "#fff",
        padding: "16px",
      }}
    >
      <h1>Second Brain</h1>

      <button onClick={handleAddBookmark}>
        Add Test Bookmark
      </button>

      <input
        id="search"
        name="search"
        placeholder="Search bookmarks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          marginTop: "12px",
          padding: "8px",
        }}
      />

      <div style={{ marginTop: "20px" }}>
        {filteredBookmarks.length === 0 ? (
          <p>No bookmarks found.</p>
        ) : (
          filteredBookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              style={{
                border: "1px solid #333",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "8px",
              }}
            >
              <strong>{bookmark.title}</strong>

              <div>{bookmark.url}</div>

              <button
                onClick={() =>
                  handleDelete(bookmark.id)
                }
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}