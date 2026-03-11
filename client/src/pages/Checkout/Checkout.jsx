import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../../redux/slices/cartSlice";
import { MapPin, Truck, ShieldCheck, ChevronRight, Copy, CheckCircle2, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";

const ADMIN_WHATSAPP = "8015850365";

const BANK_ACCOUNTS = [
  {
    id: 1,
    name: "Satheeskumar M",
    accountNo: "435100050300843",
    ifsc: "TMBL0000435",
    bank: "Tamil Nadu Mercantile Bank",
    branch: "Sivakasi",
  },
  // Add second account here later
  // { id: 2, name: "", accountNo: "", ifsc: "", bank: "", branch: "" },
  // Add third account here later
  // { id: 3, name: "", accountNo: "", ifsc: "", bank: "", branch: "" },
];

const UPI_ID = "satheeskani1995@okicici";

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu",
  "Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry",
];

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 8px", borderRadius: 6, color: copied ? "#2ECC71" : "#FF6B00", display: "flex", alignItems: "center", gap: 3, fontSize: "0.7rem", fontWeight: 700, transition: "color .2s", flexShrink: 0 }}>
      {copied ? <CheckCircle2 size={13} /> : <Copy size={13} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(s => s.cart.items);
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const savings = items.reduce((s, i) => s + ((i.originalPrice || i.price) - i.price) * i.quantity, 0);
  const shipping = total >= 999 ? 0 : 99;
  const grandTotal = total + shipping;

  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", state: "Tamil Nadu", pincode: "" });
  const [step, setStep] = useState(1);
  const [activeBank, setActiveBank] = useState(0);
  const [whatsappSent, setWhatsappSent] = useState(false);
  const [paidConfirmed, setPaidConfirmed] = useState(false);
  const [orderId] = useState(() => "SN" + Date.now().toString().slice(-6));

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleNext = () => {
    const { name, phone, address, city, pincode } = form;
    if (!name || !phone || !address || !city || !pincode) { toast.error("Please fill all required fields"); return; }
    if (phone.length < 10) { toast.error("Enter valid phone number"); return; }
    setStep(2);
    // On mobile scroll to order section, on desktop scroll to top
    setTimeout(() => {
      const el = document.getElementById("order-section");
      if (el && window.innerWidth < 680) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 50);
  };

  const buildOrderMessage = (recipient) => {
    const divider = "━━━━━━━━━━━━━━━━━━━━━━";
    const itemLines = items.map((i, idx) =>
      `${idx + 1}. ${i.name}\n   Qty: ${i.quantity} × ₹${i.price.toLocaleString()} = *₹${(i.price * i.quantity).toLocaleString()}*`
    ).join("\n");
    const bank = BANK_ACCOUNTS[0];
    const date = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

    if (recipient === "customer") {
      return encodeURIComponent(
`*SparkNest — Order Confirmation*
Order ID: #${orderId} | Date: ${date}
${divider}

*Delivery Address*
${form.name}
${form.phone}${form.email ? " | " + form.email : ""}
${form.address}
${form.city}, ${form.state} — ${form.pincode}
${divider}

*Order Summary*
${itemLines}
${divider}

*Price Breakdown*
Item Total  :  ₹${(total + savings).toLocaleString()}${savings > 0 ? `
Discount    : -₹${savings.toLocaleString()}` : ""}
Delivery    :  ${shipping === 0 ? "FREE" : "₹" + shipping}
──────────────────────
*Total Payable :  ₹${grandTotal.toLocaleString()}*
${divider}

*Payment Details*
UPI ID  :  ${UPI_ID}

Bank Transfer:
Bank    :  ${bank.bank}
A/C No  :  ${bank.accountNo}
IFSC    :  ${bank.ifsc}
Name    :  ${bank.name}
${divider}

Kindly transfer *₹${grandTotal.toLocaleString()}* and reply with your payment screenshot to confirm your order.

We will dispatch within 24 hours of payment confirmation.

Thank you for choosing SparkNest! 🎆`
      );
    } else {
      return encodeURIComponent(
`*SparkNest — New Order Alert* 🔔
Order ID: #${orderId} | Date: ${date}
${divider}

*Customer Details*
Name    :  ${form.name}
Phone   :  ${form.phone}${form.email ? `
Email   :  ${form.email}` : ""}
Address :  ${form.address}, ${form.city}, ${form.state} — ${form.pincode}
${divider}

*Order Items*
${itemLines}
${divider}

*Price Breakdown*
Item Total  :  ₹${(total + savings).toLocaleString()}${savings > 0 ? `
Discount    : -₹${savings.toLocaleString()}` : ""}
Delivery    :  ${shipping === 0 ? "FREE" : "₹" + shipping}
──────────────────────
*Total Payable :  ₹${grandTotal.toLocaleString()}*
${divider}

Please verify payment screenshot from customer and confirm dispatch.`
      );
    }
  };

  const handleWhatsappCustomer = () => {
    window.open(`https://wa.me/91${form.phone}?text=${buildOrderMessage("customer")}`, "_blank");
  };

  const handleWhatsappAdmin = () => {
    window.open(`https://wa.me/91${ADMIN_WHATSAPP}?text=${buildOrderMessage("admin")}`, "_blank");
  };

  const handleSendWhatsapp = async () => {
    setWhatsappSent(true);

    // 1. Send emails automatically via Brevo
    try {
      await fetch("/api/send-order-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail: form.email || null,
          customerName: form.name,
          orderId,
          items,
          form,
          total,
          savings,
          shipping,
          grandTotal,
        }),
      });
    } catch (err) {
      console.error("Email send failed:", err);
    }

    // 2. Open admin WhatsApp only
    handleWhatsappAdmin();

    // 3. Auto-confirm → success
    dispatch(clearCart());
    setTimeout(() => {
      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1200);
  };

  const handleSuccess = () => {
    dispatch(clearCart());
    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Empty cart guard
  if (items.length === 0 && step !== 3) {
    return (
      <div style={{ minHeight: "100vh", background: "#0D0600", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',sans-serif", gap: "1rem" }}>
        <div style={{ fontSize: "4rem" }}>🛒</div>
        <p style={{ color: "rgba(255,245,230,0.5)", fontSize: "1rem" }}>Your cart is empty</p>
        <button onClick={() => navigate("/products")} style={{ background: "linear-gradient(135deg,#FF6B00,#FF3D00)", border: "none", borderRadius: 12, color: "#fff", fontWeight: 700, padding: "0.7rem 1.8rem", cursor: "pointer", fontSize: "0.9rem" }}>Shop Now</button>
      </div>
    );
  }

  // ── Step 3: Success ──
  if (step === 3) {
    return (
      <div style={{ minHeight: "100vh", background: "#0D0600", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',sans-serif", gap: "1.2rem", padding: "2rem", textAlign: "center" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=DM+Sans:wght@400;600;700;800&display=swap');`}</style>
        <div style={{ fontSize: "5rem", lineHeight: 1 }}>🎆</div>
        <h1 style={{ color: "#FFD700", fontFamily: "'Cinzel Decorative',cursive", fontSize: "clamp(1.2rem,4vw,1.8rem)", margin: 0 }}>Order Placed!</h1>
        <div style={{ background: "rgba(255,107,0,0.08)", border: "1px solid rgba(255,107,0,0.2)", borderRadius: 12, padding: "0.7rem 1.4rem", marginTop: "-0.3rem" }}>
          <p style={{ color: "rgba(255,245,230,0.5)", fontSize: "0.72rem", margin: "0 0 0.2rem", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>Order ID</p>
          <p style={{ color: "#FFD700", fontWeight: 800, fontSize: "1.1rem", margin: 0, fontFamily: "monospace" }}>#{orderId}</p>
        </div>
        <p style={{ color: "rgba(255,245,230,0.7)", fontSize: "0.95rem", maxWidth: 420, lineHeight: 1.7, margin: 0 }}>
          Dear <strong style={{ color: "#FFF5E6" }}>{form.name}</strong>, your order has been received.<br />
          {form.email && <><span style={{ color: "#FFD700" }}>📧 Order confirmation sent to {form.email}</span><br /></>}
          Complete the payment and send the screenshot to our WhatsApp. We will confirm and dispatch within <strong style={{ color: "#FFF5E6" }}>24 hours</strong>. 🚀
        </p>
        <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", justifyContent: "center", marginTop: "0.5rem" }}>
          <button onClick={handleWhatsappAdmin} style={{ background: "#25D366", border: "none", borderRadius: 12, color: "#fff", fontWeight: 800, padding: "0.75rem 1.5rem", cursor: "pointer", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <MessageCircle size={18} /> Contact Us on WhatsApp
          </button>
          <button onClick={() => navigate("/products")} style={{ background: "rgba(255,107,0,0.1)", border: "1px solid rgba(255,107,0,0.3)", borderRadius: 12, color: "#FF6B00", fontWeight: 700, padding: "0.75rem 1.5rem", cursor: "pointer", fontSize: "0.9rem" }}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0D0600", fontFamily: "'DM Sans',sans-serif", paddingTop: 88 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        .co-input { width:100%; padding:0.72rem 1rem; background:rgba(255,255,255,0.04); border:1.5px solid rgba(255,107,0,0.15); border-radius:10px; color:#FFF5E6; font-family:'DM Sans',sans-serif; font-size:0.88rem; outline:none; transition:border .2s; box-sizing:border-box; appearance:none; -webkit-appearance:none; }
        .co-input:focus { border-color:rgba(255,107,0,0.5); background:rgba(255,107,0,0.04); }
        .co-input option { background:#1a0a00; color:#FFF5E6; }
        .bank-tab { padding:0.42rem 1rem; border-radius:8px; border:1.5px solid rgba(255,107,0,0.2); background:transparent; color:rgba(255,245,230,0.5); font-weight:700; font-size:0.78rem; cursor:pointer; transition:all .2s; font-family:'DM Sans',sans-serif; }
        .bank-tab.active { background:rgba(255,107,0,0.12); border-color:#FF6B00; color:#FF6B00; }
        @media(max-width:680px){
          .co-layout { grid-template-columns:1fr !important; }
          .co-grid { grid-template-columns:1fr !important; }
          .co-sticky { position:static !important; top:unset !important; }
          .price-card { order: -1; }
          .co-addr-pill { display:none !important; }
          .price-card { display:none !important; }
        }
      `}</style>

      <div className="co-layout" style={{ maxWidth: 980, margin: "0 auto", padding: "1.5rem 1rem 3rem", display: "grid", gridTemplateColumns: "1fr 310px", gap: "1.5rem", alignItems: "start" }}>

        {/* ── LEFT ── */}
        <div>
          {/* Steps */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.6rem" }}>
            {["Delivery Address", "Payment & Summary"].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <div onClick={() => i === 0 && step === 2 && setStep(1)} style={{ width: 28, height: 28, borderRadius: "50%", background: step > i ? "linear-gradient(135deg,#FF6B00,#FF3D00)" : step === i + 1 ? "linear-gradient(135deg,#FF6B00,#FF3D00)" : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 800, color: "#fff", cursor: i === 0 && step === 2 ? "pointer" : "default", flexShrink: 0 }}>
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: "0.8rem", fontWeight: step === i + 1 ? 700 : 500, color: step === i + 1 ? "#FFF5E6" : "rgba(255,245,230,0.4)" }}>{s}</span>
                {i < 1 && <ChevronRight size={14} color="rgba(255,245,230,0.2)" />}
              </div>
            ))}
          </div>

          {/* ── STEP 1: ADDRESS ── */}
          {step === 1 && (
            <div style={{ background: "rgba(255,107,0,0.03)", border: "1px solid rgba(255,107,0,0.1)", borderRadius: 18, padding: "1.6rem" }}>
              <h2 style={{ color: "#FFF5E6", fontSize: "1.05rem", fontWeight: 800, margin: "0 0 1.4rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <MapPin size={18} color="#FF6B00" /> Delivery Address
              </h2>
              <div className="co-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.73rem", color: "rgba(255,245,230,0.5)", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Full Name *</label>
                  <input name="name" value={form.name} onChange={onChange} className="co-input" />
                </div>
                <div>
                  <label style={{ fontSize: "0.73rem", color: "rgba(255,245,230,0.5)", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Phone *</label>
                  <input name="phone" value={form.phone} onChange={onChange} className="co-input" maxLength={10} type="tel" />
                </div>
                <div style={{ gridColumn: "1/-1" }}>
                  <label style={{ fontSize: "0.73rem", color: "rgba(255,245,230,0.5)", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Email (optional)</label>
                  <input name="email" value={form.email} onChange={onChange} className="co-input" type="email" />
                </div>
                <div style={{ gridColumn: "1/-1" }}>
                  <label style={{ fontSize: "0.73rem", color: "rgba(255,245,230,0.5)", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Address *</label>
                  <input name="address" value={form.address} onChange={onChange} className="co-input" />
                </div>
                <div>
                  <label style={{ fontSize: "0.73rem", color: "rgba(255,245,230,0.5)", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>City *</label>
                  <input name="city" value={form.city} onChange={onChange} className="co-input" />
                </div>
                <div>
                  <label style={{ fontSize: "0.73rem", color: "rgba(255,245,230,0.5)", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Pincode *</label>
                  <input name="pincode" value={form.pincode} onChange={onChange} className="co-input" maxLength={6} type="tel" />
                </div>
                <div style={{ gridColumn: "1/-1" }}>
                  <label style={{ fontSize: "0.73rem", color: "rgba(255,245,230,0.5)", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>State *</label>
                  <select name="state" value={form.state} onChange={onChange} className="co-input">
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={handleNext} style={{ marginTop: "1.4rem", width: "100%", padding: "0.85rem", background: "linear-gradient(135deg,#FF6B00,#FF3D00)", border: "none", borderRadius: 12, color: "#fff", fontWeight: 800, fontSize: "0.95rem", cursor: "pointer", boxShadow: "0 4px 20px rgba(255,107,0,0.4)", fontFamily: "'DM Sans',sans-serif" }}>
                Continue to Payment →
              </button>
            </div>
          )}

          {/* ── STEP 2: SUMMARY + PAYMENT ── */}
          {step === 2 && (
            <div id="order-section" style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>

              {/* Address pill — hidden on mobile */}
              <div className="co-addr-pill" style={{ background: "rgba(255,107,0,0.04)", border: "1px solid rgba(255,107,0,0.12)", borderRadius: 12, padding: "0.85rem 1rem", display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                <MapPin size={16} color="#FF6B00" style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ color: "#FFF5E6", fontWeight: 700, fontSize: "0.82rem", margin: 0 }}>{form.name} · {form.phone}</p>
                  <p style={{ color: "rgba(255,245,230,0.5)", fontSize: "0.75rem", margin: "0.2rem 0 0" }}>{form.address}, {form.city}, {form.state} - {form.pincode}</p>
                </div>
                <button onClick={() => setStep(1)} style={{ fontSize: "0.72rem", color: "#FF6B00", background: "none", border: "none", cursor: "pointer", fontWeight: 700, whiteSpace: "nowrap" }}>Edit</button>
              </div>

              {/* Order items */}
              <div style={{ background: "rgba(255,107,0,0.03)", border: "1px solid rgba(255,107,0,0.1)", borderRadius: 14, padding: "1.2rem" }}>
                <h3 style={{ color: "#FFF5E6", fontSize: "0.9rem", fontWeight: 800, margin: "0 0 0.9rem" }}>🛒 Your Order ({items.reduce((s, i) => s + i.quantity, 0)} items)</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                  {items.map(item => (
                    <div key={item._id} style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
                      <img src={item.image} alt={item.name} style={{ width: 46, height: 46, borderRadius: 8, objectFit: "cover", border: "1px solid rgba(255,107,0,0.15)", flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ color: "#FFF5E6", fontSize: "0.82rem", fontWeight: 600, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</p>
                        <p style={{ color: "rgba(255,245,230,0.45)", fontSize: "0.72rem", margin: "0.12rem 0 0" }}>Qty: {item.quantity} × ₹{item.price.toLocaleString()}</p>
                      </div>
                      <span style={{ color: "#FFD700", fontWeight: 700, fontSize: "0.85rem", flexShrink: 0 }}>₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: "1px solid rgba(255,107,0,0.1)", marginTop: "0.8rem", paddingTop: "0.8rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#FFF5E6", fontWeight: 800, fontSize: "0.9rem" }}>Total Payable</span>
                  <span style={{ fontWeight: 800, fontSize: "1.1rem", background: "linear-gradient(135deg,#FF6B00,#FF3D00)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment section */}
              <div style={{ background: "rgba(255,107,0,0.03)", border: "1px solid rgba(255,107,0,0.1)", borderRadius: 14, padding: "1.2rem" }}>
                <h3 style={{ color: "#FFF5E6", fontSize: "0.9rem", fontWeight: 800, margin: "0 0 1rem" }}>💳 Pay Here</h3>

                {/* UPI */}
                <div style={{ background: "rgba(37,211,102,0.06)", border: "1px solid rgba(37,211,102,0.2)", borderRadius: 12, padding: "0.9rem 1rem", marginBottom: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.4rem" }}>
                    <div>
                      <p style={{ color: "rgba(255,245,230,0.45)", fontSize: "0.65rem", fontWeight: 700, margin: "0 0 0.2rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>UPI ID</p>
                      <p style={{ color: "#FFF5E6", fontWeight: 800, fontSize: "0.95rem", margin: 0 }}>{UPI_ID}</p>
                    </div>
                    <CopyBtn text={UPI_ID} />
                  </div>
                  <p style={{ color: "rgba(255,245,230,0.4)", fontSize: "0.7rem", margin: "0.5rem 0 0" }}>Pay via GPay · PhonePe · Paytm · Any UPI app</p>
                </div>

                {/* Bank transfer */}
                <div>
                  <p style={{ color: "rgba(255,245,230,0.45)", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 0.6rem" }}>Bank Transfer</p>
                  <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.8rem", flexWrap: "wrap" }}>
                    {BANK_ACCOUNTS.map((b, i) => (
                      <button key={b.id} className={`bank-tab${activeBank === i ? " active" : ""}`} onClick={() => setActiveBank(i)}>
                        Account {i + 1}
                      </button>
                    ))}
                  </div>
                  {(() => {
                    const b = BANK_ACCOUNTS[activeBank];
                    return (
                      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,107,0,0.1)", borderRadius: 12, padding: "0.9rem 1rem", display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                        {[
                          ["Bank Name", b.bank],
                          ["Account Name", b.name],
                          ["Account Number", b.accountNo],
                          ["IFSC Code", b.ifsc],
                          ["Branch", b.branch],
                        ].map(([label, value]) => (
                          <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
                            <div style={{ minWidth: 0 }}>
                              <p style={{ color: "rgba(255,245,230,0.4)", fontSize: "0.65rem", fontWeight: 700, margin: 0, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</p>
                              <p style={{ color: "#FFF5E6", fontWeight: 700, fontSize: "0.85rem", margin: "0.1rem 0 0", wordBreak: "break-all" }}>{value}</p>
                            </div>
                            <CopyBtn text={value} />
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                <div style={{ marginTop: "1rem", background: "rgba(255,211,0,0.06)", border: "1px solid rgba(255,211,0,0.18)", borderRadius: 10, padding: "0.7rem 0.9rem", fontSize: "0.75rem", color: "rgba(255,245,230,0.6)", lineHeight: 1.65 }}>
                  ⚡ Complete the payment above, then click <strong style={{ color: "#FFD700" }}>"I Have Paid"</strong> below to confirm your order.
                </div>
              </div>

              {/* Step A — I Have Paid */}
              {!paidConfirmed && !whatsappSent && (
                <button onClick={() => setPaidConfirmed(true)} style={{ width: "100%", padding: "1rem", background: "linear-gradient(135deg,#FF6B00,#FF3D00)", border: "none", borderRadius: 14, color: "#fff", fontWeight: 800, fontSize: "1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", boxShadow: "0 4px 20px rgba(255,107,0,0.4)", fontFamily: "'DM Sans',sans-serif" }}>
                  <ShieldCheck size={20} /> I Have Paid — Confirm Order
                </button>
              )}

              {/* Step B — Send on WhatsApp (shown after paid confirmed) */}
              {paidConfirmed && !whatsappSent && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div style={{ background: "rgba(255,107,0,0.06)", border: "1px solid rgba(255,107,0,0.2)", borderRadius: 14, padding: "1rem", textAlign: "center" }}>
                    <p style={{ color: "#FFD700", fontWeight: 800, fontSize: "0.88rem", margin: "0 0 0.3rem" }}>✅ Payment noted!</p>
                    <p style={{ color: "rgba(255,245,230,0.5)", fontSize: "0.78rem", margin: 0 }}>Now send your order details + payment screenshot to our admin on WhatsApp to complete the process.</p>
                  </div>
                  <button onClick={handleSendWhatsapp} style={{ width: "100%", padding: "1rem", background: "#25D366", border: "none", borderRadius: 14, color: "#fff", fontWeight: 800, fontSize: "1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", boxShadow: "0 4px 20px rgba(37,211,102,0.35)", fontFamily: "'DM Sans',sans-serif" }}>
                    <MessageCircle size={20} /> Send Order on WhatsApp
                  </button>
                  <button onClick={() => setPaidConfirmed(false)} style={{ background: "none", border: "none", color: "rgba(255,245,230,0.35)", fontSize: "0.72rem", cursor: "pointer", textAlign: "center", fontFamily: "'DM Sans',sans-serif" }}>
                    ← Go back
                  </button>
                </div>
              )}

              {/* Step C — Sending / redirecting */}
              {whatsappSent && (
                <div style={{ background: "rgba(37,211,102,0.07)", border: "1px solid rgba(37,211,102,0.22)", borderRadius: 14, padding: "1.1rem", textAlign: "center" }}>
                  <div style={{ fontSize: "1.6rem", marginBottom: "0.4rem" }}>🎆</div>
                  <p style={{ color: "#2ECC71", fontWeight: 800, fontSize: "0.9rem", margin: "0 0 0.3rem" }}>Order confirmed! Redirecting...</p>
                  <p style={{ color: "rgba(255,245,230,0.45)", fontSize: "0.75rem", margin: 0 }}>WhatsApp opened on your device</p>
                </div>
              )}

            </div>
          )}
        </div>

        {/* ── RIGHT: Price Summary ── */}
        <div className="co-sticky price-card" style={{ position: "sticky", top: 100 }}>
          <div style={{ background: "linear-gradient(160deg,#FFF8F0,#FFF3E0)", borderRadius: 18, padding: "1.4rem", border: "1px solid rgba(255,107,0,0.15)", boxShadow: "0 4px 24px rgba(0,0,0,0.15)" }}>
            <h3 style={{ color: "#1a0800", fontWeight: 800, fontSize: "0.95rem", margin: "0 0 1rem" }}>Price Details</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "rgba(26,8,0,0.6)", fontSize: "0.82rem" }}>Price ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span style={{ color: "#1a0800", fontWeight: 600, fontSize: "0.82rem" }}>₹{(total + savings).toLocaleString()}</span>
              </div>
              {savings > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "rgba(26,8,0,0.6)", fontSize: "0.82rem" }}>Discount</span>
                  <span style={{ color: "#1a7a4a", fontWeight: 700, fontSize: "0.82rem" }}>−₹{savings.toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "rgba(26,8,0,0.6)", fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "0.3rem" }}><Truck size={13} /> Delivery</span>
                <span style={{ color: shipping === 0 ? "#1a7a4a" : "#1a0800", fontWeight: 600, fontSize: "0.82rem" }}>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
              </div>
              <div style={{ height: 1, background: "rgba(255,107,0,0.15)", margin: "0.2rem 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#1a0800", fontWeight: 800, fontSize: "0.95rem" }}>Total</span>
                <span style={{ fontWeight: 800, fontSize: "1.15rem", background: "linear-gradient(135deg,#FF6B00,#FF3D00)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>
            {savings > 0 && (
              <div style={{ marginTop: "0.85rem", background: "rgba(46,204,113,0.1)", border: "1px solid rgba(46,204,113,0.2)", borderRadius: 8, padding: "0.5rem 0.8rem", fontSize: "0.75rem", color: "#1a7a4a", fontWeight: 700, textAlign: "center" }}>
                🎉 You save ₹{savings.toLocaleString()} on this order!
              </div>
            )}
            {shipping > 0 && (
              <div style={{ marginTop: "0.6rem", fontSize: "0.7rem", color: "rgba(26,8,0,0.5)", textAlign: "center" }}>
                Add ₹{(999 - total).toLocaleString()} more for FREE delivery
              </div>
            )}
          </div>

          {/* Trust badges */}
          <div style={{ marginTop: "1rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
            {[["🔒","Secure","100% safe"],["🚚","Fast Ship","2–5 days"],["✅","Verified","Trusted store"],["💬","Support","WhatsApp help"]].map(([icon, title, sub]) => (
              <div key={title} style={{ background: "rgba(255,107,0,0.04)", border: "1px solid rgba(255,107,0,0.1)", borderRadius: 10, padding: "0.65rem", textAlign: "center" }}>
                <div style={{ fontSize: "1.2rem" }}>{icon}</div>
                <p style={{ color: "#FFF5E6", fontWeight: 700, fontSize: "0.7rem", margin: "0.2rem 0 0.1rem" }}>{title}</p>
                <p style={{ color: "rgba(255,245,230,0.4)", fontSize: "0.62rem", margin: 0 }}>{sub}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
