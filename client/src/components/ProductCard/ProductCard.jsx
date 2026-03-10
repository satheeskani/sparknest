import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ShoppingCart, Star } from "lucide-react";
import { addToCart } from "../../redux/slices/cartSlice";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleAdd = () => {
    dispatch(addToCart(product));
    toast.success(`${product.name} added! 🛒`);
  };

  return (
    <div style={{
      background: "#1A0F00",
      border: "1px solid rgba(255,107,0,0.08)",
      borderRadius: 20, overflow: "hidden",
      transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      cursor: "pointer",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = "translateY(-8px)";
      e.currentTarget.style.borderColor = "rgba(255,107,0,0.25)";
      e.currentTarget.style.boxShadow = "0 24px 60px rgba(0,0,0,0.4)";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.borderColor = "rgba(255,107,0,0.08)";
      e.currentTarget.style.boxShadow = "none";
    }}>
      {/* Image */}
      <Link to={`/products/${product._id}`} style={{ textDecoration: "none" }}>
        <div style={{
          width: "100%", height: 180,
          background: "linear-gradient(135deg, #1a0f00, #2a1500)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "3.5rem", position: "relative",
        }}>
          {product.images?.[0]
            ? <img src={product.images[0]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <span>🎆</span>
          }
          {discount > 0 && (
            <span style={{
              position: "absolute", top: 10, left: 10,
              background: "#FF3D00", color: "white",
              fontSize: "0.7rem", fontWeight: 700,
              padding: "0.25rem 0.7rem", borderRadius: 100,
            }}>{discount}% OFF</span>
          )}
          {product.isSafeForKids && (
            <span style={{
              position: "absolute", top: 10, right: 10,
              background: "rgba(34,197,94,0.15)",
              border: "1px solid rgba(34,197,94,0.3)",
              color: "#4ade80", fontSize: "0.65rem", fontWeight: 600,
              padding: "0.25rem 0.6rem", borderRadius: 100,
            }}>Kids Safe</span>
          )}
        </div>
      </Link>

      {/* Info */}
      <div style={{ padding: "1.2rem" }}>
        <div style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#FF6B00", marginBottom: "0.4rem" }}>
          {product.category}
        </div>
        <Link to={`/products/${product._id}`} style={{ textDecoration: "none" }}>
          <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "#FFF5E6", marginBottom: "0.8rem", lineHeight: 1.4 }}>
            {product.name}
          </div>
        </Link>

        {/* Rating */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", marginBottom: "0.8rem" }}>
          <Star size={14} fill="#FFD700" color="#FFD700" />
          <span style={{ fontSize: "0.8rem", color: "rgba(255,245,230,0.6)" }}>
            {product.rating?.toFixed(1) || "New"} ({product.numReviews})
          </span>
        </div>

        {/* Price + Add */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "#FFD700" }}>
              ₹{product.discountPrice || product.price}
            </span>
            {discount > 0 && (
              <span style={{ fontSize: "0.8rem", color: "rgba(255,245,230,0.3)", textDecoration: "line-through" }}>
                ₹{product.price}
              </span>
            )}
          </div>
          <button onClick={handleAdd} disabled={product.stock === 0} style={{
            background: "rgba(255,107,0,0.1)",
            border: "1px solid rgba(255,107,0,0.25)",
            color: "#FF6B00", width: 36, height: 36,
            borderRadius: 10, display: "flex", alignItems: "center",
            justifyContent: "center", cursor: "pointer",
            transition: "all 0.3s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#FF6B00"; e.currentTarget.style.color = "white"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,107,0,0.1)"; e.currentTarget.style.color = "#FF6B00"; }}
          >
            <ShoppingCart size={16} />
          </button>
        </div>
        {product.stock === 0 && <p style={{ color: "#FF3D00", fontSize: "0.75rem", marginTop: "0.5rem" }}>Out of Stock</p>}
      </div>
    </div>
  );
}