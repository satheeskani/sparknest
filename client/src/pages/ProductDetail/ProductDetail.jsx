import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useLang } from "../../components/LangContext/LangContext";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart, updateQty } from "../../redux/slices/cartSlice";
import { ShoppingCart, Star, Baby, Shield, Truck, Flame, Plus, Minus, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

const API = import.meta.env.PROD ? "" : "http://localhost:5000";

const toSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function StarRating({ rating, size = 13 }) {
  return (
    <div style={{ display:"flex", gap:"0.12rem" }}>
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={size}
          fill={s <= Math.round(rating) ? "#FFD700" : "none"}
          color={s <= Math.round(rating) ? "#FFD700" : "rgba(255,245,230,0.2)"}
          strokeWidth={1.5} />
      ))}
    </div>
  );
}

function ProductCard({ product, catMap = {} }) {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { t } = useLang();
  const cartItems = useSelector(s => s.cart.items);
  const cartItem  = cartItems.find(i => i._id === product._id);
  const qty       = cartItem ? cartItem.quantity : 0;
  const discount  = product.originalPrice ? Math.round(100 - (product.price / product.originalPrice) * 100) : 0;
  const [imgErr, setImgErr] = useState(false);

  const [qtyFocused, setQtyFocused] = useState(false);
  const [qtyVal, setQtyVal]         = useState(String(qty));
  if (!qtyFocused && qtyVal !== String(qty)) setQtyVal(String(qty));

  const commitQty = () => {
    const v = parseInt(qtyVal);
    if (!isNaN(v) && v >= 1 && v <= 99) dispatch(updateQty({ id: product._id, quantity: v }));
    else if (!isNaN(v) && v < 1) dispatch(removeFromCart(product._id));
    else setQtyVal(String(qty));
    setQtyFocused(false);
  };

  const handleAdd = (e) => { e.stopPropagation(); dispatch(addToCart(product)); toast.success("Added to cart! 🎆", { duration:1500 }); };
  const handleInc = (e) => { e.stopPropagation(); dispatch(updateQty({ id: product._id, quantity: Math.min(99, qty + 1) })); };
  const handleDec = (e) => { e.stopPropagation(); qty > 1 ? dispatch(updateQty({ id: product._id, quantity: qty - 1 })) : dispatch(removeFromCart(product._id)); };

  return (
    <div className="prod-card" style={{ display:"flex", flexDirection:"row", alignItems:"stretch", minHeight:110, cursor:"pointer" }}
      onClick={() => navigate(`/products/${toSlug(product.name)}`)}>
      <div style={{ flexShrink:0, width:100 }}>
        <div style={{ width:100, height:"100%", minHeight:110, background:"#111", overflow:"hidden", borderRadius:"14px 0 0 14px", position:"relative" }}>
          {!imgErr
            ? <img src={product.image} alt={product.name} onError={() => setImgErr(true)}
                style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", transition:"transform .4s ease" }} className="prod-img" />
            : <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#1a0a00,#0d0600)", fontSize:"2rem" }}>🎆</div>
          }
          {discount > 0 && (
            <div style={{ position:"absolute", top:6, left:0, background:"linear-gradient(135deg,#FF3D00,#FF6B00)", color:"#fff", fontSize:"0.52rem", fontWeight:800, padding:"0.1rem 0.38rem", borderRadius:"0 5px 5px 0" }}>-{discount}%</div>
          )}
        </div>
      </div>
      <div style={{ flex:1, padding:"0.6rem 0.7rem", display:"flex", flexDirection:"column", justifyContent:"space-between", minWidth:0 }}>
        <div>
          <div style={{ fontSize:"0.72rem", color:"#FF6B00", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"0.12rem", display:"flex", alignItems:"center", gap:"0.3rem" }}>
            {t[catMap[product.category]] || product.category}{product.isSafeForKids && <span style={{ color:"#1ABC9C" }}>✦ Kids Safe</span>}
          </div>
          <div style={{ fontSize:"0.80rem", fontWeight:700, color:"rgba(255,245,230,0.92)", lineHeight:1.3, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{product.name}</div>
        </div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:"0.3rem", marginTop:"0.35rem" }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:"0.2rem", marginBottom:"0.12rem" }}>
              <StarRating rating={product.rating} size={9}/>
              <span style={{ fontSize:"0.56rem", color:"rgba(255,245,230,0.72)" }}>({product.numReviews})</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"0.28rem" }}>
              <span style={{ fontSize:"1.05rem", fontWeight:800, color:"#FFD700" }}>₹{product.price}</span>
              {product.originalPrice > product.price && <span style={{ fontSize:"0.9rem", color:"rgba(255,245,230,0.6)", textDecoration:"line-through" }}>₹{product.originalPrice}</span>}
            </div>
          </div>
          {qty === 0 ? (
            <button onClick={handleAdd} style={{ background:"linear-gradient(135deg,#FF6B00,#FF3D00)", border:"none", borderRadius:7, color:"#fff", fontWeight:800, fontSize:"1rem", padding:"0.32rem 0.65rem", cursor:"pointer", boxShadow:"0 2px 8px rgba(255,107,0,0.65)", fontFamily:"'Source Sans 3',sans-serif", whiteSpace:"nowrap", flexShrink:0 }}>+ ADD</button>
          ) : (
            <div style={{ display:"flex", alignItems:"center", background:"linear-gradient(135deg,#FF6B00,#FF3D00)", borderRadius:7, overflow:"hidden", boxShadow:"0 2px 8px rgba(255,107,0,0.65)", flexShrink:0 }} onClick={e => e.stopPropagation()}>
              <button onClick={handleDec} style={{ width:22, height:26, border:"none", background:"transparent", color:"#fff", fontWeight:800, fontSize:"0.9rem", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>−</button>
              <input
                type="number" min="1" max="99"
                value={qty}
                onChange={e => {
                  const v = parseInt(e.target.value);
                  if (!isNaN(v) && v >= 1 && v <= 99) dispatch(updateQty({ id: product._id, quantity: Math.min(99, v) }));
                }}
                onClick={e => e.stopPropagation()}
                style={{ width:24, textAlign:"center", color:"#fff", fontWeight:800, fontSize:"1.05rem", background:"transparent", border:"none", outline:"none", MozAppearance:"textfield", WebkitAppearance:"none" }}
              />
              <button onClick={handleInc} style={{ width:22, height:26, border:"none", background:"transparent", color:"#fff", fontWeight:800, fontSize:"0.9rem", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate  = useNavigate();
  const { t } = useLang();
  const dispatch  = useDispatch();
  const { items } = useSelector(s => s.cart);

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [qty, setQty]         = useState(1);
  const [loading, setLoading] = useState(true);
  const [catMap, setCatMap]   = useState({});

  // Fetch categories for dynamic label mapping
  useEffect(() => {
    fetch(`${API}/api/products/categories/public`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          const map = {};
          data.categories.forEach(c => {
            const key = "cat" + c.name.replace(/\s+/g, "");
            map[c.name] = key;
          });
          setCatMap(map);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    fetch(`${API}/api/products/${slug}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setProduct(data.product);
          setRelated(data.related || []);
        }
      })
      .catch(err => console.error("Failed to fetch product:", err))
      .finally(() => setLoading(false));
    setQty(1);
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    const currentQty = items.find(i => i._id === product._id)?.quantity || 0;
    const canAdd = Math.min(Number(qty), Math.min(99, product.stock) - currentQty);
    if (canAdd <= 0) { toast.error("Max 99 per product allowed! 🚫"); return; }
    for (let i = 0; i < canAdd; i++) dispatch(addToCart(product));
    if (canAdd < qty) toast.error(`Only ${canAdd} added — max 99 per product`);
    else toast.success(`${canAdd}x ${product.name} added to cart! 🛒`);
  };

  const discount = product ? Math.round(100 - (product.price / product.originalPrice) * 100) : 0;
  const inCart   = items.filter(i => i._id === product?._id).reduce((a,b) => a + b.quantity, 0);

  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#0D0600", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"1rem", color:"rgba(255,245,230,0.65)" }}>
        <span style={{ width:36, height:36, border:"3px solid rgba(255,107,0,0.2)", borderTopColor:"#FF6B00", borderRadius:"50%", display:"inline-block", animation:"spin 0.8s linear infinite" }}/>
        <p>Loading product...</p>
      </div>
    </div>
  );

  if (!product) return (
    <div style={{ minHeight:"100vh", background:"#0D0600", display:"flex", alignItems:"center", justifyContent:"center", paddingTop:80 }}>
      <div style={{ textAlign:"center", color:"rgba(255,245,230,0.65)" }}>
        <div style={{ fontSize:"4rem", marginBottom:"1rem" }}>🎆</div>
        <p>Product not found</p>
        <Link to="/products" style={{ color:"#FF6B00", textDecoration:"none", fontWeight:700 }}>← Back to Products</Link>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#0D0600", fontFamily:"'Source Sans 3',sans-serif", paddingTop:80 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Nunito+Sans:wght@300;400;600;700;800&family=Source+Sans+3:wght@300;400;600;700&display=swap');
        @keyframes shimmer { 0%{background-position:0% center} 100%{background-position:200% center} }
        
        /* Hide number input spinners */
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance:none; margin:0; }
        input[type=number] { -moz-appearance:textfield; }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.6} }

        .add-cart-btn-main {
          flex:1; padding:0.75rem 1.2rem;
          background:linear-gradient(90deg,#FF3D00,#FF6B00,#FFD700,#FF6B00,#FF3D00);
          background-size:300% auto; animation:shimmer 3s linear infinite;
          border:none; border-radius:12px; color:#1A0500;
          font-family:'Source Sans 3',sans-serif; font-size:1rem; font-weight:800;
          cursor:pointer; display:flex; align-items:center; justify-content:center; gap:0.45rem;
          transition:transform .2s, box-shadow .2s;
          box-shadow:0 6px 22px rgba(255,107,0,0.6);
        }
        .add-cart-btn-main:hover { transform:translateY(-2px); box-shadow:0 10px 30px rgba(255,107,0,0.5); }

        .qty-btn { width:32px; height:32px; border-radius:9px; border:1.5px solid rgba(255,107,0,0.3); background:rgba(255,107,0,0.08); color:#FF6B00; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .2s; }
        .qty-btn:hover { background:rgba(255,107,0,0.18); border-color:rgba(255,107,0,0.55); }

        .prod-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,245,230,0.07);
          border-radius: 14px; overflow: hidden;
          transition: transform .3s cubic-bezier(.22,1,.36,1), box-shadow .3s, border-color .3s;
        }
        .prod-card:hover { transform:translateY(-3px); box-shadow:0 12px 36px rgba(0,0,0,0.35); border-color:rgba(255,107,0,0.22); }
        .prod-card:hover .prod-img { transform:scale(1.06); }

        .trust-badge { display:flex; align-items:center; gap:0.4rem; background:rgba(255,107,0,0.05); border:1px solid rgba(255,107,0,0.12); border-radius:8px; padding:0.45rem 0.65rem; }

        @media(max-width:768px) {
          .pd-layout { flex-direction:column !important; }
          .pd-image  { width:100% !important; }
          .related-grid { grid-template-columns:1fr !important; }
        }
      `}</style>

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 clamp(1rem,4vw,2.5rem) 4rem" }}>

        {/* Breadcrumb */}
        <div style={{ display:"flex", alignItems:"center", gap:"0.4rem", padding:"1.2rem 0 1.5rem", fontSize:"1.05rem", color:"rgba(255,245,230,0.65)", flexWrap:"wrap" }}>
          <Link to="/" style={{ color:"rgba(255,245,230,0.72)", textDecoration:"none" }} onMouseEnter={e=>e.target.style.color="#FF6B00"} onMouseLeave={e=>e.target.style.color="rgba(255,245,230,0.72)"}>Home</Link>
          <ChevronRight size={11}/>
          <Link to="/products" style={{ color:"rgba(255,245,230,0.72)", textDecoration:"none" }} onMouseEnter={e=>e.target.style.color="#FF6B00"} onMouseLeave={e=>e.target.style.color="rgba(255,245,230,0.72)"}>Shop</Link>
          <ChevronRight size={11}/>
          <Link to={`/products?category=${product.category}`} style={{ color:"rgba(255,245,230,0.72)", textDecoration:"none" }} onMouseEnter={e=>e.target.style.color="#FF6B00"} onMouseLeave={e=>e.target.style.color="rgba(255,245,230,0.72)"}>{product.category}</Link>
          <ChevronRight size={11}/>
          <span style={{ color:"rgba(255,245,230,0.8)", fontWeight:600 }}>{product.name}</span>
        </div>

        {/* ── MAIN PRODUCT CARD ── */}
        <div style={{ background:"linear-gradient(160deg,#FFF8F0,#FFF3E0,#FEF9F0)", borderRadius:20, padding:"1.4rem", border:"1px solid rgba(255,107,0,0.1)", boxShadow:"0 6px 32px rgba(0,0,0,0.1)", marginBottom:"3rem", animation:"fadeUp .4s ease" }}>
          <div className="pd-layout" style={{ display:"flex", gap:"2rem", alignItems:"flex-start" }}>

            {/* LEFT — Image */}
            <div className="pd-image" style={{ width:"42%", flexShrink:0 }}>
              <div style={{ borderRadius:16, overflow:"hidden", position:"relative", background:"#111" }}>
                <div style={{ height:340, overflow:"hidden", position:"relative" }}>
                  <img src={product.image} alt={product.name} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.35))", pointerEvents:"none" }}/>
                  {discount > 0 && <div style={{ position:"absolute", top:12, left:12, background:"linear-gradient(135deg,#FF3D00,#FF6B00)", color:"#fff", fontSize:"0.7rem", fontWeight:800, padding:"0.25rem 0.6rem", borderRadius:100, boxShadow:"0 2px 10px rgba(255,61,0,0.5)" }}>-{discount}% OFF</div>}
                  {product.isSafeForKids && <div style={{ position:"absolute", top:12, right:12, background:"linear-gradient(135deg,#1ABC9C,#2ECC71)", color:"#fff", fontSize:"0.9rem", fontWeight:800, padding:"0.25rem 0.6rem", borderRadius:100, display:"flex", alignItems:"center", gap:"0.25rem", boxShadow:"0 2px 10px rgba(46,204,113,0.5)" }}><Baby size={10} strokeWidth={2.5}/> Kids Safe</div>}
                </div>
              </div>
            </div>

            {/* RIGHT — Info */}
            <div style={{ flex:1, minWidth:0 }}>

              {/* Category + badges row */}
              <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"0.45rem", flexWrap:"wrap" }}>
                <span style={{ fontSize:"1rem", color:"#FF6B00", fontWeight:800, letterSpacing:"0.1em", textTransform:"uppercase" }}>{t[catMap[product.category]] || product.category}</span>
                {product.isSafeForKids && <span style={{ background:"rgba(46,204,113,0.15)", border:"1px solid rgba(46,204,113,0.3)", color:"#2ECC71", fontSize:"0.6rem", fontWeight:700, padding:"0.12rem 0.5rem", borderRadius:100, display:"flex", alignItems:"center", gap:"0.2rem" }}><Baby size={9}/> Kids Safe</span>}
                {product.stock <= 20 && <span style={{ background:"rgba(255,61,0,0.12)", border:"1px solid rgba(255,61,0,0.25)", color:"#FF3D00", fontSize:"0.6rem", fontWeight:700, padding:"0.12rem 0.5rem", borderRadius:100, animation:"pulse 2s infinite" }}>Only {product.stock} left!</span>}
              </div>

              {/* Name */}
              <h1 style={{ fontFamily:"'Source Sans 3',sans-serif", fontSize:"clamp(1.2rem,2.5vw,1.7rem)", fontWeight:800, color:"#1a0800", margin:"0 0 0.6rem", lineHeight:1.2 }}>{product.name}</h1>

              {/* Rating + stock inline */}
              <div style={{ display:"flex", alignItems:"center", gap:"0.6rem", marginBottom:"0.9rem", flexWrap:"wrap" }}>
                <StarRating rating={product.rating} size={14}/>
                <span style={{ fontSize:"1rem", fontWeight:700, color:"#b8860b" }}>{product.rating}</span>
                <span style={{ fontSize:"0.9rem", color:"rgba(26,8,0,0.55)" }}>({product.numReviews})</span>
                <span style={{ color:"rgba(26,8,0,0.18)" }}>|</span>
                <span style={{ fontSize:"0.76rem", color: product.stock <= 0 ? "rgba(255,245,230,0.35)" : product.stock <= 20 ? "#FF6B00" : "#1a7a4a", fontWeight:700 }}>
                  {product.stock <= 0 ? "❌ Out of Stock" : product.stock <= 20 ? `🔥 Only ${product.stock} left` : `✓ In Stock (${product.stock})`}
                </span>
              </div>

              {/* Price — compact inline */}
              <div style={{ display:"flex", alignItems:"center", gap:"0.6rem", marginBottom:"0.9rem", padding:"0.7rem 1rem", background:"rgba(255,107,0,0.07)", border:"1px solid rgba(255,107,0,0.15)", borderRadius:12 }}>
                <span style={{ fontSize:"1.7rem", fontWeight:800, background:"linear-gradient(135deg,#FF6B00,#FF3D00)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", lineHeight:1 }}>₹{product.price}</span>
                {product.originalPrice > product.price && (
                  <>
                    <span style={{ fontSize:"1.05rem", color:"rgba(26,8,0,0.35)", textDecoration:"line-through", fontWeight:400 }}>₹{product.originalPrice}</span>
                    <span style={{ fontSize:"1.05rem", background:"linear-gradient(135deg,#FF3D00,#FF6B00)", color:"#fff", fontWeight:800, padding:"0.15rem 0.5rem", borderRadius:100 }}>Save ₹{product.originalPrice - product.price}</span>
                  </>
                )}
              </div>

              {/* Description */}
              <p style={{ color:"rgba(26,8,0,0.65)", lineHeight:1.65, fontSize:"0.83rem", marginBottom:"1rem" }}>{product.description}</p>

              {/* Qty + Add to Cart */}
              <div style={{ display:"flex", gap:"0.7rem", marginBottom:"0.8rem", alignItems:"center" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"0.4rem", background:"rgba(255,107,0,0.05)", border:"1.5px solid rgba(255,107,0,0.15)", borderRadius:10, padding:"0.25rem 0.4rem" }}>
                  <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q-1))}><Minus size={13}/></button>
                  <input
                  type="number" min="1"
                  value={qty}
                  onChange={e => setQty(e.target.value)}
                  onFocus={e => e.target.select()}
                  onBlur={e => {
                    const v = parseInt(e.target.value);
                    if (!isNaN(v) && v >= 1) setQty(Math.min(99, Math.min(product.stock, v)));
                    else setQty(1);
                  }}
                  onKeyDown={e => { if (e.key === "Enter") e.target.blur(); }}
                  style={{ width:36, textAlign:"center", fontWeight:700, color:"#1a0800", fontSize:"1.05rem", background:"transparent", border:"none", outline:"none", MozAppearance:"textfield", WebkitAppearance:"none" }}
                />
                  <button className="qty-btn" onClick={() => setQty(q => Math.min(Math.min(99, product.stock), q+1))}><Plus size={13}/></button>
                </div>
                <button className="add-cart-btn-main" onClick={handleAddToCart} disabled={product.stock <= 0}
                  style={{ opacity: product.stock <= 0 ? 0.45 : 1, cursor: product.stock <= 0 ? "not-allowed" : "pointer" }}>
                  <ShoppingCart size={16} strokeWidth={2.2}/>
                  {product.stock <= 0 ? "Out of Stock" : qty > 1 ? `Add ${qty} to Cart` : "Add to Cart"}
                </button>
              </div>

              {inCart > 0 && (
                <p style={{ fontSize:"0.74rem", color:"#1a7a4a", fontWeight:600, marginBottom:"0.8rem" }}>
                  ✓ {inCart} already in cart — <Link to="/cart" style={{ color:"#FF6B00", textDecoration:"underline" }}>View Cart</Link>
                </p>
              )}

              {/* Trust badges — hardcoded English + translate="no" prevents browser auto-translation */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.5rem" }}>
                {[
                  { icon:Shield, color:"#2ECC71", text:"Safety Certified" },
                  { icon:Truck,  color:"#3498DB", text:"Free Delivery above ₹999" },
                  { icon:Flame,  color:"#FF6B00", text:"Direct from Sivakasi" },
                  { icon:Baby,   color:"#1ABC9C", text:"Safety Certified" },
                ].map(({ icon:Icon, color, text }) => (
                  <div key={text} className="trust-badge" translate="no">
                    <Icon size={12} color={color} strokeWidth={2}/>
                    <span style={{ fontSize:"1rem", color:"rgba(26,8,0,0.7)", fontWeight:600 }}>{text}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* ── RELATED PRODUCTS ── */}
        {related.length > 0 && (
          <div style={{ animation:"fadeUp .5s ease .1s both" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.2rem", flexWrap:"wrap", gap:"0.75rem" }}>
              <div>
                <p style={{ fontSize:"1rem", color:"#FF6B00", fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", margin:"0 0 0.2rem" }}>✨ You May Also Like</p>
                <h2 style={{ fontFamily:"'Libre Baskerville',serif", textTransform:"uppercase", letterSpacing:"0.05em", fontSize:"clamp(0.95rem,2.5vw,1.35rem)", color:"#FFF5E6", fontWeight:900, margin:0 }}>
                  Related <span style={{ background:"linear-gradient(90deg,#FFD700,#FF6B00)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Products</span>
                </h2>
              </div>
              <Link to="/products" style={{ fontSize:"0.9rem", color:"#FF6B00", textDecoration:"none", fontWeight:700, display:"flex", alignItems:"center", gap:"0.3rem", border:"1px solid rgba(255,107,0,0.25)", borderRadius:9, padding:"0.4rem 0.85rem", transition:"all .2s" }}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(255,107,0,0.1)"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                View All <ChevronRight size={13}/>
              </Link>
            </div>
            <div className="related-grid" style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"0.75rem" }}>
              {related.map(p => <ProductCard key={p._id} product={p} catMap={catMap} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
