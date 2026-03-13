import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../../redux/slices/cartSlice";
import { useLang } from "../../components/LangContext/LangContext";
import { MapPin, Truck, ChevronRight, Copy, CheckCircle2, MessageCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const API = import.meta.env.PROD ? "" : "http://localhost:5000";

const ADMIN_WHATSAPP = "6385812382";

const BANK_ACCOUNTS = [
  {
    id: 1,
    name: "Satheeskumar M",
    accountNo: "435100050300843",
    ifsc: "TMBL0000435",
    bank: "Tamil Nadu Mercantile Bank",
    branch: "Sivakasi",
  },
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
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

export default function Checkout() {
  const dispatch   = useDispatch();
  const { t }      = useLang();
  const navigate   = useNavigate();
  const items      = useSelector(s => s.cart.items);
  const total      = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const savings    = items.reduce((s, i) => s + ((i.originalPrice || i.price) - i.price) * i.quantity, 0);
  const shipping   = total >= 999 ? 0 : 99;
  const grandTotal = total + shipping;

  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", state: "Tamil Nadu", pincode: "" });
  const [step, setStep]               = useState(1);
  const [submitting, setSubmitting]   = useState(false);
  const [orderId] = useState(() => "SN" + Date.now().toString().slice(-6));
  const [orderSnapshot, setOrderSnapshot] = useState(null);

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleNext = () => {
    const { name, phone, address, city, pincode } = form;
    if (!name || !phone || !address || !city || !pincode) { toast.error("Please fill all required fields"); return; }
    if (phone.length < 10) { toast.error("Enter valid phone number"); return; }
    setStep(2);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const buildOrderMessage = (recipient, snap = null) => {
    const _items      = snap ? snap.items      : items;
    const _total      = snap ? snap.total      : total;
    const _savings    = snap ? snap.savings    : savings;
    const _shipping   = snap ? snap.shipping   : shipping;
    const _grandTotal = snap ? snap.grandTotal : grandTotal;
    const _form       = snap ? snap.form       : form;
    const divider     = "━━━━━━━━━━━━━━━━━━━━━━";
    const itemLines   = _items.map((i, idx) =>
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
${_form.name}
${_form.phone}${_form.email ? " | " + _form.email : ""}
${_form.address}
${_form.city}, ${_form.state} — ${_form.pincode}
${divider}

*Order Summary*
${itemLines}
${divider}

*Price Breakdown*
Item Total  :  ₹${(_total + _savings).toLocaleString()}${_savings > 0 ? `\nDiscount    : -₹${_savings.toLocaleString()}` : ""}
Delivery    :  ${_shipping === 0 ? "FREE" : "₹" + _shipping}
──────────────────────
*Total Payable :  ₹${_grandTotal.toLocaleString()}*
${divider}

*Payment Details*
UPI ID  :  ${UPI_ID}

Bank Transfer:
Bank    :  ${bank.bank}
A/C No  :  ${bank.accountNo}
IFSC    :  ${bank.ifsc}
Name    :  ${bank.name}
${divider}

Kindly transfer *₹${_grandTotal.toLocaleString()}* and reply with your payment screenshot to confirm your order.

We will dispatch within 24 hours of payment confirmation.

Thank you for choosing SparkNest! 🎆`
      );
    } else {
      return encodeURIComponent(
`*SparkNest — New Order Alert* 🔔
Order ID: #${orderId} | Date: ${date}
${divider}

*Customer Details*
Name    :  ${_form.name}
Phone   :  ${_form.phone}${_form.email ? `\nEmail   :  ${_form.email}` : ""}
Address :  ${_form.address}, ${_form.city}, ${_form.state} — ${_form.pincode}
${divider}

*Order Items*
${itemLines}
${divider}

*Price Breakdown*
Item Total  :  ₹${(_total + _savings).toLocaleString()}${_savings > 0 ? `\nDiscount    : -₹${_savings.toLocaleString()}` : ""}
Delivery    :  ${_shipping === 0 ? "FREE" : "₹" + _shipping}
──────────────────────
*Total Payable :  ₹${_grandTotal.toLocaleString()}*
${divider}

Please verify payment screenshot from customer and confirm dispatch.`
      );
    }
  };

  // ── POST order to /api/orders ──────────────────────────────────────────────
  const postOrder = async (snap) => {
    const payload = {
      orderId,
      customer: {
        name:    snap.form.name,
        phone:   snap.form.phone,
        email:   snap.form.email || "",
        address: snap.form.address,
        city:    snap.form.city,
        state:   snap.form.state,
        pincode: snap.form.pincode,
      },
      items: snap.items.map(i => ({
        productId:     i._id,
        name:          i.name,
        image:         i.image,
        price:         i.price,
        originalPrice: i.originalPrice,
        quantity:      i.quantity,
        category:      i.category,
      })),
      pricing: {
        itemTotal:  snap.total + snap.savings,
        discount:   snap.savings,
        shipping:   snap.shipping,
        grandTotal: snap.grandTotal,
      },
    };

    const res  = await fetch(`${API}/api/orders`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to save order");
    return data;
  };

  const handleConfirmOrder = async () => {
    setSubmitting(true);
    const snap = { items: [...items], total, savings, shipping, grandTotal, form: { ...form } };
    setOrderSnapshot(snap);

    try {
      // 1. Save order to MongoDB
      await postOrder(snap);

      // 2. Send confirmation emails (non-blocking — failure won't stop checkout)
      fetch("/api/send-order-email", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          customerEmail: form.email || null,
          customerName:  form.name,
          orderId,
          items,
          form,
          total,
          savings,
          shipping,
          grandTotal,
        }),
      }).catch(err => console.error("Email send failed:", err));

      // 3. Clear cart and advance to success screen
      dispatch(clearCart());
      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Empty cart guard
  if (items.length === 0 && step !== 3) {
    return (
      <div style={{ minHeight: "100vh", background: "#0D0600", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Source Sans 3',sans-serif", gap: "1rem" }}>
        <div style={{ fontSize: "4rem" }}>🛒</div>
        <p style={{ color: "rgba(255,245,230,0.72)", fontSize: "1rem" }}>Your cart is empty</p>
        <button onClick={() => navigate("/products")} style={{ background: "linear-gradient(135deg,#FF6B00,#FF3D00)", border: "none", borderRadius: 12, color: "#fff", fontWeight: 700, padding: "0.7rem 1.8rem", cursor: "pointer", fontSize: "0.9rem" }}>Shop Now</button>
      </div>
    );
  }

  // ── Step 3: Success ──
  if (step === 3) {
    const snap = orderSnapshot;
    const bank = BANK_ACCOUNTS[0];
    return (
      <div style={{ minHeight: "100vh", background: "#0D0600", fontFamily: "'Source Sans 3',sans-serif", padding: "2rem clamp(1rem,5vw,3rem)", paddingTop: 88 }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Nunito+Sans:wght@300;400;600;700;800&family=Source+Sans+3:wght@300;400;600;700&display=swap');`}</style>
        <div style={{ maxWidth: 560, margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.2rem" }}>

          {/* Header */}
          <div style={{ textAlign: "center", padding: "1.5rem 0 0.5rem" }}>
            <div style={{ fontSize: "4rem", lineHeight: 1, marginBottom: "0.75rem" }}>🎆</div>
            <h1 style={{ color: "#FFD700", fontFamily: "'Libre Baskerville',serif", textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "clamp(1.2rem,4vw,1.8rem)", margin: "0 0 0.5rem" }}>Order Confirmed!</h1>
            <div style={{ display: "inline-block", background: "rgba(255,107,0,0.08)", border: "1px solid rgba(255,107,0,0.2)", borderRadius: 10, padding: "0.5rem 1.2rem" }}>
              <span style={{ color: "rgba(255,245,230,0.6)", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Order ID &nbsp;</span>
              <span style={{ color: "#FFD700", fontWeight: 800, fontSize: "1rem", fontFamily: "monospace" }}>#{orderId}</span>
            </div>
            <p style={{ color: "rgba(255,245,230,0.65)", fontSize: "1rem", marginTop: "0.75rem", lineHeight: 1.6 }}>
              Dear <strong style={{ color: "#FFF5E6" }}>{snap?.form.name || form.name}</strong>, complete the payment below and send the screenshot to our WhatsApp. We'll dispatch within <strong style={{ color: "#FFD700" }}>24 hours</strong>. 🚀
            </p>
          </div>

          {/* Payment Details */}
          <div style={{ background: "rgba(255,107,0,0.04)", border: "1px solid rgba(255,107,0,0.15)", borderRadius: 16, padding: "1.2rem" }}>
            <h3 style={{ color: "#FFF5E6", fontWeight: 800, fontSize: "1.05rem", margin: "0 0 1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>💳 Complete Your Payment</h3>

            <div style={{ background: "linear-gradient(135deg,rgba(255,107,0,0.12),rgba(255,61,0,0.06))", border: "1px solid rgba(255,107,0,0.25)", borderRadius: 12, padding: "0.85rem 1rem", marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "rgba(255,245,230,0.8)", fontWeight: 700, fontSize: "1rem" }}>Amount Due</span>
              <span style={{ color: "#FFD700", fontWeight: 900, fontSize: "1.3rem" }}>₹{(snap?.grandTotal || grandTotal).toLocaleString()}</span>
            </div>

            <div style={{ background: "rgba(37,211,102,0.06)", border: "1px solid rgba(37,211,102,0.2)", borderRadius: 12, padding: "0.9rem 1rem", marginBottom: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.4rem" }}>
                <div>
                  <p style={{ color: "rgba(255,245,230,0.6)", fontSize: "0.7rem", fontWeight: 700, margin: "0 0 0.2rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>UPI ID</p>
                  <p style={{ color: "#FFF5E6", fontWeight: 800, fontSize: "1rem", margin: 0 }}>{UPI_ID}</p>
                </div>
                <CopyBtn text={UPI_ID} />
              </div>
              <p style={{ color: "rgba(255,245,230,0.55)", fontSize: "1.05rem", margin: "0.5rem 0 0" }}>Pay via GPay · PhonePe · Paytm · Any UPI app</p>
            </div>

            <p style={{ color: "rgba(255,245,230,0.6)", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 0.6rem" }}>Bank Transfer</p>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,107,0,0.1)", borderRadius: 12, padding: "0.9rem 1rem", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              {[
                ["Bank Name",    bank.bank],
                ["Account Name", bank.name],
                ["Account No.", bank.accountNo],
                ["IFSC Code",   bank.ifsc],
                ["Branch",      bank.branch],
              ].map(([label, value]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
                  <div>
                    <p style={{ color: "rgba(255,245,230,0.55)", fontSize: "0.7rem", fontWeight: 700, margin: 0, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</p>
                    <p style={{ color: "#FFF5E6", fontWeight: 700, fontSize: "0.9rem", margin: "0.1rem 0 0", wordBreak: "break-all" }}>{value}</p>
                  </div>
                  <CopyBtn text={value} />
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp CTA */}
          <button
            onClick={() => window.open(`https://wa.me/91${ADMIN_WHATSAPP}?text=${buildOrderMessage("admin", snap)}`, "_blank")}
            style={{ width: "100%", padding: "1rem", background: "#25D366", border: "none", borderRadius: 14, color: "#fff", fontWeight: 800, fontSize: "1.05rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", boxShadow: "0 4px 20px rgba(37,211,102,0.4)", fontFamily: "'Source Sans 3',sans-serif" }}>
            <MessageCircle size={20} /> Send Payment Screenshot on WhatsApp
          </button>

          <button onClick={() => navigate("/products")} style={{ background: "transparent", border: "1px solid rgba(255,107,0,0.3)", borderRadius: 12, color: "#FF6B00", fontWeight: 700, padding: "0.75rem", cursor: "pointer", fontSize: "0.9rem", width: "100%" }}>
            Continue Shopping
          </button>

        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0D0600", fontFamily: "'Source Sans 3',sans-serif", paddingTop: 88 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Nunito+Sans:wght@300;400;600;700;800&family=Source+Sans+3:wght@300;400;600;700&display=swap');
        .co-input { width:100%; padding:0.85rem 1rem; background:rgba(255,255,255,0.05); border:1.5px solid rgba(255,107,0,0.2); border-radius:12px; color:#FFF5E6; font-family:'Source Sans 3',sans-serif; font-size:1rem; font-weight:500; outline:none; transition:border .2s; box-sizing:border-box; appearance:none; -webkit-appearance:none; }
        .co-input:focus { border-color:rgba(255,107,0,0.6); background:rgba(255,107,0,0.06); }
        .co-input option { background:#1a0a00; color:#FFF5E6; }
        .co-label { font-size:1rem; color:rgba(255,245,230,0.6); font-weight:700; display:block; margin-bottom:0.5rem; text-transform:uppercase; letter-spacing:0.04em; }
        @media(max-width:680px){
          .co-layout { grid-template-columns:1fr !important; }
          .co-grid   { grid-template-columns:1fr !important; }
          .co-sticky { position:static !important; top:unset !important; }
          .price-card { order:2; margin-top:0 !important; }
          .price-trust-badges { display:none !important; }
          .price-card-inner { padding:1rem !important; border-radius:14px !important; }
        }
      `}</style>

      <div className="co-layout" style={{ maxWidth: 980, margin: "0 auto", padding: "1.5rem 1rem 3rem", display: "grid", gridTemplateColumns: "1fr 310px", gap: "1.5rem", alignItems: "start" }}>

        {/* ── LEFT ── */}
        <div>
          {/* Steps */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.6rem" }}>
            {[t.deliveryAddress, t.paymentSummary].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <div onClick={() => i === 0 && step === 2 && setStep(1)} style={{ width: 28, height: 28, borderRadius: "50%", background: step > i ? "linear-gradient(135deg,#FF6B00,#FF3D00)" : step === i + 1 ? "linear-gradient(135deg,#FF6B00,#FF3D00)" : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.05rem", fontWeight: 800, color: "#fff", cursor: i === 0 && step === 2 ? "pointer" : "default", flexShrink: 0 }}>
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: "1.05rem", fontWeight: step === i + 1 ? 700 : 500, color: step === i + 1 ? "#FFF5E6" : "rgba(255,245,230,0.65)" }}>{s}</span>
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
                  <label className="co-label">{t.fullName}</label>
                  <input name="name" value={form.name} onChange={onChange} className="co-input" />
                </div>
                <div>
                  <label className="co-label">{t.phone}</label>
                  <input name="phone" value={form.phone} onChange={onChange} className="co-input" maxLength={10} type="tel" />
                </div>
                <div style={{ gridColumn: "1/-1" }}>
                  <label className="co-label">{t.emailOpt}</label>
                  <input name="email" value={form.email} onChange={onChange} className="co-input" type="email" />
                </div>
                <div style={{ gridColumn: "1/-1" }}>
                  <label className="co-label">{t.address}</label>
                  <input name="address" value={form.address} onChange={onChange} className="co-input" />
                </div>
                <div>
                  <label className="co-label">{t.city}</label>
                  <input name="city" value={form.city} onChange={onChange} className="co-input" />
                </div>
                <div>
                  <label className="co-label">{t.pincode}</label>
                  <input name="pincode" value={form.pincode} onChange={onChange} className="co-input" maxLength={6} type="tel" />
                </div>
                <div style={{ gridColumn: "1/-1" }}>
                  <label className="co-label">{t.state}</label>
                  <select name="state" value={form.state} onChange={onChange} className="co-input">
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={handleNext} style={{ marginTop: "1.4rem", width: "100%", padding: "0.85rem", background: "linear-gradient(135deg,#FF6B00,#FF3D00)", border: "none", borderRadius: 12, color: "#fff", fontWeight: 800, fontSize: "1.05rem", cursor: "pointer", boxShadow: "0 4px 20px rgba(255,107,0,0.65)", fontFamily: "'Source Sans 3',sans-serif" }}>
                {t.continuePayment}
              </button>
            </div>
          )}

          {/* ── STEP 2: SUMMARY + PAYMENT ── */}
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
              <div style={{ background: "rgba(255,107,0,0.04)", border: "1px solid rgba(255,107,0,0.12)", borderRadius: 12, padding: "0.85rem 1rem", display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                <MapPin size={16} color="#FF6B00" style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ color: "#FFF5E6", fontWeight: 700, fontSize: "1.05rem", margin: 0 }}>{form.name} · {form.phone}</p>
                  <p style={{ color: "rgba(255,245,230,0.72)", fontSize: "0.8rem", margin: "0.2rem 0 0" }}>{form.address}, {form.city}, {form.state} - {form.pincode}</p>
                </div>
                <button onClick={() => { setStep(1); window.scrollTo({ top: 0, behavior: "instant" }); }} style={{ fontSize: "1.05rem", color: "#FF6B00", background: "none", border: "none", cursor: "pointer", fontWeight: 700, whiteSpace: "nowrap", padding: "0.3rem 0.5rem", borderRadius: 8 }}>← Edit</button>
              </div>

              <div style={{ background: "rgba(255,107,0,0.03)", border: "1px solid rgba(255,107,0,0.1)", borderRadius: 14, padding: "1.2rem" }}>
                <h3 style={{ color: "#FFF5E6", fontSize: "1.05rem", fontWeight: 800, margin: "0 0 0.9rem" }}>🛒 Your Order ({items.reduce((s, i) => s + i.quantity, 0)} items)</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                  {items.map(item => (
                    <div key={item._id} style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
                      <img src={item.image} alt={item.name} style={{ width: 46, height: 46, borderRadius: 8, objectFit: "cover", border: "1px solid rgba(255,107,0,0.15)", flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ color: "#FFF5E6", fontSize: "1.05rem", fontWeight: 700, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</p>
                        <p style={{ color: "rgba(255,245,230,0.7)", fontSize: "0.9rem", margin: "0.15rem 0 0" }}>Qty: {item.quantity} × ₹{item.price.toLocaleString()}</p>
                      </div>
                      <span style={{ color: "#FFD700", fontWeight: 700, fontSize: "1.05rem", flexShrink: 0 }}>₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: "1px solid rgba(255,107,0,0.1)", marginTop: "0.8rem", paddingTop: "0.8rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#FFF5E6", fontWeight: 800, fontSize: "1.05rem" }}>Total Payable</span>
                  <span style={{ fontWeight: 800, fontSize: "1.1rem", background: "linear-gradient(135deg,#FF6B00,#FF3D00)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleConfirmOrder}
                disabled={submitting}
                style={{ width: "100%", padding: "1rem", background: submitting ? "rgba(255,107,0,0.4)" : "linear-gradient(135deg,#FF6B00,#FF3D00)", border: "none", borderRadius: 14, color: "#fff", fontWeight: 800, fontSize: "1.05rem", cursor: submitting ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", boxShadow: submitting ? "none" : "0 4px 20px rgba(255,107,0,0.5)", fontFamily: "'Source Sans 3',sans-serif", transition: "all .2s" }}>
                {submitting ? <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Placing Order…</> : "✅ Confirm Order"}
              </button>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}
        </div>

        {/* ── RIGHT: Price Summary ── */}
        <div className="co-sticky price-card" style={{ position: "sticky", top: 100 }}>
          <div className="price-card-inner" style={{ background: "linear-gradient(160deg,#FFF8F0,#FFF3E0)", borderRadius: 18, padding: "1.4rem", border: "1px solid rgba(255,107,0,0.15)", boxShadow: "0 4px 24px rgba(0,0,0,0.15)" }}>
            <h3 style={{ color: "#1a0800", fontWeight: 800, fontSize: "1.05rem", margin: "0 0 1rem" }}>Price Details</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "rgba(26,8,0,0.6)", fontSize: "1rem" }}>Price ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span style={{ color: "#1a0800", fontWeight: 600, fontSize: "1rem" }}>₹{(total + savings).toLocaleString()}</span>
              </div>
              {savings > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "rgba(26,8,0,0.6)", fontSize: "1rem" }}>Discount</span>
                  <span style={{ color: "#1a7a4a", fontWeight: 700, fontSize: "1rem" }}>−₹{savings.toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "rgba(26,8,0,0.6)", fontSize: "1rem", display: "flex", alignItems: "center", gap: "0.3rem" }}><Truck size={13} /> Delivery</span>
                <span style={{ color: shipping === 0 ? "#1a7a4a" : "#1a0800", fontWeight: 600, fontSize: "1rem" }}>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
              </div>
              <div style={{ height: 1, background: "rgba(255,107,0,0.15)", margin: "0.2rem 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#1a0800", fontWeight: 800, fontSize: "1.05rem" }}>Total</span>
                <span style={{ fontWeight: 800, fontSize: "1.15rem", background: "linear-gradient(135deg,#FF6B00,#FF3D00)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>
            {savings > 0 && (
              <div style={{ marginTop: "0.85rem", background: "rgba(46,204,113,0.1)", border: "1px solid rgba(46,204,113,0.2)", borderRadius: 8, padding: "0.5rem 0.8rem", fontSize: "1.05rem", color: "#1a7a4a", fontWeight: 700, textAlign: "center" }}>
                🎉 You save ₹{savings.toLocaleString()} on this order!
              </div>
            )}
            {shipping > 0 && (
              <div style={{ marginTop: "0.6rem", fontSize: "0.7rem", color: "rgba(26,8,0,0.5)", textAlign: "center" }}>
                Add ₹{(999 - total).toLocaleString()} more for FREE delivery
              </div>
            )}
          </div>

          <div className="price-trust-badges" style={{ marginTop: "1rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
            {[["🔒","Secure","100% Safe"],["🚚","Fast Shipping","2–5 Days"],["✅","Verified","Trusted Store"],["💬","Support","WhatsApp Help"]].map(([icon, title, sub]) => (
              <div key={title} style={{ background: "rgba(255,107,0,0.04)", border: "1px solid rgba(255,107,0,0.1)", borderRadius: 10, padding: "0.65rem", textAlign: "center" }}>
                <div style={{ fontSize: "1.2rem" }}>{icon}</div>
                <p style={{ color: "#FFF5E6", fontWeight: 700, fontSize: "0.7rem", margin: "0.2rem 0 0.1rem" }}>{title}</p>
                <p style={{ color: "rgba(255,245,230,0.65)", fontSize: "0.9rem", margin: 0 }}>{sub}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
