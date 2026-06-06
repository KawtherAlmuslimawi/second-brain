import type { Bookmark } from "../types/bookmark";

const STORAGE_KEY = "second-brain-bookmarks";

export function getBookmarks(): Bookmark[] {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    return [];
  }

  return JSON.parse(data);
}

export function saveBookmark(bookmark: Bookmark) {
  const bookmarks = getBookmarks();

  bookmarks.unshift(bookmark);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(bookmarks)
  );
  const exists = bookmarks.some(
  b => b.url === bookmark.url
  );

  if (exists) {
  return;
  }
}

export function deleteBookmark(id: string) {
  const bookmarks = getBookmarks().filter(
    (bookmark) => bookmark.id !== id
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(bookmarks)
  );
}