import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ChevronUp } from "lucide-react";
import { store } from "./redux/store";
import { LangProvider, useLang } from "./components/LangContext/LangContext";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

import Home          from "./pages/Home/Home";
import Products      from "./pages/Products/Products";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Cart          from "./pages/Cart/Cart";
import Checkout      from "./pages/Checkout/Checkout";
import Contact       from "./pages/Contact/Contact";
import Blog          from "./pages/Blog/Blog";
import AdminPanel    from "./pages/Admin/AdminPanel";

function RouteScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [pathname]);
  return null;
}

function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!visible) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      style={{ position:"fixed", bottom:"1.5rem", right:"1.5rem", zIndex:999, width:48, height:48, borderRadius:"50%", background:"linear-gradient(135deg,#FF6B00,#FF3D00)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 20px rgba(255,107,0,0.5)", transition:"transform .2s" }}
      onMouseEnter={e => e.currentTarget.style.transform="scale(1.12)"}
      onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
      title="Back to top"
    >
      <ChevronUp size={22} color="#fff" strokeWidth={3} />
    </button>
  );
}

function LangSwitcher() {
  const { lang, setLang, LANGS } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <style>{`
        @keyframes lang-gradient { 0%{background-position:0% center} 100%{background-position:200% center} }
        @keyframes lang-glow { 0%,100%{box-shadow:0 0 12px rgba(255,107,0,0.65),0 0 24px rgba(255,61,0,0.2)} 50%{box-shadow:0 0 22px rgba(255,215,0,0.6),0 0 40px rgba(255,107,0,0.6)} }
        @keyframes lang-pop { from{opacity:0;transform:scale(0.85) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
        .lang-fab { display:inline-flex; align-items:center; justify-content:center; width:48px; height:48px; border-radius:50%; background:linear-gradient(90deg,#FF3D00,#FF6B00,#FFD700,#FF6B00,#FF3D00); background-size:300% auto; animation:lang-gradient 3s linear infinite, lang-glow 2.5s ease-in-out infinite; border:none; cursor:pointer; font-size:1.35rem; line-height:1; transition:transform .2s; }
        .lang-fab:hover { transform:scale(1.12); }
        .lang-menu { position:absolute; bottom:calc(100% + 0.6rem); right:0; background:linear-gradient(160deg,#1A0800,#0D0500); border:1px solid rgba(255,215,0,0.2); border-radius:16px; padding:0.45rem; min-width:148px; box-shadow:0 -8px 32px rgba(0,0,0,0.5),0 0 20px rgba(255,107,0,0.15); animation:lang-pop .2s cubic-bezier(.22,1,.36,1); z-index:1000; }
        .lang-option { display:flex; align-items:center; gap:0.65rem; width:100%; border:none; border-radius:10px; padding:0.55rem 0.85rem; font-family:'Nunito Sans',sans-serif; font-weight:800; font-size:0.88rem; cursor:pointer; text-align:left; transition:all .15s; margin-bottom:0.15rem; }
        .lang-option:last-child { margin-bottom:0; }
      `}</style>
      <div ref={ref} style={{ position:"fixed", bottom:"5.5rem", right:"1.5rem", zIndex:999 }}>
        {open && (
          <div className="lang-menu">
            <p style={{ margin:"0 0 0.35rem", padding:"0 0.5rem", fontSize:"0.6rem", fontWeight:800, letterSpacing:"0.14em", textTransform:"uppercase", color:"rgba(255,215,0,0.45)", fontFamily:"'Nunito Sans',sans-serif" }}>Language</p>
            {LANGS.map(l => (
              <button key={l.code} className="lang-option" onClick={() => { setLang(l.code); setOpen(false); }}
                style={{ background:lang===l.code?"linear-gradient(135deg,rgba(255,107,0,0.22),rgba(255,61,0,0.12))":"transparent", border:lang===l.code?"1px solid rgba(255,107,0,0.35)":"1px solid transparent", color:lang===l.code?"#FFD700":"#FFF5E6" }}>
                <span style={{ fontSize:"1.15rem" }}>{l.flag}</span>
                <span>{l.full}</span>
                {lang===l.code && <span style={{ marginLeft:"auto", color:"#FF6B00", fontSize:"0.75rem" }}>✓</span>}
              </button>
            ))}
          </div>
        )}
        <button className="lang-fab" onClick={() => setOpen(o => !o)}>🌐</button>
      </div>
    </>
  );
}

// Layout wrapper — hides Navbar/Footer on admin page
function Layout({ children }) {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/sparknest-cp");
  return (
    <div className="min-h-screen bg-dark text-white font-body">
      <RouteScrollToTop />
      {!isAdmin && <Navbar />}
      <main>{children}</main>
      {!isAdmin && <Footer />}
      {!isAdmin && <LangSwitcher />}
      {!isAdmin && <ScrollToTop />}
      <Toaster position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <LangProvider>
      <Provider store={store}>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/"              element={<Home />} />
              <Route path="/products"       element={<Products />} />
              <Route path="/products/:slug" element={<ProductDetail />} />
              <Route path="/cart"           element={<Cart />} />
              <Route path="/checkout"       element={<Checkout />} />
              <Route path="/contact"        element={<Contact />} />
              <Route path="/blog"           element={<Blog />} />
              <Route path="/sparknest-cp"    element={<AdminPanel />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </Provider>
    </LangProvider>
  );
}
