import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ChevronDown } from "lucide-react";

const shopLinks = ["Sparklers", "Rockets", "Combo Packs", "Kids Special", "Sky Shots", "Gift Boxes"];
const festivalLinks = [
  { label: "Diwali 🪔",     href: "#" },
  { label: "Karthigai 🌟",  href: "#" },
  { label: "New Year 🎊",   href: "#" },
  { label: "Weddings 💒",   href: "#" },
  { label: "Pongal 🎉",     href: "#" },
];
const helpLinks = [
  { label: "Track Order 📦", href: "/track-order", isRoute: true },
  { label: "Safety Guide",   href: "#",             isRoute: false },
  { label: "Contact Us",     href: "/contact",       isRoute: true },
];

// ── Accordion section for mobile ──
function AccordionCol({ title, titleColor, gradientBar, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      borderBottom: "1px solid rgba(255,255,255,.06)",
      overflow: "hidden",
    }}>
      {/* Header row — tappable */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "1rem 0",
          background: "none", border: "none", cursor: "pointer",
        }}
      >
        <span style={{
          fontSize: "1.05rem", letterSpacing: "0.22em", textTransform: "uppercase",
          fontWeight: 800, color: titleColor,
          WebkitFontSmoothing: "antialiased",
        }}>{title}</span>
        <ChevronDown size={16} color={titleColor} style={{
          transition: "transform .3s",
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
        }} />
      </button>

      {/* Collapsible content */}
      <div style={{
        maxHeight: open ? "400px" : "0",
        overflow: "hidden",
        transition: "max-height .35s ease",
        paddingBottom: open ? "1rem" : "0",
      }}>
        {children}
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer style={{ position: "relative", zIndex: 2, overflow: "hidden" }}>
      <style>{`
        @keyframes shimmer-text {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes float-lamp {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }

        .footer-logo-text {
          background: linear-gradient(90deg,#FFD700,#FF6B00,#FF1493,#FFD700);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer-text 3s linear infinite;
          font-size: 1.8rem; font-weight: 900;
          font-family: 'Libre Baskerville', serif;
          -webkit-font-smoothing: antialiased;
        }

        .footer-col-title {
          font-size: 0.72rem; letter-spacing: 0.22em;
          text-transform: uppercase; font-weight: 800;
          margin-bottom: 1.2rem; padding-bottom: 0.6rem;
          position: relative; display: inline-block;
          -webkit-font-smoothing: antialiased;
        }

        .footer-link {
          color: rgba(255,245,230,0.8); text-decoration: none;
          font-size: 0.9rem; font-weight: 500;
          transition: color .2s, padding-left .2s;
          display: block; margin-bottom: 0.65rem;
          -webkit-font-smoothing: antialiased;
        }
        .footer-link:hover { color: #FFD700; padding-left: 6px; }

        .footer-divider {
          height: 1px;
          background: linear-gradient(90deg,transparent,rgba(255,215,0,.4),rgba(255,107,0,.4),rgba(255,20,147,.3),transparent);
        }

        .footer-lamp { animation: float-lamp 3s ease-in-out infinite; display: inline-block; }

        .footer-badge {
          display: inline-flex; align-items: center; gap: 0.4rem;
          padding: 0.35rem 0.9rem; border-radius: 100px;
          font-size: 0.72rem; font-weight: 700; letter-spacing: 0.05em;
          margin: 0.3rem;
        }

        /* ── Desktop grid ── */
        .footer-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1fr;
          gap: 2.5rem;
          margin-bottom: 3rem;
        }
        .footer-col-desktop { display: block; }
        .footer-col-mobile  { display: none; }

        .footer-lamps {
          display: flex; justify-content: center;
          gap: 1rem; font-size: 1.6rem;
          margin-bottom: 0.8rem; flex-wrap: wrap;
        }
        .footer-bottom {
          display: flex; align-items: center;
          justify-content: space-between;
          flex-wrap: wrap; gap: 1rem; padding-top: 1.5rem;
        }

        /* ── Tablet: 2 cols ── */
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
          .footer-brand-col { grid-column: span 2; }
        }

        /* ── Mobile: brand + accordions ── */
        @media (max-width: 560px) {
          .footer-grid { display: block; margin-bottom: 0; }
          .footer-brand-col { margin-bottom: 1.5rem; }
          /* Hide desktop cols, show mobile accordions */
          .footer-col-desktop { display: none; }
          .footer-col-mobile  { display: block; margin-bottom: 0.5rem; }
          .footer-bottom { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
          .footer-lamps  { font-size: 1.2rem; gap: 0.6rem; }
          .footer-logo-text { font-size: 1.4rem; }
          /* Tighten greeting on mobile */
          .footer-greeting { padding: 1.2rem 1rem !important; margin-bottom: 1.8rem !important; }
          .footer-greeting p:first-of-type { font-size: 1rem !important; }
        }
      `}</style>

      {/* ── Top rainbow strip ── */}
      <div style={{
        height: 3,
        background: "linear-gradient(90deg,#FFD700,#FF6B00,#FF1493,#9B59B6,#00BFFF,#2ECC71,#FFD700)",
        backgroundSize: "200% auto", animation: "shimmer-text 3s linear infinite",
      }} />

      {/* ── Main body ── */}
      <div style={{
        background: "linear-gradient(180deg,#0D0800 0%,#0A0500 60%,#000 100%)",
        padding: "4rem clamp(1.5rem,5vw,4rem) 2rem",
        position: "relative",
      }}>
        <div style={{ position:"absolute", inset:0, pointerEvents:"none",
          background:"radial-gradient(ellipse 60% 40% at 50% 0%,rgba(255,107,0,.07) 0%,transparent 70%)" }} />

        <div style={{ maxWidth:1280, margin:"0 auto", position:"relative", zIndex:1 }}>

          {/* Diwali greeting */}
          <div className="footer-greeting" style={{
            textAlign:"center", marginBottom:"3rem",
            padding:"1.5rem clamp(1rem,4vw,2rem)", borderRadius:20,
            background:"linear-gradient(135deg,rgba(255,215,0,.06),rgba(255,107,0,.04),rgba(155,89,182,.06))",
            border:"1px solid rgba(255,215,0,.15)",
          }}>
            <div className="footer-lamps">
              {["🪔","🎆","🎇","🧨","🎆","🪔"].map((e,i)=>(
                <span key={i} className="footer-lamp" style={{ animationDelay:`${i*0.3}s` }}>{e}</span>
              ))}
            </div>
            <p style={{
              fontFamily:"'Libre Baskerville',serif", textTransform:"uppercase", letterSpacing:"0.05em",
              background:"linear-gradient(90deg,#FFD700,#FF6B00,#FF1493,#FFD700)",
              backgroundSize:"200% auto",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              animation:"shimmer-text 3s linear infinite",
              fontSize:"clamp(0.9rem,2vw,1.4rem)", fontWeight:900, marginBottom:"0.4rem",
            }}>
              Happy Diwali from SparkNest! 🪔
            </p>
            <p style={{ fontSize:"clamp(0.78rem,1.5vw,0.85rem)", color:"rgba(255,245,230,.8)" }}>
              Wishing you light, joy &amp; prosperity this festive season
            </p>
          </div>

          {/* ── Desktop grid ── */}
          <div className="footer-grid">

            {/* Brand col */}
            <div className="footer-brand-col">
              <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"1rem" }}>
                <Sparkles style={{ color:"#FFD700", width:22, height:22, flexShrink:0 }} />
                <span className="footer-logo-text">SparkNest</span>
              </div>
              <p style={{ fontSize:"1.05rem", color:"rgba(255,245,230,.8)", lineHeight:1.8, marginBottom:"1.2rem" }}>
                India's smartest AI-powered cracker store. Premium quality from Sivakasi, delivered to your doorstep. 🏭
              </p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"0.4rem", marginBottom:"1.4rem" }}>
                {[
                  { label:"🛡️ Safe",       bg:"rgba(46,204,113,.12)", border:"rgba(46,204,113,.3)", color:"#2ECC71" },
                  { label:"⭐ 4.9 Rating", bg:"rgba(255,215,0,.1)",   border:"rgba(255,215,0,.3)",  color:"#FFD700" },
                  { label:"🚚 Free Ship",  bg:"rgba(0,191,255,.1)",   border:"rgba(0,191,255,.3)",  color:"#00BFFF" },
                ].map(b=>(
                  <span key={b.label} className="footer-badge"
                    style={{ background:b.bg, border:`1px solid ${b.border}`, color:b.color }}>
                    {b.label}
                  </span>
                ))}
              </div>
              <p style={{ fontSize:"0.9rem", color:"rgba(255,245,230,.6)" }}>Made with ❤️ in Sivakasi, India</p>
            </div>

            {/* Shop — desktop only */}
            <div className="footer-col-desktop">
              <div className="footer-col-title" style={{ color:"#FFD700" }}>
                Shop
                <span style={{ position:"absolute", bottom:0, left:0, height:2, width:"100%",
                  background:"linear-gradient(90deg,#FFD700,#FF6B00)", borderRadius:2 }} />
              </div>
              {shopLinks.map(l=>(
                <Link key={l} to={`/products?category=${encodeURIComponent(l)}`} className="footer-link" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>{l}</Link>
              ))}
            </div>

            {/* Festivals — desktop only */}
            <div className="footer-col-desktop">
              <div className="footer-col-title" style={{ color:"#FF6B9D" }}>
                Festivals
                <span style={{ position:"absolute", bottom:0, left:0, height:2, width:"100%",
                  background:"linear-gradient(90deg,#FF6B9D,#FF1493)", borderRadius:2 }} />
              </div>
              {festivalLinks.map(l=>(
                <a key={l.label} href={l.href} className="footer-link"
                  onMouseEnter={e=>{ e.currentTarget.style.color="#FF6B9D"; e.currentTarget.style.paddingLeft="6px"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.color="rgba(255,245,230,0.8)"; e.currentTarget.style.paddingLeft="0"; }}>
                  {l.label}
                </a>
              ))}
            </div>

            {/* Help — desktop only */}
            <div className="footer-col-desktop">
              <div className="footer-col-title" style={{ color:"#00BFFF" }}>
                Help
                <span style={{ position:"absolute", bottom:0, left:0, height:2, width:"100%",
                  background:"linear-gradient(90deg,#00BFFF,#9B59B6)", borderRadius:2 }} />
              </div>
              {helpLinks.map(l=>(
                l.isRoute
                  ? <Link key={l.label} to={l.href} className="footer-link"
                      onMouseEnter={e=>{ e.currentTarget.style.color="#00BFFF"; e.currentTarget.style.paddingLeft="6px"; }}
                      onMouseLeave={e=>{ e.currentTarget.style.color="rgba(255,245,230,0.8)"; e.currentTarget.style.paddingLeft="0"; }}>
                      {l.label}
                    </Link>
                  : <a key={l.label} href={l.href} className="footer-link"
                      onMouseEnter={e=>{ e.currentTarget.style.color="#00BFFF"; e.currentTarget.style.paddingLeft="6px"; }}
                      onMouseLeave={e=>{ e.currentTarget.style.color="rgba(255,245,230,0.8)"; e.currentTarget.style.paddingLeft="0"; }}>
                      {l.label}
                    </a>
              ))}
              <div style={{ marginTop:"1.2rem", padding:"1rem", borderRadius:12,
                background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)" }}>
                <p style={{ fontSize:"0.9rem", color:"rgba(255,245,230,.8)", marginBottom:"0.4rem" }}>📧 support@sparknest.in</p>
                <p style={{ fontSize:"0.9rem", color:"rgba(255,245,230,.8)" }}>📞 8015850365</p>
              </div>
            </div>
          </div>

          {/* ── Mobile accordions (hidden on desktop) ── */}
          <div className="footer-col-mobile">
            <AccordionCol title="Shop" titleColor="#FFD700">
              {shopLinks.map(l=>(
                <Link key={l} to={`/products?category=${encodeURIComponent(l)}`} className="footer-link" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>{l}</Link>
              ))}
            </AccordionCol>

            <AccordionCol title="Festivals" titleColor="#FF6B9D">
              {festivalLinks.map(l=>(
                <a key={l.label} href={l.href} className="footer-link">{l.label}</a>
              ))}
            </AccordionCol>

            <AccordionCol title="Help" titleColor="#00BFFF">
              {helpLinks.map(l=>(
                l.isRoute
                  ? <Link key={l.label} to={l.href} className="footer-link">{l.label}</Link>
                  : <a key={l.label} href={l.href} className="footer-link">{l.label}</a>
              ))}
              <div style={{ marginTop:"0.8rem", padding:"0.9rem", borderRadius:12,
                background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)" }}>
                <p style={{ fontSize:"0.9rem", color:"rgba(255,245,230,.8)", marginBottom:"0.4rem" }}>📧 support@sparknest.in</p>
                <p style={{ fontSize:"0.9rem", color:"rgba(255,245,230,.8)" }}>📞 8015850365</p>
              </div>
            </AccordionCol>
          </div>

          {/* Spacer on mobile between accordions and divider */}
          <div style={{ height:"1.5rem" }} />

          {/* Divider */}
          <div className="footer-divider" />

          {/* Bottom bar */}
          <div className="footer-bottom">
            <p style={{ fontSize:"0.8rem", color:"rgba(255,245,230,.8)" }}>
              © {new Date().getFullYear()} SparkNest. All rights reserved.
            </p>

            <p style={{ fontSize:"0.9rem", color:"rgba(255,245,230,.8)" }}>
              🔒 Secure &amp; Encrypted Payments
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}
