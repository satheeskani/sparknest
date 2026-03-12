import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ChevronUp } from "lucide-react";
import { store } from "./redux/store";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

import Home from "./pages/Home/Home";
import Products from "./pages/Products/Products";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";

function RouteScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
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
      style={{
        position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 999,
        width: 48, height: 48, borderRadius: "50%",
        background: "linear-gradient(135deg,#FF6B00,#FF3D00)",
        border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 20px rgba(255,107,0,0.5)",
        transition: "transform .2s",
      }}
      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.12)"}
      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      title="Back to top"
    >
      <ChevronUp size={22} color="#fff" strokeWidth={3} />
    </button>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="min-h-screen bg-dark text-white font-body">
          <RouteScrollToTop />
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:slug" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
          </main>
          <Footer />
          <ScrollToTop />
          <Toaster position="top-right" />
        </div>
      </BrowserRouter>
    </Provider>
  );
}
