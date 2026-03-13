import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart, updateQty } from "../../redux/slices/cartSlice";
import { ShoppingCart, SlidersHorizontal, X, Baby, ChevronDown, ChevronLeft, ChevronRight, Search, Heart } from "lucide-react";
import toast from "react-hot-toast";
import { useLang } from "../../components/LangContext/LangContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const toSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const CATEGORIES = ["Sparklers","Rockets","Bombs","Flower Pots","Sky Shots","Kids Special","Combo Packs","Gift Boxes"];

function ProductCard({ product, wishlist, onWishlist }) {
  const dispatch  = useDispatch();
  const { t } = useLang();
  const CAT_MAP = {
    "Sparklers":"catSparklers","Rockets":"catRockets","Bombs":"catBombs",
    "Flower Pots":"catFlowerPots","Sky Shots":"catSkyShots","Kids Special":"catKidsSpecial",
    "Combo Packs":"catComboPacks","Gift Boxes":"catGiftBoxes",
  };
  const cartItems = useSelector(s => s.cart.items);
  const cartItem  = cartItems.find(i => i._id === product._id);
  const qty       = cartItem ? cartItem.quantity : 0;
  const discount  = product.originalPrice ? Math.round(100 - (product.price / product.originalPrice) * 100) : 0;
  const [imgErr, setImgErr] = useState(false);
  const isWished  = wishlist.includes(product._id);

  const [qtyFocused, setQtyFocused] = useState(false);
  const [qtyVal, setQtyVal]         = useState(String(qty));
  if (!qtyFocused && qtyVal !== String(qty)) setQtyVal(String(qty));

  const max = Math.min(99, product.stock || 99);

  const commitQty = () => {
    const v = parseInt(qtyVal);
    if (!isNaN(v) && v >= 1) dispatch(updateQty({ id: product._id, quantity: Math.min(max, v) }));
    else if (!isNaN(v) && v < 1) dispatch(removeFromCart(product._id));
    else setQtyVal(String(qty));
    setQtyFocused(false);
  };

  const handleAdd  = (e) => { e.preventDefault(); dispatch(addToCart(product)); toast.success("Added to cart! 🎆", { duration:1500 }); };
  const handleInc  = (e) => { e.preventDefault(); if (qty < max) dispatch(updateQty({ id: product._id, quantity: qty + 1 })); };
  const handleDec  = (e) => { e.preventDefault(); qty > 1 ? dispatch(updateQty({ id: product._id, quantity: qty - 1 })) : dispatch(removeFromCart(product._id)); };
  const handleWish = (e) => { e.preventDefault(); onWishlist(product._id); toast(isWished ? "Removed from wishlist" : "Added to wishlist ❤️", { duration:1200 }); };

  return (
    <div className="prod-card" style={{ display:"flex", flexDirection:"row", alignItems:"stretch", minHeight:115 }}>
      <Link to={`/products/${toSlug(product.name)}`} style={{ display:"block", flexShrink:0, width:105, position:"relative" }}>
        <div style={{ width:105, height:"100%", minHeight:115, background:"#111", overflow:"hidden", borderRadius:"14px 0 0 14px", position:"relative" }}>
          {!imgErr
            ? <img src={product.image} alt={product.name} onError={() => setImgErr(true)}
                style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", transition:"transform .4s ease" }} className="prod-img" />
            : <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#1a0a00,#0d0600)", fontSize:"2rem" }}>🎆</div>
          }
          {discount > 0 && (
            <div style={{ position:"absolute", top:7, left:0, background:"linear-gradient(135deg,#FF3D00,#FF6B00)", color:"#fff", fontSize:"0.55rem", fontWeight:800, padding:"0.12rem 0.42rem", borderRadius:"0 6px 6px 0" }}>
              -{discount}%
            </div>
          )}
        </div>
      </Link>

      <div className="prod-card-content" style={{ flex:1, padding:"0.5rem 0.65rem", display:"flex", flexDirection:"column", justifyContent:"space-between", minWidth:0 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"0.25rem" }}>
          <div style={{ minWidth:0, flex:1 }}>
            <div className="prod-cat-line" style={{ fontSize:"1.05rem", color:"#FF6B00", fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"0.12rem", display:"flex", alignItems:"center", gap:"0.3rem", flexWrap:"nowrap", overflow:"hidden" }}>
              {t[CAT_MAP[product.category]] || product.category}
            </div>
            <Link to={`/products/${toSlug(product.name)}`} style={{ textDecoration:"none" }}>
              <div className="prod-name" style={{ fontSize:"1.05rem", fontWeight:700, color:"rgba(255,245,230,0.92)", lineHeight:1.3, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                {product.name}
              </div>
            </Link>
          </div>
          <button onClick={handleWish}
            style={{ flexShrink:0, width:27, height:27, borderRadius:"50%", border:`1.5px solid ${isWished ? "rgba(255,61,0,0.5)" : "rgba(255,245,230,0.12)"}`, background: isWished ? "rgba(255,61,0,0.1)" : "rgba(255,255,255,0.04)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s", marginLeft:"0.25rem" }}>
            <Heart size={12} fill={isWished ? "#FF3D00" : "none"} color={isWished ? "#FF3D00" : "rgba(255,245,230,0.6)"} strokeWidth={2} />
          </button>
        </div>

        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:"0.25rem", marginTop:"0.25rem" }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:"0.25rem", marginBottom:"0.18rem" }}>
              {product.stock <= 20
                ? <span style={{ fontSize:"0.82rem", fontWeight:800, padding:"0.18rem 0.55rem", borderRadius:100, background:"rgba(255,61,0,0.18)", color:"#FF4500", border:"1px solid rgba(255,61,0,0.35)", whiteSpace:"nowrap" }}>🔥 Only {product.stock} left</span>
                : <span style={{ fontSize:"0.82rem", fontWeight:800, padding:"0.18rem 0.55rem", borderRadius:100, background:"rgba(46,204,113,0.15)", color:"#2ECC71", border:"1px solid rgba(46,204,113,0.3)", whiteSpace:"nowrap" }}>✓ {product.stock} in stock</span>
              }
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"0.3rem" }}>
              <span style={{ fontSize:"1.05rem", fontWeight:800, color:"#FFD700" }}>₹{product.price}</span>
              {product.originalPrice > product.price && (
                <span style={{ fontSize:"0.9rem", color:"rgba(255,245,230,0.6)", textDecoration:"line-through" }}>₹{product.originalPrice}</span>
              )}
            </div>
          </div>
          {qty === 0 ? (
            <button onClick={handleAdd} style={{ background:"linear-gradient(135deg,#FF6B00,#FF3D00)", border:"none", borderRadius:8, color:"#fff", fontWeight:800, fontSize:"1rem", padding:"0.42rem 0.85rem", cursor:"pointer", display:"flex", alignItems:"center", gap:"0.2rem", boxShadow:"0 2px 8px rgba(255,107,0,0.65)", fontFamily:"'Source Sans 3',sans-serif", whiteSpace:"nowrap", flexShrink:0 }}>
              + ADD
            </button>
          ) : (
            <div style={{ display:"flex", alignItems:"center", background:"linear-gradient(135deg,#FF6B00,#FF3D00)", borderRadius:8, overflow:"hidden", boxShadow:"0 2px 8px rgba(255,107,0,0.65)", flexShrink:0 }}>
              <button onClick={handleDec} style={{ width:24, height:28, border:"none", background:"transparent", color:"#fff", fontWeight:800, fontSize:"1.05rem", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>−</button>
              <input
                type="number" min="1" max="99"
                value={qtyVal}
                onChange={e => setQtyVal(e.target.value)}
                onFocus={e => { setQtyFocused(true); e.target.select(); }}
                onBlur={commitQty}
                onKeyDown={e => { if (e.key === "Enter") { commitQty(); e.target.blur(); } }}
                onClick={e => e.preventDefault()}
                style={{ width:28, textAlign:"center", color:"#fff", fontWeight:800, fontSize:"1.05rem", background:"transparent", border:"none", outline:"none", MozAppearance:"textfield", WebkitAppearance:"none" }}
              />
              <button onClick={handleInc} disabled={qty >= max} style={{ width:24, height:28, border:"none", background:"transparent", color: qty >= max ? "rgba(255,255,255,0.3)" : "#fff", fontWeight:800, fontSize:"1.05rem", cursor: qty >= max ? "not-allowed" : "pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function WishlistView({ wishlist, onWishlist, products }) {
  const wishedProducts = products.filter(p => wishlist.includes(p._id));
  return (
    <div>
      <div style={{ marginBottom:"1.5rem" }}>
        <h2 style={{ fontFamily:"'Libre Baskerville',serif", textTransform:"uppercase", letterSpacing:"0.05em", fontSize:"1.1rem", color:"#FFF5E6", margin:0, display:"flex", alignItems:"center", gap:"0.5rem" }}>
          <Heart size={18} fill="#FF3D00" color="#FF3D00" /> My Wishlist
          <span style={{ fontFamily:"'Source Sans 3',sans-serif", fontSize:"1.05rem", fontWeight:600, color:"rgba(255,245,230,0.72)", marginLeft:"0.25rem" }}>({wishedProducts.length} items)</span>
        </h2>
      </div>
      {wishedProducts.length === 0 ? (
        <div style={{ textAlign:"center", padding:"4rem 2rem", color:"rgba(255,245,230,0.6)" }}>
          <Heart size={48} color="rgba(255,245,230,0.15)" style={{ marginBottom:"1rem" }} />
          <p style={{ fontSize:"1rem", fontWeight:600, color:"rgba(255,245,230,0.72)", marginBottom:"0.5rem" }}>Your wishlist is empty</p>
          <p style={{ fontSize:"1rem" }}>Tap the ♡ on any product to save it here</p>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"0.85rem" }}>
          {wishedProducts.map(p => (
            <ProductCard key={p._id} product={p} wishlist={wishlist} onWishlist={onWishlist} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Products() {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const SORT_OPTIONS = [
    { label:"Newest First",    value:"newest"     },
    { label:"Price: Low→High", value:"price_asc"  },
    { label:"Price: High→Low", value:"price_desc" },
    { label:"Top Rated",       value:"rating"     },
  ];
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/api/products?limit=100`)
      .then(r => r.json())
      .then(data => { if (data.success) setProducts(data.products); })
      .catch(err => console.error("Failed to fetch products:", err))
      .finally(() => setLoading(false));
  }, []);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch]           = useState("");
  const [activeTab, setActiveTab]     = useState("all");

  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sparknest_wishlist") || "[]"); } catch { return []; }
  });
  const toggleWishlist = (id) => {
    setWishlist(prev => {
      const next = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
      localStorage.setItem("sparknest_wishlist", JSON.stringify(next));
      return next;
    });
  };

  const [selectedCats, setSelectedCats] = useState(() => { const cat = searchParams.get("category"); return cat ? [cat] : []; });
  const [priceRange, setPriceRange]     = useState([0, 2000]);
  const [kidsOnly, setKidsOnly]         = useState(searchParams.get("isSafeForKids") === "true");
  const [sortBy, setSortBy]             = useState("newest");
  const [currentPage, setCurrentPage]   = useState(1);
  const [pendingCats, setPendingCats]   = useState(selectedCats);
  const [pendingPrice, setPendingPrice] = useState(priceRange);
  const [pendingKids, setPendingKids]   = useState(kidsOnly);

  // Sync filters when URL params change (e.g. footer/navbar category links)
  useEffect(() => {
    const cat = searchParams.get("category");
    const kids = searchParams.get("isSafeForKids") === "true";
    if (cat) { setSelectedCats([cat]); setPendingCats([cat]); }
    else { setSelectedCats([]); setPendingCats([]); }
    setKidsOnly(kids); setPendingKids(kids);
    setCurrentPage(1);
  }, [searchParams]);
  const ITEMS_PER_PAGE = 9;

  const toggleCat        = (cat) => setSelectedCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  const togglePendingCat = (cat) => setPendingCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);

  const applyMobileFilters = () => { setSelectedCats(pendingCats); setPriceRange(pendingPrice); setKidsOnly(pendingKids); setSidebarOpen(false); };
  const openSidebar = () => { setPendingCats(selectedCats); setPendingPrice(priceRange); setPendingKids(kidsOnly); setSidebarOpen(true); };
  const clearFilters = () => {
    setSelectedCats([]); setPendingCats([]);
    setPriceRange([0,2000]); setPendingPrice([0,2000]);
    setKidsOnly(false); setPendingKids(false);
    setSortBy("newest"); setSearch(""); setCurrentPage(1);
  };

  const filtered = products
    .filter(p => selectedCats.length === 0 || selectedCats.includes(p.category))
    .filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    .filter(p => !kidsOnly || p.isSafeForKids)
    .filter(p => !search.trim() || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => {
      if (sortBy === "price_asc")  return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "rating")     return b.rating - a.rating;
      return 0;
    });

  useEffect(() => { setCurrentPage(1); }, [selectedCats, priceRange, kidsOnly, sortBy, search]);

  const hasFilters = selectedCats.length > 0 || priceRange[0] > 0 || priceRange[1] < 2000 || kidsOnly;
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((currentPage-1)*ITEMS_PER_PAGE, currentPage*ITEMS_PER_PAGE);

  const FilterContent = ({ pending = false }) => {
    const cats     = pending ? pendingCats   : selectedCats;
    const toggle   = pending ? togglePendingCat : toggleCat;
    const price    = pending ? pendingPrice  : priceRange;
    const setPrice = pending ? setPendingPrice : setPriceRange;
    const kids     = pending ? pendingKids   : kidsOnly;
    const setKids  = pending ? setPendingKids : setKidsOnly;
    return (
      <>
        <div style={{ marginBottom:"1.5rem" }}>
          <p style={{ fontSize:"1rem", letterSpacing:"0.12em", textTransform:"uppercase", color:"#FF6B00", fontWeight:700, fontFamily:"'Nunito Sans',sans-serif", marginBottom:"0.75rem" }}>Categories</p>
          {CATEGORIES.map(cat => (
            <label key={cat} className={`filter-check${cats.includes(cat) ? " active" : ""}`}>
              <input type="checkbox" checked={cats.includes(cat)} onChange={() => toggle(cat)} />{cat}
            </label>
          ))}
        </div>
        <div style={{ marginBottom:"1.5rem" }}>
          <p style={{ fontSize:"1rem", letterSpacing:"0.12em", textTransform:"uppercase", color:"#FF6B00", fontWeight:700, fontFamily:"'Nunito Sans',sans-serif", marginBottom:"0.75rem" }}>Price Range</p>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.5rem" }}>
            <span style={{ fontSize:"1.05rem", color:"#FF6B00", fontWeight:700 }}>₹{price[0]}</span>
            <span style={{ fontSize:"1.05rem", color:"#FF6B00", fontWeight:700 }}>₹{price[1]}</span>
          </div>
          <div style={{ position:"relative", height:34, marginBottom:"0.5rem" }}>
            {/* Track background */}
            <div style={{ position:"absolute", top:"50%", left:0, right:0, height:5, borderRadius:5,
              background:"rgba(255,245,230,0.1)", transform:"translateY(-50%)" }} />
            {/* Active track */}
            <div style={{ position:"absolute", top:"50%", transform:"translateY(-50%)", height:5, borderRadius:5,
              background:"linear-gradient(to right,#FF6B00,#FFD700)",
              left:`${(price[0]/2000)*100}%`,
              right:`${100-(price[1]/2000)*100}%` }} />
            {/* Min thumb */}
            <input type="range" min={0} max={2000} step={50} value={price[0]}
              onChange={e => { const v = Math.min(Number(e.target.value), price[1]-50); setPrice([v, price[1]]); }}
              style={{ position:"absolute", width:"100%", height:"100%", opacity:0, cursor:"pointer", zIndex: price[0] > 1900 ? 5 : 3, top:0, left:0, margin:0 }} />
            {/* Max thumb */}
            <input type="range" min={0} max={2000} step={50} value={price[1]}
              onChange={e => { const v = Math.max(Number(e.target.value), price[0]+50); setPrice([price[0], v]); }}
              style={{ position:"absolute", width:"100%", height:"100%", opacity:0, cursor:"pointer", zIndex:4, top:0, left:0, margin:0 }} />
            {/* Min thumb visual */}
            <div style={{ position:"absolute", top:"50%", transform:"translate(-50%,-50%)",
              left:`${(price[0]/2000)*100}%`, width:18, height:18, borderRadius:"50%",
              background:"#FF6B00", border:"2.5px solid #fff", boxShadow:"0 0 0 3px rgba(255,107,0,0.3)", pointerEvents:"none", zIndex:6 }} />
            {/* Max thumb visual */}
            <div style={{ position:"absolute", top:"50%", transform:"translate(-50%,-50%)",
              left:`${(price[1]/2000)*100}%`, width:18, height:18, borderRadius:"50%",
              background:"#FFD700", border:"2.5px solid #fff", boxShadow:"0 0 0 3px rgba(255,215,0,0.3)", pointerEvents:"none", zIndex:6 }} />
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:"0.1rem" }}>
            <span style={{ fontSize:"0.82rem", color:"rgba(26,8,0,0.45)" }}>₹0</span>
            <span style={{ fontSize:"0.82rem", color:"rgba(26,8,0,0.45)" }}>₹2000</span>
          </div>
        </div>
        <div style={{ marginBottom:"1.2rem" }}>
          <p style={{ fontSize:"1rem", letterSpacing:"0.12em", textTransform:"uppercase", color:"#FF6B00", fontWeight:700, fontFamily:"'Nunito Sans',sans-serif", marginBottom:"0.75rem" }}>Kids Safe Only</p>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background: kids ? "rgba(46,204,113,0.1)" : "rgba(0,0,0,0.04)", border:`1.5px solid ${kids ? "rgba(46,204,113,0.35)" : "rgba(26,8,0,0.1)"}`, borderRadius:12, padding:"0.6rem 0.85rem", cursor:"pointer" }} onClick={() => setKids(k => !k)}>
            <span style={{ fontSize:"1rem", color: kids ? "#1a7a4a" : "rgba(26,8,0,0.6)", fontWeight:700, display:"flex", alignItems:"center", gap:"0.35rem" }}>
              <Baby size={14} strokeWidth={2} color={kids ? "#1ABC9C" : "rgba(26,8,0,0.4)"} />{kids ? "Kids Safe ON" : "Kids Safe OFF"}
            </span>
            <div className={`kids-toggle${kids ? " on" : ""}`} style={{ pointerEvents:"none" }} />
          </div>
        </div>
      </>
    );
  };

  return (
    <div style={{ minHeight:"100vh", background:"#0D0600", fontFamily:"'Source Sans 3', sans-serif", paddingTop:"80px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Nunito+Sans:wght@300;400;600;700;800&family=Source+Sans+3:wght@300;400;600;700&display=swap');

        
        /* Hide number input spinners */
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance:none; margin:0; }
        input[type=number] { -moz-appearance:textfield; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        @keyframes skel-wave { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }

        .skel-bar {
          background: rgba(255,255,255,0.07);
          border-radius: 6px;
          position: relative;
          overflow: hidden;
        }
        .skel-bar::after, .skel-shine::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
          animation: skel-wave 1.4s infinite;
        }
        .skel-shine {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .prod-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,245,230,0.07);
          border-radius: 14px; overflow: hidden;
          transition: transform .3s cubic-bezier(.22,1,.36,1), box-shadow .3s, border-color .3s;
          animation: fadeUp .3s ease both;
        }
        .prod-card:hover { transform: translateY(-3px); box-shadow: 0 12px 36px rgba(0,0,0,0.35); border-color: rgba(255,107,0,0.22); }
        .prod-card:hover .prod-img { transform: scale(1.06); }

        .filter-check {
          display: flex; align-items: center; gap: 0.55rem;
          padding: 0.38rem 0.65rem; border-radius: 9px;
          cursor: pointer; transition: background .2s;
          font-size: 1rem; color: #3a1a00; font-weight: 600; user-select: none; font-family:'Source Sans 3',sans-serif;
        }
        .filter-check:hover { background: rgba(255,107,0,0.07); }
        .filter-check.active { color: #FF6B00; background: rgba(255,107,0,0.11); }
        .filter-check input[type=checkbox] { accent-color:#FF6B00; width:17px; height:17px; cursor:pointer; flex-shrink:0; }

        .sort-select {
          background: #1A0A00; border: 1.5px solid rgba(255,245,230,0.12);
          border-radius: 12px; padding: 0.58rem 2.4rem 0.58rem 1rem;
          color: #FFF5E6; font-family: 'Source Sans 3',sans-serif;
          font-size: 0.82rem; font-weight: 600; outline: none; cursor: pointer;
          appearance: none; -webkit-appearance: none; transition: border-color .2s;
          width: 100%; box-sizing: border-box;
        }
        .sort-select:hover { border-color: rgba(255,107,0,0.6); }
        .sort-select:focus { border-color: rgba(255,107,0,0.55); box-shadow: 0 0 0 3px rgba(255,107,0,0.1); }
        .sort-select option { background:#1A0A00; color:#FFF5E6; }

        .search-bar {
          background: rgba(255,255,255,0.05); border: 1.5px solid rgba(255,245,230,0.1);
          border-radius: 12px; padding: 0.58rem 1rem 0.58rem 2.5rem;
          color: #FFF5E6; font-family: 'Source Sans 3',sans-serif;
          font-size: 0.85rem; outline: none; width: 100%;
          transition: border-color .2s, box-shadow .2s; box-sizing: border-box;
        }
        .search-bar::placeholder { color: rgba(255,245,230,0.65); }
        .search-bar:focus { border-color: rgba(255,107,0,0.5); box-shadow: 0 0 0 3px rgba(255,107,0,0.08); }



        .kids-toggle {
          position:relative; width:42px; height:23px;
          background:rgba(26,8,0,0.15); border-radius:100px;
          transition:background .3s; flex-shrink:0;
          border:1.5px solid rgba(26,8,0,0.15); display:inline-block;
        }
        .kids-toggle.on { background:linear-gradient(135deg,#1ABC9C,#2ECC71); border-color:transparent; }
        .kids-toggle::after {
          content:''; position:absolute; top:2px; left:2px;
          width:15px; height:15px; border-radius:50%; background:#fff;
          transition:transform .3s; box-shadow:0 1px 4px rgba(0,0,0,0.25);
        }
        .kids-toggle.on::after { transform:translateX(19px); }

        .filter-sidebar {
          position: sticky; top: 88px; align-self: flex-start;
          width: 230px; flex-shrink: 0;
          background: linear-gradient(160deg,#FFF8F0,#FFF3E0,#FEF9F0);
          border-radius: 18px; padding: 1.3rem 1.1rem;
          border: 1px solid rgba(255,107,0,0.1);
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
        }

        .filter-overlay {
          display:none; position:fixed; top:80px; left:0; right:0; bottom:0;
          background:rgba(0,0,0,0.65); z-index:40; backdrop-filter:blur(4px);
        }
        .filter-overlay.open { display:block; }

        .filter-drawer {
          position:fixed; top:80px; left:-100%; bottom:0;
          width:min(290px, 85vw);
          background:linear-gradient(160deg,#FFF8F0,#FFF3E0);
          z-index:50; overflow-y:auto;
          padding:1.5rem 1.2rem 1.5rem;
          transition:left .3s cubic-bezier(.22,1,.36,1);
          border-right:1px solid rgba(255,107,0,0.15);
          box-sizing: border-box;
        }
        .filter-drawer.open { left:0; }
        .prod-filter-btn { display:none !important; }

        .tab-bar { display:flex; border-bottom:1px solid rgba(255,245,230,0.08); margin-bottom:1.5rem; }
        .tab-btn {
          padding:0.55rem 1.2rem; border:none; background:none; cursor:pointer;
          font-family:'Source Sans 3',sans-serif; font-size:1rem; font-weight:600;
          color:rgba(255,245,230,0.7); border-bottom:2px solid transparent;
          transition:all .2s; display:flex; align-items:center; gap:0.4rem;
        }
        .tab-btn.active { color:#FF6B00; border-bottom-color:#FF6B00; }

        /* ── Navbar fix: solid background on this dark page ── */
        nav { background: rgba(8,4,0,0.95) !important; backdrop-filter: blur(20px) saturate(180%) !important; -webkit-backdrop-filter: blur(20px) saturate(180%) !important; border-bottom: 1px solid rgba(255,215,0,0.15) !important; }

        @media(max-width:900px) {
          .filter-sidebar  { display:none !important; }
          .prod-filter-btn { display:flex !important; }
          .prod-grid { grid-template-columns:1fr !important; }
        }

        /* Mobile toolbar: search full width on top, filters+sort below */
        @media(max-width:480px) {
          .prod-grid { gap:0.65rem !important; }
          .toolbar-wrap { flex-wrap:wrap !important; }
          .toolbar-search { order:0; flex: 0 0 100% !important; min-width:100% !important; }
          .toolbar-row2 { order:1; display:flex !important; width:100%; gap:0.65rem; }
          .toolbar-sort { flex:1 !important; }

          /* Card mobile fixes */
          .prod-card { min-height:85px !important; }
          .prod-card-content { padding:0.38rem 0.5rem !important; }
          .prod-cat-line { font-size:0.68rem !important; letter-spacing:0.03em !important; gap:0.2rem !important; white-space:nowrap !important; overflow:hidden !important; }
          .prod-name { font-size:0.88rem !important; -webkit-line-clamp:1 !important; }
        }
      `}</style>

      <div className={`filter-overlay${sidebarOpen ? " open" : ""}`} onClick={() => setSidebarOpen(false)} />

      {/* Mobile filter drawer */}
      <div className={`filter-drawer${sidebarOpen ? " open" : ""}`}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.3rem" }}>
          <span style={{ fontWeight:800, color:"#1a0800", fontSize:"1.05rem", display:"flex", alignItems:"center", gap:"0.4rem" }}>
            <SlidersHorizontal size={15} color="#FF6B00" /> Filters
          </span>
          <button onClick={() => setSidebarOpen(false)} style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(26,8,0,0.5)", padding:"0.2rem" }}>
            <X size={18} />
          </button>
        </div>
        <FilterContent pending={true} />
        <div style={{ marginTop:"1.5rem", paddingTop:"1rem", borderTop:"1px solid rgba(255,107,0,0.12)" }}>
          <button onClick={applyMobileFilters}
            style={{ width:"100%", boxSizing:"border-box", background:"linear-gradient(135deg,#FF6B00,#FF3D00)", border:"none", borderRadius:12, color:"#fff", fontFamily:"'Source Sans 3',sans-serif", fontWeight:800, fontSize:"1rem", padding:"0.82rem", cursor:"pointer", boxShadow:"0 4px 16px rgba(255,107,0,0.65)" }}>
            Apply
          </button>
        </div>
      </div>

      <div style={{ maxWidth:1380, margin:"0 auto", padding:"0 clamp(1.2rem,4vw,3rem)" }}>

        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"2rem 0 1.5rem", borderBottom:"1px solid rgba(255,245,230,0.06)", marginBottom:"1.5rem", flexWrap:"wrap", gap:"1rem" }}>
          <h1 style={{ fontFamily:"'Libre Baskerville',serif", textTransform:"uppercase", letterSpacing:"0.05em", fontSize:"clamp(1.1rem,3vw,1.9rem)", color:"#FFF5E6", fontWeight:900, margin:0 }}>
            Shop <span style={{ background:"linear-gradient(90deg,#FFD700,#FF6B00,#FF1493)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Crackers</span>
          </h1>
          <p style={{ color:"rgba(255,245,230,0.72)", fontSize:"0.9rem", margin:0 }}>
            {filtered.length} products · Page {currentPage}/{totalPages || 1}
          </p>
        </div>

        <div style={{ display:"flex", gap:"1.8rem", paddingBottom:"4rem" }}>

          {/* Desktop Sidebar */}
          <aside className="filter-sidebar">
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.3rem" }}>
              <span style={{ fontWeight:800, color:"#1a0800", fontSize:"1rem", display:"flex", alignItems:"center", gap:"0.4rem" }}>
                <SlidersHorizontal size={15} color="#FF6B00" /> Filters
              </span>
              {hasFilters && (
                <button onClick={clearFilters} style={{ background:"none", border:"none", color:"rgba(255,107,0,0.7)", fontSize:"1rem", fontWeight:700, cursor:"pointer", fontFamily:"'Source Sans 3',sans-serif", display:"flex", alignItems:"center", gap:"0.2rem" }}>
                  <X size={11}/> Clear
                </button>
              )}
            </div>
            <FilterContent pending={false} />

          </aside>

          {/* Main */}
          <div style={{ flex:1, minWidth:0 }}>

            <div className="tab-bar">
              <button className={`tab-btn${activeTab==="all" ? " active" : ""}`} onClick={() => setActiveTab("all")}>All Products</button>
              <button className={`tab-btn${activeTab==="wishlist" ? " active" : ""}`} onClick={() => setActiveTab("wishlist")}>
                <Heart size={13} fill={activeTab==="wishlist" ? "#FF3D00" : "none"} color={activeTab==="wishlist" ? "#FF3D00" : "rgba(255,245,230,0.7)"} />
                Wishlist {wishlist.length > 0 && <span style={{ background: activeTab==="wishlist" ? "#FF3D00" : "rgba(255,107,0,0.2)", color: activeTab==="wishlist" ? "#fff" : "#FF6B00", borderRadius:"50%", width:17, height:17, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:"0.6rem", fontWeight:800 }}>{wishlist.length}</span>}
              </button>
            </div>

            {activeTab === "wishlist" ? (
              <WishlistView wishlist={wishlist} onWishlist={toggleWishlist} products={products} />
            ) : (
              <>
                {/* Toolbar */}
                <div className="toolbar-wrap" style={{ display:"flex", gap:"0.65rem", marginBottom:"1.2rem", alignItems:"center" }}>
                  <div className="toolbar-search" style={{ position:"relative", flex:1, minWidth:160 }}>
                    <Search size={14} color="rgba(255,245,230,0.55)" style={{ position:"absolute", left:"0.85rem", top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }} />
                    <input className="search-bar" placeholder="Search crackers…" value={search} onChange={e => setSearch(e.target.value)} />
                  </div>

                  <div className="toolbar-row2" style={{ display:"contents" }}>
                    <button onClick={openSidebar} className="prod-filter-btn"
                      style={{ alignItems:"center", gap:"0.4rem", background:"rgba(255,107,0,0.1)", border:"1.5px solid rgba(255,107,0,0.3)", borderRadius:12, padding:"0.58rem 1rem", color:"#FF6B00", fontFamily:"'Source Sans 3',sans-serif", fontSize:"1rem", fontWeight:600, cursor:"pointer", flexShrink:0 }}>
                      <SlidersHorizontal size={14}/> Filters
                      {hasFilters && <span style={{ background:"#FF6B00", color:"#fff", borderRadius:"50%", width:17, height:17, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:"0.6rem", fontWeight:800 }}>{selectedCats.length + (kidsOnly?1:0)}</span>}
                    </button>
                    <div className="toolbar-sort" style={{ position:"relative", flexShrink:0 }}>
                      <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                        {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                      <ChevronDown size={14} color="#FF6B00" style={{ position:"absolute", right:"0.75rem", top:"50%", transform:"translateY(-50%)", pointerEvents:"none", strokeWidth:2.5 }} />
                    </div>
                  </div>
                </div>

                {/* Active chips */}
                {(selectedCats.length > 0 || kidsOnly) && (
                  <div style={{ display:"flex", gap:"0.45rem", flexWrap:"wrap", marginBottom:"1rem" }}>
                    {selectedCats.map(c => (
                      <div key={c} style={{ display:"inline-flex", alignItems:"center", gap:"0.3rem", background:"rgba(255,107,0,0.12)", border:"1px solid rgba(255,107,0,0.3)", borderRadius:100, padding:"0.28rem 0.8rem", fontSize:"1rem", color:"#FF6B00", fontWeight:600 }}>
                        {c} <X size={10} style={{ cursor:"pointer" }} onClick={() => toggleCat(c)} />
                      </div>
                    ))}
                    {kidsOnly && (
                      <div style={{ display:"inline-flex", alignItems:"center", gap:"0.3rem", background:"rgba(46,204,113,0.12)", border:"1px solid rgba(46,204,113,0.3)", borderRadius:100, padding:"0.28rem 0.8rem", fontSize:"1rem", color:"#2ECC71", fontWeight:600 }}>
                        <Baby size={10}/> Kids Safe <X size={10} style={{ cursor:"pointer" }} onClick={() => setKidsOnly(false)} />
                      </div>
                    )}
                  </div>
                )}

                {/* Grid */}
                {loading ? (
                  <div className="prod-grid" style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"0.8rem" }}>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} style={{ display:"flex", flexDirection:"row", minHeight:115, borderRadius:14, overflow:"hidden", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,245,230,0.07)" }}>
                        {/* Image skeleton */}
                        <div style={{ width:105, flexShrink:0, background:"rgba(255,255,255,0.06)", position:"relative", overflow:"hidden" }}>
                          <div className="skel-shine" />
                        </div>
                        {/* Content skeleton */}
                        <div style={{ flex:1, padding:"0.65rem 0.75rem", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
                          <div>
                            <div className="skel-bar" style={{ width:"45%", height:10, marginBottom:8 }} />
                            <div className="skel-bar" style={{ width:"90%", height:13, marginBottom:5 }} />
                            <div className="skel-bar" style={{ width:"65%", height:13 }} />
                          </div>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                            <div>
                              <div className="skel-bar" style={{ width:70, height:11, marginBottom:6 }} />
                              <div className="skel-bar" style={{ width:55, height:16 }} />
                            </div>
                            <div className="skel-bar" style={{ width:60, height:30, borderRadius:8 }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filtered.length === 0 ? (
                  <div style={{ textAlign:"center", padding:"5rem 2rem", color:"rgba(255,245,230,0.6)" }}>
                    <div style={{ fontSize:"3.5rem", marginBottom:"1rem" }}>🎆</div>
                    <p style={{ fontSize:"1.05rem", fontWeight:600, color:"rgba(255,245,230,0.55)", marginBottom:"0.4rem" }}>No products found</p>
                    <p style={{ fontSize:"1rem" }}>Try adjusting your filters</p>
                    <button onClick={clearFilters} style={{ marginTop:"1rem", background:"rgba(255,107,0,0.1)", border:"1px solid rgba(255,107,0,0.3)", borderRadius:100, padding:"0.55rem 1.4rem", color:"#FF6B00", fontFamily:"'Source Sans 3',sans-serif", fontSize:"1rem", fontWeight:700, cursor:"pointer" }}>Clear Filters</button>
                  </div>
                ) : (
                  <>
                    <div className="prod-grid" style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"0.8rem" }}>
                      {paginated.map((p,i) => (
                        <div key={p._id} style={{ animationDelay:`${i*0.03}s` }}>
                          <ProductCard product={p} wishlist={wishlist} onWishlist={toggleWishlist} />
                        </div>
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"0.45rem", marginTop:"2rem", flexWrap:"wrap" }}>
                        <button onClick={() => { setCurrentPage(p => Math.max(1,p-1)); window.scrollTo({top:0,behavior:"smooth"}); }} disabled={currentPage===1}
                          style={{ width:36, height:36, borderRadius:9, border:"1.5px solid rgba(255,245,230,0.12)", background: currentPage===1 ? "rgba(255,255,255,0.03)" : "rgba(255,107,0,0.1)", color: currentPage===1 ? "rgba(255,245,230,0.2)" : "#FF6B00", cursor: currentPage===1 ? "not-allowed" : "pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                          <ChevronLeft size={16} strokeWidth={2.5}/>
                        </button>
                        {Array.from({ length:totalPages },(_,i)=>i+1)
                          .filter(n => n===1||n===totalPages||Math.abs(n-currentPage)<=1)
                          .reduce((acc,n,idx,arr) => { if(idx>0&&n-arr[idx-1]>1)acc.push("..."); acc.push(n); return acc; },[])
                          .map((item,idx) => item==="..." ? (
                            <span key={`d${idx}`} style={{ color:"rgba(255,245,230,0.55)", padding:"0 0.1rem" }}>…</span>
                          ) : (
                            <button key={item} onClick={() => { setCurrentPage(item); window.scrollTo({top:0,behavior:"smooth"}); }}
                              style={{ width:36, height:36, borderRadius:9, border: item===currentPage ? "none" : "1.5px solid rgba(255,245,230,0.12)", background: item===currentPage ? "linear-gradient(135deg,#FF6B00,#FF3D00)" : "rgba(255,255,255,0.04)", color: item===currentPage ? "#fff" : "rgba(255,245,230,0.6)", fontFamily:"'Source Sans 3',sans-serif", fontSize:"1.05rem", fontWeight: item===currentPage?800:500, cursor:"pointer", boxShadow: item===currentPage ? "0 4px 14px rgba(255,107,0,0.65)" : "none" }}>
                              {item}
                            </button>
                          ))
                        }
                        <button onClick={() => { setCurrentPage(p => Math.min(totalPages,p+1)); window.scrollTo({top:0,behavior:"smooth"}); }} disabled={currentPage===totalPages}
                          style={{ width:36, height:36, borderRadius:9, border:"1.5px solid rgba(255,245,230,0.12)", background: currentPage===totalPages ? "rgba(255,255,255,0.03)" : "rgba(255,107,0,0.1)", color: currentPage===totalPages ? "rgba(255,245,230,0.2)" : "#FF6B00", cursor: currentPage===totalPages ? "not-allowed" : "pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                          <ChevronRight size={16} strokeWidth={2.5}/>
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
