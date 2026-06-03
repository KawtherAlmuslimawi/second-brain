export default function App() {
  return (
    <div style={{
      width: "350px",
      minHeight: "500px",
      background: "#111",
      color: "#fff",
      padding: "16px"
    }}>
      <h1>Second Brain</h1>

      <button>
        Save Current Page
      </button>

      <input
        placeholder="Search bookmarks..."
        style={{
          width: "100%",
          marginTop: "12px"
        }}
      />

      <div style={{ marginTop: "20px" }}>
        No bookmarks yet.
      </div>
    </div>
  );
}