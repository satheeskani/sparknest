import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../../redux/slices/cartSlice";
import { MapPin, Phone, User, Mail, ChevronRight, ShieldCheck, Truck } from "lucide-react";
import toast from "react-hot-toast";

export default function Checkout() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const items     = useSelector(s => s.cart.items);
  const total     = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const savings   = items.reduce((s, i) => s + ((i.originalPrice || i.price) - i.price) * i.quantity, 0);
  const shipping  = total >= 999 ? 0 : 99;
  const grandTotal = total + shipping;

  const [form, setForm] = useState({ name:"", email:"", phone:"", address:"", city:"", state:"Tamil Nadu", pincode:"" });
  const [step, setStep] = useState(1); // 1=address, 2=summary

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleNext = () => {
    const { name, phone, address, city, pincode } = form;
    if (!name || !phone || !address || !city || !pincode) {
      toast.error("Please fill all required fields"); return;
    }
    if (phone.length < 10) { toast.error("Enter valid phone number"); return; }
    setStep(2);
  };

  const handleRazorpay = () => {
    // Razorpay integration placeholder
    toast.success("Order placed! 🎆 (Razorpay coming soon)", { duration: 3000 });
    dispatch(clearCart());
    navigate("/");
  };

  if (items.length === 0) {
    return (
      <div style={{ minHeight:"100vh", background:"#0D0600", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif", gap:"1rem" }}>
        <div style={{ fontSize:"4rem" }}>🛒</div>
        <p style={{ color:"rgba(255,245,230,0.5)", fontSize:"1rem" }}>Your cart is empty</p>
        <button onClick={() => navigate("/products")} style={{ background:"linear-gradient(135deg,#FF6B00,#FF3D00)", border:"none", borderRadius:12, color:"#fff", fontWeight:700, padding:"0.7rem 1.8rem", cursor:"pointer", fontSize:"0.9rem" }}>
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", background:"#0D0600", fontFamily:"'DM Sans',sans-serif", paddingTop:88 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        .checkout-input { width:100%; padding:0.7rem 1rem; background:rgba(255,255,255,0.04); border:1.5px solid rgba(255,107,0,0.15); border-radius:10px; color:#FFF5E6; font-family:'DM Sans',sans-serif; font-size:0.88rem; outline:none; transition:border .2s; box-sizing:border-box; }
        .checkout-input:focus { border-color:rgba(255,107,0,0.5); background:rgba(255,107,0,0.04); }
        .checkout-input::placeholder { color:rgba(255,245,230,0.3); }
      `}</style>

      <div style={{ maxWidth:960, margin:"0 auto", padding:"2rem 1.5rem", display:"grid", gridTemplateColumns:"1fr 340px", gap:"2rem", alignItems:"start" }}>

        {/* Left — Form / Summary */}
        <div>
          {/* Steps */}
          <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"1.8rem" }}>
            {["Delivery Address","Order Summary"].map((s,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
                <div style={{ width:28, height:28, borderRadius:"50%", background: step > i ? "linear-gradient(135deg,#FF6B00,#FF3D00)" : step === i+1 ? "linear-gradient(135deg,#FF6B00,#FF3D00)" : "rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.72rem", fontWeight:800, color:"#fff" }}>
                  {step > i+1 ? "✓" : i+1}
                </div>
                <span style={{ fontSize:"0.8rem", fontWeight: step===i+1 ? 700 : 500, color: step===i+1 ? "#FFF5E6" : "rgba(255,245,230,0.4)" }}>{s}</span>
                {i < 1 && <ChevronRight size={14} color="rgba(255,245,230,0.2)" />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div style={{ background:"rgba(255,107,0,0.03)", border:"1px solid rgba(255,107,0,0.1)", borderRadius:18, padding:"1.8rem" }}>
              <h2 style={{ color:"#FFF5E6", fontSize:"1.05rem", fontWeight:800, marginBottom:"1.4rem", display:"flex", alignItems:"center", gap:"0.5rem" }}>
                <MapPin size={18} color="#FF6B00" /> Delivery Address
              </h2>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
                <div>
                  <label style={{ fontSize:"0.73rem", color:"rgba(255,245,230,0.5)", fontWeight:600, display:"block", marginBottom:"0.4rem" }}>Full Name *</label>
                  <input name="name" value={form.name} onChange={onChange} placeholder="Ravi Kumar" className="checkout-input" />
                </div>
                <div>
                  <label style={{ fontSize:"0.73rem", color:"rgba(255,245,230,0.5)", fontWeight:600, display:"block", marginBottom:"0.4rem" }}>Phone *</label>
                  <input name="phone" value={form.phone} onChange={onChange} placeholder="9876543210" className="checkout-input" maxLength={10} />
                </div>
                <div style={{ gridColumn:"1/-1" }}>
                  <label style={{ fontSize:"0.73rem", color:"rgba(255,245,230,0.5)", fontWeight:600, display:"block", marginBottom:"0.4rem" }}>Email</label>
                  <input name="email" value={form.email} onChange={onChange} placeholder="ravi@email.com" className="checkout-input" />
                </div>
                <div style={{ gridColumn:"1/-1" }}>
                  <label style={{ fontSize:"0.73rem", color:"rgba(255,245,230,0.5)", fontWeight:600, display:"block", marginBottom:"0.4rem" }}>Address *</label>
                  <input name="address" value={form.address} onChange={onChange} placeholder="House No, Street, Area" className="checkout-input" />
                </div>
                <div>
                  <label style={{ fontSize:"0.73rem", color:"rgba(255,245,230,0.5)", fontWeight:600, display:"block", marginBottom:"0.4rem" }}>City *</label>
                  <input name="city" value={form.city} onChange={onChange} placeholder="Sivakasi" className="checkout-input" />
                </div>
                <div>
                  <label style={{ fontSize:"0.73rem", color:"rgba(255,245,230,0.5)", fontWeight:600, display:"block", marginBottom:"0.4rem" }}>Pincode *</label>
                  <input name="pincode" value={form.pincode} onChange={onChange} placeholder="626123" className="checkout-input" maxLength={6} />
                </div>
                <div>
                  <label style={{ fontSize:"0.73rem", color:"rgba(255,245,230,0.5)", fontWeight:600, display:"block", marginBottom:"0.4rem" }}>State</label>
                  <input name="state" value={form.state} onChange={onChange} className="checkout-input" />
                </div>
              </div>
              <button onClick={handleNext} style={{ marginTop:"1.4rem", width:"100%", padding:"0.85rem", background:"linear-gradient(135deg,#FF6B00,#FF3D00)", border:"none", borderRadius:12, color:"#fff", fontWeight:800, fontSize:"0.95rem", cursor:"pointer", boxShadow:"0 4px 20px rgba(255,107,0,0.4)", fontFamily:"'DM Sans',sans-serif" }}>
                Continue to Summary →
              </button>
            </div>
          )}

          {step === 2 && (
            <div style={{ background:"rgba(255,107,0,0.03)", border:"1px solid rgba(255,107,0,0.1)", borderRadius:18, padding:"1.8rem" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.4rem" }}>
                <h2 style={{ color:"#FFF5E6", fontSize:"1.05rem", fontWeight:800 }}>Order Summary</h2>
                <button onClick={() => setStep(1)} style={{ fontSize:"0.75rem", color:"#FF6B00", background:"none", border:"none", cursor:"pointer", fontWeight:600 }}>← Edit Address</button>
              </div>

              {/* Delivery address pill */}
              <div style={{ background:"rgba(255,107,0,0.06)", border:"1px solid rgba(255,107,0,0.12)", borderRadius:12, padding:"0.85rem 1rem", marginBottom:"1.2rem", display:"flex", gap:"0.6rem" }}>
                <MapPin size={16} color="#FF6B00" style={{ flexShrink:0, marginTop:2 }} />
                <div>
                  <p style={{ color:"#FFF5E6", fontWeight:700, fontSize:"0.82rem", margin:0 }}>{form.name} · {form.phone}</p>
                  <p style={{ color:"rgba(255,245,230,0.5)", fontSize:"0.75rem", margin:"0.2rem 0 0" }}>{form.address}, {form.city}, {form.state} - {form.pincode}</p>
                </div>
              </div>

              {/* Items */}
              <div style={{ display:"flex", flexDirection:"column", gap:"0.6rem", marginBottom:"1.2rem" }}>
                {items.map(item => (
                  <div key={item._id} style={{ display:"flex", alignItems:"center", gap:"0.7rem" }}>
                    <img src={item.image} alt={item.name} style={{ width:44, height:44, borderRadius:8, objectFit:"cover", border:"1px solid rgba(255,107,0,0.15)" }} />
                    <div style={{ flex:1 }}>
                      <p style={{ color:"#FFF5E6", fontSize:"0.8rem", fontWeight:600, margin:0 }}>{item.name}</p>
                      <p style={{ color:"rgba(255,245,230,0.45)", fontSize:"0.72rem", margin:"0.15rem 0 0" }}>Qty: {item.quantity}</p>
                    </div>
                    <span style={{ color:"#FFD700", fontWeight:700, fontSize:"0.85rem" }}>₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <button onClick={handleRazorpay} style={{ width:"100%", padding:"0.9rem", background:"linear-gradient(135deg,#FF6B00,#FF3D00)", border:"none", borderRadius:12, color:"#fff", fontWeight:800, fontSize:"1rem", cursor:"pointer", boxShadow:"0 4px 20px rgba(255,107,0,0.45)", fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem" }}>
                <ShieldCheck size={18} /> Pay ₹{grandTotal.toLocaleString()} Securely
              </button>
              <p style={{ textAlign:"center", fontSize:"0.7rem", color:"rgba(255,245,230,0.3)", marginTop:"0.6rem" }}>Powered by Razorpay · 100% secure</p>
            </div>
          )}
        </div>

        {/* Right — Price Breakdown */}
        <div style={{ position:"sticky", top:100 }}>
          <div style={{ background:"linear-gradient(160deg,#FFF8F0,#FFF3E0)", borderRadius:18, padding:"1.4rem", border:"1px solid rgba(255,107,0,0.15)", boxShadow:"0 4px 24px rgba(0,0,0,0.15)" }}>
            <h3 style={{ color:"#1a0800", fontWeight:800, fontSize:"0.95rem", marginBottom:"1rem" }}>Price Details</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:"0.65rem" }}>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <span style={{ color:"rgba(26,8,0,0.6)", fontSize:"0.82rem" }}>Price ({items.reduce((s,i) => s+i.quantity,0)} items)</span>
                <span style={{ color:"#1a0800", fontWeight:600, fontSize:"0.82rem" }}>₹{(total + savings).toLocaleString()}</span>
              </div>
              {savings > 0 && (
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ color:"rgba(26,8,0,0.6)", fontSize:"0.82rem" }}>Discount</span>
                  <span style={{ color:"#1a7a4a", fontWeight:700, fontSize:"0.82rem" }}>−₹{savings.toLocaleString()}</span>
                </div>
              )}
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <span style={{ color:"rgba(26,8,0,0.6)", fontSize:"0.82rem", display:"flex", alignItems:"center", gap:"0.3rem" }}><Truck size={13} /> Delivery</span>
                <span style={{ color: shipping === 0 ? "#1a7a4a" : "#1a0800", fontWeight:600, fontSize:"0.82rem" }}>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
              </div>
              <div style={{ height:1, background:"rgba(255,107,0,0.15)", margin:"0.3rem 0" }} />
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <span style={{ color:"#1a0800", fontWeight:800, fontSize:"0.95rem" }}>Total</span>
                <span style={{ fontWeight:800, fontSize:"1.1rem", background:"linear-gradient(135deg,#FF6B00,#FF3D00)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>
            {savings > 0 && (
              <div style={{ marginTop:"0.85rem", background:"rgba(46,204,113,0.1)", border:"1px solid rgba(46,204,113,0.2)", borderRadius:8, padding:"0.5rem 0.8rem", fontSize:"0.75rem", color:"#1a7a4a", fontWeight:700, textAlign:"center" }}>
                🎉 You save ₹{savings.toLocaleString()} on this order!
              </div>
            )}
            {shipping > 0 && (
              <div style={{ marginTop:"0.6rem", fontSize:"0.7rem", color:"rgba(26,8,0,0.5)", textAlign:"center" }}>
                Add ₹{(999 - total).toLocaleString()} more for FREE delivery
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
