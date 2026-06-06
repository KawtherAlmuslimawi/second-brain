export async function getPageContent(tabId: number) {
  const response = await chrome.tabs.sendMessage(
    tabId,
    {
      type: "GET_PAGE_CONTENT"
    }
  );

  return response?.content || "";
}