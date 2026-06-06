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
  if (
  !currentTab?.url ||
  currentTab.url.startsWith("chrome://")
) {
  alert("This page cannot be saved.");
  return;
}
  const [{ result }] = await chrome.scripting.executeScript({
  target: { tabId: currentTab.id! },
  func: () => document.body.innerText,
  });

  const content = result ?? "";

  if (!currentTab?.url) {
    return;
  }

  const bookmark: Bookmark = {
  id: crypto.randomUUID(),
  title: currentTab.title || "Untitled",
  url: currentTab.url,
  favicon: currentTab.favIconUrl,
  content,
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
      .includes(search.toLowerCase()) ||
    bookmark.content
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
        Save Page
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

              <a
               href={bookmark.url}
               target="_blank"
               rel="noreferrer"
               
              >
               {bookmark.url}
              </a>
              <div
              style={{
              fontSize: "12px",
              opacity: 0.7,
              marginTop: "4px"
            }}
            >
            {bookmark.content
            ? bookmark.content.slice(0, 120)
            : "No content extracted"}...
            </div>

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