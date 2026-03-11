import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart, updateQty } from "../../redux/slices/cartSlice";
import { ShoppingCart, Star, Baby, Shield, Truck, Flame, Plus, Minus, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

const toSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const fromSlug = (slug, products) => products.find(p => toSlug(p.name) === slug);

const DEMO_PRODUCTS = [
  { _id:"1",  name:"Golden Sparklers Pack",      category:"Sparklers",    price:299,  originalPrice:399,  rating:4.8, numReviews:124, isSafeForKids:true,  image:"https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80", description:"Experience the magic of Diwali with our premium Golden Sparklers Pack. Each sparkler burns for 90 seconds with a brilliant golden shower effect. Perfect for family celebrations, weddings, and festivals.", stock:45 },
  { _id:"2",  name:"Sky Rocket 10-in-1",          category:"Rockets",      price:549,  originalPrice:699,  rating:4.6, numReviews:89,  isSafeForKids:false, image:"https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800&q=80", description:"Reach for the skies with our Sky Rocket 10-in-1 combo. Each box contains 10 rockets with different colour effects — red stars, green comets, golden rain, and silver crackling.", stock:28 },
  { _id:"3",  name:"Rainbow Flower Pot Set",      category:"Flower Pots",  price:399,  originalPrice:499,  rating:4.9, numReviews:201, isSafeForKids:true,  image:"https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800&q=80", description:"A mesmerising flower pot set that creates a stunning rainbow-coloured fountain effect. Safe enough for the whole family and produces minimal smoke.", stock:60 },
  { _id:"4",  name:"Thunder Bomb Pack (20pcs)",   category:"Bombs",        price:199,  originalPrice:249,  rating:4.3, numReviews:56,  isSafeForKids:false, image:"https://images.unsplash.com/photo-1514254040595-6e0d913fc1e4?w=800&q=80", description:"Classic thunder crackers with a loud, satisfying bang. Pack of 20 individually wrapped crackers with long fuses for safe lighting.", stock:100 },
  { _id:"5",  name:"Sky Shot Premium Bundle",     category:"Sky Shots",    price:899,  originalPrice:1199, rating:4.7, numReviews:143, isSafeForKids:false, image:"https://images.unsplash.com/photo-1533230408708-8f9f91d1235a?w=800&q=80", description:"Our premium sky shot bundle delivers a professional fireworks show from your own backyard. Sequential firing with 3-second intervals.", stock:15 },
  { _id:"6",  name:"Kids Fun Cracker Set",        category:"Kids Special", price:349,  originalPrice:449,  rating:4.9, numReviews:312, isSafeForKids:true,  image:"https://images.unsplash.com/photo-1604881991720-f91add269bed?w=800&q=80", description:"Specially designed for children aged 5 and above. Includes colourful sparklers, pop-pops, and snake tablets — all low-noise and low-smoke.", stock:80 },
  { _id:"7",  name:"Diwali Mega Combo Pack",      category:"Combo Packs",  price:1499, originalPrice:1999, rating:4.8, numReviews:267, isSafeForKids:false, image:"https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&q=80", description:"The ultimate Diwali celebration package! Includes rockets, flower pots, sparklers, bombs, and sky shots — everything for a full night of celebration.", stock:20 },
  { _id:"8",  name:"Premium Gift Box Deluxe",     category:"Gift Boxes",   price:799,  originalPrice:999,  rating:4.6, numReviews:98,  isSafeForKids:true,  image:"https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80", description:"A beautifully packaged gift box perfect for Diwali gifting. Contains premium sparklers, colour pencils, and flower pots in a decorative box with ribbon.", stock:35 },
  { _id:"9",  name:"Silver Sparklers (50pcs)",    category:"Sparklers",    price:179,  originalPrice:199,  rating:4.5, numReviews:445, isSafeForKids:true,  image:"https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80", description:"Our best-selling Silver Sparklers pack — 50 sparklers with a classic silver shower effect. Perfect for birthdays, weddings, and Diwali.", stock:120 },
  { _id:"10", name:"Colour Rain Rockets",         category:"Rockets",      price:649,  originalPrice:799,  rating:4.4, numReviews:72,  isSafeForKids:false, image:"https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800&q=80", description:"A stunning rocket pack with a beautiful colour rain effect. Each rocket bursts into a cascade of multicoloured stars that slowly fall like rain.", stock:40 },
  { _id:"11", name:"Mini Flower Pot (12pcs)",     category:"Flower Pots",  price:249,  originalPrice:299,  rating:4.7, numReviews:189, isSafeForKids:true,  image:"https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800&q=80", description:"Compact mini flower pots for balconies and courtyards. Pack of 12, each creating a colourful fountain for 90 seconds. Very low noise and smoke.", stock:75 },
  { _id:"12", name:"Atom Bomb Special (10pcs)",   category:"Bombs",        price:149,  originalPrice:199,  rating:4.2, numReviews:33,  isSafeForKids:false, image:"https://images.unsplash.com/photo-1514254040595-6e0d913fc1e4?w=800&q=80", description:"The classic Atom Bomb cracker — a Diwali staple for decades. Each cracker delivers a sharp, loud bang. Pack of 10 with extra-long fuses.", stock:90 },
];

function StarRating({ rating, size = 14 }) {
  return (
    <div style={{ display:"flex", gap:"0.15rem" }}>
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={size}
          fill={s <= Math.round(rating) ? "#FFD700" : "none"}
          color={s <= Math.round(rating) ? "#FFD700" : "rgba(255,245,230,0.2)"}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

/* ── Same horizontal card as Products page ── */
function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(s => s.cart.items);
  const cartItem  = cartItems.find(i => i._id === product._id);
  const qty       = cartItem ? cartItem.quantity : 0;
  const discount  = product.originalPrice ? Math.round(100 - (product.price / product.originalPrice) * 100) : 0;
  const [imgErr, setImgErr] = useState(false);

  const handleAdd = (e) => { e.stopPropagation(); dispatch(addToCart(product)); toast.success("Added to cart! 🎆", { duration:1500 }); };
  const handleInc = (e) => { e.stopPropagation(); dispatch(updateQty({ id: product._id, quantity: qty + 1 })); };
  const handleDec = (e) => { e.stopPropagation(); qty > 1 ? dispatch(updateQty({ id: product._id, quantity: qty - 1 })) : dispatch(removeFromCart(product._id)); };

  return (
    <div className="prod-card" style={{ display:"flex", flexDirection:"row", alignItems:"stretch", minHeight:115, cursor:"pointer" }}
      onClick={() => navigate(`/products/${toSlug(product.name)}`)}>
      {/* Image */}
      <div style={{ flexShrink:0, width:105, position:"relative" }}>
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
      </div>

      {/* Info */}
      <div style={{ flex:1, padding:"0.65rem 0.75rem", display:"flex", flexDirection:"column", justifyContent:"space-between", minWidth:0 }}>
        <div>
          <div style={{ fontSize:"0.56rem", color:"#FF6B00", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"0.15rem", display:"flex", alignItems:"center", gap:"0.35rem" }}>
            {product.category}
            {product.isSafeForKids && <span style={{ color:"#1ABC9C", fontSize:"0.54rem" }}>✦ Kids Safe</span>}
          </div>
          <div style={{ fontSize:"0.8rem", fontWeight:700, color:"rgba(255,245,230,0.92)", lineHeight:1.3, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
            {product.name}
          </div>
        </div>

        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:"0.3rem", marginTop:"0.4rem" }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:"0.25rem", marginBottom:"0.18rem" }}>
              <StarRating rating={product.rating} size={10}/>
              <span style={{ fontSize:"0.58rem", color:"rgba(255,245,230,0.5)" }}>({product.numReviews})</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"0.3rem" }}>
              <span style={{ fontSize:"0.92rem", fontWeight:800, color:"#FFD700" }}>₹{product.price}</span>
              {product.originalPrice > product.price && (
                <span style={{ fontSize:"0.65rem", color:"rgba(255,245,230,0.35)", textDecoration:"line-through" }}>₹{product.originalPrice}</span>
              )}
            </div>
          </div>
          {qty === 0 ? (
            <button onClick={handleAdd} style={{ background:"linear-gradient(135deg,#FF6B00,#FF3D00)", border:"none", borderRadius:8, color:"#fff", fontWeight:800, fontSize:"0.7rem", padding:"0.35rem 0.7rem", cursor:"pointer", display:"flex", alignItems:"center", gap:"0.2rem", boxShadow:"0 2px 8px rgba(255,107,0,0.4)", fontFamily:"'DM Sans',sans-serif", whiteSpace:"nowrap", flexShrink:0 }}>
              + ADD
            </button>
          ) : (
            <div style={{ display:"flex", alignItems:"center", background:"linear-gradient(135deg,#FF6B00,#FF3D00)", borderRadius:8, overflow:"hidden", boxShadow:"0 2px 8px rgba(255,107,0,0.4)", flexShrink:0 }} onClick={e => e.stopPropagation()}>
              <button onClick={handleDec} style={{ width:24, height:28, border:"none", background:"transparent", color:"#fff", fontWeight:800, fontSize:"0.95rem", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>−</button>
              <span style={{ minWidth:18, textAlign:"center", color:"#fff", fontWeight:800, fontSize:"0.75rem" }}>{qty}</span>
              <button onClick={handleInc} style={{ width:24, height:28, border:"none", background:"transparent", color:"#fff", fontWeight:800, fontSize:"0.95rem", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector(s => s.cart);

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [qty, setQty]         = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
    const found = fromSlug(slug, DEMO_PRODUCTS);
    if (found) {
      setProduct(found);
      setRelated(DEMO_PRODUCTS.filter(p => p._id !== found._id && (p.category === found.category || p.isSafeForKids === found.isSafeForKids)).slice(0, 4));
    }
    setQty(1);
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < qty; i++) dispatch(addToCart(product));
    toast.success(`${qty}x ${product.name} added to cart! 🛒`);
  };

  const discount = product ? Math.round(100 - (product.price / product.originalPrice) * 100) : 0;
  const inCart   = items.filter(i => i._id === product?._id).reduce((a,b) => a + b.quantity, 0);

  if (!product) return (
    <div style={{ minHeight:"100vh", background:"#0D0600", display:"flex", alignItems:"center", justifyContent:"center", paddingTop:80 }}>
      <div style={{ textAlign:"center", color:"rgba(255,245,230,0.4)" }}>
        <div style={{ fontSize:"4rem", marginBottom:"1rem" }}>🎆</div>
        <p>Product not found</p>
        <Link to="/products" style={{ color:"#FF6B00", textDecoration:"none", fontWeight:700 }}>← Back to Shop</Link>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#0D0600", fontFamily:"'DM Sans',sans-serif", paddingTop:80 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@900&family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
        @keyframes shimmer { 0%{background-position:0% center} 100%{background-position:200% center} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.6} }

        .add-cart-btn-main {
          flex:1; padding:0.95rem 1.5rem;
          background:linear-gradient(90deg,#FF3D00,#FF6B00,#FFD700,#FF6B00,#FF3D00);
          background-size:300% auto; animation:shimmer 3s linear infinite;
          border:none; border-radius:14px; color:#1A0500;
          font-family:'DM Sans',sans-serif; font-size:1rem; font-weight:800;
          cursor:pointer; display:flex; align-items:center; justify-content:center; gap:0.5rem;
          transition:transform .2s, box-shadow .2s;
          box-shadow:0 8px 28px rgba(255,107,0,0.38);
        }
        .add-cart-btn-main:hover { transform:translateY(-2px); box-shadow:0 12px 36px rgba(255,107,0,0.55); }

        .qty-btn { width:36px; height:36px; border-radius:10px; border:1.5px solid rgba(255,107,0,0.3); background:rgba(255,107,0,0.08); color:#FF6B00; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .2s; }
        .qty-btn:hover { background:rgba(255,107,0,0.18); border-color:rgba(255,107,0,0.55); }

        .prod-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,245,230,0.07);
          border-radius: 14px; overflow: hidden;
          transition: transform .3s cubic-bezier(.22,1,.36,1), box-shadow .3s, border-color .3s;
        }
        .prod-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 36px rgba(0,0,0,0.35);
          border-color: rgba(255,107,0,0.22);
        }
        .prod-card:hover .prod-img { transform: scale(1.06); }

        @media(max-width:768px) {
          .pd-layout { flex-direction:column !important; }
          .pd-image  { width:100% !important; }
          .related-grid { grid-template-columns:1fr !important; }
        }
      `}</style>

      <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 clamp(1rem,4vw,2.5rem) 5rem" }}>

        {/* Breadcrumb */}
        <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", padding:"1.5rem 0 2rem", fontSize:"0.78rem", color:"rgba(255,245,230,0.4)", flexWrap:"wrap" }}>
          <Link to="/" style={{ color:"rgba(255,245,230,0.5)", textDecoration:"none" }}
            onMouseEnter={e=>e.target.style.color="#FF6B00"} onMouseLeave={e=>e.target.style.color="rgba(255,245,230,0.5)"}>Home</Link>
          <ChevronRight size={12}/>
          <Link to="/products" style={{ color:"rgba(255,245,230,0.5)", textDecoration:"none" }}
            onMouseEnter={e=>e.target.style.color="#FF6B00"} onMouseLeave={e=>e.target.style.color="rgba(255,245,230,0.5)"}>Shop</Link>
          <ChevronRight size={12}/>
          <Link to={`/products?category=${product.category}`} style={{ color:"rgba(255,245,230,0.5)", textDecoration:"none" }}
            onMouseEnter={e=>e.target.style.color="#FF6B00"} onMouseLeave={e=>e.target.style.color="rgba(255,245,230,0.5)"}>{product.category}</Link>
          <ChevronRight size={12}/>
          <span style={{ color:"rgba(255,245,230,0.8)", fontWeight:600 }}>{product.name}</span>
        </div>

        {/* ── MAIN PRODUCT CARD ── */}
        <div style={{ background:"linear-gradient(160deg,#FFF8F0,#FFF3E0,#FEF9F0)", borderRadius:24, padding:"2rem", border:"1px solid rgba(255,107,0,0.1)", boxShadow:"0 8px 40px rgba(0,0,0,0.12)", marginBottom:"4rem", animation:"fadeUp .4s ease" }}>
          <div className="pd-layout" style={{ display:"flex", gap:"3rem", alignItems:"flex-start" }}>

            {/* LEFT — Single Image */}
            <div className="pd-image" style={{ width:"45%", flexShrink:0 }}>
              <div style={{ borderRadius:20, overflow:"hidden", position:"relative", background:"#111", border:"1px solid rgba(255,245,230,0.08)" }}>
                <div style={{ height:420, overflow:"hidden", position:"relative" }}>
                  <img src={product.image} alt={product.name}
                    style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
                  />
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.4))", pointerEvents:"none" }}/>
                  {discount > 0 && <div style={{ position:"absolute", top:14, left:14, background:"linear-gradient(135deg,#FF3D00,#FF6B00)", color:"#fff", fontSize:"0.75rem", fontWeight:800, padding:"0.3rem 0.7rem", borderRadius:100, boxShadow:"0 3px 12px rgba(255,61,0,0.5)" }}>-{discount}% OFF</div>}
                  {product.isSafeForKids && <div style={{ position:"absolute", top:14, right:14, background:"linear-gradient(135deg,#1ABC9C,#2ECC71)", color:"#fff", fontSize:"0.68rem", fontWeight:800, padding:"0.3rem 0.7rem", borderRadius:100, display:"flex", alignItems:"center", gap:"0.3rem", boxShadow:"0 3px 12px rgba(46,204,113,0.5)" }}><Baby size={11} strokeWidth={2.5}/> Kids Safe</div>}
                </div>
              </div>
            </div>

            {/* RIGHT — Product Info */}
            <div style={{ flex:1, minWidth:0 }}>
              {/* Category + badges */}
              <div style={{ display:"flex", alignItems:"center", gap:"0.6rem", marginBottom:"0.6rem", flexWrap:"wrap" }}>
                <span style={{ fontSize:"0.7rem", color:"#FF6B00", fontWeight:800, letterSpacing:"0.1em", textTransform:"uppercase" }}>{product.category}</span>
                {product.isSafeForKids && <span style={{ background:"rgba(46,204,113,0.15)", border:"1px solid rgba(46,204,113,0.3)", color:"#2ECC71", fontSize:"0.65rem", fontWeight:700, padding:"0.15rem 0.55rem", borderRadius:100, display:"flex", alignItems:"center", gap:"0.25rem" }}><Baby size={10}/> Kids Safe</span>}
                {product.stock <= 20 && <span style={{ background:"rgba(255,61,0,0.12)", border:"1px solid rgba(255,61,0,0.25)", color:"#FF3D00", fontSize:"0.65rem", fontWeight:700, padding:"0.15rem 0.55rem", borderRadius:100, animation:"pulse 2s infinite" }}>Only {product.stock} left!</span>}
              </div>

              {/* Name */}
              <h1 style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"clamp(1.4rem,3vw,2rem)", fontWeight:800, color:"#1a0800", margin:"0 0 0.8rem", lineHeight:1.2 }}>{product.name}</h1>

              {/* Rating */}
              <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"1.4rem", flexWrap:"wrap" }}>
                <StarRating rating={product.rating} size={16}/>
                <span style={{ fontSize:"0.88rem", fontWeight:700, color:"#FFD700" }}>{product.rating}</span>
                <span style={{ fontSize:"0.82rem", color:"rgba(26,8,0,0.65)" }}>({product.numReviews} reviews)</span>
                <span style={{ color:"rgba(26,8,0,0.2)" }}>|</span>
                <span style={{ fontSize:"0.82rem", color: product.stock > 20 ? "#1a7a4a" : "#FF6B00", fontWeight:700 }}>
                  {product.stock > 0 ? `✓ In Stock (${product.stock} units)` : "✗ Out of Stock"}
                </span>
              </div>

              {/* Price */}
              <div style={{ display:"flex", alignItems:"baseline", gap:"0.75rem", marginBottom:"1.6rem", padding:"1.2rem 1.4rem", background:"rgba(255,107,0,0.08)", border:"1px solid rgba(255,107,0,0.18)", borderRadius:14 }}>
                <span style={{ fontSize:"2.2rem", fontWeight:800, background:"linear-gradient(135deg,#FF6B00,#FF3D00)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>₹{product.price}</span>
                {product.originalPrice > product.price && (
                  <>
                    <span style={{ fontSize:"1.1rem", color:"rgba(26,8,0,0.35)", textDecoration:"line-through", fontWeight:400 }}>₹{product.originalPrice}</span>
                    <span style={{ fontSize:"0.82rem", background:"linear-gradient(135deg,#FF3D00,#FF6B00)", color:"#fff", fontWeight:800, padding:"0.2rem 0.6rem", borderRadius:100 }}>Save ₹{product.originalPrice - product.price}</span>
                  </>
                )}
              </div>

              {/* Description */}
              <p style={{ color:"rgba(26,8,0,0.7)", lineHeight:1.75, fontSize:"0.88rem", marginBottom:"1.6rem" }}>{product.description}</p>

              {/* Qty + Add to Cart */}
              <div style={{ display:"flex", gap:"0.85rem", marginBottom:"1.2rem", alignItems:"center", flexWrap:"wrap" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", background:"rgba(255,107,0,0.05)", border:"1.5px solid rgba(255,107,0,0.15)", borderRadius:12, padding:"0.3rem 0.5rem" }}>
                  <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q-1))}><Minus size={14}/></button>
                  <span style={{ minWidth:28, textAlign:"center", fontWeight:700, color:"#1a0800", fontSize:"1rem" }}>{qty}</span>
                  <button className="qty-btn" onClick={() => setQty(q => Math.min(product.stock, q+1))}><Plus size={14}/></button>
                </div>
                <button className="add-cart-btn-main" onClick={handleAddToCart} disabled={product.stock === 0}>
                  <ShoppingCart size={18} strokeWidth={2.2}/>
                  Add {qty > 1 ? `${qty} to Cart` : "to Cart"}
                </button>
              </div>

              {inCart > 0 && (
                <p style={{ fontSize:"0.78rem", color:"#1a7a4a", fontWeight:600, marginBottom:"1.2rem" }}>
                  ✓ {inCart} already in your cart — <Link to="/cart" style={{ color:"#FF6B00", textDecoration:"underline" }}>View Cart</Link>
                </p>
              )}

              {/* Trust badges */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.6rem", marginBottom:"1.4rem" }}>
                {[
                  { icon:Shield, color:"#2ECC71", text:"100% Certified Safe" },
                  { icon:Truck,  color:"#3498DB", text:"Free Ship ₹999+" },
                  { icon:Flame,  color:"#FF6B00", text:"Direct from Sivakasi" },
                  { icon:Baby,   color:"#1ABC9C", text:"BIS Certified Products" },
                ].map(({ icon:Icon, color, text }) => (
                  <div key={text} style={{ display:"flex", alignItems:"center", gap:"0.5rem", background:"rgba(255,107,0,0.05)", border:"1px solid rgba(255,107,0,0.12)", borderRadius:10, padding:"0.6rem 0.8rem" }}>
                    <Icon size={14} color={color} strokeWidth={2}/>
                    <span style={{ fontSize:"0.72rem", color:"rgba(26,8,0,0.75)", fontWeight:600 }}>{text}</span>
                  </div>
                ))}
              </div>

              {/* Sivakasi tag */}
              <div style={{ background:"rgba(255,107,0,0.06)", border:"1px solid rgba(255,107,0,0.15)", borderRadius:12, padding:"0.8rem 1rem", display:"flex", alignItems:"center", gap:"0.6rem" }}>
                <span style={{ fontSize:"1.1rem" }}>🏭</span>
                <p style={{ margin:0, fontSize:"0.75rem", color:"rgba(26,8,0,0.7)", lineHeight:1.5, fontWeight:500 }}>
                  Sourced directly from <strong style={{ color:"#FF6B00" }}>Sivakasi, Tamil Nadu</strong> — India's fireworks capital since 1923
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── RELATED PRODUCTS ── */}
        {related.length > 0 && (
          <div style={{ animation:"fadeUp .5s ease .1s both" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.5rem", flexWrap:"wrap", gap:"1rem" }}>
              <div>
                <p style={{ fontSize:"0.68rem", color:"#FF6B00", fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", margin:"0 0 0.25rem" }}>✨ You May Also Like</p>
                <h2 style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:"clamp(1rem,2.5vw,1.5rem)", color:"#FFF5E6", fontWeight:900, margin:0 }}>
                  Related <span style={{ background:"linear-gradient(90deg,#FFD700,#FF6B00)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Products</span>
                </h2>
              </div>
              <Link to="/products" style={{ fontSize:"0.82rem", color:"#FF6B00", textDecoration:"none", fontWeight:700, display:"flex", alignItems:"center", gap:"0.3rem", border:"1px solid rgba(255,107,0,0.25)", borderRadius:10, padding:"0.45rem 1rem", transition:"all .2s" }}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(255,107,0,0.1)"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                View All <ChevronRight size={14}/>
              </Link>
            </div>

            <div className="related-grid" style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"0.85rem" }}>
              {related.map(p => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
