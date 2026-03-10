import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ShoppingCart, LogOut, Menu, X } from "lucide-react";
import { logout } from "../../redux/slices/authSlice";

const navLinks = [
  { label: "Home",      path: "/" },
  { label: "Shop",      path: "/products" },
  { label: "Combos 🎁", path: "/products?category=Combo+Packs" },
  { label: "Kids Safe 🧒", path: "/products?isSafeForKids=true" },
];

export default function Navbar() {
  const { user }  = useSelector((s) => s.auth);
  const { items } = useSelector((s) => s.cart);
  const dispatch  = useDispatch();
  const location  = useLocation();

  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  const cartCount = items.reduce((acc, i) => acc + i.quantity, 0);

  // ── Scroll → glassmorphism
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // ── Close menu on route change
  useEffect(() => setMenuOpen(false), [location.pathname]);

  // ── Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname + location.search === path || location.pathname === path;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@900&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,800&display=swap');
        @keyframes shimmer-logo {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes slideDown {
          from { opacity:0; transform:translateY(-10px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity:0; transform:translateX(-100%); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes fadeOverlay {
          from { opacity:0; }
          to   { opacity:1; }
        }

        /* Logo */
        .nav-logo-text {
          font-family: 'Cinzel Decorative', serif;
          font-size: 1.5rem; font-weight: 900;
          background: linear-gradient(90deg,#FFD700,#FF6B00,#FF1493,#FFD700);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer-logo 3s linear infinite;
          filter: drop-shadow(0 0 12px rgba(255,215,0,0.35));
          text-decoration: none;
          -webkit-font-smoothing: antialiased;
          text-rendering: geometricPrecision;
        }

        /* Desktop nav link */
        .nav-link {
          position: relative;
          font-size: 0.82rem; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          text-decoration: none;
          color: #FFF5E6;
          padding: 0.35rem 0;
          transition: color 0.25s;
          white-space: nowrap;
          text-rendering: geometricPrecision;
          -webkit-font-smoothing: antialiased;
          opacity: 1;
        }
        .nav-link::after {
          content: '';
          position: absolute; bottom:-3px; left:0;
          width:0; height:2px; border-radius:2px;
          background: linear-gradient(90deg,#FFD700,#FF6B00);
          transition: width 0.3s ease;
        }
        .nav-link:hover              { color:#FFD700; }
        .nav-link:hover::after       { width:100%; }
        .nav-link.active             { color:#FFD700; }
        .nav-link.active::after      { width:100%; }

        /* Cart */
        .cart-icon {
          position:relative; color:rgba(255,245,230,0.75);
          text-decoration:none; transition:color .2s, transform .2s;
        }
        .cart-icon:hover { color:#FFD700; transform:scale(1.12); }
        .cart-count {
          position:absolute; top:-8px; right:-8px;
          background:linear-gradient(135deg,#FF6B00,#FF3D00);
          color:#fff; font-size:0.62rem; font-weight:800;
          width:18px; height:18px; border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          box-shadow: 0 0 10px rgba(255,107,0,.6);
        }

        /* Login btn */
        .login-btn {
          background:linear-gradient(135deg,#FFD700,#FF6B00,#FF3D00);
          background-size:200% auto;
          animation:shimmer-logo 2.5s linear infinite;
          color:#1A0500 !important;
          padding:0.5rem 1.4rem; border-radius:100px;
          font-size:0.82rem; font-weight:800;
          text-decoration:none; white-space:nowrap;
          box-shadow:0 4px 16px rgba(255,107,0,.4);
          transition:transform .2s, box-shadow .2s;
          letter-spacing:0.04em;
        }
        .login-btn:hover { transform:scale(1.06); box-shadow:0 6px 24px rgba(255,107,0,.6); }

        /* Hamburger */
        .hamburger {
          background:rgba(255,255,255,.05);
          border:1px solid rgba(255,215,0,.25);
          border-radius:10px; padding:0.45rem;
          cursor:pointer; color:#FFD700;
          display:flex; align-items:center; justify-content:center;
          transition:background .2s, border-color .2s;
        }
        .hamburger:hover { background:rgba(255,215,0,.1); border-color:rgba(255,215,0,.5); }

        /* Mobile overlay */
        .mobile-overlay {
          position:fixed; inset:0; z-index:998;
          background:rgba(0,0,0,.65);
          backdrop-filter:blur(4px);
          animation:fadeOverlay .25s ease;
        }

        /* Mobile drawer */
        .mobile-drawer {
          position:fixed; top:0; left:0; z-index:999;
          width:min(300px,82vw); height:100vh;
          background:linear-gradient(160deg,#0D0800 0%,#130800 50%,#0D0500 100%);
          border-right:1px solid rgba(255,215,0,.15);
          box-shadow:4px 0 40px rgba(0,0,0,.6);
          animation:slideInLeft .3s cubic-bezier(.22,1,.36,1);
          display:flex; flex-direction:column; overflow:hidden;
        }

        /* Mobile link */
        .mobile-link {
          display:flex; align-items:center; gap:0.9rem;
          padding:1rem 1.6rem;
          font-size:1rem; font-weight:700; text-decoration:none;
          color:#FFF5E6;
          border-bottom:1px solid rgba(255,255,255,.04);
          transition:background .2s, color .2s, padding-left .2s;
          letter-spacing:0.05em;
          -webkit-font-smoothing:antialiased;
          text-rendering:geometricPrecision;
        }
        .mobile-link:hover {
          background:rgba(255,215,0,.06);
          color:#FFD700;
          padding-left:2rem;
        }
        .mobile-link.active {
          color:#FFD700;
          background:rgba(255,215,0,.08);
          border-left:3px solid #FFD700;
        }

        /* Logout btn */
        .logout-btn {
          background:none; border:none;
          color:rgba(255,107,0,.8); cursor:pointer;
          font-size:0.85rem; font-weight:600;
          display:flex; align-items:center; gap:0.4rem;
          padding:0.4rem 0; transition:color .2s;
        }
        .logout-btn:hover { color:#FF6B00; }

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
        padding:"0 clamp(1.5rem, 5vw, 4rem)",
        height:68,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        /* Glassmorphism kicks in after scroll */
        background: scrolled
          ? "rgba(8,4,0,0.92)"
          : "linear-gradient(180deg,rgba(10,5,0,0.9) 0%,transparent 100%)",
        backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "blur(6px)",
        WebkitBackdropFilter: scrolled ? "blur(20px) saturate(180%)" : "blur(6px)",
        borderBottom: scrolled
          ? "1px solid rgba(255,215,0,0.15)"
          : "1px solid transparent",
        boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.4)" : "none",
        transition:"background .35s, backdrop-filter .35s, border-color .35s, box-shadow .35s",
      }}>

        {/* Logo */}
        <Link to="/" className="nav-logo-text">SparkNest</Link>

        {/* Desktop Links */}
        <div className="desktop-links" style={{ display:"flex", gap:"2.5rem", alignItems:"center" }}>
          {navLinks.map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              className={`nav-link${isActive(path) ? " active" : ""}`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth + Cart */}
        <div className="desktop-auth" style={{ display:"flex", alignItems:"center", gap:"1.2rem" }}>
          <Link to="/cart" className="cart-icon">
            <ShoppingCart size={22} />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>

          {user ? (
            <div style={{ display:"flex", alignItems:"center", gap:"0.8rem" }}>
              <span style={{ fontSize:"0.85rem", color:"rgba(255,245,230,.6)", whiteSpace:"nowrap" }}>
                Hi, {user.name.split(" ")[0]}! 👋
              </span>
              <button className="logout-btn" onClick={() => dispatch(logout())}>
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="login-btn">Login</Link>
          )}
        </div>

        {/* Mobile: cart + hamburger */}
        <div className="hamburger-wrap" style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
          <Link to="/cart" className="cart-icon">
            <ShoppingCart size={22} />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>
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
          {/* Drawer header */}
          <div style={{
            padding:"1.2rem 1.6rem",
            display:"flex", alignItems:"center", justifyContent:"space-between",
            borderBottom:"1px solid rgba(255,215,0,.15)",
            background:"rgba(255,215,0,.03)",
          }}>
            <span style={{
              fontFamily:"'Cinzel Decorative',serif", fontSize:"1.2rem", fontWeight:900,
              background:"linear-gradient(90deg,#FFD700,#FF6B00,#FF1493)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            }}>SparkNest 🎆</span>
            <button className="hamburger" onClick={() => setMenuOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Diwali greeting */}
          <div style={{
            padding:"0.8rem 1.6rem",
            background:"linear-gradient(135deg,rgba(255,215,0,.06),rgba(255,107,0,.04))",
            borderBottom:"1px solid rgba(255,255,255,.04)",
          }}>
            <p style={{ fontSize:"0.75rem", color:"rgba(255,215,0,.7)", fontWeight:600 }}>
              🪔 Happy Diwali 2025! &nbsp;✨
            </p>
          </div>

          {/* Links */}
          <div style={{ flex:1, overflowY:"auto" }}>
            {navLinks.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className={`mobile-link${isActive(path) ? " active" : ""}`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Drawer footer — auth */}
          <div style={{
            padding:"1.4rem 1.6rem",
            borderTop:"1px solid rgba(255,215,0,.12)",
            background:"rgba(255,215,0,.02)",
          }}>
            {user ? (
              <div style={{ display:"flex", flexDirection:"column", gap:"0.8rem" }}>
                <p style={{ fontSize:"0.88rem", color:"rgba(255,245,230,.65)", fontWeight:600 }}>
                  👋 Hi, {user.name.split(" ")[0]}!
                </p>
                <button className="logout-btn" onClick={() => { dispatch(logout()); setMenuOpen(false); }}>
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="login-btn" style={{ display:"block", textAlign:"center" }}
                onClick={() => setMenuOpen(false)}>
                Login / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
