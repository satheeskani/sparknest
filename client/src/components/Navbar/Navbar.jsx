import { useState, useEffect } from "react";
import CartDrawer from "../CartDrawer/CartDrawer";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { ShoppingCart, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home",       path: "/" },
  { label: "Products",   path: "/products" },
  { label: "Blog",       path: "/blog" },
  { label: "Contact Us", path: "/contact" },
];

export default function Navbar() {
  const { items } = useSelector((s) => s.cart);
  const location  = useLocation();

  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [cartOpen,  setCartOpen]  = useState(false);

  const cartCount = items.reduce((acc, i) => acc + i.quantity, 0);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    document.body.style.overflow = "";
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname + location.search === path || location.pathname === path;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Nunito+Sans:wght@300;400;600;700;800&family=Source+Sans+3:wght@300;400;600;700&display=swap');
        @keyframes shimmer-logo {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes slideInLeft {
          from { opacity:0; transform:translateX(-100%); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes fadeOverlay {
          from { opacity:0; }
          to   { opacity:1; }
        }
        .nav-logo-text {
          font-family: 'Libre Baskerville', serif;
          font-size: 1.5rem; font-weight: 900;
          background: linear-gradient(90deg,#FFD700,#FF6B00,#FF1493,#FFD700);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer-logo 3s linear infinite;
          filter: drop-shadow(0 0 12px rgba(255,215,0,0.35));
          text-decoration: none;
          -webkit-font-smoothing: antialiased;
        }
        .nav-link {
          position: relative;
          font-size: 0.82rem; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          text-decoration: none; color: #FFF5E6;
          padding: 0.35rem 0; transition: color 0.25s; white-space: nowrap;
        }
        .nav-link::after {
          content: ''; position: absolute; bottom:-3px; left:0;
          width:0; height:2px; border-radius:2px;
          background: linear-gradient(90deg,#FFD700,#FF6B00);
          transition: width 0.3s ease;
        }
        .nav-link:hover              { color:#FFD700; }
        .nav-link:hover::after       { width:100%; }
        .nav-link.active             { color:#FFD700; }
        .nav-link.active::after      { width:100%; }
        @keyframes cart-gradient { 0%{background-position:0% center} 100%{background-position:200% center} }
        @keyframes cart-glow { 0%,100%{box-shadow:0 0 12px rgba(255,107,0,0.65),0 0 24px rgba(255,61,0,0.2)} 50%{box-shadow:0 0 22px rgba(255,215,0,0.6),0 0 40px rgba(255,107,0,0.6)} }
        .cart-btn {
          display:inline-flex; align-items:center; justify-content:center; gap:0.4rem;
          background: linear-gradient(90deg,#FF3D00,#FF6B00,#FFD700,#FF6B00,#FF3D00);
          background-size:300% auto;
          animation: cart-gradient 3s linear infinite, cart-glow 2.5s ease-in-out infinite;
          border:none; border-radius:50px; padding:0.48rem 1.1rem;
          color:#1A0500; cursor:pointer;
          font-family:'Source Sans 3',sans-serif; font-weight:800; font-size:1.05rem;
          white-space:nowrap; flex-shrink:0; line-height:1;
        }
        .cart-btn:hover { transform:scale(1.06); }
        .hamburger {
          background:rgba(255,255,255,.05); border:1px solid rgba(255,215,0,.25);
          border-radius:10px; padding:0.45rem; cursor:pointer; color:#FFD700;
          display:flex; align-items:center; justify-content:center;
          transition:background .2s, border-color .2s;
        }
        .hamburger:hover { background:rgba(255,215,0,.1); border-color:rgba(255,215,0,.5); }
        .mobile-overlay {
          position:fixed; inset:0; z-index:998; background:rgba(0,0,0,.65);
          backdrop-filter:blur(4px); animation:fadeOverlay .25s ease;
        }
        .mobile-drawer {
          position:fixed; top:0; left:0; z-index:999;
          width:min(300px,82vw); height:100vh;
          background:linear-gradient(160deg,#0D0800 0%,#130800 50%,#0D0500 100%);
          border-right:1px solid rgba(255,215,0,.15);
          box-shadow:4px 0 40px rgba(0,0,0,.6);
          animation:slideInLeft .3s cubic-bezier(.22,1,.36,1);
          display:flex; flex-direction:column; overflow:hidden;
        }
        .mobile-link {
          display:flex; align-items:center; gap:0.9rem; padding:1rem 1.6rem;
          font-size:1rem; font-weight:700; text-decoration:none; color:#FFF5E6;
          border-bottom:1px solid rgba(255,255,255,.04);
          transition:background .2s, color .2s, padding-left .2s; letter-spacing:0.05em;
        }
        .mobile-link:hover { background:rgba(255,215,0,.06); color:#FFD700; padding-left:2rem; }
        .mobile-link.active { color:#FFD700; background:rgba(255,215,0,.08); border-left:3px solid #FFD700; }
        @media(max-width:768px) {
          .desktop-links { display:none !important; }
          .desktop-auth  { display:none !important; }
          .hamburger-wrap { display:flex !important; }
        }
        @media(min-width:769px) {
          .hamburger-wrap { display:none !important; }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:100,
        padding:"0 clamp(1.5rem, 5vw, 4rem)", height:68,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        background: "rgba(8,4,0,0.95)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderBottom: scrolled ? "1px solid rgba(255,215,0,0.15)" : "1px solid rgba(255,215,0,0.08)",
        boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.4)" : "0 2px 16px rgba(0,0,0,0.5)",
        transition:"background .35s, backdrop-filter .35s, border-color .35s, box-shadow .35s",
      }}>

        <Link to="/" className="nav-logo-text">SparkNest</Link>

        {/* Desktop Links */}
        <div className="desktop-links" style={{ display:"flex", gap:"2.5rem", alignItems:"center" }}>
          {navLinks.map(({ label, path }) => (
            <Link key={path} to={path} className={`nav-link${isActive(path) ? " active" : ""}`}>
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop: Cart */}
        <div className="desktop-auth" style={{ display:"flex", alignItems:"center", gap:"1.2rem" }}>
          <button onClick={() => setCartOpen(true)} className="cart-btn">
            <ShoppingCart size={17} />
            <span>Cart</span>
            {cartCount > 0 && (
              <span style={{ color:"#fff", fontSize:"1.05rem", fontWeight:800 }}>{cartCount}</span>
            )}
          </button>
        </div>

        {/* Mobile: Cart + Hamburger */}
        <div className="hamburger-wrap" style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
          <button onClick={() => setCartOpen(true)} className="cart-btn">
            <ShoppingCart size={17} />
            <span>Cart</span>
            {cartCount > 0 && (
              <span style={{ color:"#fff", fontSize:"1.05rem", fontWeight:800 }}>{cartCount}</span>
            )}
          </button>
          <button className="hamburger" onClick={() => setMenuOpen(true)}>
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {/* ── MOBILE OVERLAY ── */}
      {menuOpen && (
        <div className="mobile-overlay" onClick={() => setMenuOpen(false)} />
      )}

      {/* ── MOBILE DRAWER ── */}
      {menuOpen && (
        <div className="mobile-drawer">
          <div style={{
            padding:"1.2rem 1.6rem",
            display:"flex", alignItems:"center", justifyContent:"space-between",
            borderBottom:"1px solid rgba(255,215,0,.15)", background:"rgba(255,215,0,.03)",
          }}>
            <span style={{
              fontFamily:"'Libre Baskerville',serif", textTransform:"uppercase",
              letterSpacing:"0.05em", fontSize:"1.2rem", fontWeight:900,
              background:"linear-gradient(90deg,#FFD700,#FF6B00,#FF1493)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            }}>SparkNest</span>
            <button className="hamburger" onClick={() => setMenuOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div style={{
            padding:"0.8rem 1.6rem",
            background:"linear-gradient(135deg,rgba(255,215,0,.06),rgba(255,107,0,.04))",
            borderBottom:"1px solid rgba(255,255,255,.04)",
          }}>
            <p style={{ margin:0, fontSize:"1.05rem", color:"rgba(255,215,0,.7)", fontWeight:600 }}>
              🪔 Happy Diwali 2025! &nbsp;✨
            </p>
          </div>

          <div style={{ flex:1, overflowY:"auto" }}>
            {navLinks.map(({ label, path }) => (
              <Link key={path} to={path} className={`mobile-link${isActive(path) ? " active" : ""}`}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
