import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Search, Package, Truck, CheckCircle2, Clock, XCircle, ChevronRight, MapPin } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "";

const STATUS_STEPS = ["Pending", "Confirmed", "Processing", "Dispatched", "Delivered"];

const STATUS_META = {
  Pending:    { color:"#FF9800", icon:"⏳", desc:"Your order has been received and is awaiting confirmation." },
  Confirmed:  { color:"#2196F3", icon:"✅", desc:"Your order has been confirmed and will be packed soon." },
  Processing: { color:"#9C27B0", icon:"📦", desc:"Your order is being packed and prepared for dispatch." },
  Dispatched: { color:"#FF6B00", icon:"🚚", desc:"Your order is on the way! You will receive it soon." },
  Delivered:  { color:"#4CAF50", icon:"🎆", desc:"Your order has been delivered. Enjoy your crackers!" },
  Cancelled:  { color:"#F44336", icon:"❌", desc:"Your order has been cancelled." },
};

const PAYMENT_META = {
  Pending:  { color:"#FF9800", label:"Payment Pending" },
  Paid:     { color:"#4CAF50", label:"Payment Received ✓" },
  Failed:   { color:"#F44336", label:"Payment Failed" },
  Refunded: { color:"#9C27B0", label:"Refunded" },
};

export default function TrackOrder() {
  const [orderId, setOrderId]   = useState("");
  const [phone, setPhone]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [order, setOrder]       = useState(null);
  const [error, setError]       = useState("");

  const handleTrack = async (e) => {
    e?.preventDefault();
    if (!orderId.trim() || !phone.trim()) { setError("Please enter both Order ID and phone number"); return; }
    setLoading(true); setError(""); setOrder(null);
    try {
      const res  = await fetch(`${API}/api/orders/track`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ orderId: orderId.trim().toUpperCase(), phone: phone.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message); }
      else { setOrder(data.order); }
    } catch { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  const stepIndex   = order ? STATUS_STEPS.indexOf(order.orderStatus) : -1;
  const statusMeta  = order ? (STATUS_META[order.orderStatus] || STATUS_META.Pending) : null;
  const paymentMeta = order ? (PAYMENT_META[order.paymentStatus] || PAYMENT_META.Pending) : null;
  const fmtDate     = d => new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"long", year:"numeric" });
  const fmtTime     = d => new Date(d).toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" });

  return (
    <>
      <Helmet>
        <title>Track Your Order | SparkNest</title>
        <meta name="description" content="Track your SparkNest cracker order status. Enter your Order ID and phone number to check delivery status." />
      </Helmet>

      <div style={{ minHeight:"100vh", background:"#0D0600", fontFamily:"'Source Sans 3',sans-serif", paddingTop:88 }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Source+Sans+3:wght@300;400;600;700;800&display=swap');
          @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
          @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.5} }
          @keyframes spin   { to{transform:rotate(360deg)} }
          .track-input {
            width:100%; padding:0.85rem 1rem; background:rgba(255,255,255,0.05);
            border:1.5px solid rgba(255,107,0,0.2); border-radius:12px;
            color:#FFF5E6; font-family:'Source Sans 3',sans-serif; font-size:1rem;
            font-weight:500; outline:none; transition:border .2s; box-sizing:border-box;
          }
          .track-input:focus { border-color:rgba(255,107,0,0.6); background:rgba(255,107,0,0.04); }
          .track-input::placeholder { color:rgba(255,245,230,0.3); }
          .step-dot { transition: all .3s; }
        `}</style>

        <div style={{ maxWidth:680, margin:"0 auto", padding:"2rem clamp(1.2rem,4vw,2.5rem) 5rem" }}>

          {/* Header */}
          <div style={{ textAlign:"center", marginBottom:"2.5rem", animation:"fadeUp .4s ease" }}>
            <div style={{ fontSize:"3rem", marginBottom:"0.75rem" }}>📦</div>
            <h1 style={{ fontFamily:"'Libre Baskerville',serif", fontSize:"clamp(1.4rem,3vw,2rem)", color:"#FFF5E6", fontWeight:900, margin:"0 0 0.5rem", textTransform:"uppercase", letterSpacing:"0.05em" }}>
              Track Your <span style={{ background:"linear-gradient(135deg,#FF6B00,#FFD700)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Order</span>
            </h1>
            <p style={{ color:"rgba(255,245,230,0.45)", fontSize:"0.95rem", margin:0 }}>
              Enter your Order ID and phone number to check your delivery status
            </p>
          </div>

          {/* Search Form */}
          <div style={{ background:"linear-gradient(160deg,rgba(255,107,0,0.06),rgba(255,61,0,0.03))", border:"1px solid rgba(255,107,0,0.15)", borderRadius:20, padding:"1.8rem", marginBottom:"1.5rem", animation:"fadeUp .4s ease .05s both" }}>
            <form onSubmit={handleTrack}>
              <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
                <div>
                  <label style={{ display:"block", color:"rgba(255,245,230,0.55)", fontSize:"0.78rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"0.4rem" }}>
                    Order ID
                  </label>
                  <input className="track-input" value={orderId} onChange={e=>setOrderId(e.target.value.toUpperCase())}
                    placeholder="e.g. SN1000" autoComplete="off" />
                </div>
                <div>
                  <label style={{ display:"block", color:"rgba(255,245,230,0.55)", fontSize:"0.78rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"0.4rem" }}>
                    Phone Number
                  </label>
                  <input className="track-input" value={phone} onChange={e=>setPhone(e.target.value)}
                    placeholder="10-digit mobile number" type="text" inputMode="numeric" maxLength={10} autoComplete="off" />
                </div>
                {error && (
                  <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", background:"rgba(255,61,0,0.08)", border:"1px solid rgba(255,61,0,0.25)", borderRadius:10, padding:"0.6rem 0.85rem" }}>
                    <XCircle size={15} color="#FF3D00" />
                    <span style={{ color:"#FF6B6B", fontSize:"0.85rem", fontWeight:600 }}>{error}</span>
                  </div>
                )}
                <button type="submit" disabled={loading}
                  style={{ width:"100%", padding:"0.9rem", background:"linear-gradient(135deg,#FF6B00,#FF3D00)", border:"none", borderRadius:12, color:"#fff", fontFamily:"'Source Sans 3',sans-serif", fontWeight:800, fontSize:"1rem", cursor:loading?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem", boxShadow:"0 4px 20px rgba(255,107,0,0.4)", opacity:loading?0.7:1, transition:"opacity .2s" }}>
                  {loading
                    ? <><span style={{ width:18,height:18,border:"2.5px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%",display:"inline-block",animation:"spin .8s linear infinite" }} /> Tracking…</>
                    : <><Search size={16} /> Track Order</>
                  }
                </button>
              </div>
            </form>
          </div>

          {/* Order Result */}
          {order && (
            <div style={{ animation:"fadeUp .4s ease" }}>

              {/* Status Banner */}
              <div style={{ background:`linear-gradient(135deg,${statusMeta.color}18,${statusMeta.color}08)`, border:`1.5px solid ${statusMeta.color}44`, borderRadius:20, padding:"1.5rem 1.8rem", marginBottom:"1rem", display:"flex", alignItems:"center", gap:"1rem" }}>
                <div style={{ fontSize:"2.5rem", flexShrink:0 }}>{statusMeta.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"0.6rem", marginBottom:"0.2rem", flexWrap:"wrap" }}>
                    <span style={{ color:"#FFF5E6", fontWeight:900, fontSize:"1.05rem" }}>#{order.orderId}</span>
                    <span style={{ background:`${statusMeta.color}22`, border:`1px solid ${statusMeta.color}44`, color:statusMeta.color, fontSize:"0.72rem", fontWeight:800, padding:"0.15rem 0.6rem", borderRadius:100, textTransform:"uppercase", letterSpacing:"0.06em" }}>
                      {order.orderStatus}
                    </span>
                    <span style={{ background:`${paymentMeta.color}18`, border:`1px solid ${paymentMeta.color}33`, color:paymentMeta.color, fontSize:"0.68rem", fontWeight:700, padding:"0.15rem 0.6rem", borderRadius:100 }}>
                      {paymentMeta.label}
                    </span>
                  </div>
                  <p style={{ color:"rgba(255,245,230,0.55)", fontSize:"0.85rem", margin:"0 0 0.2rem" }}>{statusMeta.desc}</p>
                  <p style={{ color:"rgba(255,245,230,0.3)", fontSize:"0.75rem", margin:0 }}>
                    Placed on {fmtDate(order.createdAt)} at {fmtTime(order.createdAt)}
                  </p>
                </div>
              </div>

              {/* Progress Steps — only for non-cancelled */}
              {order.orderStatus !== "Cancelled" && (
                <div style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,107,0,0.1)", borderRadius:16, padding:"1.4rem 1.6rem", marginBottom:"1rem" }}>
                  <p style={{ color:"rgba(255,245,230,0.4)", fontSize:"0.72rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", margin:"0 0 1.2rem" }}>Delivery Progress</p>
                  <div style={{ display:"flex", alignItems:"center", position:"relative" }}>
                    {STATUS_STEPS.map((step, i) => {
                      const done    = i <= stepIndex;
                      const current = i === stepIndex;
                      return (
                        <div key={step} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", position:"relative", zIndex:1 }}>
                          {/* Connector line */}
                          {i < STATUS_STEPS.length - 1 && (
                            <div style={{ position:"absolute", top:14, left:"50%", width:"100%", height:3, background: i < stepIndex ? "#FF6B00" : "rgba(255,255,255,0.07)", zIndex:0, transition:"background .3s" }} />
                          )}
                          {/* Dot */}
                          <div className="step-dot" style={{ width:28, height:28, borderRadius:"50%", border:`2.5px solid ${done ? "#FF6B00" : "rgba(255,255,255,0.1)"}`, background: done ? (current ? "#FF6B00" : "rgba(255,107,0,0.3)") : "rgba(255,255,255,0.04)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"0.5rem", zIndex:1, animation: current ? "pulse 2s infinite" : "none" }}>
                            {done && !current && <CheckCircle2 size={14} color="#FF6B00" />}
                            {current && <div style={{ width:10, height:10, borderRadius:"50%", background:"#fff" }} />}
                          </div>
                          {/* Label */}
                          <span style={{ fontSize:"0.6rem", fontWeight: current ? 800 : 600, color: done ? (current ? "#FFD700" : "#FF6B00") : "rgba(255,245,230,0.25)", textAlign:"center", lineHeight:1.3, letterSpacing:"0.03em" }}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,107,0,0.1)", borderRadius:16, padding:"1.4rem 1.6rem", marginBottom:"1rem" }}>
                <p style={{ color:"rgba(255,245,230,0.4)", fontSize:"0.72rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", margin:"0 0 1rem" }}>Order Items</p>
                <div style={{ display:"flex", flexDirection:"column", gap:"0.6rem" }}>
                  {order.items.map((item, i) => (
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"0.5rem 0", borderBottom: i < order.items.length-1 ? "1px solid rgba(255,107,0,0.06)" : "none" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
                        <span style={{ color:"rgba(255,245,230,0.6)", fontSize:"0.85rem" }}>🎆</span>
                        <span style={{ color:"#FFF5E6", fontWeight:600, fontSize:"0.88rem" }}>{item.name}</span>
                        <span style={{ color:"rgba(255,245,230,0.35)", fontSize:"0.8rem" }}>× {item.quantity}</span>
                      </div>
                      <span style={{ color:"#FFD700", fontWeight:700, fontSize:"0.88rem" }}>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>
                {/* Pricing summary */}
                <div style={{ marginTop:"1rem", paddingTop:"0.75rem", borderTop:"1px solid rgba(255,107,0,0.1)" }}>
                  {order.pricing?.discount > 0 && (
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.3rem" }}>
                      <span style={{ color:"rgba(255,245,230,0.45)", fontSize:"0.82rem" }}>Discount</span>
                      <span style={{ color:"#2ECC71", fontWeight:600, fontSize:"0.82rem" }}>−₹{order.pricing.discount.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.3rem" }}>
                    <span style={{ color:"rgba(255,245,230,0.45)", fontSize:"0.82rem" }}>Delivery</span>
                    <span style={{ color: order.pricing?.shipping === 0 ? "#2ECC71" : "rgba(255,245,230,0.6)", fontWeight:600, fontSize:"0.82rem" }}>{order.pricing?.shipping === 0 ? "FREE" : `₹${order.pricing?.shipping}`}</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ color:"#FFF5E6", fontWeight:800, fontSize:"0.95rem" }}>Total Paid</span>
                    <span style={{ color:"#FF6B00", fontWeight:900, fontSize:"1.05rem" }}>₹{order.pricing?.grandTotal?.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,107,0,0.1)", borderRadius:16, padding:"1.4rem 1.6rem", marginBottom:"1.5rem" }}>
                <p style={{ color:"rgba(255,245,230,0.4)", fontSize:"0.72rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", margin:"0 0 0.6rem" }}>Delivering To</p>
                <div style={{ display:"flex", alignItems:"flex-start", gap:"0.5rem" }}>
                  <MapPin size={14} color="#FF6B00" style={{ marginTop:2, flexShrink:0 }} />
                  <p style={{ color:"rgba(255,245,230,0.65)", fontSize:"0.88rem", margin:0, lineHeight:1.6 }}>
                    {order.customer.name}<br />
                    {order.customer.city}, {order.customer.state} — {order.customer.pincode}
                  </p>
                </div>
              </div>

              {/* Help */}
              <div style={{ textAlign:"center", color:"rgba(255,245,230,0.35)", fontSize:"0.82rem" }}>
                Need help? <a href="https://wa.me/916385812382" target="_blank" rel="noreferrer" style={{ color:"#25D366", fontWeight:700, textDecoration:"none" }}>💬 Chat on WhatsApp</a>
              </div>
            </div>
          )}

          {/* Back link */}
          <div style={{ textAlign:"center", marginTop:"2rem" }}>
            <Link to="/" style={{ color:"rgba(255,245,230,0.35)", fontSize:"0.82rem", textDecoration:"none", display:"inline-flex", alignItems:"center", gap:"0.3rem" }}>
              ← Back to Home
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}
