import { useState, useEffect, useRef } from "react";
import {
  Plus, Pencil, Trash2, X, Upload, Loader2,
  LogOut, Package, ImageIcon, CheckCircle2, AlertCircle
} from "lucide-react";
import toast from "react-hot-toast";

// ── Config ────────────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "sparknest@admin2025";
const API            = import.meta.env.PROD ? "" : "http://localhost:5000";

const CATEGORIES = [
  "Sparklers","Rockets","Bombs","Flower Pots",
  "Sky Shots","Kids Special","Combo Packs","Gift Boxes",
];

const EMPTY_FORM = {
  name:"", slug:"", description:"", price:"", originalPrice:"",
  category:"Sparklers", stock:"", isFeatured:false, isSafeForKids:false,
  tags:"", image:"",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const toSlug = str => str.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");

// ── Sub-components ────────────────────────────────────────────────────────────
function Label({ children, required }) {
  return (
    <label style={{ fontSize:"0.72rem", fontWeight:700, color:"rgba(255,245,230,0.55)", textTransform:"uppercase", letterSpacing:"0.06em", display:"block", marginBottom:"0.4rem" }}>
      {children}{required && <span style={{ color:"#FF6B00", marginLeft:3 }}>*</span>}
    </label>
  );
}

function Input({ style, ...props }) {
  return (
    <input
      {...props}
      style={{ width:"100%", padding:"0.7rem 0.9rem", background:"rgba(255,255,255,0.06)", border:"1.5px solid rgba(255,107,0,0.2)", borderRadius:10, color:"#FFF5E6", fontFamily:"'Source Sans 3',sans-serif", fontSize:"0.95rem", outline:"none", boxSizing:"border-box", ...style }}
      onFocus={e => e.target.style.borderColor="rgba(255,107,0,0.6)"}
      onBlur={e  => e.target.style.borderColor="rgba(255,107,0,0.2)"}
    />
  );
}

function Textarea({ style, ...props }) {
  return (
    <textarea
      {...props}
      style={{ width:"100%", padding:"0.7rem 0.9rem", background:"rgba(255,255,255,0.06)", border:"1.5px solid rgba(255,107,0,0.2)", borderRadius:10, color:"#FFF5E6", fontFamily:"'Source Sans 3',sans-serif", fontSize:"0.95rem", outline:"none", boxSizing:"border-box", resize:"vertical", ...style }}
      onFocus={e => e.target.style.borderColor="rgba(255,107,0,0.6)"}
      onBlur={e  => e.target.style.borderColor="rgba(255,107,0,0.2)"}
    />
  );
}

function Select({ children, style, ...props }) {
  return (
    <select
      {...props}
      style={{ width:"100%", padding:"0.7rem 0.9rem", background:"#1a0800", border:"1.5px solid rgba(255,107,0,0.2)", borderRadius:10, color:"#FFF5E6", fontFamily:"'Source Sans 3',sans-serif", fontSize:"0.95rem", outline:"none", boxSizing:"border-box", appearance:"none", ...style }}
      onFocus={e => e.target.style.borderColor="rgba(255,107,0,0.6)"}
      onBlur={e  => e.target.style.borderColor="rgba(255,107,0,0.2)"}
    >
      {children}
    </select>
  );
}

// ── Image Upload Zone ─────────────────────────────────────────────────────────
function ImageUpload({ currentImage, onUpload, uploading, setUploading }) {
  const fileRef = useRef();
  const [preview, setPreview] = useState(currentImage || "");

  useEffect(() => { setPreview(currentImage || ""); }, [currentImage]);

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Only image files allowed"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }

    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      // Upload a temp product to get the Cloudinary URL back
      // We use a dedicated upload endpoint
      const res  = await fetch(`${API}/api/products/upload-image`, {
        method: "POST",
        body:   formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      setPreview(data.url);
      onUpload(data.url);
      toast.success("Image uploaded!");
    } catch (err) {
      toast.error(err.message || "Upload failed");
      setPreview(currentImage || "");
    } finally {
      setUploading(false);
    }
  };

  const onDrop = e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); };

  return (
    <div>
      <Label>Product Image</Label>
      <div
        onClick={() => !uploading && fileRef.current.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={onDrop}
        style={{ border:"2px dashed rgba(255,107,0,0.3)", borderRadius:12, padding:"1.2rem", textAlign:"center", cursor: uploading ? "not-allowed" : "pointer", background:"rgba(255,107,0,0.03)", transition:"border-color .2s", position:"relative", minHeight:140 }}
        onMouseEnter={e => e.currentTarget.style.borderColor="rgba(255,107,0,0.6)"}
        onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,107,0,0.3)"}
      >
        {uploading ? (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"0.5rem", padding:"1rem 0" }}>
            <Loader2 size={28} color="#FF6B00" style={{ animation:"spin 1s linear infinite" }} />
            <p style={{ color:"rgba(255,245,230,0.6)", fontSize:"0.85rem", margin:0 }}>Uploading to Cloudinary…</p>
          </div>
        ) : preview ? (
          <div style={{ position:"relative" }}>
            <img src={preview} alt="preview" style={{ width:"100%", maxHeight:160, objectFit:"cover", borderRadius:8 }} />
            <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.4)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", opacity:0, transition:"opacity .2s" }}
              onMouseEnter={e => e.currentTarget.style.opacity=1}
              onMouseLeave={e => e.currentTarget.style.opacity=0}>
              <p style={{ color:"#fff", fontWeight:700, fontSize:"0.85rem" }}>Click to replace</p>
            </div>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"0.5rem", padding:"0.5rem 0" }}>
            <Upload size={28} color="rgba(255,107,0,0.6)" />
            <p style={{ color:"rgba(255,245,230,0.6)", fontSize:"0.85rem", margin:0 }}>Click or drag & drop image here</p>
            <p style={{ color:"rgba(255,245,230,0.35)", fontSize:"0.75rem", margin:0 }}>JPG, PNG, WebP · Max 5MB</p>
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => handleFile(e.target.files[0])} />
    </div>
  );
}

// ── Product Form Modal ────────────────────────────────────────────────────────
function ProductModal({ product, onClose, onSaved }) {
  const isEdit   = !!product?._id;
  const [form, setForm]         = useState(isEdit ? {
    ...product,
    price:         String(product.price),
    originalPrice: String(product.originalPrice || ""),
    stock:         String(product.stock),
    tags:          (product.tags || []).join(", "),
  } : EMPTY_FORM);
  const [saving,    setSaving]    = useState(false);
  const [uploading, setUploading] = useState(false);

  const onChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "name" && !isEdit ? { slug: toSlug(value) } : {}),
    }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.stock || !form.description) {
      toast.error("Fill all required fields"); return;
    }
    if (!form.image) { toast.error("Please upload a product image"); return; }

    setSaving(true);
    try {
      const payload = {
        name:          form.name,
        slug:          form.slug || toSlug(form.name),
        description:   form.description,
        price:         Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        category:      form.category,
        stock:         Number(form.stock),
        isFeatured:    form.isFeatured,
        isSafeForKids: form.isSafeForKids,
        tags:          form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
        image:         form.image,
      };

      const url    = isEdit ? `${API}/api/products/${product._id}` : `${API}/api/products`;
      const method = isEdit ? "PATCH" : "POST";

      const res  = await fetch(url, {
        method,
        headers: { "Content-Type":"application/json" },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save");

      toast.success(isEdit ? "Product updated!" : "Product created!");
      onSaved();
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:1000, background:"rgba(0,0,0,0.75)", backdropFilter:"blur(6px)", display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"1rem", overflowY:"auto" }}>
      <div style={{ background:"linear-gradient(160deg,#1A0800,#0D0500)", border:"1px solid rgba(255,107,0,0.2)", borderRadius:20, width:"100%", maxWidth:680, margin:"auto", padding:"1.8rem" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem" }}>
          <h2 style={{ color:"#FFF5E6", fontFamily:"'Libre Baskerville',serif", fontSize:"1.2rem", margin:0 }}>
            {isEdit ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.06)", border:"none", borderRadius:8, padding:"0.4rem", cursor:"pointer", color:"rgba(255,245,230,0.6)", display:"flex" }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
          {/* Name */}
          <div style={{ gridColumn:"1/-1" }}>
            <Label required>Product Name</Label>
            <Input name="name" value={form.name} onChange={onChange} placeholder="e.g. Golden Sparklers Pack" />
          </div>

          {/* Slug */}
          <div style={{ gridColumn:"1/-1" }}>
            <Label>Slug (auto-generated)</Label>
            <Input name="slug" value={form.slug} onChange={onChange} placeholder="golden-sparklers-pack" />
          </div>

          {/* Description */}
          <div style={{ gridColumn:"1/-1" }}>
            <Label required>Description</Label>
            <Textarea name="description" value={form.description} onChange={onChange} rows={3} placeholder="Describe the product…" />
          </div>

          {/* Price */}
          <div>
            <Label required>Price (₹)</Label>
            <Input name="price" value={form.price} onChange={onChange} type="number" placeholder="299" />
          </div>

          {/* Original Price */}
          <div>
            <Label>Original Price (₹)</Label>
            <Input name="originalPrice" value={form.originalPrice} onChange={onChange} type="number" placeholder="399 (optional)" />
          </div>

          {/* Category */}
          <div>
            <Label required>Category</Label>
            <Select name="category" value={form.category} onChange={onChange}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </div>

          {/* Stock */}
          <div>
            <Label required>Stock</Label>
            <Input name="stock" value={form.stock} onChange={onChange} type="number" placeholder="50" />
          </div>

          {/* Tags */}
          <div style={{ gridColumn:"1/-1" }}>
            <Label>Tags (comma separated)</Label>
            <Input name="tags" value={form.tags} onChange={onChange} placeholder="sparkler, golden, diwali" />
          </div>

          {/* Checkboxes */}
          <div style={{ gridColumn:"1/-1", display:"flex", gap:"1.5rem" }}>
            {[["isFeatured","⭐ Featured"],["isSafeForKids","🧒 Safe for Kids"]].map(([key, label]) => (
              <label key={key} style={{ display:"flex", alignItems:"center", gap:"0.5rem", cursor:"pointer", color:"rgba(255,245,230,0.75)", fontSize:"0.9rem", fontWeight:600 }}>
                <input type="checkbox" name={key} checked={!!form[key]} onChange={onChange} style={{ width:16, height:16, accentColor:"#FF6B00" }} />
                {label}
              </label>
            ))}
          </div>

          {/* Image Upload */}
          <div style={{ gridColumn:"1/-1" }}>
            <ImageUpload
              currentImage={form.image}
              onUpload={url => setForm(f => ({ ...f, image: url }))}
              uploading={uploading}
              setUploading={setUploading}
            />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display:"flex", gap:"0.75rem", marginTop:"1.5rem" }}>
          <button onClick={onClose} style={{ flex:1, padding:"0.8rem", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,107,0,0.2)", borderRadius:10, color:"rgba(255,245,230,0.7)", fontWeight:700, cursor:"pointer", fontFamily:"'Source Sans 3',sans-serif" }}>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={saving || uploading} style={{ flex:2, padding:"0.8rem", background: saving ? "rgba(255,107,0,0.4)" : "linear-gradient(135deg,#FF6B00,#FF3D00)", border:"none", borderRadius:10, color:"#fff", fontWeight:800, cursor: saving ? "not-allowed" : "pointer", fontFamily:"'Source Sans 3',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem", boxShadow: saving ? "none" : "0 4px 16px rgba(255,107,0,0.4)" }}>
            {saving ? <><Loader2 size={16} style={{ animation:"spin 1s linear infinite" }} /> Saving…</> : isEdit ? "Save Changes" : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete Confirm ────────────────────────────────────────────────────────────
function DeleteConfirm({ product, onClose, onDeleted }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`${API}/api/products/${product._id}`, { method:"DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Product deleted");
      onDeleted();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:1001, background:"rgba(0,0,0,0.8)", display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem" }}>
      <div style={{ background:"linear-gradient(160deg,#1A0800,#0D0500)", border:"1px solid rgba(255,60,0,0.3)", borderRadius:16, padding:"1.8rem", maxWidth:400, width:"100%", textAlign:"center" }}>
        <AlertCircle size={40} color="#FF3D00" style={{ marginBottom:"1rem" }} />
        <h3 style={{ color:"#FFF5E6", fontFamily:"'Libre Baskerville',serif", margin:"0 0 0.5rem" }}>Delete Product?</h3>
        <p style={{ color:"rgba(255,245,230,0.6)", fontSize:"0.9rem", margin:"0 0 1.5rem" }}>
          <strong style={{ color:"#FFF5E6" }}>{product.name}</strong> will be permanently deleted along with its image from Cloudinary.
        </p>
        <div style={{ display:"flex", gap:"0.75rem" }}>
          <button onClick={onClose} style={{ flex:1, padding:"0.75rem", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, color:"rgba(255,245,230,0.7)", fontWeight:700, cursor:"pointer", fontFamily:"'Source Sans 3',sans-serif" }}>Cancel</button>
          <button onClick={handleDelete} disabled={deleting} style={{ flex:1, padding:"0.75rem", background:"#FF3D00", border:"none", borderRadius:10, color:"#fff", fontWeight:800, cursor: deleting ? "not-allowed" : "pointer", fontFamily:"'Source Sans 3',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:"0.4rem" }}>
            {deleting ? <Loader2 size={15} style={{ animation:"spin 1s linear infinite" }} /> : <Trash2 size={15} />}
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Login Gate ────────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }) {
  const [pw, setPw]       = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (pw === ADMIN_PASSWORD) { onLogin(); setError(""); }
    else setError("Incorrect password");
  };

  return (
    <div style={{ minHeight:"100vh", background:"#0D0600", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Source Sans 3',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@700&family=Source+Sans+3:wght@400;600;700;800&display=swap');`}</style>
      <div style={{ background:"linear-gradient(160deg,#1A0800,#0D0500)", border:"1px solid rgba(255,107,0,0.2)", borderRadius:20, padding:"2.5rem", width:"100%", maxWidth:380, textAlign:"center" }}>
        <div style={{ fontSize:"3rem", marginBottom:"0.75rem" }}>🔐</div>
        <h1 style={{ fontFamily:"'Libre Baskerville',serif", color:"#FFF5E6", fontSize:"1.4rem", margin:"0 0 0.4rem" }}>Admin Panel</h1>
        <p style={{ color:"rgba(255,245,230,0.45)", fontSize:"0.85rem", margin:"0 0 1.8rem" }}>SparkNest · Sivakasi</p>
        <input
          type="password"
          value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleLogin()}
          placeholder="Enter admin password"
          style={{ width:"100%", padding:"0.85rem 1rem", background:"rgba(255,255,255,0.06)", border:`1.5px solid ${error ? "#FF3D00" : "rgba(255,107,0,0.2)"}`, borderRadius:12, color:"#FFF5E6", fontFamily:"'Source Sans 3',sans-serif", fontSize:"1rem", outline:"none", boxSizing:"border-box", marginBottom:"0.5rem" }}
        />
        {error && <p style={{ color:"#FF3D00", fontSize:"0.82rem", margin:"0 0 0.75rem" }}>{error}</p>}
        <button onClick={handleLogin} style={{ width:"100%", padding:"0.85rem", background:"linear-gradient(135deg,#FF6B00,#FF3D00)", border:"none", borderRadius:12, color:"#fff", fontWeight:800, fontSize:"1rem", cursor:"pointer", boxShadow:"0 4px 20px rgba(255,107,0,0.5)", fontFamily:"'Source Sans 3',sans-serif", marginTop: error ? 0 : "0.75rem" }}>
          Login
        </button>
      </div>
    </div>
  );
}

// ── Main Admin Panel ──────────────────────────────────────────────────────────
export default function AdminPanel() {
  const [authed,    setAuthed]    = useState(() => sessionStorage.getItem("sn_admin") === "1");
  const [products,  setProducts]  = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [modal,     setModal]     = useState(null); // null | "add" | product object
  const [delTarget, setDelTarget] = useState(null);
  const [search,    setSearch]    = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/products?limit=100`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch { toast.error("Failed to load products"); }
    finally  { setLoading(false); }
  };

  useEffect(() => { if (authed) fetchProducts(); }, [authed]);

  const handleLogin = () => { sessionStorage.setItem("sn_admin","1"); setAuthed(true); };
  const handleLogout = () => { sessionStorage.removeItem("sn_admin"); setAuthed(false); };

  if (!authed) return <AdminLogin onLogin={handleLogin} />;

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight:"100vh", background:"#0D0600", fontFamily:"'Source Sans 3',sans-serif", paddingTop:68 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Source+Sans+3:wght@300;400;600;700;800&display=swap');
        @keyframes spin { to { transform:rotate(360deg); } }
        .prod-row:hover { background:rgba(255,107,0,0.04) !important; }
        @media(max-width:700px){ .admin-table th:nth-child(3), .admin-table td:nth-child(3), .admin-table th:nth-child(5), .admin-table td:nth-child(5) { display:none; } }
      `}</style>

      {/* ── Top bar ── */}
      <div style={{ background:"rgba(8,4,0,0.95)", borderBottom:"1px solid rgba(255,107,0,0.15)", padding:"0 clamp(1rem,4vw,2.5rem)", height:68, display:"flex", alignItems:"center", justifyContent:"space-between", position:"fixed", top:0, left:0, right:0, zIndex:200 }}>
        <div style={{ display:"flex", alignItems:"center", gap:"0.7rem" }}>
          <Package size={20} color="#FF6B00" />
          <span style={{ fontFamily:"'Libre Baskerville',serif", color:"#FFD700", fontSize:"1.1rem", fontWeight:700 }}>SparkNest Admin</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
          <span style={{ color:"rgba(255,245,230,0.45)", fontSize:"0.8rem" }}>{products.length} products</span>
          <button onClick={handleLogout} style={{ display:"flex", alignItems:"center", gap:"0.4rem", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,107,0,0.2)", borderRadius:8, padding:"0.45rem 0.9rem", color:"rgba(255,245,230,0.65)", fontWeight:700, fontSize:"0.8rem", cursor:"pointer", fontFamily:"'Source Sans 3',sans-serif" }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"2rem 1rem" }}>

        {/* ── Actions bar ── */}
        <div style={{ display:"flex", gap:"0.75rem", marginBottom:"1.5rem", flexWrap:"wrap" }}>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products…"
            style={{ flex:1, minWidth:200, padding:"0.7rem 1rem", background:"rgba(255,255,255,0.05)", border:"1.5px solid rgba(255,107,0,0.2)", borderRadius:10, color:"#FFF5E6", fontFamily:"'Source Sans 3',sans-serif", fontSize:"0.95rem", outline:"none" }}
          />
          <button onClick={() => setModal("add")} style={{ display:"flex", alignItems:"center", gap:"0.4rem", padding:"0.7rem 1.4rem", background:"linear-gradient(135deg,#FF6B00,#FF3D00)", border:"none", borderRadius:10, color:"#fff", fontWeight:800, fontSize:"0.9rem", cursor:"pointer", fontFamily:"'Source Sans 3',sans-serif", boxShadow:"0 4px 16px rgba(255,107,0,0.4)", whiteSpace:"nowrap" }}>
            <Plus size={17} /> Add Product
          </button>
        </div>

        {/* ── Products Table ── */}
        {loading ? (
          <div style={{ textAlign:"center", padding:"4rem 0" }}>
            <Loader2 size={36} color="#FF6B00" style={{ animation:"spin 1s linear infinite" }} />
            <p style={{ color:"rgba(255,245,230,0.5)", marginTop:"1rem" }}>Loading products…</p>
          </div>
        ) : (
          <div style={{ background:"rgba(255,107,0,0.02)", border:"1px solid rgba(255,107,0,0.1)", borderRadius:16, overflow:"hidden" }}>
            <table className="admin-table" style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ borderBottom:"1px solid rgba(255,107,0,0.12)", background:"rgba(255,107,0,0.05)" }}>
                  {["Image","Name","Category","Price","Stock","Actions"].map(h => (
                    <th key={h} style={{ padding:"0.9rem 1rem", textAlign:"left", fontSize:"0.7rem", fontWeight:700, color:"rgba(255,245,230,0.45)", textTransform:"uppercase", letterSpacing:"0.08em", whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign:"center", padding:"3rem", color:"rgba(255,245,230,0.4)", fontSize:"0.9rem" }}>
                      No products found
                    </td>
                  </tr>
                ) : filtered.map(p => (
                  <tr key={p._id} className="prod-row" style={{ borderBottom:"1px solid rgba(255,107,0,0.07)", transition:"background .15s" }}>
                    <td style={{ padding:"0.75rem 1rem" }}>
                      {p.image
                        ? <img src={p.image} alt={p.name} style={{ width:48, height:48, objectFit:"cover", borderRadius:8, border:"1px solid rgba(255,107,0,0.15)" }} />
                        : <div style={{ width:48, height:48, borderRadius:8, background:"rgba(255,107,0,0.08)", display:"flex", alignItems:"center", justifyContent:"center" }}><ImageIcon size={18} color="rgba(255,107,0,0.4)" /></div>
                      }
                    </td>
                    <td style={{ padding:"0.75rem 1rem" }}>
                      <p style={{ color:"#FFF5E6", fontWeight:700, fontSize:"0.9rem", margin:"0 0 0.2rem" }}>{p.name}</p>
                      <div style={{ display:"flex", gap:"0.4rem", flexWrap:"wrap" }}>
                        {p.isFeatured    && <span style={{ fontSize:"0.62rem", background:"rgba(255,215,0,0.15)", color:"#FFD700", border:"1px solid rgba(255,215,0,0.3)", borderRadius:4, padding:"0.1rem 0.4rem", fontWeight:700 }}>⭐ Featured</span>}
                        {p.isSafeForKids && <span style={{ fontSize:"0.62rem", background:"rgba(46,204,113,0.12)", color:"#2ECC71", border:"1px solid rgba(46,204,113,0.3)", borderRadius:4, padding:"0.1rem 0.4rem", fontWeight:700 }}>🧒 Kids</span>}
                      </div>
                    </td>
                    <td style={{ padding:"0.75rem 1rem", color:"rgba(255,245,230,0.6)", fontSize:"0.85rem" }}>{p.category}</td>
                    <td style={{ padding:"0.75rem 1rem" }}>
                      <p style={{ color:"#FFD700", fontWeight:700, fontSize:"0.95rem", margin:0 }}>₹{p.price.toLocaleString()}</p>
                      {p.originalPrice && <p style={{ color:"rgba(255,245,230,0.35)", fontSize:"0.75rem", textDecoration:"line-through", margin:0 }}>₹{p.originalPrice.toLocaleString()}</p>}
                    </td>
                    <td style={{ padding:"0.75rem 1rem" }}>
                      <span style={{ color: p.stock < 10 ? "#FF3D00" : p.stock < 30 ? "#FFD700" : "#2ECC71", fontWeight:700, fontSize:"0.9rem" }}>{p.stock}</span>
                    </td>
                    <td style={{ padding:"0.75rem 1rem" }}>
                      <div style={{ display:"flex", gap:"0.5rem" }}>
                        <button onClick={() => setModal(p)} style={{ display:"flex", alignItems:"center", gap:"0.3rem", padding:"0.4rem 0.8rem", background:"rgba(255,107,0,0.1)", border:"1px solid rgba(255,107,0,0.25)", borderRadius:8, color:"#FF6B00", fontWeight:700, fontSize:"0.78rem", cursor:"pointer", fontFamily:"'Source Sans 3',sans-serif" }}>
                          <Pencil size={13} /> Edit
                        </button>
                        <button onClick={() => setDelTarget(p)} style={{ display:"flex", alignItems:"center", gap:"0.3rem", padding:"0.4rem 0.8rem", background:"rgba(255,61,0,0.08)", border:"1px solid rgba(255,61,0,0.2)", borderRadius:8, color:"#FF3D00", fontWeight:700, fontSize:"0.78rem", cursor:"pointer", fontFamily:"'Source Sans 3',sans-serif" }}>
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {modal && (
        <ProductModal
          product={modal === "add" ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); fetchProducts(); }}
        />
      )}
      {delTarget && (
        <DeleteConfirm
          product={delTarget}
          onClose={() => setDelTarget(null)}
          onDeleted={() => { setDelTarget(null); fetchProducts(); }}
        />
      )}
    </div>
  );
}
