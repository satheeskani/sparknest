import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart, updateQty } from "../../redux/slices/cartSlice";
import { ShoppingCart, Star, SlidersHorizontal, X, Baby, ChevronDown, ChevronLeft, ChevronRight, Search, Heart } from "lucide-react";
import toast from "react-hot-toast";

const toSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const CATEGORIES = ["Sparklers","Rockets","Bombs","Flower Pots","Sky Shots","Kids Special","Combo Packs","Gift Boxes"];
const SORT_OPTIONS = [
  { label:"Newest First",    value:"newest"     },
  { label:"Price: Low→High", value:"price_asc"  },
  { label:"Price: High→Low", value:"price_desc" },
  { label:"Top Rated",       value:"rating"     },
];

const DEMO_PRODUCTS = [
  { _id:"1",  name:"Golden Sparklers Pack", stock:45,      category:"Sparklers",   price:299,  originalPrice:399,  rating:4.8, numReviews:124, isSafeForKids:true,  image:"https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80" },
  { _id:"2",  name:"Sky Rocket 10-in-1", stock:28,         category:"Rockets",     price:549,  originalPrice:699,  rating:4.6, numReviews:89,  isSafeForKids:false, image:"https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=400&q=80" },
  { _id:"3",  name:"Rainbow Flower Pot Set", stock:60,     category:"Flower Pots", price:399,  originalPrice:499,  rating:4.9, numReviews:201, isSafeForKids:true,  image:"https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=400&q=80" },
  { _id:"4",  name:"Thunder Bomb Pack (20pcs)", stock:100,  category:"Bombs",       price:199,  originalPrice:249,  rating:4.3, numReviews:56,  isSafeForKids:false, image:"https://images.unsplash.com/photo-1514254040595-6e0d913fc1e4?w=400&q=80" },
  { _id:"5",  name:"Sky Shot Premium Bundle", stock:15,    category:"Sky Shots",   price:899,  originalPrice:1199, rating:4.7, numReviews:143, isSafeForKids:false, image:"https://images.unsplash.com/photo-1533230408708-8f9f91d1235a?w=400&q=80" },
  { _id:"6",  name:"Kids Fun Cracker Set", stock:80,       category:"Kids Special",price:349,  originalPrice:449,  rating:4.9, numReviews:312, isSafeForKids:true,  image:"https://images.unsplash.com/photo-1604881991720-f91add269bed?w=400&q=80" },
  { _id:"7",  name:"Diwali Mega Combo Pack", stock:20,     category:"Combo Packs", price:1499, originalPrice:1999, rating:4.8, numReviews:267, isSafeForKids:false, image:"https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&q=80" },
  { _id:"8",  name:"Premium Gift Box Deluxe", stock:35,    category:"Gift Boxes",  price:799,  originalPrice:999,  rating:4.6, numReviews:98,  isSafeForKids:true,  image:"https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&q=80" },
  { _id:"9",  name:"Silver Sparklers (50pcs)", stock:120,   category:"Sparklers",   price:179,  originalPrice:199,  rating:4.5, numReviews:445, isSafeForKids:true,  image:"https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80" },
  { _id:"10", name:"Colour Rain Rockets", stock:40,        category:"Rockets",     price:649,  originalPrice:799,  rating:4.4, numReviews:72,  isSafeForKids:false, image:"https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=400&q=80" },
  { _id:"11", name:"Mini Flower Pot (12pcs)", stock:75,    category:"Flower Pots", price:249,  originalPrice:299,  rating:4.7, numReviews:189, isSafeForKids:true,  image:"https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=400&q=80" },
  { _id:"12", name:"Atom Bomb Special (10pcs)", stock:90,  category:"Bombs",       price:149,  originalPrice:199,  rating:4.2, numReviews:33,  isSafeForKids:false, image:"https://images.unsplash.com/photo-1514254040595-6e0d913fc1e4?w=400&q=80" },
];

function StarRating({ rating }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"0.15rem" }}>
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={10}
          fill={s <= Math.round(rating) ? "#FFD700" : "none"}
          color={s <= Math.round(rating) ? "#FFD700" : "rgba(255,245,230,0.2)"}
          strokeWidth={1.5} />
      ))}
    </div>
  );
}

function ProductCard({ product, wishlist, onWishlist }) {
  const dispatch  = useDispatch();
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

      <div style={{ flex:1, padding:"0.65rem 0.75rem", display:"flex", flexDirection:"column", justifyContent:"space-between", minWidth:0 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"0.25rem" }}>
          <div style={{ minWidth:0, flex:1 }}>
            <div style={{ fontSize:"0.72rem", color:"#FF6B00", fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"0.2rem", display:"flex", alignItems:"center", gap:"0.35rem" }}>
              {product.category}
              {product.isSafeForKids && <span style={{ color:"#1ABC9C", fontSize:"0.72rem" }}>✦ Kids Safe</span>}
            </div>
            <Link to={`/products/${toSlug(product.name)}`} style={{ textDecoration:"none" }}>
              <div style={{ fontSize:"0.95rem", fontWeight:700, color:"rgba(255,245,230,0.92)", lineHeight:1.3, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                {product.name}
              </div>
            </Link>
          </div>
          <button onClick={handleWish}
            style={{ flexShrink:0, width:27, height:27, borderRadius:"50%", border:`1.5px solid ${isWished ? "rgba(255,61,0,0.5)" : "rgba(255,245,230,0.12)"}`, background: isWished ? "rgba(255,61,0,0.1)" : "rgba(255,255,255,0.04)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s", marginLeft:"0.25rem" }}>
            <Heart size={12} fill={isWished ? "#FF3D00" : "none"} color={isWished ? "#FF3D00" : "rgba(255,245,230,0.35)"} strokeWidth={2} />
          </button>
        </div>

        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:"0.3rem", marginTop:"0.4rem" }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:"0.25rem", marginBottom:"0.18rem", flexWrap:"wrap" }}>
              <StarRating rating={product.rating} />
              <span style={{ fontSize:"0.75rem", color:"rgba(255,245,230,0.5)" }}>({product.numReviews})</span>
              {product.stock <= 20
                ? <span style={{ fontSize:"0.78rem", fontWeight:800, padding:"0.22rem 0.6rem", borderRadius:100, background:"rgba(255,61,0,0.18)", color:"#FF4500", border:"1px solid rgba(255,61,0,0.35)", whiteSpace:"nowrap" }}>🔥 {product.stock} left</span>
                : <span style={{ fontSize:"0.78rem", fontWeight:800, padding:"0.22rem 0.6rem", borderRadius:100, background:"rgba(46,204,113,0.15)", color:"#2ECC71", border:"1px solid rgba(46,204,113,0.3)", whiteSpace:"nowrap" }}>✓ {product.stock} in stock</span>
              }
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"0.3rem" }}>
              <span style={{ fontSize:"1.05rem", fontWeight:800, color:"#FFD700" }}>₹{product.price}</span>
              {product.originalPrice > product.price && (
                <span style={{ fontSize:"0.78rem", color:"rgba(255,245,230,0.35)", textDecoration:"line-through" }}>₹{product.originalPrice}</span>
              )}
            </div>
          </div>
          {qty === 0 ? (
            <button onClick={handleAdd} style={{ background:"linear-gradient(135deg,#FF6B00,#FF3D00)", border:"none", borderRadius:8, color:"#fff", fontWeight:800, fontSize:"0.82rem", padding:"0.42rem 0.85rem", cursor:"pointer", display:"flex", alignItems:"center", gap:"0.2rem", boxShadow:"0 2px 8px rgba(255,107,0,0.4)", fontFamily:"'DM Sans',sans-serif", whiteSpace:"nowrap", flexShrink:0 }}>
              + ADD
            </button>
          ) : (
            <div style={{ display:"flex", alignItems:"center", background:"linear-gradient(135deg,#FF6B00,#FF3D00)", borderRadius:8, overflow:"hidden", boxShadow:"0 2px 8px rgba(255,107,0,0.4)", flexShrink:0 }}>
              <button onClick={handleDec} style={{ width:24, height:28, border:"none", background:"transparent", color:"#fff", fontWeight:800, fontSize:"0.95rem", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>−</button>
              <input
                type="number" min="1" max="99"
                value={qtyVal}
                onChange={e => setQtyVal(e.target.value)}
                onFocus={e => { setQtyFocused(true); e.target.select(); }}
                onBlur={commitQty}
                onKeyDown={e => { if (e.key === "Enter") { commitQty(); e.target.blur(); } }}
                onClick={e => e.preventDefault()}
                style={{ width:28, textAlign:"center", color:"#fff", fontWeight:800, fontSize:"0.88rem", background:"transparent", border:"none", outline:"none", MozAppearance:"textfield", WebkitAppearance:"none" }}
              />
              <button onClick={handleInc} disabled={qty >= max} style={{ width:24, height:28, border:"none", background:"transparent", color: qty >= max ? "rgba(255,255,255,0.3)" : "#fff", fontWeight:800, fontSize:"0.95rem", cursor: qty >= max ? "not-allowed" : "pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function WishlistView({ wishlist, onWishlist }) {
  const wishedProducts = DEMO_PRODUCTS.filter(p => wishlist.includes(p._id));
  return (
    <div>
      <div style={{ marginBottom:"1.5rem" }}>
        <h2 style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:"1.1rem", color:"#FFF5E6", margin:0, display:"flex", alignItems:"center", gap:"0.5rem" }}>
          <Heart size={18} fill="#FF3D00" color="#FF3D00" /> My Wishlist
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.75rem", fontWeight:600, color:"rgba(255,245,230,0.5)", marginLeft:"0.25rem" }}>({wishedProducts.length} items)</span>
        </h2>
      </div>
      {wishedProducts.length === 0 ? (
        <div style={{ textAlign:"center", padding:"4rem 2rem", color:"rgba(255,245,230,0.35)" }}>
          <Heart size={48} color="rgba(255,245,230,0.15)" style={{ marginBottom:"1rem" }} />
          <p style={{ fontSize:"1rem", fontWeight:600, color:"rgba(255,245,230,0.5)", marginBottom:"0.5rem" }}>Your wishlist is empty</p>
          <p style={{ fontSize:"0.82rem" }}>Tap the ♡ on any product to save it here</p>
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

  const [products]  = useState(DEMO_PRODUCTS);
  const [loading]   = useState(false);
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
          <p style={{ fontSize:"0.78rem", letterSpacing:"0.12em", textTransform:"uppercase", color:"#FF6B00", fontWeight:700, marginBottom:"0.6rem" }}>Category</p>
          {CATEGORIES.map(cat => (
            <label key={cat} className={`filter-check${cats.includes(cat) ? " active" : ""}`}>
              <input type="checkbox" checked={cats.includes(cat)} onChange={() => toggle(cat)} />{cat}
            </label>
          ))}
        </div>
        <div style={{ marginBottom:"1.5rem" }}>
          <p style={{ fontSize:"0.78rem", letterSpacing:"0.12em", textTransform:"uppercase", color:"#FF6B00", fontWeight:700, marginBottom:"0.6rem" }}>Price Range</p>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.5rem" }}>
            <span style={{ fontSize:"0.88rem", color:"#FF6B00", fontWeight:700 }}>₹{price[0]}</span>
            <span style={{ fontSize:"0.88rem", color:"#FF6B00", fontWeight:700 }}>₹{price[1]}</span>
          </div>
          <input type="range" className="range-input" min={0} max={2000} step={50}
            value={price[1]} style={{ "--val":`${(price[1]/2000)*100}%` }}
            onChange={e => setPrice([price[0], Number(e.target.value)])} />
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:"0.25rem" }}>
            <span style={{ fontSize:"0.75rem", color:"rgba(26,8,0,0.55)" }}>₹0</span>
            <span style={{ fontSize:"0.75rem", color:"rgba(26,8,0,0.55)" }}>₹2000</span>
          </div>
        </div>
        <div style={{ marginBottom:"1.2rem" }}>
          <p style={{ fontSize:"0.78rem", letterSpacing:"0.12em", textTransform:"uppercase", color:"#FF6B00", fontWeight:700, marginBottom:"0.6rem" }}>Kids Safe Only</p>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background: kids ? "rgba(46,204,113,0.1)" : "rgba(0,0,0,0.04)", border:`1.5px solid ${kids ? "rgba(46,204,113,0.35)" : "rgba(26,8,0,0.1)"}`, borderRadius:12, padding:"0.6rem 0.85rem", cursor:"pointer" }} onClick={() => setKids(k => !k)}>
            <span style={{ fontSize:"0.92rem", color: kids ? "#1a7a4a" : "rgba(26,8,0,0.6)", fontWeight:700, display:"flex", alignItems:"center", gap:"0.35rem" }}>
              <Baby size={14} strokeWidth={2} color={kids ? "#1ABC9C" : "rgba(26,8,0,0.4)"} />{kids ? "Kids Safe ON" : "Kids Safe OFF"}
            </span>
            <div className={`kids-toggle${kids ? " on" : ""}`} style={{ pointerEvents:"none" }} />
          </div>
        </div>
      </>
    );
  };

  return (
    <div style={{ minHeight:"100vh", background:"#0D0600", fontFamily:"'DM Sans', sans-serif", paddingTop:"80px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@900&family=DM+Sans:wght@300;400;500;600;700;800&display=swap');

        
        /* Hide number input spinners */
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance:none; margin:0; }
        input[type=number] { -moz-appearance:textfield; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin   { to{transform:rotate(360deg)} }

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
          font-size: 0.8rem; color: #3a1a00; font-weight: 500; user-select: none;
        }
        .filter-check:hover { background: rgba(255,107,0,0.07); }
        .filter-check.active { color: #FF6B00; background: rgba(255,107,0,0.11); }
        .filter-check input[type=checkbox] { accent-color:#FF6B00; width:14px; height:14px; cursor:pointer; flex-shrink:0; }

        .sort-select {
          background: #1A0A00; border: 1.5px solid rgba(255,245,230,0.12);
          border-radius: 12px; padding: 0.58rem 2.4rem 0.58rem 1rem;
          color: #FFF5E6; font-family: 'DM Sans',sans-serif;
          font-size: 0.82rem; font-weight: 600; outline: none; cursor: pointer;
          appearance: none; -webkit-appearance: none; transition: border-color .2s;
          width: 100%; box-sizing: border-box;
        }
        .sort-select:hover { border-color: rgba(255,107,0,0.35); }
        .sort-select:focus { border-color: rgba(255,107,0,0.55); box-shadow: 0 0 0 3px rgba(255,107,0,0.1); }
        .sort-select option { background:#1A0A00; color:#FFF5E6; }

        .search-bar {
          background: rgba(255,255,255,0.05); border: 1.5px solid rgba(255,245,230,0.1);
          border-radius: 12px; padding: 0.58rem 1rem 0.58rem 2.5rem;
          color: #FFF5E6; font-family: 'DM Sans',sans-serif;
          font-size: 0.85rem; outline: none; width: 100%;
          transition: border-color .2s, box-shadow .2s; box-sizing: border-box;
        }
        .search-bar::placeholder { color: rgba(255,245,230,0.4); }
        .search-bar:focus { border-color: rgba(255,107,0,0.5); box-shadow: 0 0 0 3px rgba(255,107,0,0.08); }

        .range-input {
          -webkit-appearance: none; appearance: none; width: 100%; height: 4px;
          border-radius: 4px; outline: none; cursor: pointer;
          background: linear-gradient(to right, #FF6B00 var(--val), rgba(255,245,230,0.1) var(--val));
        }
        .range-input::-webkit-slider-thumb {
          -webkit-appearance: none; width: 17px; height: 17px; border-radius: 50%;
          background: #FF6B00; cursor: pointer; box-shadow: 0 0 0 3px rgba(255,107,0,0.2); border: 2px solid #fff;
        }

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
          font-family:'DM Sans',sans-serif; font-size:0.95rem; font-weight:600;
          color:rgba(255,245,230,0.45); border-bottom:2px solid transparent;
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
        }
      `}</style>

      <div className={`filter-overlay${sidebarOpen ? " open" : ""}`} onClick={() => setSidebarOpen(false)} />

      {/* Mobile filter drawer */}
      <div className={`filter-drawer${sidebarOpen ? " open" : ""}`}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.3rem" }}>
          <span style={{ fontWeight:800, color:"#1a0800", fontSize:"0.95rem", display:"flex", alignItems:"center", gap:"0.4rem" }}>
            <SlidersHorizontal size={15} color="#FF6B00" /> Filters
          </span>
          <button onClick={() => setSidebarOpen(false)} style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(26,8,0,0.5)", padding:"0.2rem" }}>
            <X size={18} />
          </button>
        </div>
        <FilterContent pending={true} />
        <div style={{ marginTop:"1.5rem", paddingTop:"1rem", borderTop:"1px solid rgba(255,107,0,0.12)" }}>
          <button onClick={applyMobileFilters}
            style={{ width:"100%", boxSizing:"border-box", background:"linear-gradient(135deg,#FF6B00,#FF3D00)", border:"none", borderRadius:12, color:"#fff", fontFamily:"'DM Sans',sans-serif", fontWeight:800, fontSize:"0.92rem", padding:"0.82rem", cursor:"pointer", boxShadow:"0 4px 16px rgba(255,107,0,0.4)" }}>
            Apply
          </button>
        </div>
      </div>

      <div style={{ maxWidth:1380, margin:"0 auto", padding:"0 clamp(1.2rem,4vw,3rem)" }}>

        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"2rem 0 1.5rem", borderBottom:"1px solid rgba(255,245,230,0.06)", marginBottom:"1.5rem", flexWrap:"wrap", gap:"1rem" }}>
          <h1 style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:"clamp(1.1rem,3vw,1.9rem)", color:"#FFF5E6", fontWeight:900, margin:0 }}>
            Shop <span style={{ background:"linear-gradient(90deg,#FFD700,#FF6B00,#FF1493)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Crackers</span>
          </h1>
          <p style={{ color:"rgba(255,245,230,0.5)", fontSize:"0.78rem", margin:0 }}>
            {filtered.length} products · Page {currentPage}/{totalPages || 1}
          </p>
        </div>

        <div style={{ display:"flex", gap:"1.8rem", paddingBottom:"4rem" }}>

          {/* Desktop Sidebar */}
          <aside className="filter-sidebar">
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.3rem" }}>
              <span style={{ fontWeight:800, color:"#1a0800", fontSize:"0.92rem", display:"flex", alignItems:"center", gap:"0.4rem" }}>
                <SlidersHorizontal size={15} color="#FF6B00" /> Filters
              </span>
              {hasFilters && (
                <button onClick={clearFilters} style={{ background:"none", border:"none", color:"rgba(255,107,0,0.7)", fontSize:"0.82rem", fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", gap:"0.2rem" }}>
                  <X size={11}/> Clear
                </button>
              )}
            </div>
            <FilterContent pending={false} />
            <div style={{ background:"rgba(255,107,0,0.06)", border:"1px solid rgba(255,107,0,0.14)", borderRadius:10, padding:"0.6rem 0.75rem", marginTop:"0.8rem" }}>
              <p style={{ fontSize:"0.68rem", color:"rgba(26,8,0,0.6)", fontWeight:600, margin:0, lineHeight:1.5 }}>
                🏭 Sourced from <strong style={{ color:"#FF6B00" }}>Sivakasi</strong> — India's cracker capital
              </p>
            </div>
          </aside>

          {/* Main */}
          <div style={{ flex:1, minWidth:0 }}>

            <div className="tab-bar">
              <button className={`tab-btn${activeTab==="all" ? " active" : ""}`} onClick={() => setActiveTab("all")}>All Products</button>
              <button className={`tab-btn${activeTab==="wishlist" ? " active" : ""}`} onClick={() => setActiveTab("wishlist")}>
                <Heart size={13} fill={activeTab==="wishlist" ? "#FF3D00" : "none"} color={activeTab==="wishlist" ? "#FF3D00" : "rgba(255,245,230,0.45)"} />
                Wishlist {wishlist.length > 0 && <span style={{ background: activeTab==="wishlist" ? "#FF3D00" : "rgba(255,107,0,0.2)", color: activeTab==="wishlist" ? "#fff" : "#FF6B00", borderRadius:"50%", width:20, height:20, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:"0.8rem", fontWeight:800 }}>{wishlist.length}</span>}
              </button>
            </div>

            {activeTab === "wishlist" ? (
              <WishlistView wishlist={wishlist} onWishlist={toggleWishlist} />
            ) : (
              <>
                {/* Toolbar */}
                <div className="toolbar-wrap" style={{ display:"flex", gap:"0.65rem", marginBottom:"1.2rem", alignItems:"center" }}>
                  <div className="toolbar-search" style={{ position:"relative", flex:1, minWidth:160 }}>
                    <Search size={14} color="rgba(255,245,230,0.3)" style={{ position:"absolute", left:"0.85rem", top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }} />
                    <input className="search-bar" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
                  </div>

                  <div className="toolbar-row2" style={{ display:"contents" }}>
                    <button onClick={openSidebar} className="prod-filter-btn"
                      style={{ alignItems:"center", gap:"0.4rem", background:"rgba(255,107,0,0.1)", border:"1.5px solid rgba(255,107,0,0.3)", borderRadius:12, padding:"0.58rem 1rem", color:"#FF6B00", fontFamily:"'DM Sans',sans-serif", fontSize:"0.82rem", fontWeight:600, cursor:"pointer", flexShrink:0 }}>
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
                      <div key={c} style={{ display:"inline-flex", alignItems:"center", gap:"0.3rem", background:"rgba(255,107,0,0.12)", border:"1px solid rgba(255,107,0,0.3)", borderRadius:100, padding:"0.28rem 0.8rem", fontSize:"0.82rem", color:"#FF6B00", fontWeight:600 }}>
                        {c} <X size={10} style={{ cursor:"pointer" }} onClick={() => toggleCat(c)} />
                      </div>
                    ))}
                    {kidsOnly && (
                      <div style={{ display:"inline-flex", alignItems:"center", gap:"0.3rem", background:"rgba(46,204,113,0.12)", border:"1px solid rgba(46,204,113,0.3)", borderRadius:100, padding:"0.28rem 0.8rem", fontSize:"0.82rem", color:"#2ECC71", fontWeight:600 }}>
                        <Baby size={10}/> Kids Safe <X size={10} style={{ cursor:"pointer" }} onClick={() => setKidsOnly(false)} />
                      </div>
                    )}
                  </div>
                )}

                {/* Grid */}
                {loading ? (
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:280, gap:"0.8rem", color:"rgba(255,245,230,0.4)" }}>
                    <span style={{ width:26, height:26, border:"3px solid rgba(255,107,0,0.2)", borderTopColor:"#FF6B00", borderRadius:"50%", display:"inline-block", animation:"spin 0.8s linear infinite" }}/>
                    Loading...
                  </div>
                ) : filtered.length === 0 ? (
                  <div style={{ textAlign:"center", padding:"5rem 2rem", color:"rgba(255,245,230,0.35)" }}>
                    <div style={{ fontSize:"3.5rem", marginBottom:"1rem" }}>🎆</div>
                    <p style={{ fontSize:"0.95rem", fontWeight:600, color:"rgba(255,245,230,0.55)", marginBottom:"0.4rem" }}>No products found</p>
                    <p style={{ fontSize:"0.82rem" }}>Try adjusting your filters</p>
                    <button onClick={clearFilters} style={{ marginTop:"1rem", background:"rgba(255,107,0,0.1)", border:"1px solid rgba(255,107,0,0.3)", borderRadius:100, padding:"0.55rem 1.4rem", color:"#FF6B00", fontFamily:"'DM Sans',sans-serif", fontSize:"0.82rem", fontWeight:700, cursor:"pointer" }}>Clear Filters</button>
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
                            <span key={`d${idx}`} style={{ color:"rgba(255,245,230,0.3)", padding:"0 0.1rem" }}>…</span>
                          ) : (
                            <button key={item} onClick={() => { setCurrentPage(item); window.scrollTo({top:0,behavior:"smooth"}); }}
                              style={{ width:36, height:36, borderRadius:9, border: item===currentPage ? "none" : "1.5px solid rgba(255,245,230,0.12)", background: item===currentPage ? "linear-gradient(135deg,#FF6B00,#FF3D00)" : "rgba(255,255,255,0.04)", color: item===currentPage ? "#fff" : "rgba(255,245,230,0.6)", fontFamily:"'DM Sans',sans-serif", fontSize:"0.85rem", fontWeight: item===currentPage?800:500, cursor:"pointer", boxShadow: item===currentPage ? "0 4px 14px rgba(255,107,0,0.4)" : "none" }}>
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
