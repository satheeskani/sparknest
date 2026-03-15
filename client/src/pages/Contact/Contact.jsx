import { useState } from "react";
import { MapPin, Phone, Mail, MessageCircle, Clock, Send, CheckCircle2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const ADMIN_WHATSAPP = "6385812382";
const ADMIN_EMAIL    = "sparknest.help@gmail.com";
const ADMIN_PHONE    = "+91 63858 12382";
const ADDRESS        = "Sivakasi, Tamil Nadu — 626 123, India";

const FAQS = [
  { q: "Do you deliver all over India?", a: "Yes! We ship pan-India. Orders above ₹999 get FREE delivery. Standard delivery takes 2–5 working days." },
  { q: "How do I pay?", a: "We accept UPI (GPay, PhonePe, Paytm) and Bank Transfer. After confirming your order, send the payment screenshot on WhatsApp to confirm." },
  { q: "Are your products certified?", a: "Absolutely. All products are sourced directly from licensed manufacturers in Sivakasi and comply with Petroleum & Explosives Safety Organisation (PESO) norms." },
  { q: "Can I return or exchange?", a: "Due to the nature of the product (fireworks), we don't accept returns. However, if you receive a damaged or wrong item, contact us within 24 hours and we'll make it right." },
  { q: "How quickly will I hear back?", a: "WhatsApp messages are answered within 1–2 hours during business hours (9 AM – 8 PM IST). Email replies may take up to 24 hours." },
];

export default function Contact() {
  const [form, setForm]       = useState({ name: "", phone: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.message) {
      toast.error("Please fill Name, Phone and Message"); return;
    }
    setSending(true);
    // Send via WhatsApp (opens in new tab) — replace with email API if preferred
    const msg = encodeURIComponent(
`*SparkNest — Contact Form*
━━━━━━━━━━━━━━━━━━━━━━
Name    : ${form.name}
Phone   : ${form.phone}${form.email ? `\nEmail   : ${form.email}` : ""}
Subject : ${form.subject || "General Enquiry"}
━━━━━━━━━━━━━━━━━━━━━━
${form.message}`
    );
    window.open(`https://wa.me/91${ADMIN_WHATSAPP}?text=${msg}`, "_blank");
    await new Promise(r => setTimeout(r, 800));
    setSent(true);
    setSending(false);
    toast.success("Message sent via WhatsApp!");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0D0600", fontFamily: "'Source Sans 3',sans-serif", paddingTop: 88 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Source+Sans+3:wght@300;400;600;700&display=swap');
        .ct-input {
          width:100%; padding:0.85rem 1rem;
          background:rgba(255,255,255,0.05);
          border:1.5px solid rgba(255,107,0,0.2);
          border-radius:12px; color:#FFF5E6;
          font-family:'Source Sans 3',sans-serif;
          font-size:1rem; font-weight:500;
          outline:none; transition:border .2s;
          box-sizing:border-box; resize:vertical;
        }
        .ct-input:focus { border-color:rgba(255,107,0,0.6); background:rgba(255,107,0,0.06); }
        .ct-label { font-size:0.72rem; color:rgba(255,245,230,0.6); font-weight:700; display:block; margin-bottom:0.45rem; text-transform:uppercase; letter-spacing:0.06em; }
        .faq-item { border-bottom:1px solid rgba(255,107,0,0.1); }
        .faq-btn  { width:100%; background:none; border:none; padding:1rem 0; cursor:pointer; display:flex; justify-content:space-between; align-items:center; text-align:left; gap:1rem; }
        @media(max-width:760px){ .ct-grid { grid-template-columns:1fr !important; } }
      `}</style>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "2rem 1rem 4rem" }}>

        {/* ── Hero ── */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p style={{ color: "#FF6B00", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.14em", margin: "0 0 0.6rem" }}>We're here for you</p>
          <h1 style={{ fontFamily: "'Libre Baskerville',serif", color: "#FFF5E6", fontSize: "clamp(2rem,5vw,3.2rem)", margin: "0 0 1rem", lineHeight: 1.15 }}>
            Contact <span style={{ color: "#FFD700" }}>SparkNest</span>
          </h1>
          <p style={{ color: "rgba(255,245,230,0.65)", fontSize: "1.05rem", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
            Questions about your order, bulk enquiries, or just want to say hello — we'd love to hear from you. Our team in Sivakasi replies fast.
          </p>
        </div>

        <div className="ct-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "2rem", alignItems: "start" }}>

          {/* ── LEFT: Info ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            {/* Quick Contact Cards */}
            {[
              { icon: <MessageCircle size={20} color="#25D366" />, label: "WhatsApp (Fastest)", value: ADMIN_PHONE, action: () => window.open(`https://wa.me/91${ADMIN_WHATSAPP}`, "_blank"), btn: "Chat Now", btnColor: "#25D366" },
              { icon: <Phone size={20} color="#FF6B00" />,         label: "Call Us",            value: ADMIN_PHONE, action: () => window.open(`tel:${ADMIN_PHONE}`),             btn: "Call",      btnColor: "#FF6B00" },
              { icon: <Mail size={20} color="#00BFFF" />,          label: "Email",              value: ADMIN_EMAIL, action: () => window.open(`mailto:${ADMIN_EMAIL}`),           btn: "Send Mail", btnColor: "#00BFFF" },
            ].map(({ icon, label, value, action, btn, btnColor }) => (
              <div key={label} style={{ background: "rgba(255,107,0,0.03)", border: "1px solid rgba(255,107,0,0.1)", borderRadius: 14, padding: "1rem 1.2rem", display: "flex", alignItems: "center", gap: "0.9rem" }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: "rgba(255,245,230,0.55)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 0.15rem" }}>{label}</p>
                  <p style={{ color: "#FFF5E6", fontWeight: 600, fontSize: "0.9rem", margin: 0, wordBreak: "break-all" }}>{value}</p>
                </div>
                <button onClick={action} style={{ background: "transparent", border: `1px solid ${btnColor}`, borderRadius: 8, color: btnColor, fontWeight: 700, fontSize: "0.75rem", padding: "0.4rem 0.9rem", cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'Source Sans 3',sans-serif" }}>{btn}</button>
              </div>
            ))}

            {/* Address */}
            <div style={{ background: "rgba(255,107,0,0.03)", border: "1px solid rgba(255,107,0,0.1)", borderRadius: 14, padding: "1rem 1.2rem", display: "flex", gap: "0.9rem", alignItems: "flex-start" }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <MapPin size={20} color="#FF6B00" />
              </div>
              <div>
                <p style={{ color: "rgba(255,245,230,0.55)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 0.15rem" }}>Location</p>
                <p style={{ color: "#FFF5E6", fontWeight: 600, fontSize: "0.9rem", margin: "0 0 0.15rem" }}>{ADDRESS}</p>
                <p style={{ color: "rgba(255,245,230,0.5)", fontSize: "0.8rem", margin: 0 }}>Direct-from-manufacturer crackers 🎆</p>
              </div>
            </div>

            {/* Hours */}
            <div style={{ background: "rgba(255,107,0,0.03)", border: "1px solid rgba(255,107,0,0.1)", borderRadius: 14, padding: "1rem 1.2rem", display: "flex", gap: "0.9rem", alignItems: "flex-start" }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Clock size={20} color="#FFD700" />
              </div>
              <div>
                <p style={{ color: "rgba(255,245,230,0.55)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 0.5rem" }}>Business Hours</p>
                {[["Mon – Sat", "9:00 AM – 8:00 PM IST"],["Sunday", "10:00 AM – 6:00 PM IST"]].map(([day, hrs]) => (
                  <div key={day} style={{ display: "flex", justifyContent: "space-between", gap: "1rem", marginBottom: "0.25rem" }}>
                    <span style={{ color: "rgba(255,245,230,0.65)", fontSize: "0.85rem" }}>{day}</span>
                    <span style={{ color: "#FFF5E6", fontWeight: 600, fontSize: "0.85rem" }}>{hrs}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Form + FAQ ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* Contact Form */}
            <div style={{ background: "rgba(255,107,0,0.03)", border: "1px solid rgba(255,107,0,0.12)", borderRadius: 18, padding: "1.6rem" }}>
              <h2 style={{ color: "#FFF5E6", fontFamily: "'Libre Baskerville',serif", fontSize: "1.25rem", margin: "0 0 1.4rem" }}>Send a Message</h2>

              {sent ? (
                <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
                  <CheckCircle2 size={48} color="#25D366" style={{ marginBottom: "1rem" }} />
                  <p style={{ color: "#FFF5E6", fontWeight: 700, fontSize: "1.1rem", margin: "0 0 0.5rem" }}>Message sent on WhatsApp!</p>
                  <p style={{ color: "rgba(255,245,230,0.6)", fontSize: "0.9rem", margin: "0 0 1.2rem" }}>We'll reply within 1–2 hours during business hours.</p>
                  <button onClick={() => { setSent(false); setForm({ name:"",phone:"",email:"",subject:"",message:"" }); }} style={{ background: "linear-gradient(135deg,#FF6B00,#FF3D00)", border: "none", borderRadius: 10, color: "#fff", fontWeight: 700, padding: "0.65rem 1.5rem", cursor: "pointer", fontFamily: "'Source Sans 3',sans-serif" }}>Send Another</button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label className="ct-label">Name *</label>
                      <input name="name" value={form.name} onChange={onChange} className="ct-input" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="ct-label">Phone *</label>
                      <input name="phone" value={form.phone} onChange={onChange} className="ct-input" placeholder="10-digit mobile" maxLength={10} type="tel" />
                    </div>
                  </div>
                  <div>
                    <label className="ct-label">Email (optional)</label>
                    <input name="email" value={form.email} onChange={onChange} className="ct-input" type="email" placeholder="you@example.com" />
                  </div>
                  <div>
                    <label className="ct-label">Subject</label>
                    <input name="subject" value={form.subject} onChange={onChange} className="ct-input" placeholder="Order enquiry / Bulk order / Other" />
                  </div>
                  <div>
                    <label className="ct-label">Message *</label>
                    <textarea name="message" value={form.message} onChange={onChange} className="ct-input" rows={4} placeholder="How can we help you?" />
                  </div>
                  <button onClick={handleSubmit} disabled={sending} style={{ width: "100%", padding: "0.9rem", background: sending ? "rgba(255,107,0,0.4)" : "linear-gradient(135deg,#FF6B00,#FF3D00)", border: "none", borderRadius: 12, color: "#fff", fontWeight: 800, fontSize: "1rem", cursor: sending ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", boxShadow: sending ? "none" : "0 4px 20px rgba(255,107,0,0.5)", fontFamily: "'Source Sans 3',sans-serif", transition: "all .2s" }}>
                    {sending ? <><Loader2 size={17} style={{ animation: "spin 1s linear infinite" }} /> Sending…</> : <><Send size={17} /> Send via WhatsApp</>}
                  </button>
                  <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
                </div>
              )}
            </div>

            {/* FAQ */}
            <div style={{ background: "rgba(255,107,0,0.03)", border: "1px solid rgba(255,107,0,0.12)", borderRadius: 18, padding: "1.6rem" }}>
              <h2 style={{ color: "#FFF5E6", fontFamily: "'Libre Baskerville',serif", fontSize: "1.25rem", margin: "0 0 0.5rem" }}>Frequently Asked Questions</h2>
              <div>
                {FAQS.map((faq, i) => (
                  <div key={i} className="faq-item">
                    <button className="faq-btn" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                      <span style={{ color: "#FFF5E6", fontWeight: 700, fontSize: "0.95rem" }}>{faq.q}</span>
                      <span style={{ color: "#FF6B00", fontSize: "1.1rem", flexShrink: 0, transition: "transform .2s", transform: openFaq === i ? "rotate(45deg)" : "none" }}>+</span>
                    </button>
                    {openFaq === i && (
                      <p style={{ color: "rgba(255,245,230,0.7)", fontSize: "0.9rem", lineHeight: 1.7, margin: "0 0 1rem", paddingRight: "1rem" }}>{faq.a}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
