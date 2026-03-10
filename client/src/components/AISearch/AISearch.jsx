import { useState } from "react";
import { Loader } from "lucide-react";
import { aiSearch } from "../../utils/api";

export default function AISearch({ onResults }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const { data } = await aiSearch(query);
      onResults(data.products);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .ai-search-wrap {
          position: relative;
          max-width: 620px;
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
        }
        .ai-search-box {
          display: flex;
          align-items: center;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,107,0,0.25);
          border-radius: 100px;
          padding: 0.35rem 0.35rem 0.35rem 1.2rem;
          gap: 0.6rem;
          transition: all 0.3s;
          box-sizing: border-box;
          width: 100%;
        }
        .ai-search-box:focus-within {
          border-color: rgba(255,215,0,0.6);
          box-shadow: 0 0 0 3px rgba(255,215,0,0.1);
        }
        .ai-search-input {
          flex: 1;
          min-width: 0;
          background: transparent;
          border: none;
          outline: none;
          color: #FFF5E6;
          font-family: 'Outfit', sans-serif;
          font-size: 0.9rem;
          -webkit-font-smoothing: antialiased;
        }
        .ai-search-input::placeholder {
          color: rgba(255,245,230,0.35);
        }
        .ai-search-btn {
          flex-shrink: 0;
          background: linear-gradient(135deg, #FF6B00, #FF3D00);
          border: none;
          border-radius: 100px;
          padding: 0.65rem 1.4rem;
          color: white;
          font-family: 'Outfit', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          white-space: nowrap;
          transition: transform .15s, opacity .15s;
        }
        .ai-search-btn:hover   { transform: scale(1.04); }
        .ai-search-btn:active  { transform: scale(0.97); }
        .ai-search-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }

        @media (max-width: 560px) {
          .ai-search-box   { padding: 0.6rem 0.6rem 0.6rem 1rem; }
          .ai-search-input { font-size: 0.82rem; }
          .ai-search-btn   { padding: 0.45rem 0.9rem; font-size: 0.78rem; }
        }
        @media (max-width: 380px) {
          .ai-search-input { font-size: 0.75rem; }
          .ai-search-btn   { padding: 0.55rem 0.8rem; font-size: 0.72rem; }
        }
      `}</style>

      <div className="ai-search-wrap">
        <div className="ai-search-box">
          <input
            className="ai-search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder='Try: "safe crackers for kids"'
          />
          <button
            className="ai-search-btn"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading
              ? <><Loader size={13} className="spin" /> Searching...</>
              : "Search"
            }
          </button>
        </div>
      </div>
    </>
  );
}
