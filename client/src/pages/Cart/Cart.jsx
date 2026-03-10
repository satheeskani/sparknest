import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQty, clearCart } from "../../redux/slices/cartSlice";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Cart() {
  const { items } = useSelector((s) => s.cart);
  const dispatch = useDispatch();
  const total = items.reduce((acc, i) => acc + (i.discountPrice || i.price) * i.quantity, 0);
  const shipping = total > 999 ? 0 : 99;

  if (items.length === 0)
    return (
      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "1.5rem",
        color: "rgba(255,245,230,0.3)", position: "relative", zIndex: 2,
      }}>
        <ShoppingBag size={64} style={{ opacity: 0.2 }} />
        <p style={{ fontSize: "1.5rem", fontFamily: "'Cinzel Decorative', serif" }}>Your cart is empty!</p>
        <Link to="/products" style={{
          background: "linear-gradient(135deg, #FF6B00, #FF3D00)",
          color: "white", padding: "0.9rem 2.5rem",
          borderRadius: 100, textDecoration: "none",
          fontFamily: "'Outfit', sans-serif", fontWeight: 600,
        }}>Shop Now 🎆</Link>
      </div>
    );

  return (
    <div style={{ paddingTop: "6rem", minHeight: "100vh", position: "relative", zIndex: 2 }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 4rem" }}>
        <h1 style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: "2rem", marginBottom: "2rem", color: "#FFF5E6" }}>
          Your Cart 🛒
        </h1>

        {/* Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
          {items.map((item) => (
            <div key={item._id} style={{
              background: "#1A0F00", border: "1px solid rgba(255,107,0,0.1)",
              borderRadius: 16, padding: "1rem 1.2rem",
              display: "flex", alignItems: "center", gap: "1rem",
            }}>
              {/* Image */}
              <div style={{
                width: 72, height: 72,
                background: "linear-gradient(135deg, #2a1500, #1a0f00)",
                borderRadius: 12, display: "flex",
                alignItems: "center", justifyContent: "center", fontSize: "2rem",
                flexShrink: 0,
              }}>
                {item.images?.[0] ? <img src={item.images[0]} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 12 }} /> : "🎆"}
              </div>

              {/* Name + Price */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: "#FFF5E6", marginBottom: "0.3rem" }}>{item.name}</div>
                <div style={{ color: "#FFD700", fontWeight: 700 }}>₹{item.discountPrice || item.price}</div>
              </div>

              {/* Qty Controls */}
              <div style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: "0.3rem 0.5rem",
              }}>
                <button onClick={() => item.quantity > 1
                  ? dispatch(updateQty({ id: item._id, quantity: item.quantity - 1 }))
                  : dispatch(removeFromCart(item._id))}
                  style={{ background: "none", border: "none", color: "#FFF5E6", cursor: "pointer", padding: "0.2rem" }}>
                  <Minus size={14} />
                </button>
                <span style={{ width: 28, textAlign: "center", fontWeight: 600 }}>{item.quantity}</span>
                <button onClick={() => dispatch(updateQty({ id: item._id, quantity: item.quantity + 1 }))}
                  style={{ background: "none", border: "none", color: "#FFF5E6", cursor: "pointer", padding: "0.2rem" }}>
                  <Plus size={14} />
                </button>
              </div>

              {/* Delete */}
              <button onClick={() => { dispatch(removeFromCart(item._id)); toast.success("Removed!"); }}
                style={{ background: "none", border: "none", color: "rgba(255,245,230,0.3)", cursor: "pointer", transition: "color 0.3s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#FF3D00"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,245,230,0.3)"}>
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div style={{
          background: "#1A0F00", border: "1px solid rgba(255,107,0,0.15)",
          borderRadius: 20, padding: "1.5rem 2rem",
        }}>
          <h2 style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: "1.2rem", marginBottom: "1.2rem", color: "#FFF5E6" }}>
            Order Summary
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem", marginBottom: "1.2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "rgba(255,245,230,0.5)" }}>
              <span>Subtotal</span><span style={{ color: "#FFF5E6" }}>₹{total}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "rgba(255,245,230,0.5)" }}>
              <span>Shipping</span>
              <span style={{ color: shipping === 0 ? "#4ade80" : "#FFF5E6" }}>{shipping === 0 ? "FREE 🎉" : `₹${shipping}`}</span>
            </div>
            {shipping > 0 && <p style={{ fontSize: "0.75rem", color: "rgba(255,245,230,0.3)" }}>Add ₹{999 - total} more for free shipping!</p>}
          </div>
          <div style={{
            display: "flex", justifyContent: "space-between",
            fontWeight: 700, fontSize: "1.2rem",
            borderTop: "1px solid rgba(255,107,0,0.1)",
            paddingTop: "1rem", marginBottom: "1.5rem",
          }}>
            <span style={{ color: "#FFF5E6" }}>Total</span>
            <span style={{ color: "#FFD700" }}>₹{total + shipping}</span>
          </div>
          <button style={{
            width: "100%",
            background: "linear-gradient(135deg, #FF6B00, #FF3D00)",
            border: "none", borderRadius: 12,
            padding: "1rem", color: "white",
            fontFamily: "'Outfit', sans-serif", fontSize: "1rem",
            fontWeight: 600, cursor: "pointer",
            boxShadow: "0 4px 20px rgba(255,107,0,0.3)",
          }}>
            Proceed to Checkout →
          </button>
        </div>
      </div>
    </div>
  );
}