import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeFromCart, updateQty, clearCart } from "../../redux/slices/cartSlice";
import { ShoppingBag, X, Trash2, Plus, Minus, ShoppingCart } from "lucide-react";


function CartQtyInput({ item }) {
  const dispatch = useDispatch();
  const [focused, setFocused] = useState(false);
  const [val, setVal] = useState(String(item.quantity));
  const max = Math.min(99, item.stock || 99);

  // Keep val in sync when not focused
  if (!focused && val !== String(item.quantity)) {
    setVal(String(item.quantity));
  }

  const commit = () => {
    const v = parseInt(val);
    if (!isNaN(v) && v >= 1) dispatch(updateQty({ id: item._id, quantity: Math.min(max, v) }));
    else if (!isNaN(v) && v < 1) dispatch(removeFromCart(item._id));
    else setVal(String(item.quantity));
    setFocused(false);
  };

  return (
    <input
      type="number" min="1" max={max}
      value={val}
      onChange={e => setVal(e.target.value)}
      onFocus={e => { setFocused(true); e.target.select(); }}
      onBlur={commit}
      onKeyDown={e => { if (e.key === "Enter") { commit(); e.target.blur(); } }}
      style={{ minWidth:22, width:32, textAlign:"center", color:"#FFF5E6", fontWeight:700, fontSize:"0.82rem", background:"transparent", border:"none", outline:"none", MozAppearance:"textfield", WebkitAppearance:"none" }}
    />
  );
}

export default function CartDrawer({ open, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(s => s.cart.items);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const savings = items.reduce((sum, i) => sum + ((i.originalPrice || i.price) - i.price) * i.quantity, 0);

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <>
      <style>{`
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance:none; margin:0; }
        input[type=number] { -moz-appearance:textfield; }
      `}</style>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
          zIndex: 1100, opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.3s ease", backdropFilter: "blur(4px)",
        }}
      />

      {/* Drawer */}
      <div style={{
        position: "fixed", top: 0, right: 0, height: "100vh", width: "min(420px, 100vw)",
        background: "linear-gradient(180deg,#1A0800 0%,#0D0600 100%)",
        zIndex: 1101, display: "flex", flexDirection: "column",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.35s cubic-bezier(0.34,1.1,0.64,1)",
        boxShadow: "-8px 0 40px rgba(0,0,0,0.5)",
        borderLeft: "1px solid rgba(255,107,0,0.15)",
        fontFamily: "'DM Sans', sans-serif",
      }}>

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "1.2rem 1.4rem", borderBottom: "1px solid rgba(255,107,0,0.12)",
          background: "rgba(255,107,0,0.05)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <ShoppingBag size={20} color="#FF6B00" />
            <span style={{ fontWeight: 800, fontSize: "1.05rem", color: "#FFF5E6" }}>
              Your Cart
            </span>
            {totalItems > 0 && (
              <span style={{
                background: "linear-gradient(135deg,#FF6B00,#FF3D00)",
                color: "#fff", fontSize: "0.7rem", fontWeight: 800,
                padding: "0.15rem 0.5rem", borderRadius: 100,
              }}>
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            {items.length > 0 && (
              <button
                onClick={() => dispatch(clearCart())}
                style={{ background: "rgba(255,61,0,0.1)", border: "1px solid rgba(255,61,0,0.2)", borderRadius: 8, color: "#FF6B00", fontSize: "0.7rem", fontWeight: 700, padding: "0.3rem 0.7rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem" }}
              >
                <Trash2 size={11} /> Clear
              </button>
            )}
            <button
              onClick={onClose}
              style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid rgba(255,245,230,0.12)", background: "rgba(255,255,255,0.05)", color: "#FFF5E6", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.4rem" }}>
          {items.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60%", gap: "1rem" }}>
              <ShoppingCart size={56} color="rgba(255,107,0,0.2)" />
              <p style={{ color: "rgba(255,245,230,0.4)", fontSize: "0.9rem", fontWeight: 500 }}>Your cart is empty</p>
              <button
                onClick={onClose}
                style={{ background: "linear-gradient(135deg,#FF6B00,#FF3D00)", border: "none", borderRadius: 10, color: "#fff", fontWeight: 700, fontSize: "0.85rem", padding: "0.6rem 1.4rem", cursor: "pointer" }}
              >
                Shop Now 🎆
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {items.map(item => (
                <div key={item._id} style={{
                  display: "flex", gap: "0.85rem", alignItems: "center",
                  background: "rgba(255,107,0,0.04)", border: "1px solid rgba(255,107,0,0.1)",
                  borderRadius: 14, padding: "0.75rem",
                }}>
                  {/* Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: 64, height: 64, borderRadius: 10, objectFit: "cover", flexShrink: 0, border: "1px solid rgba(255,107,0,0.15)" }}
                  />
                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#FFF5E6", lineHeight: 1.3, marginBottom: "0.2rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "rgba(255,245,230,0.45)", marginBottom: "0.5rem" }}>
                      ₹{item.price} × {item.quantity}
                    </div>
                    {/* Qty controls */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", background: "rgba(255,107,0,0.1)", border: "1px solid rgba(255,107,0,0.2)", borderRadius: 8, overflow: "hidden" }}>
                        <button
                          onClick={() => item.quantity > 1 ? dispatch(updateQty({ id: item._id, quantity: item.quantity - 1 })) : dispatch(removeFromCart(item._id))}
                          style={{ width: 28, height: 28, border: "none", background: "transparent", color: "#FF6B00", fontWeight: 800, fontSize: "1rem", cursor: "pointer" }}
                        >−</button>
                        <CartQtyInput item={item} />
                        <button
                          onClick={() => { const max = Math.min(99, item.stock || 99); if (item.quantity < max) dispatch(updateQty({ id: item._id, quantity: item.quantity + 1 })); }}
                          disabled={item.quantity >= Math.min(99, item.stock || 99)}
                          style={{ width: 28, height: 28, border: "none", background: "transparent", color: item.quantity >= Math.min(99, item.stock || 99) ? "rgba(255,107,0,0.25)" : "#FF6B00", fontWeight: 800, fontSize: "1rem", cursor: item.quantity >= Math.min(99, item.stock || 99) ? "not-allowed" : "pointer" }}
                        >+</button>
                      </div>
                      <span style={{ fontWeight: 800, color: "#FFD700", fontSize: "0.9rem" }}>
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  {/* Remove */}
                  <button
                    onClick={() => dispatch(removeFromCart(item._id))}
                    style={{ width: 28, height: 28, border: "none", background: "rgba(255,61,0,0.08)", borderRadius: "50%", color: "rgba(255,107,0,0.6)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: "1rem 1.4rem 1.4rem", borderTop: "1px solid rgba(255,107,0,0.12)", background: "rgba(255,107,0,0.04)" }}>
            {savings > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.78rem", color: "rgba(255,245,230,0.5)" }}>You save</span>
                <span style={{ fontSize: "0.78rem", color: "#2ECC71", fontWeight: 700 }}>₹{savings.toLocaleString()}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.85rem", color: "rgba(255,245,230,0.6)", fontWeight: 500 }}>
                Total ({totalItems} {totalItems === 1 ? "item" : "items"})
              </span>
              <span style={{ fontSize: "1.3rem", fontWeight: 800, color: "#FFD700" }}>
                ₹{total.toLocaleString()}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              style={{
                width: "100%", padding: "0.9rem", border: "none", borderRadius: 14,
                background: "linear-gradient(135deg,#FF6B00,#FF3D00)",
                color: "#fff", fontWeight: 800, fontSize: "1rem",
                cursor: "pointer", boxShadow: "0 4px 20px rgba(255,107,0,0.45)",
                fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.02em",
                transition: "transform .15s, box-shadow .15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(255,107,0,0.6)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(255,107,0,0.45)"; }}
            >
              Proceed to Checkout →
            </button>
            <p style={{ textAlign: "center", fontSize: "0.7rem", color: "rgba(255,245,230,0.3)", marginTop: "0.6rem" }}>
              Free delivery on orders above ₹999
            </p>
          </div>
        )}
      </div>
    </>
  );
}
