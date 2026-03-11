import { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart, updateQty } from "../../redux/slices/cartSlice";
import { fetchProducts } from "../../utils/api";
import { ShoppingCart, Star, SlidersHorizontal, X, Baby, Flame, ChevronDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import toast from "react-hot-toast";

const toSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const CATEGORIES = ["Sparklers","Rockets","Bombs","Flower Pots","Sky Shots","Kids Special","Combo Packs","Gift Boxes"];
const SORT_OPTIONS = [
  { label:"Newest First",    value:"newest"     },
  { label:"Price: Low→High", value:"price_asc"  },
  { label:"Price: High→Low", value:"price_desc" },
  { label:"Top Rated",       value:"rating"     },
];

// ── Placeholder products for UI (replace with real API data) ──
const DEMO_PRODUCTS = [
  { _id:"1",  name:"Golden Sparklers Pack",      category:"Sparklers",   price:299,  originalPrice:399,  rating:4.8, numReviews:124, isSafeForKids:true,  image:"https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80" },
  { _id:"2",  name:"Sky Rocket 10-in-1",         category:"Rockets",     price:549,  originalPrice:699,  rating:4.6, numReviews:89,  isSafeForKids:false, image:"https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=400&q=80" },
  { _id:"3",  name:"Rainbow Flower Pot Set",     category:"Flower Pots", price:399,  originalPrice:499,  rating:4.9, numReviews:201, isSafeForKids:true,  image:"https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=400&q=80" },
  { _id:"4",  name:"Thunder Bomb Pack (20pcs)",  category:"Bombs",       price:199,  originalPrice:249,  rating:4.3, numReviews:56,  isSafeForKids:false, image:"https://images.unsplash.com/photo-1514254040595-6e0d913fc1e4?w=400&q=80" },
  { _id:"5",  name:"Sky Shot Premium Bundle",    category:"Sky Shots",   price:899,  originalPrice:1199, rating:4.7, numReviews:143, isSafeForKids:false, image:"https://images.unsplash.com/photo-1533230408708-8f9f91d1235a?w=400&q=80" },
  { _id:"6",  name:"Kids Fun Cracker Set",       category:"Kids Special",price:349,  originalPrice:449,  rating:4.9, numReviews:312, isSafeForKids:true,  image:"https://images.unsplash.com/photo-1604881991720-f91add269bed?w=400&q=80" },
  { _id:"7",  name:"Diwali Mega Combo Pack",     category:"Combo Packs", price:1499, originalPrice:1999, rating:4.8, numReviews:267, isSafeForKids:false, image:"https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&q=80" },
  { _id:"8",  name:"Premium Gift Box Deluxe",    category:"Gift Boxes",  price:799,  originalPrice:999,  rating:4.6, numReviews:98,  isSafeForKids:true,  image:"https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&q=80" },
  { _id:"9",  name:"Silver Sparklers (50pcs)",   category:"Sparklers",   price:179,  originalPrice:199,  rating:4.5, numReviews:445, isSafeForKids:true,  image:"https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80" },
  { _id:"10", name:"Colour Rain Rockets",        category:"Rockets",     price:649,  originalPrice:799,  rating:4.4, numReviews:72,  isSafeForKids:false, image:"https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=400&q=80" },
  { _id:"11", name:"Mini Flower Pot (12pcs)",    category:"Flower Pots", price:249,  originalPrice:299,  rating:4.7, numReviews:189, isSafeForKids:true,  image:"https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=400&q=80" },
  { _id:"12", name:"Atom Bomb Special (10pcs)",  category:"Bombs",       price:149,  originalPrice:199,  rating:4.2, numReviews:33,  isSafeForKids:false, image:"https://images.unsplash.com/photo-1514254040595-6e0d913fc1e4?w=400&q=80" },
];

function StarRating({ rating }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"0.2rem" }}>
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={11}
          fill={s <= Math.round(rating) ? "#FFD700" : "none"}
          color={s <= Math.round(rating) ? "#FFD700" : "rgba(255,245,230,0.2)"}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const cartItems = useSelector(s => s.cart.items);
  const cartItem = cartItems.find(i => i._id === product._id);
  const qty = cartItem ? cartItem.quantity : 0;
  const discount = product.originalPrice
    ? Math.round(100 - (product.price / product.originalPrice) * 100)
    : 0;
  const [imgErr, setImgErr] = useState(false);

  const handleAdd = (e) => { e.preventDefault(); dispatch(addToCart(product)); toast.success("Added to cart! 🎆", { duration:1500 }); };
  const handleInc = (e) => { e.preventDefault(); dispatch(updateQty({ id: product._id, quantity: qty + 1 })); };
  const handleDec = (e) => { e.preventDefault(); qty > 1 ? dispatch(updateQty({ id: product._id, quantity: qty - 1 })) : dispatch(removeFromCart(product._id)); };

  return (
    <div className="prod-card">
      {/* Image */}
      <Link to={`/products/${toSlug(product.name)}`} style={{ display:"block", position:"relative", overflow:"hidden" }}>
        <div style={{ height:190, background:"#111", overflow:"hidden", position:"relative" }}>
          {!imgErr ? (
            <img src={product.image} alt={product.name}
              onError={() => setImgErr(true)}
              style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", transition:"transform .4s ease" }}
              className="prod-img"
            />
          ) : (
            <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#1a0a00,#0d0600)", fontSize:"3rem" }}>
              🎆
            </div>
          )}
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,transparent 55%,rgba(0,0,0,0.55) 100%)", pointerEvents:"none" }} />
          {discount > 0 && (
            <div style={{ position:"absolute", top:10, left:10, background:"linear-gradient(135deg,#FF3D00,#FF6B00)", color:"#fff", fontSize:"0.65rem", fontWeight:800, padding:"0.22rem 0.55rem", borderRadius:100, letterSpacing:"0.04em", boxShadow:"0 2px 8px rgba(255,61,0,0.5)" }}>
              -{discount}%
            </div>
          )}
          {product.isSafeForKids && (
            <div style={{ position:"absolute", top:10, right:10, background:"linear-gradient(135deg,#1ABC9C,#2ECC71)", color:"#fff", fontSize:"0.6rem", fontWeight:800, padding:"0.22rem 0.5rem", borderRadius:100, display:"flex", alignItems:"center", gap:"0.2rem", boxShadow:"0 2px 8px rgba(46,204,113,0.5)" }}>
              <Baby size={9} strokeWidth={2.5} /> Kids Safe
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div style={{ padding:"0.85rem 0.9rem 0.9rem" }}>
        <div style={{ fontSize:"0.65rem", color:"#FF6B00", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"0.25rem" }}>
          {product.category}
        </div>
        <Link to={`/products/${toSlug(product.name)}`} style={{ textDecoration:"none" }}>
          <div style={{ fontSize:"0.88rem", fontWeight:700, color:"rgba(255,245,230,0.92)", lineHeight:1.35, marginBottom:"0.45rem", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
            {product.name}
          </div>
        </Link>
        <div style={{ display:"flex", alignItems:"center", gap:"0.35rem", marginBottom:"0.55rem" }}>
          <StarRating rating={product.rating} />
          <span style={{ fontSize:"0.7rem", color:"rgba(255,245,230,0.8)", fontWeight:500 }}>
            {product.rating} ({product.numReviews})
          </span>
        </div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
            <span style={{ fontSize:"1.05rem", fontWeight:800, color:"#FFD700" }}>₹{product.price}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span style={{ fontSize:"0.75rem", color:"rgba(255,245,230,0.55)", textDecoration:"line-through" }}>₹{product.originalPrice}</span>
            )}
          </div>
          {/* Zomato-style add button */}
          {qty === 0 ? (
            <button onClick={handleAdd} style={{ background:"linear-gradient(135deg,#FF6B00,#FF3D00)", border:"none", borderRadius:10, color:"#fff", fontWeight:800, fontSize:"0.78rem", padding:"0.45rem 0.9rem", cursor:"pointer", display:"flex", alignItems:"center", gap:"0.3rem", boxShadow:"0 3px 12px rgba(255,107,0,0.4)", fontFamily:"'DM Sans',sans-serif", transition:"transform .15s" }}
              onMouseDown={e=>e.currentTarget.style.transform="scale(0.95)"} onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}>
              <span style={{ fontSize:"1rem", lineHeight:1 }}>+</span> ADD
            </button>
          ) : (
            <div style={{ display:"flex", alignItems:"center", gap:0, background:"linear-gradient(135deg,#FF6B00,#FF3D00)", borderRadius:10, overflow:"hidden", boxShadow:"0 3px 12px rgba(255,107,0,0.4)" }}>
              <button onClick={handleDec} style={{ width:32, height:32, border:"none", background:"transparent", color:"#fff", fontWeight:800, fontSize:"1.1rem", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>−</button>
              <span style={{ minWidth:24, textAlign:"center", color:"#fff", fontWeight:800, fontSize:"0.85rem" }}>{qty}</span>
              <button onClick={handleInc} style={{ width:32, height:32, border:"none", background:"transparent", color:"#fff", fontWeight:800, fontSize:"1.1rem", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const [products, setProducts]     = useState(DEMO_PRODUCTS);
  const [loading, setLoading]       = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch]         = useState("");

  // Filter state
  const [selectedCats, setSelectedCats] = useState(() => {
    const cat = searchParams.get("category");
    return cat ? [cat] : [];
  });
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [kidsOnly, setKidsOnly]     = useState(searchParams.get("isSafeForKids") === "true");
  const [sortBy, setSortBy]         = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart! 🛒`);
  };

  const toggleCat = (cat) => {
    setSelectedCats(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  // Apply filters + sort to products
  const filtered = products
    .filter(p => selectedCats.length === 0 || selectedCats.includes(p.category))
    .filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    .filter(p => !kidsOnly || p.isSafeForKids)
    .filter(p => !search.trim() || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "price_asc")  return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "rating")     return b.rating - a.rating;
      return 0; // newest — keep original order
    });

  const clearFilters = () => {
    setSelectedCats([]); setPriceRange([0, 2000]);
    setKidsOnly(false); setSortBy("newest"); setSearch("");
    setCurrentPage(1);
  };

  // Reset to page 1 whenever filters/sort/search change
  useEffect(() => { setCurrentPage(1); }, [selectedCats, priceRange, kidsOnly, sortBy, search]);

  const hasFilters   = selectedCats.length > 0 || priceRange[0] > 0 || priceRange[1] < 2000 || kidsOnly;
  const totalPages   = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated    = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div style={{ minHeight:"100vh", background:"#0D0600", fontFamily:"'DM Sans', sans-serif", paddingTop:"80px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@900&family=DM+Sans:wght@300;400;500;600;700;800&display=swap');

        @keyframes shimmer { 0%{background-position:0% center} 100%{background-position:200% center} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to{transform:rotate(360deg)} }

        .prod-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,245,230,0.07);
          border-radius: 16px; overflow: hidden;
          transition: transform .3s cubic-bezier(.22,1,.36,1), box-shadow .3s, border-color .3s;
          animation: fadeUp .35s ease both;
        }
        .prod-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.35);
          border-color: rgba(255,107,0,0.25);
        }
        .prod-card:hover .prod-img { transform: scale(1.06); }

        .add-cart-btn {
          width: 100%;
          background: linear-gradient(90deg,#FF3D00,#FF6B00,#FFD700,#FF6B00,#FF3D00);
          background-size: 300% auto;
          animation: shimmer 3s linear infinite;
          border: none; border-radius: 10px;
          padding: 0.6rem 0; color: #1A0500;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem; font-weight: 800;
          cursor: pointer; display: flex;
          align-items: center; justify-content: center; gap: 0.4rem;
          transition: transform .2s, box-shadow .2s;
          box-shadow: 0 4px 16px rgba(255,107,0,0.3);
        }
        .add-cart-btn:hover { transform: scale(1.03); box-shadow: 0 6px 22px rgba(255,107,0,0.5); }

        .filter-check {
          display: flex; align-items: center; gap: 0.6rem;
          padding: 0.45rem 0.7rem; border-radius: 10px;
          cursor: pointer; transition: background .2s;
          font-size: 0.82rem; color: #3a1a00;
          font-weight: 500; user-select: none;
        }
        .filter-check:hover { background: rgba(255,107,0,0.08); }
        .filter-check.active { color: #FF6B00; background: rgba(255,107,0,0.12); }
        .filter-check:hover { background: rgba(255,107,0,0.07); }

        .filter-check input[type=checkbox] {
          accent-color: #FF6B00;
          width: 15px; height: 15px; cursor: pointer;
          flex-shrink: 0;
        }

        .sort-select {
          background: #1A0A00;
          border: 1.5px solid rgba(255,245,230,0.12);
          border-radius: 12px;
          padding: 0.62rem 2.6rem 0.62rem 1.1rem;
          color: #FFF5E6; font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem; font-weight: 600;
          outline: none; cursor: pointer; appearance: none;
          -webkit-appearance: none; -moz-appearance: none;
          transition: border-color .2s, box-shadow .2s;
          min-width: 160px;
        }
        .sort-select:hover { border-color: rgba(255,107,0,0.35); }
        .sort-select:focus { border-color: rgba(255,107,0,0.55); box-shadow: 0 0 0 3px rgba(255,107,0,0.1); }
        .sort-select option { background: #1A0A00; color: #FFF5E6; padding: 0.5rem; }

        .search-bar {
          background: rgba(255,255,255,0.05);
          border: 1.5px solid rgba(255,245,230,0.1);
          border-radius: 12px; padding: 0.62rem 1rem 0.62rem 2.6rem;
          color: #FFF5E6; font-family: 'DM Sans', sans-serif;
          font-size: 0.88rem; outline: none; width: 100%;
          transition: border-color .2s, box-shadow .2s;
        }
        .search-bar::placeholder { color: rgba(255,245,230,0.5); }
        .search-bar:focus { border-color: rgba(255,107,0,0.5); box-shadow: 0 0 0 3px rgba(255,107,0,0.08); }

        .range-input {
          -webkit-appearance: none; appearance: none;
          width: 100%; height: 4px; border-radius: 4px; outline: none;
          background: linear-gradient(to right, #FF6B00 var(--val), rgba(255,245,230,0.1) var(--val));
          cursor: pointer;
        }
        .range-input::-webkit-slider-thumb {
          -webkit-appearance: none; width: 18px; height: 18px;
          border-radius: 50%; background: #FF6B00; cursor: pointer;
          box-shadow: 0 0 0 3px rgba(255,107,0,0.2);
          border: 2px solid #fff;
        }

        .kids-toggle {
          position: relative; width: 44px; height: 24px;
          background: rgba(26,8,0,0.15);
          border-radius: 100px; cursor: pointer;
          transition: background .3s; flex-shrink: 0;
          border: 1.5px solid rgba(26,8,0,0.15);
          display: inline-block;
        }
        .kids-toggle.on { background: linear-gradient(135deg,#1ABC9C,#2ECC71); border-color: transparent; }
        .kids-toggle::after {
          content:''; position:absolute; top:2px; left:2px;
          width:16px; height:16px; border-radius:50%; background:#fff;
          transition: transform .3s; box-shadow: 0 1px 4px rgba(0,0,0,0.25);
        }
        .kids-toggle.on::after { transform: translateX(20px); }

        /* Sidebar overlay */
        .sidebar-overlay {
          display: none; position: fixed; top: 80px; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.6); z-index: 40;
          backdrop-filter: blur(4px);
        }
        .sidebar-overlay.open { display: block; }

        .filter-sidebar {
          position: sticky; top: 88px; 
          align-self: flex-start;
        }

        @media(max-width:900px) {
          .filter-sidebar {
            position: fixed !important; top: 80px !important; left: -100% !important;
            width: 280px !important; height: calc(100vh - 80px) !important;
            background: linear-gradient(160deg,#FFF8F0,#FFF3E0) !important; z-index: 50 !important;
            overflow-y: auto !important; padding: 1.5rem 1.2rem !important;
            transition: left .3s cubic-bezier(.22,1,.36,1) !important;
            border-right: 1px solid rgba(255,107,0,0.15) !important;
          }
          .filter-sidebar.open { left: 0 !important; }
          .prod-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media(max-width:480px) {
          .prod-grid { grid-template-columns: 1fr !important; gap: 0.8rem !important; }
          .prod-card { border-radius: 12px; }
          .prod-img-wrap { height: 180px !important; }
        }
      `}</style>

      {/* Mobile sidebar overlay */}
      <div className={`sidebar-overlay${sidebarOpen ? " open" : ""}`} onClick={() => setSidebarOpen(false)} />

      <div style={{ maxWidth:1380, margin:"0 auto", padding:"0 clamp(1.2rem,4vw,3rem)" }}>

        {/* ── PAGE HEADER ── */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"2rem 0 1.5rem", borderBottom:"1px solid rgba(255,245,230,0.06)", marginBottom:"1.5rem", flexWrap:"wrap", gap:"1rem" }}>
          <h1 style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:"clamp(1.2rem,3vw,2rem)", color:"#FFF5E6", fontWeight:900, margin:0 }}>
            Shop <span style={{ background:"linear-gradient(90deg,#FFD700,#FF6B00,#FF1493)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Crackers</span>
          </h1>
          <p style={{ color:"rgba(255,245,230,0.8)", fontSize:"0.82rem", margin:0 }}>
            {filtered.length} products · Page {currentPage}/{totalPages || 1}
          </p>
        </div>

      <div style={{ display:"flex", gap:"2rem", paddingBottom:"4rem", minHeight:"100vh" }}>

        {/* ══════════ FILTER SIDEBAR ══════════ */}
        <aside className={`filter-sidebar${sidebarOpen ? " open" : ""}`} style={{ width:240, flexShrink:0, alignSelf:"flex-start", background:"linear-gradient(160deg,#FFF8F0,#FFF3E0,#FEF9F0)", borderRadius:18, padding:"1.4rem 1.2rem", border:"1px solid rgba(255,107,0,0.1)", boxShadow:"0 4px 24px rgba(0,0,0,0.08)" }}>
          {/* Mobile close */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.5rem" }}>
            <span style={{ fontWeight:800, color:"#1a0800", fontSize:"1rem", display:"flex", alignItems:"center", gap:"0.4rem" }}>
              <SlidersHorizontal size={16} color="#FF6B00" /> Filters
            </span>
            {hasFilters && (
              <button onClick={clearFilters} style={{ background:"none", border:"none", color:"rgba(255,107,0,0.7)", fontSize:"0.75rem", fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", gap:"0.2rem" }}>
                <X size={12}/> Clear all
              </button>
            )}
          </div>

          {/* Categories */}
          <div style={{ marginBottom:"1.8rem" }}>
            <p style={{ fontSize:"0.68rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"#FF6B00", fontWeight:700, marginBottom:"0.7rem" }}>Category</p>
            {CATEGORIES.map(cat => (
              <label key={cat} className={`filter-check${selectedCats.includes(cat) ? " active" : ""}`}>
                <input type="checkbox" checked={selectedCats.includes(cat)} onChange={() => toggleCat(cat)} />
                {cat}
              </label>
            ))}
          </div>

          {/* Price Range */}
          <div style={{ marginBottom:"1.8rem" }}>
            <p style={{ fontSize:"0.68rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"#FF6B00", fontWeight:700, marginBottom:"0.7rem" }}>Price Range</p>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.6rem" }}>
              <span style={{ fontSize:"0.78rem", color:"#FF6B00", fontWeight:700 }}>₹{priceRange[0]}</span>
              <span style={{ fontSize:"0.78rem", color:"#FF6B00", fontWeight:700 }}>₹{priceRange[1]}</span>
            </div>
            <input type="range" className="range-input" min={0} max={2000} step={50}
              value={priceRange[1]}
              style={{ "--val":`${(priceRange[1]/2000)*100}%` }}
              onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
            />
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:"0.3rem" }}>
              <span style={{ fontSize:"0.65rem", color:"rgba(26,8,0,0.65)" }}>₹0</span>
              <span style={{ fontSize:"0.65rem", color:"rgba(26,8,0,0.65)" }}>₹2000</span>
            </div>
          </div>

          {/* Kids Safe */}
          <div style={{ marginBottom:"1.5rem" }}>
            <p style={{ fontSize:"0.68rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"#FF6B00", fontWeight:700, marginBottom:"0.7rem" }}>Kids Safe Only</p>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background: kidsOnly ? "rgba(46,204,113,0.1)" : "rgba(0,0,0,0.04)", border:`1.5px solid ${kidsOnly ? "rgba(46,204,113,0.35)" : "rgba(26,8,0,0.1)"}`, borderRadius:12, padding:"0.65rem 0.9rem", cursor:"pointer", transition:"all .3s" }} onClick={() => setKidsOnly(k => !k)}>
              <span style={{ fontSize:"0.82rem", color: kidsOnly ? "#1a7a4a" : "rgba(26,8,0,0.6)", fontWeight:700, display:"flex", alignItems:"center", gap:"0.4rem", transition:"color .3s" }}>
                <Baby size={15} strokeWidth={2} color={kidsOnly ? "#1ABC9C" : "rgba(26,8,0,0.4)"}/> 
                {kidsOnly ? "Kids Safe ON" : "Kids Safe OFF"}
              </span>
              <div className={`kids-toggle${kidsOnly ? " on" : ""}`} style={{ pointerEvents:"none" }} />
            </div>
          </div>

          {/* Sivakasi badge */}
          <div style={{ background:"rgba(255,107,0,0.06)", border:"1px solid rgba(255,107,0,0.15)", borderRadius:12, padding:"0.8rem", marginTop:"1rem" }}>
            <p style={{ fontSize:"0.72rem", color:"rgba(26,8,0,0.6)", fontWeight:600, margin:0, lineHeight:1.5 }}>
              🏭 All products sourced directly from <strong style={{ color:"#FF6B00" }}>Sivakasi</strong> — India's cracker capital
            </p>
          </div>
        </aside>

        {/* ══════════ MAIN CONTENT ══════════ */}
        <div style={{ flex:1, minWidth:0 }}>

          {/* Toolbar */}
          <div style={{ display:"flex", gap:"0.75rem", marginBottom:"1.5rem", flexWrap:"wrap", alignItems:"center" }}>
            {/* Mobile filter btn */}
            <button onClick={() => setSidebarOpen(true)} style={{ display:"none", alignItems:"center", gap:"0.4rem", background:"rgba(255,107,0,0.1)", border:"1.5px solid rgba(255,107,0,0.3)", borderRadius:12, padding:"0.6rem 1rem", color:"#FF6B00", fontFamily:"'DM Sans',sans-serif", fontSize:"0.85rem", fontWeight:600, cursor:"pointer" }}
              className="mobile-filter-btn">
              <SlidersHorizontal size={15}/> Filters {hasFilters && <span style={{ background:"#FF6B00", color:"#fff", borderRadius:"50%", width:18, height:18, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:"0.65rem", fontWeight:800 }}>{selectedCats.length + (kidsOnly?1:0)}</span>}
            </button>

            {/* Search */}
            <div style={{ position:"relative", flex:1, minWidth:180 }}>
              <Search size={15} color="rgba(255,245,230,0.3)" style={{ position:"absolute", left:"0.9rem", top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }} />
              <input className="search-bar" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {/* Sort */}
            <div style={{ position:"relative", flexShrink:0 }}>
              <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown size={15} color="#FF6B00" style={{ position:"absolute", right:"0.8rem", top:"50%", transform:"translateY(-50%)", pointerEvents:"none", strokeWidth:2.5 }} />
            </div>
          </div>

          {/* Active filter chips */}
          {(selectedCats.length > 0 || kidsOnly) && (
            <div style={{ display:"flex", gap:"0.5rem", flexWrap:"wrap", marginBottom:"1.2rem" }}>
              {selectedCats.map(c => (
                <div key={c} style={{ display:"inline-flex", alignItems:"center", gap:"0.35rem", background:"rgba(255,107,0,0.12)", border:"1px solid rgba(255,107,0,0.3)", borderRadius:100, padding:"0.28rem 0.75rem", fontSize:"0.75rem", color:"#FF6B00", fontWeight:600 }}>
                  {c}
                  <X size={11} style={{ cursor:"pointer" }} onClick={() => toggleCat(c)} />
                </div>
              ))}
              {kidsOnly && (
                <div style={{ display:"inline-flex", alignItems:"center", gap:"0.35rem", background:"rgba(46,204,113,0.12)", border:"1px solid rgba(46,204,113,0.3)", borderRadius:100, padding:"0.28rem 0.75rem", fontSize:"0.75rem", color:"#2ECC71", fontWeight:600 }}>
                  <Baby size={11}/> Kids Safe
                  <X size={11} style={{ cursor:"pointer" }} onClick={() => setKidsOnly(false)} />
                </div>
              )}
            </div>
          )}

          {/* Product Grid */}
          {loading ? (
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:300, gap:"0.8rem", color:"rgba(255,245,230,0.4)" }}>
              <span style={{ width:28, height:28, border:"3px solid rgba(255,107,0,0.2)", borderTopColor:"#FF6B00", borderRadius:"50%", display:"inline-block", animation:"spin 0.8s linear infinite" }}/>
              Loading products...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:"5rem 2rem", color:"rgba(255,245,230,0.35)" }}>
              <div style={{ fontSize:"4rem", marginBottom:"1rem" }}>🎆</div>
              <p style={{ fontSize:"1rem", fontWeight:600, marginBottom:"0.5rem", color:"rgba(255,245,230,0.6)" }}>No products found</p>
              <p style={{ fontSize:"0.85rem" }}>Try adjusting your filters</p>
              <button onClick={clearFilters} style={{ marginTop:"1.2rem", background:"rgba(255,107,0,0.1)", border:"1px solid rgba(255,107,0,0.3)", borderRadius:100, padding:"0.6rem 1.5rem", color:"#FF6B00", fontFamily:"'DM Sans',sans-serif", fontSize:"0.85rem", fontWeight:700, cursor:"pointer" }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <>
            <div className="prod-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1rem" }}>
              {paginated.map((p, i) => (
                <div key={p._id} style={{ animationDelay:`${i * 0.04}s` }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>

            {/* ── PAGINATION ── */}
            {totalPages > 1 && (
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem", marginTop:"2.5rem", flexWrap:"wrap", paddingBottom:"1rem" }}>
                {/* Prev */}
                <button
                  onClick={() => { setCurrentPage(pg => Math.max(1, pg-1)); setTimeout(() => window.scrollTo({top:0,behavior:"smooth"}), 50); }}
                  disabled={currentPage === 1}
                  title="Previous page"
                  style={{ width:38, height:38, borderRadius:10, border:"1.5px solid rgba(255,245,230,0.12)", background: currentPage===1 ? "rgba(255,255,255,0.03)" : "rgba(255,107,0,0.1)", color: currentPage===1 ? "rgba(255,245,230,0.2)" : "#FF6B00", cursor: currentPage===1 ? "not-allowed" : "pointer", transition:"all .2s", display:"flex", alignItems:"center", justifyContent:"center" }}
                ><ChevronLeft size={17} strokeWidth={2.5} /></button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(n => n === 1 || n === totalPages || Math.abs(n - currentPage) <= 1)
                  .reduce((acc, n, idx, arr) => {
                    if (idx > 0 && n - arr[idx-1] > 1) acc.push("...");
                    acc.push(n);
                    return acc;
                  }, [])
                  .map((item, idx) => item === "..." ? (
                    <span key={`dots-${idx}`} style={{ color:"rgba(255,245,230,0.3)", fontSize:"0.9rem", padding:"0 0.2rem" }}>…</span>
                  ) : (
                    <button key={item}
                      onClick={() => { setCurrentPage(item); window.scrollTo({top:0,behavior:"smooth"}); }}
                      style={{ width:38, height:38, borderRadius:10, border: item===currentPage ? "none" : "1.5px solid rgba(255,245,230,0.12)", background: item===currentPage ? "linear-gradient(135deg,#FF6B00,#FF3D00)" : "rgba(255,255,255,0.04)", color: item===currentPage ? "#fff" : "rgba(255,245,230,0.65)", fontFamily:"'DM Sans',sans-serif", fontSize:"0.88rem", fontWeight: item===currentPage ? 800 : 500, cursor:"pointer", transition:"all .2s", boxShadow: item===currentPage ? "0 4px 16px rgba(255,107,0,0.4)" : "none" }}
                    >{item}</button>
                  ))
                }

                {/* Next */}
                <button
                  onClick={() => { setCurrentPage(pg => Math.min(totalPages, pg+1)); setTimeout(() => window.scrollTo({top:0,behavior:"smooth"}), 50); }}
                  disabled={currentPage === totalPages}
                  title="Next page"
                  style={{ width:38, height:38, borderRadius:10, border:"1.5px solid rgba(255,245,230,0.12)", background: currentPage===totalPages ? "rgba(255,255,255,0.03)" : "rgba(255,107,0,0.1)", color: currentPage===totalPages ? "rgba(255,245,230,0.2)" : "#FF6B00", cursor: currentPage===totalPages ? "not-allowed" : "pointer", transition:"all .2s", display:"flex", alignItems:"center", justifyContent:"center" }}
                ><ChevronRight size={17} strokeWidth={2.5} /></button>
              </div>
            )}
            </>
          )}
        </div>
      </div>
      </div>{/* end maxWidth container */}

      <style>{`
        @media(max-width:900px) {
          .mobile-filter-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
