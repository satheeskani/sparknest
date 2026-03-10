import { useState } from "react";
import { X, Send } from "lucide-react";
import { aiChat } from "../../utils/api";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "✨ Hey! I'm SparkBot! Ask me about crackers, safe options for kids, or Diwali combos! 🎆" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);
    try {
      const { data } = await aiChat(updated);
      setMessages([...updated, { role: "assistant", content: data.message }]);
    } catch {
      setMessages([...updated, { role: "assistant", content: "Sorry, I'm having trouble. Try again! 🔧" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button onClick={() => setOpen(!open)} style={{
        position: "fixed", bottom: "2rem", right: "2rem", zIndex: 500,
        width: 60, height: 60,
        background: "linear-gradient(135deg, #FF6B00, #FF3D00)",
        border: "none", borderRadius: "50%",
        fontSize: "1.5rem", cursor: "pointer",
        boxShadow: "0 8px 30px rgba(255,107,0,0.5)",
        animation: "pulse 2s ease-in-out infinite",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {open ? "✕" : "✨"}
      </button>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 8px 30px rgba(255,107,0,0.5); }
          50% { box-shadow: 0 8px 50px rgba(255,107,0,0.8), 0 0 0 8px rgba(255,107,0,0.1); }
        }
      `}</style>

      {/* Chat Window */}
      {open && (
        <div style={{
          position: "fixed", bottom: "6rem", right: "2rem", zIndex: 500,
          width: 320, background: "#1A0F00",
          border: "1px solid rgba(255,107,0,0.25)",
          borderRadius: 20, overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}>
          {/* Header */}
          <div style={{
            background: "rgba(255,107,0,0.1)",
            borderBottom: "1px solid rgba(255,107,0,0.15)",
            padding: "1rem 1.2rem",
            display: "flex", alignItems: "center", gap: "0.8rem",
          }}>
            <span style={{ fontSize: "1.3rem" }}>✨</span>
            <div>
              <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: "0.9rem", color: "#FFF5E6", fontWeight: 700 }}>SparkBot</div>
              <div style={{ fontSize: "0.7rem", color: "rgba(255,245,230,0.4)" }}>AI Cracker Assistant 🎆</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ padding: "1rem", maxHeight: 280, overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "85%", padding: "0.6rem 0.9rem",
                  borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: m.role === "user" ? "linear-gradient(135deg, #FF6B00, #FF3D00)" : "rgba(255,255,255,0.06)",
                  color: "#FFF5E6", fontSize: "0.85rem", lineHeight: 1.5,
                }}>{m.content}</div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ background: "rgba(255,255,255,0.06)", padding: "0.6rem 0.9rem", borderRadius: "16px 16px 16px 4px", fontSize: "0.85rem", color: "rgba(255,245,230,0.4)" }}>
                  SparkBot is typing...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{
            borderTop: "1px solid rgba(255,107,0,0.15)",
            padding: "0.8rem", display: "flex", gap: "0.5rem",
          }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about crackers..."
              style={{
                flex: 1, background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 10, padding: "0.5rem 0.8rem",
                color: "#FFF5E6", fontFamily: "'Outfit', sans-serif",
                fontSize: "0.85rem", outline: "none",
              }}
            />
            <button onClick={sendMessage} style={{
              background: "linear-gradient(135deg, #FF6B00, #FF3D00)",
              border: "none", borderRadius: 10,
              padding: "0.5rem 0.8rem", cursor: "pointer", color: "white",
            }}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}