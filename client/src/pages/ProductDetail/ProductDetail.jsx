import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/slices/cartSlice";
import { ShoppingCart, Star, ChevronLeft, Baby, Shield, Truck, Flame, Plus, Minus, ThumbsUp, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

// ── Demo product data (replace with API call) ──
const toSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const fromSlug = (slug, products) => products.find(p => toSlug(p.name) === slug);

const DEMO_PRODUCTS = [
  { _id:"1",  name:"Golden Sparklers Pack",      category:"Sparklers",    price:299,  originalPrice:399,  rating:4.8, numReviews:124, isSafeForKids:true,  image:"https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80", images:["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80","https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800&q=80","https://images.unsplash.com/photo-1533230408708-8f9f91d1235a?w=800&q=80"], description:"Experience the magic of Diwali with our premium Golden Sparklers Pack. Each sparkler burns for 90 seconds with a brilliant golden shower effect. Perfect for family celebrations, weddings, and festivals. Made with high-quality composition for consistent burn time.", specs:{ "Pack Contains":"25 Sparklers", "Burn Time":"90 seconds each", "Height":"30cm", "Effect":"Golden shower", "Weight":"500g", "Manufacturer":"Sri Kaliswari Fireworks, Sivakasi" }, stock:45 },
  { _id:"2",  name:"Sky Rocket 10-in-1",          category:"Rockets",      price:549,  originalPrice:699,  rating:4.6, numReviews:89,  isSafeForKids:false, image:"https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800&q=80", images:["https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800&q=80","https://images.unsplash.com/photo-1533230408708-8f9f91d1235a?w=800&q=80","https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80"], description:"Reach for the skies with our Sky Rocket 10-in-1 combo. Each box contains 10 rockets with different colour effects — red stars, green comets, golden rain, and silver crackling. Launches up to 80 feet high. Ideal for open ground celebrations.", specs:{ "Pack Contains":"10 Rockets", "Launch Height":"80 feet", "Effects":"10 different colours", "Fuse Length":"8cm", "Weight":"800g", "Manufacturer":"Standard Fireworks, Sivakasi" }, stock:28 },
  { _id:"3",  name:"Rainbow Flower Pot Set",      category:"Flower Pots",  price:399,  originalPrice:499,  rating:4.9, numReviews:201, isSafeForKids:true,  image:"https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800&q=80", images:["https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800&q=80","https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80","https://images.unsplash.com/photo-1533230408708-8f9f91d1235a?w=800&q=80"], description:"A mesmerising flower pot set that creates a stunning rainbow-coloured fountain effect. Safe enough for the whole family and produces minimal smoke. Great for terraces, balconies, and indoor celebrations (ventilated). Each pot burns beautifully for 2 minutes.", specs:{ "Pack Contains":"6 Flower Pots", "Burn Time":"2 minutes each", "Effect":"Rainbow fountain", "Smoke":"Minimal", "Weight":"600g", "Manufacturer":"Ayyan Fireworks, Sivakasi" }, stock:60 },
  { _id:"4",  name:"Thunder Bomb Pack (20pcs)",   category:"Bombs",        price:199,  originalPrice:249,  rating:4.3, numReviews:56,  isSafeForKids:false, image:"https://images.unsplash.com/photo-1514254040595-6e0d913fc1e4?w=800&q=80", images:["https://images.unsplash.com/photo-1514254040595-6e0d913fc1e4?w=800&q=80","https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800&q=80","https://images.unsplash.com/photo-1533230408708-8f9f91d1235a?w=800&q=80"], description:"Classic thunder crackers with a loud, satisfying bang. Pack of 20 individually wrapped crackers with long fuses for safe lighting. A Diwali essential for those who enjoy the traditional cracker experience.", specs:{ "Pack Contains":"20 Crackers", "Fuse Length":"10cm", "Sound Level":"High", "Weight":"400g", "Manufacturer":"Cock Brand, Sivakasi" }, stock:100 },
  { _id:"5",  name:"Sky Shot Premium Bundle",     category:"Sky Shots",    price:899,  originalPrice:1199, rating:4.7, numReviews:143, isSafeForKids:false, image:"https://images.unsplash.com/photo-1533230408708-8f9f91d1235a?w=800&q=80", images:["https://images.unsplash.com/photo-1533230408708-8f9f91d1235a?w=800&q=80","https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800&q=80","https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800&q=80"], description:"Our premium sky shot bundle delivers a professional fireworks show from your own backyard. Each shot fires a coloured star into the sky that explodes into a beautiful burst. Sequential firing with 3-second intervals.", specs:{ "Pack Contains":"30 Shots", "Launch Height":"50 feet", "Effects":"Multi-colour stars", "Interval":"3 seconds", "Weight":"1.2kg", "Manufacturer":"Sony Fireworks, Sivakasi" }, stock:15 },
  { _id:"6",  name:"Kids Fun Cracker Set",        category:"Kids Special",  price:349,  originalPrice:449,  rating:4.9, numReviews:312, isSafeForKids:true,  image:"https://images.unsplash.com/photo-1604881991720-f91add269bed?w=800&q=80", images:["https://images.unsplash.com/photo-1604881991720-f91add269bed?w=800&q=80","https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80","https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800&q=80"], description:"Specially designed for children aged 5 and above. This fun set includes colourful sparklers, pop-pops, and snake tablets — all low-noise and low-smoke products certified safe for kids. A wonderful way to introduce little ones to the joy of Diwali safely.", specs:{ "Pack Contains":"Mixed set of 20 items", "Age Suitable":"5+ years", "Noise Level":"Low", "Smoke":"Very minimal", "Weight":"350g", "Manufacturer":"Nandhu Fireworks, Sivakasi" }, stock:80 },
  { _id:"7",  name:"Diwali Mega Combo Pack",      category:"Combo Packs",  price:1499, originalPrice:1999, rating:4.8, numReviews:267, isSafeForKids:false, image:"https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&q=80", images:["https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&q=80","https://images.unsplash.com/photo-1533230408708-8f9f91d1235a?w=800&q=80","https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800&q=80"], description:"The ultimate Diwali celebration package! This mega combo includes rockets, flower pots, sparklers, bombs, and sky shots — everything you need for a full night of celebration. Curated by our experts for the perfect Diwali experience.", specs:{ "Pack Contains":"50+ items", "Categories":"6 types", "Duration":"2+ hours of fun", "Weight":"3.5kg", "Best For":"Family gatherings", "Manufacturer":"Multiple, Sivakasi" }, stock:20 },
  { _id:"8",  name:"Premium Gift Box Deluxe",     category:"Gift Boxes",   price:799,  originalPrice:999,  rating:4.6, numReviews:98,  isSafeForKids:true,  image:"https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80", images:["https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80","https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80","https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800&q=80"], description:"A beautifully packaged gift box perfect for gifting during Diwali. Contains a curated selection of premium sparklers, colour pencils, and flower pots. Comes in a decorative box with a ribbon — ready to gift!", specs:{ "Pack Contains":"15 items in gift box", "Gift Wrapping":"Included", "Ribbon":"Yes", "Weight":"1kg", "Best For":"Corporate & personal gifting", "Manufacturer":"Multiple, Sivakasi" }, stock:35 },
  { _id:"9",  name:"Silver Sparklers (50pcs)",    category:"Sparklers",    price:179,  originalPrice:199,  rating:4.5, numReviews:445, isSafeForKids:true,  image:"https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80", images:["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80","https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800&q=80","https://images.unsplash.com/photo-1533230408708-8f9f91d1235a?w=800&q=80"], description:"Our best-selling Silver Sparklers pack — 50 sparklers with a classic silver shower effect. Perfect for birthday cakes, wedding send-offs, and Diwali celebrations. Each sparkler burns cleanly with minimal smoke.", specs:{ "Pack Contains":"50 Sparklers", "Burn Time":"60 seconds each", "Effect":"Silver shower", "Smoke":"Minimal", "Weight":"400g", "Manufacturer":"Sri Kaliswari Fireworks, Sivakasi" }, stock:120 },
  { _id:"10", name:"Colour Rain Rockets",         category:"Rockets",      price:649,  originalPrice:799,  rating:4.4, numReviews:72,  isSafeForKids:false, image:"https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800&q=80", images:["https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800&q=80","https://images.unsplash.com/photo-1533230408708-8f9f91d1235a?w=800&q=80","https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800&q=80"], description:"A stunning rocket pack that delivers a beautiful colour rain effect at peak height. Each rocket bursts into a cascade of multicoloured stars that slowly fall like rain. Pack of 8 rockets with varied colour combinations.", specs:{ "Pack Contains":"8 Rockets", "Launch Height":"70 feet", "Effect":"Colour rain cascade", "Fuse Length":"8cm", "Weight":"700g", "Manufacturer":"Standard Fireworks, Sivakasi" }, stock:40 },
  { _id:"11", name:"Mini Flower Pot (12pcs)",     category:"Flower Pots",  price:249,  originalPrice:299,  rating:4.7, numReviews:189, isSafeForKids:true,  image:"https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800&q=80", images:["https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800&q=80","https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80","https://images.unsplash.com/photo-1533230408708-8f9f91d1235a?w=800&q=80"], description:"Compact mini flower pots perfect for small spaces like balconies and courtyards. Pack of 12 pots each creating a colourful fountain effect for 90 seconds. Kids safe with very low noise and smoke.", specs:{ "Pack Contains":"12 Mini Pots", "Burn Time":"90 seconds each", "Effect":"Colour fountain", "Noise":"Very low", "Weight":"450g", "Manufacturer":"Ayyan Fireworks, Sivakasi" }, stock:75 },
  { _id:"12", name:"Atom Bomb Special (10pcs)",   category:"Bombs",        price:149,  originalPrice:199,  rating:4.2, numReviews:33,  isSafeForKids:false, image:"https://images.unsplash.com/photo-1514254040595-6e0d913fc1e4?w=800&q=80", images:["https://images.unsplash.com/photo-1514254040595-6e0d913fc1e4?w=800&q=80","https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800&q=80","https://images.unsplash.com/photo-1533230408708-8f9f91d1235a?w=800&q=80"], description:"The classic Atom Bomb cracker — a Diwali staple for decades. Each cracker delivers a sharp, loud bang. Pack of 10 with extra-long fuses for safe lighting. For outdoor use only.", specs:{ "Pack Contains":"10 Crackers", "Fuse Length":"12cm", "Sound Level":"Very High", "Use":"Outdoor only", "Weight":"300g", "Manufacturer":"Cock Brand, Sivakasi" }, stock:90 },
];

const DEMO_REVIEWS = [
  { _id:"r1", user:"Priya S.", avatar:"P", rating:5, comment:"Absolutely loved the sparklers! Burns bright and lasts long. Will definitely order again for this Diwali!", date:"2 days ago", helpful:24 },
  { _id:"r2", user:"Karthik M.", avatar:"K", rating:4, comment:"Good quality product. Delivery was fast. Only one sparkler in the pack didn't light but rest were perfect.", date:"1 week ago", helpful:12 },
  { _id:"r3", user:"Anitha R.", avatar:"A", rating:5, comment:"Perfect for kids! Very safe and minimal smoke. My children loved it. Great product from Sivakasi.", date:"2 weeks ago", helpful:31 },
  { _id:"r4", user:"Rajesh T.", avatar:"R", rating:4, comment:"Nice golden effect. Packing is good. Arrived before Diwali as promised. Happy customer!", date:"3 weeks ago", helpful:8 },
];

function StarRating({ rating, size = 14, interactive = false, onRate }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display:"flex", gap:"0.15rem" }}>
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={size}
          fill={s <= (hover || Math.round(rating)) ? "#FFD700" : "none"}
          color={s <= (hover || Math.round(rating)) ? "#FFD700" : "rgba(255,245,230,0.2)"}
          strokeWidth={1.5}
          style={{ cursor: interactive ? "pointer" : "default", transition:"transform .15s" }}
          onMouseEnter={() => interactive && setHover(s)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onRate && onRate(s)}
        />
      ))}
    </div>
  );
}

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector(s => s.cart);

  const [product, setProduct]       = useState(null);
  const [related, setRelated]       = useState([]);
  const [activeImg, setActiveImg]   = useState(0);
  const [qty, setQty]               = useState(1);
  const [activeTab, setActiveTab]   = useState("description");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews]       = useState(DEMO_REVIEWS);
  const [imgZoom, setImgZoom]       = useState(false);
  const [zoomPos, setZoomPos]       = useState({ x:50, y:50 });
  const imgRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const found = fromSlug(slug, DEMO_PRODUCTS);
    if (found) {
      setProduct(found);
      setRelated(DEMO_PRODUCTS.filter(p => p._id !== found._id && (p.category === found.category || p.isSafeForKids === found.isSafeForKids)).slice(0, 4));
    }
    setActiveImg(0); setQty(1);
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < qty; i++) dispatch(addToCart(product));
    toast.success(`${qty}x ${product.name} added to cart! 🛒`);
  };

  const handleMouseMove = (e) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
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

  const ratingBreakdown = [5,4,3,2,1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    pct: Math.round((reviews.filter(r => r.rating === star).length / reviews.length) * 100)
  }));

  return (
    <div style={{ minHeight:"100vh", background:"#0D0600", fontFamily:"'DM Sans',sans-serif", paddingTop:80 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@900&family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
        @keyframes shimmer { 0%{background-position:0% center} 100%{background-position:200% center} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.6} }

        .thumb-img { cursor:pointer; border-radius:10px; overflow:hidden; border:2px solid transparent; transition:border-color .2s, transform .2s; }
        .thumb-img:hover { transform:scale(1.05); }
        .thumb-img.active { border-color:#FF6B00; box-shadow:0 0 0 2px rgba(255,107,0,0.3); }

        .tab-btn { background:none; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:0.9rem; font-weight:600; padding:0.7rem 1.4rem; border-radius:10px; transition:all .2s; color:rgba(255,245,230,0.45); }
        .tab-btn.active { background:rgba(255,107,0,0.12); color:#FF6B00; }
        .tab-btn:hover:not(.active) { color:rgba(255,245,230,0.8); background:rgba(255,255,255,0.04); }

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

        .related-card { background:rgba(255,255,255,0.04); border:1px solid rgba(255,245,230,0.07); border-radius:14px; overflow:hidden; transition:transform .3s, border-color .3s, box-shadow .3s; cursor:pointer; }
        .related-card:hover { transform:translateY(-5px); border-color:rgba(255,107,0,0.25); box-shadow:0 16px 40px rgba(0,0,0,0.3); }
        .related-card:hover .related-img { transform:scale(1.06); }

        .qty-btn { width:36px; height:36px; border-radius:10px; border:1.5px solid rgba(255,107,0,0.3); background:rgba(255,107,0,0.08); color:#FF6B00; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .2s; font-family:'DM Sans',sans-serif; }
        .qty-btn:hover { background:rgba(255,107,0,0.18); border-color:rgba(255,107,0,0.55); color:#FF3D00; }

        .review-input { background:rgba(255,255,255,0.05); border:1.5px solid rgba(255,245,230,0.1); border-radius:12px; padding:0.85rem 1rem; color:#FFF5E6; font-family:'DM Sans',sans-serif; font-size:0.9rem; outline:none; width:100%; resize:vertical; transition:border-color .2s; box-sizing:border-box; }
        .review-input:focus { border-color:rgba(255,107,0,0.5); }
        .review-input::placeholder { color:rgba(255,245,230,0.3); }

        .spec-row:nth-child(odd) { background:rgba(255,255,255,0.03); }

        @media(max-width:768px) {
          .pd-layout { flex-direction:column !important; }
          .pd-images { width:100% !important; }
          .related-grid { grid-template-columns:repeat(2,1fr) !important; }
        }
        @media(max-width:480px) {
          .related-grid { grid-template-columns:1fr !important; }
        }
      `}</style>

      <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 clamp(1rem,4vw,2.5rem) 5rem" }}>

        {/* ── BREADCRUMB ── */}
        <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", padding:"1.5rem 0 2rem", fontSize:"0.78rem", color:"rgba(255,245,230,0.4)", flexWrap:"wrap" }}>
          <Link to="/" style={{ color:"rgba(255,245,230,0.5)", textDecoration:"none", transition:"color .2s" }}
            onMouseEnter={e=>e.target.style.color="#FF6B00"} onMouseLeave={e=>e.target.style.color="rgba(255,245,230,0.5)"}>Home</Link>
          <ChevronRight size={12}/>
          <Link to="/products" style={{ color:"rgba(255,245,230,0.5)", textDecoration:"none", transition:"color .2s" }}
            onMouseEnter={e=>e.target.style.color="#FF6B00"} onMouseLeave={e=>e.target.style.color="rgba(255,245,230,0.5)"}>Shop</Link>
          <ChevronRight size={12}/>
          <Link to={`/products?category=${product.category}`} style={{ color:"rgba(255,245,230,0.5)", textDecoration:"none", transition:"color .2s" }}
            onMouseEnter={e=>e.target.style.color="#FF6B00"} onMouseLeave={e=>e.target.style.color="rgba(255,245,230,0.5)"}>{product.category}</Link>
          <ChevronRight size={12}/>
          <span style={{ color:"rgba(255,245,230,0.8)", fontWeight:600 }}>{product.name}</span>
        </div>

        {/* ── MAIN PRODUCT LAYOUT ── */}
        <div style={{ background:"linear-gradient(160deg,#FFF8F0,#FFF3E0,#FEF9F0)", borderRadius:24, padding:"2rem", border:"1px solid rgba(255,107,0,0.1)", boxShadow:"0 8px 40px rgba(0,0,0,0.12)", marginBottom:"4rem" }}>
        <div className="pd-layout" style={{ display:"flex", gap:"3rem", alignItems:"flex-start", animation:"fadeUp .4s ease" }}>

          {/* LEFT — Images */}
          <div className="pd-images" style={{ width:"48%", flexShrink:0 }}>
            {/* Main image */}
            <div ref={imgRef}
              style={{ borderRadius:20, overflow:"hidden", position:"relative", background:"#111", cursor: imgZoom ? "zoom-out" : "zoom-in", marginBottom:"0.85rem", border:"1px solid rgba(255,245,230,0.08)" }}
              onMouseMove={handleMouseMove}
              onClick={() => setImgZoom(z => !z)}
            >
              <div style={{ height:420, overflow:"hidden", position:"relative" }}>
                <img src={product.images[activeImg]} alt={product.name}
                  style={{ width:"100%", height:"100%", objectFit:"cover", display:"block",
                    transform: imgZoom ? `scale(1.8) translate(${(50-zoomPos.x)*0.4}%, ${(50-zoomPos.y)*0.4}%)` : "scale(1)",
                    transition: imgZoom ? "none" : "transform .3s ease",
                    transformOrigin:`${zoomPos.x}% ${zoomPos.y}%`
                  }}
                />
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.4))", pointerEvents:"none" }}/>
                {/* Discount badge */}
                {discount > 0 && <div style={{ position:"absolute", top:14, left:14, background:"linear-gradient(135deg,#FF3D00,#FF6B00)", color:"#fff", fontSize:"0.75rem", fontWeight:800, padding:"0.3rem 0.7rem", borderRadius:100, boxShadow:"0 3px 12px rgba(255,61,0,0.5)" }}>-{discount}% OFF</div>}
                {/* Kids safe */}
                {product.isSafeForKids && <div style={{ position:"absolute", top:14, right:14, background:"linear-gradient(135deg,#1ABC9C,#2ECC71)", color:"#fff", fontSize:"0.68rem", fontWeight:800, padding:"0.3rem 0.7rem", borderRadius:100, display:"flex", alignItems:"center", gap:"0.3rem", boxShadow:"0 3px 12px rgba(46,204,113,0.5)" }}><Baby size={11} strokeWidth={2.5}/> Kids Safe</div>}
                {/* Zoom hint */}
                <div style={{ position:"absolute", bottom:12, right:12, background:"rgba(0,0,0,0.5)", borderRadius:8, padding:"0.3rem 0.6rem", fontSize:"0.65rem", color:"rgba(255,245,230,0.7)", backdropFilter:"blur(6px)", pointerEvents:"none" }}>
                  {imgZoom ? "Click to zoom out" : "Click to zoom in"}
                </div>
              </div>
            </div>

            {/* Thumbnails */}
            <div style={{ display:"flex", gap:"0.6rem" }}>
              {product.images.map((img, i) => (
                <div key={i} className={`thumb-img${activeImg===i?" active":""}`}
                  style={{ flex:1, height:80, overflow:"hidden" }}
                  onClick={() => setActiveImg(i)}>
                  <img src={img} alt={`view ${i+1}`} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Product Info */}
          <div style={{ flex:1, minWidth:0 }}>
            {/* Category + Badge */}
            <div style={{ display:"flex", alignItems:"center", gap:"0.6rem", marginBottom:"0.6rem" }}>
              <span style={{ fontSize:"0.7rem", color:"#FF6B00", fontWeight:800, letterSpacing:"0.1em", textTransform:"uppercase" }}>{product.category}</span>
              {product.isSafeForKids && <span style={{ background:"rgba(46,204,113,0.15)", border:"1px solid rgba(46,204,113,0.3)", color:"#2ECC71", fontSize:"0.65rem", fontWeight:700, padding:"0.15rem 0.55rem", borderRadius:100, display:"flex", alignItems:"center", gap:"0.25rem" }}><Baby size={10}/> Kids Safe</span>}
              {product.stock <= 20 && <span style={{ background:"rgba(255,61,0,0.12)", border:"1px solid rgba(255,61,0,0.25)", color:"#FF3D00", fontSize:"0.65rem", fontWeight:700, padding:"0.15rem 0.55rem", borderRadius:100, animation:"pulse 2s infinite" }}>Only {product.stock} left!</span>}
            </div>

            {/* Name */}
            <h1 style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"clamp(1.4rem,3vw,2rem)", fontWeight:800, color:"#1a0800", margin:"0 0 0.8rem", lineHeight:1.2, letterSpacing:"-0.01em" }}>{product.name}</h1>

            {/* Rating row */}
            <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"1.4rem", flexWrap:"wrap" }}>
              <StarRating rating={product.rating} size={16}/>
              <span style={{ fontSize:"0.88rem", fontWeight:700, color:"#FFD700" }}>{product.rating}</span>
              <span style={{ fontSize:"0.82rem", color:"rgba(26,8,0,0.65)", fontWeight:500 }}>({product.numReviews} reviews)</span>
              <span style={{ color:"rgba(255,245,230,0.15)" }}>|</span>
              <span style={{ fontSize:"0.82rem", color: product.stock > 20 ? "#1a7a4a" : "#FF6B00", fontWeight:700 }}>
                {product.stock > 0 ? `✓ In Stock (${product.stock} units)` : "✗ Out of Stock"}
              </span>
            </div>

            {/* Price */}
            <div style={{ display:"flex", alignItems:"baseline", gap:"0.75rem", marginBottom:"1.6rem", padding:"1.2rem 1.4rem", background:"rgba(255,107,0,0.08)", border:"1px solid rgba(255,107,0,0.18)", borderRadius:14 }}>
              <span style={{ fontSize:"2.2rem", fontWeight:800, fontFamily:"'DM Sans',sans-serif", background:"linear-gradient(135deg,#FF6B00,#FF3D00)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>₹{product.price}</span>
              {product.originalPrice > product.price && (
                <>
                  <span style={{ fontSize:"1.1rem", color:"rgba(26,8,0,0.35)", textDecoration:"line-through", fontWeight:400 }}>₹{product.originalPrice}</span>
                  <span style={{ fontSize:"0.82rem", background:"linear-gradient(135deg,#FF3D00,#FF6B00)", color:"#fff", fontWeight:800, padding:"0.2rem 0.6rem", borderRadius:100 }}>Save ₹{product.originalPrice - product.price}</span>
                </>
              )}
            </div>

            {/* Quantity + Add to Cart */}
            <div style={{ display:"flex", gap:"0.85rem", marginBottom:"1.4rem", alignItems:"center", flexWrap:"wrap" }}>
              {/* Qty */}
              <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", background:"rgba(255,107,0,0.05)", border:"1.5px solid rgba(255,107,0,0.15)", borderRadius:12, padding:"0.3rem 0.5rem" }}>
                <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q-1))}><Minus size={14}/></button>
                <span style={{ minWidth:28, textAlign:"center", fontWeight:700, color:"#1a0800", fontSize:"1rem" }}>{qty}</span>
                <button className="qty-btn" onClick={() => setQty(q => Math.min(product.stock, q+1))}><Plus size={14}/></button>
              </div>
              {/* Add to cart */}
              <button className="add-cart-btn-main" onClick={handleAddToCart} disabled={product.stock === 0}>
                <ShoppingCart size={18} strokeWidth={2.2}/>
                Add {qty > 1 ? `${qty} to Cart` : "to Cart"}
              </button>
            </div>

            {/* Cart count pill */}
            {inCart > 0 && (
              <p style={{ fontSize:"0.78rem", color:"#1a7a4a", fontWeight:600, marginBottom:"1.2rem", display:"flex", alignItems:"center", gap:"0.3rem" }}>
                ✓ {inCart} already in your cart — <Link to="/cart" style={{ color:"#FFD700", textDecoration:"underline" }}>View Cart</Link>
              </p>
            )}

            {/* Trust badges */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.6rem", marginBottom:"1.6rem" }}>
              {[
                { icon:Shield,   color:"#2ECC71", text:"100% Certified Safe" },
                { icon:Truck,    color:"#3498DB", text:"Free Ship ₹999+" },
                { icon:Flame,    color:"#FF6B00", text:"Direct from Sivakasi" },
                { icon:Baby,     color:"#1ABC9C", text:"BIS Certified Products" },
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
        </div>{/* end cream card */}

        {/* ── TABS ── */}
        <div style={{ marginBottom:"3rem", animation:"fadeUp .5s ease .1s both" }}>
          {/* Tab bar */}
          <div style={{ display:"flex", gap:"0.3rem", borderBottom:"1px solid rgba(255,245,230,0.08)", marginBottom:"2rem", flexWrap:"wrap" }}>
            {[
              { key:"description", label:"Description" },
              { key:"specs",       label:"Specifications" },
              { key:"reviews",     label:`Reviews (${reviews.length})` },
            ].map(t => (
              <button key={t.key} className={`tab-btn${activeTab===t.key?" active":""}`}
                onClick={() => setActiveTab(t.key)}>{t.label}</button>
            ))}
          </div>

          {/* Description */}
          {activeTab === "description" && (
            <div style={{ animation:"fadeUp .3s ease" }}>
              <p style={{ color:"rgba(255,245,230,0.82)", lineHeight:1.85, fontSize:"0.95rem", maxWidth:720, margin:"0 0 1.5rem" }}>{product.description}</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"0.6rem" }}>
                {["Premium Quality", "Sivakasi Certified", "BIS Approved", "Eco Friendly Dyes", "Long Fuse"].map(tag => (
                  <span key={tag} style={{ background:"rgba(255,107,0,0.1)", border:"1px solid rgba(255,107,0,0.2)", color:"#FF6B00", fontSize:"0.75rem", fontWeight:600, padding:"0.3rem 0.8rem", borderRadius:100 }}>{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* Specifications */}
          {activeTab === "specs" && (
            <div style={{ animation:"fadeUp .3s ease", maxWidth:600 }}>
              <div style={{ borderRadius:14, overflow:"hidden", border:"1px solid rgba(255,245,230,0.08)" }}>
                {Object.entries(product.specs).map(([key, val], i) => (
                  <div key={key} className="spec-row" style={{ display:"flex", padding:"0.85rem 1.2rem", gap:"1rem" }}>
                    <span style={{ width:180, flexShrink:0, fontSize:"0.82rem", color:"rgba(255,245,230,0.45)", fontWeight:600 }}>{key}</span>
                    <span style={{ fontSize:"0.88rem", color:"rgba(255,245,230,0.88)", fontWeight:500 }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          {activeTab === "reviews" && (
            <div style={{ animation:"fadeUp .3s ease" }}>
              <div style={{ display:"flex", gap:"2.5rem", marginBottom:"2.5rem", flexWrap:"wrap" }}>
                {/* Overall rating */}
                <div style={{ textAlign:"center", minWidth:140 }}>
                  <div style={{ fontSize:"3.5rem", fontWeight:800, color:"#FFD700", lineHeight:1 }}>{product.rating}</div>
                  <StarRating rating={product.rating} size={20}/>
                  <p style={{ fontSize:"0.75rem", color:"rgba(255,245,230,0.4)", marginTop:"0.4rem" }}>{product.numReviews} reviews</p>
                </div>
                {/* Breakdown bars */}
                <div style={{ flex:1, minWidth:200 }}>
                  {ratingBreakdown.map(({ star, count, pct }) => (
                    <div key={star} style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"0.4rem" }}>
                      <span style={{ fontSize:"0.75rem", color:"rgba(255,245,230,0.5)", width:20, textAlign:"right" }}>{star}</span>
                      <Star size={11} fill="#FFD700" color="#FFD700" strokeWidth={1.5}/>
                      <div style={{ flex:1, height:6, background:"rgba(255,245,230,0.08)", borderRadius:4, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${pct}%`, background:"linear-gradient(90deg,#FF6B00,#FFD700)", borderRadius:4, transition:"width .5s ease" }}/>
                      </div>
                      <span style={{ fontSize:"0.72rem", color:"rgba(255,245,230,0.35)", width:24 }}>{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review list */}
              <div style={{ display:"flex", flexDirection:"column", gap:"1.2rem", marginBottom:"2.5rem" }}>
                {reviews.map(r => (
                  <div key={r._id} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,245,230,0.07)", borderRadius:14, padding:"1.2rem 1.4rem" }}>
                    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"0.6rem", gap:"1rem", flexWrap:"wrap" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
                        <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#FF6B00,#FF3D00)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color:"#fff", fontSize:"0.85rem", flexShrink:0 }}>{r.avatar}</div>
                        <div>
                          <p style={{ margin:0, fontWeight:700, fontSize:"0.88rem", color:"#FFF5E6" }}>{r.user}</p>
                          <p style={{ margin:0, fontSize:"0.7rem", color:"rgba(255,245,230,0.35)" }}>{r.date}</p>
                        </div>
                      </div>
                      <StarRating rating={r.rating} size={13}/>
                    </div>
                    <p style={{ margin:"0 0 0.8rem", fontSize:"0.875rem", color:"rgba(255,245,230,0.78)", lineHeight:1.7 }}>{r.comment}</p>
                    <button style={{ background:"none", border:"1px solid rgba(255,245,230,0.1)", borderRadius:8, padding:"0.3rem 0.8rem", color:"rgba(255,245,230,0.4)", fontSize:"0.72rem", fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:"0.3rem", fontFamily:"'DM Sans',sans-serif", transition:"all .2s" }}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(255,107,0,0.3)";e.currentTarget.style.color="#FF6B00"}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,245,230,0.1)";e.currentTarget.style.color="rgba(255,245,230,0.4)"}}>
                      <ThumbsUp size={11}/> Helpful ({r.helpful})
                    </button>
                  </div>
                ))}
              </div>

              {/* Write review */}
              <div style={{ background:"rgba(255,107,0,0.04)", border:"1px solid rgba(255,107,0,0.12)", borderRadius:16, padding:"1.5rem" }}>
                <p style={{ fontWeight:700, color:"#FFF5E6", marginBottom:"1rem", fontSize:"0.95rem" }}>Write a Review</p>
                <div style={{ marginBottom:"0.85rem" }}>
                  <p style={{ fontSize:"0.78rem", color:"rgba(255,245,230,0.5)", marginBottom:"0.4rem" }}>Your Rating</p>
                  <StarRating rating={reviewRating} size={24} interactive onRate={setReviewRating}/>
                </div>
                <textarea className="review-input" rows={3} placeholder="Share your experience with this product..."
                  value={reviewText} onChange={e => setReviewText(e.target.value)}
                  style={{ marginBottom:"0.85rem" }}/>
                <button onClick={() => {
                  if (!reviewRating || !reviewText.trim()) { toast.error("Please add a rating and review!"); return; }
                  const newReview = { _id:`r${Date.now()}`, user:"You", avatar:"Y", rating:reviewRating, comment:reviewText, date:"Just now", helpful:0 };
                  setReviews(prev => [newReview, ...prev]);
                  setReviewRating(0); setReviewText("");
                  toast.success("Review submitted! 🌟");
                }} style={{ background:"linear-gradient(90deg,#FF6B00,#FF3D00)", border:"none", borderRadius:10, padding:"0.7rem 1.6rem", color:"#fff", fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"0.88rem", cursor:"pointer" }}>
                  Submit Review
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── RELATED PRODUCTS ── */}
        {related.length > 0 && (
          <div style={{ animation:"fadeUp .5s ease .2s both" }}>
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

            <div className="related-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"1rem" }}>
              {related.map(p => {
                const disc = Math.round(100 - (p.price / p.originalPrice) * 100);
                return (
                  <div key={p._id} className="related-card" onClick={() => navigate(`/products/${toSlug(p.name)}`)}>
                    <div style={{ height:160, overflow:"hidden", position:"relative", background:"#111" }}>
                      <img src={p.image} alt={p.name} className="related-img" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", transition:"transform .4s ease" }}/>
                      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,transparent 50%,rgba(0,0,0,0.5))", pointerEvents:"none" }}/>
                      {disc > 0 && <div style={{ position:"absolute", top:8, left:8, background:"linear-gradient(135deg,#FF3D00,#FF6B00)", color:"#fff", fontSize:"0.6rem", fontWeight:800, padding:"0.18rem 0.5rem", borderRadius:100 }}>-{disc}%</div>}
                      {p.isSafeForKids && <div style={{ position:"absolute", top:8, right:8, background:"linear-gradient(135deg,#1ABC9C,#2ECC71)", color:"#fff", fontSize:"0.58rem", fontWeight:800, padding:"0.18rem 0.45rem", borderRadius:100, display:"flex", alignItems:"center", gap:"0.2rem" }}><Baby size={8}/> Safe</div>}
                    </div>
                    <div style={{ padding:"0.85rem" }}>
                      <p style={{ fontSize:"0.6rem", color:"#FF6B00", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", margin:"0 0 0.25rem" }}>{p.category}</p>
                      <p style={{ fontSize:"0.82rem", fontWeight:700, color:"rgba(255,245,230,0.9)", margin:"0 0 0.4rem", lineHeight:1.3, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{p.name}</p>
                      <div style={{ display:"flex", alignItems:"center", gap:"0.4rem", marginBottom:"0.6rem" }}>
                        <StarRating rating={p.rating} size={10}/>
                        <span style={{ fontSize:"0.65rem", color:"rgba(255,245,230,0.5)" }}>({p.numReviews})</span>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:"0.4rem", justifyContent:"space-between" }}>
                        <span style={{ fontSize:"0.95rem", fontWeight:800, color:"#FFD700" }}>₹{p.price}</span>
                        <button onClick={e => { e.stopPropagation(); dispatch(addToCart(p)); toast.success("Added to cart! 🛒"); }}
                          style={{ background:"linear-gradient(90deg,#FF6B00,#FF3D00)", border:"none", borderRadius:8, padding:"0.38rem 0.7rem", color:"#fff", fontSize:"0.7rem", fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:"0.25rem", fontFamily:"'DM Sans',sans-serif" }}>
                          <ShoppingCart size={11}/> Add
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
