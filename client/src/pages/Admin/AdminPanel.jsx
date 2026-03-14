import { useState, useEffect, useRef, useCallback } from "react";
import {
  Plus, Pencil, Trash2, X, Upload, Loader2, LogOut, Package,
  ImageIcon, Users, ShoppingBag, LayoutDashboard, Tag,
  TrendingUp, AlertCircle, RefreshCw, ChevronDown, Phone, Mail, MapPin, ContactRound
} from "lucide-react";
import toast from "react-hot-toast";

// ── Config ─────────────────────────────────────────────────────────────────────
const API = import.meta.env.VITE_API_URL || "";

const CATEGORIES    = ["Sparklers","Rockets","Bombs","Flower Pots","Sky Shots","Kids Special","Combo Packs","Gift Boxes"];
const CAT_COLORS    = { "Sparklers":"#FFD700","Rockets":"#FF6B00","Bombs":"#FF3D00","Flower Pots":"#2ECC71","Sky Shots":"#00BFFF","Kids Special":"#FF69B4","Combo Packs":"#7B2FBE","Gift Boxes":"#F39C12" };
const CAT_EMOJI     = { "Sparklers":"✨","Rockets":"🚀","Bombs":"💥","Flower Pots":"🌸","Sky Shots":"🎆","Kids Special":"🧒","Combo Packs":"📦","Gift Boxes":"🎁" };
const ORDER_STATUS  = ["Pending","Confirmed","Processing","Shipped","Delivered","Cancelled"];
const PAYMENT_STATUS= ["Pending","Screenshot Received","Confirmed","Failed"];

const STATUS_COLORS = {
  "Pending":             { bg:"rgba(255,215,0,0.12)",  text:"#FFD700",  border:"rgba(255,215,0,0.3)" },
  "Confirmed":           { bg:"rgba(46,204,113,0.12)", text:"#2ECC71",  border:"rgba(46,204,113,0.3)" },
  "Processing":          { bg:"rgba(0,191,255,0.12)",  text:"#00BFFF",  border:"rgba(0,191,255,0.3)" },
  "Shipped":             { bg:"rgba(123,47,190,0.12)", text:"#7B2FBE",  border:"rgba(123,47,190,0.3)" },
  "Delivered":           { bg:"rgba(46,204,113,0.18)", text:"#27AE60",  border:"rgba(46,204,113,0.4)" },
  "Cancelled":           { bg:"rgba(255,61,0,0.12)",   text:"#FF3D00",  border:"rgba(255,61,0,0.3)" },
  "Screenshot Received": { bg:"rgba(0,191,255,0.12)",  text:"#00BFFF",  border:"rgba(0,191,255,0.3)" },
  "Failed":              { bg:"rgba(255,61,0,0.12)",   text:"#FF3D00",  border:"rgba(255,61,0,0.3)" },
  "user":                { bg:"rgba(255,245,230,0.06)", text:"rgba(255,245,230,0.6)", border:"rgba(255,245,230,0.12)" },
  "admin":               { bg:"rgba(255,107,0,0.12)",  text:"#FF6B00",  border:"rgba(255,107,0,0.3)" },
};

const EMPTY_FORM = { name:"", slug:"", description:"", price:"", originalPrice:"", category:"Sparklers", stock:"", isFeatured:false, isSafeForKids:false, tags:"", image:"" };

// ── Helpers ────────────────────────────────────────────────────────────────────
const toSlug   = s => s.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const fmtPrice = n => `₹${Number(n||0).toLocaleString("en-IN")}`;
const fmtDate  = d => new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});

// Authenticated fetch — automatically attaches Bearer token
const authFetch = (url, options = {}, token) => {
  return fetch(`${API}${url}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};

// ── Shared UI ──────────────────────────────────────────────────────────────────
const S = {
  input: { width:"100%", padding:"0.7rem 0.9rem", background:"rgba(255,255,255,0.06)", border:"1.5px solid rgba(255,107,0,0.2)", borderRadius:10, color:"#FFF5E6", fontFamily:"'Source Sans 3',sans-serif", fontSize:"0.95rem", outline:"none", boxSizing:"border-box" },
  label: { fontSize:"0.7rem", fontWeight:700, color:"rgba(255,245,230,0.45)", textTransform:"uppercase", letterSpacing:"0.07em", display:"block", marginBottom:"0.35rem" },
  card:  { background:"rgba(255,107,0,0.03)", border:"1px solid rgba(255,107,0,0.12)", borderRadius:16, padding:"1.4rem" },
  th:    { padding:"0.8rem 1rem", textAlign:"left", fontSize:"0.67rem", fontWeight:700, color:"rgba(255,245,230,0.38)", textTransform:"uppercase", letterSpacing:"0.08em", whiteSpace:"nowrap" },
  td:    { padding:"0.72rem 1rem", borderBottom:"1px solid rgba(255,107,0,0.06)" },
};

function Badge({ status }) {
  const c = STATUS_COLORS[status] || { bg:"rgba(255,255,255,0.07)", text:"#FFF5E6", border:"rgba(255,255,255,0.12)" };
  return <span style={{ background:c.bg, color:c.text, border:`1px solid ${c.border}`, borderRadius:6, padding:"0.18rem 0.6rem", fontSize:"0.67rem", fontWeight:700, whiteSpace:"nowrap" }}>{status}</span>;
}

function StatCard({ icon, label, value, color="#FF6B00" }) {
  return (
    <div style={{ ...S.card, display:"flex", alignItems:"center", gap:"1rem" }}>
      <div style={{ width:46, height:46, borderRadius:14, background:`${color}18`, border:`1.5px solid ${color}30`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{icon}</div>
      <div>
        <p style={{ color:"rgba(255,245,230,0.45)", fontSize:"0.72rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", margin:"0 0 0.2rem" }}>{label}</p>
        <p style={{ color:"#FFF5E6", fontSize:"1.45rem", fontWeight:900, margin:0, lineHeight:1 }}>{value}</p>
      </div>
    </div>
  );
}

function Input(props)   { return <input    {...props} style={{ ...S.input, ...props.style }} onFocus={e=>e.target.style.borderColor="rgba(255,107,0,0.6)"} onBlur={e=>e.target.style.borderColor="rgba(255,107,0,0.2)"} />; }
function Textarea(props) { return <textarea {...props} style={{ ...S.input, resize:"vertical", ...props.style }} onFocus={e=>e.target.style.borderColor="rgba(255,107,0,0.6)"} onBlur={e=>e.target.style.borderColor="rgba(255,107,0,0.2)"} />; }
function FSelect({ children, ...props }) { return <select {...props} style={{ ...S.input, background:"#1a0800", appearance:"none", ...props.style }} onFocus={e=>e.target.style.borderColor="rgba(255,107,0,0.6)"} onBlur={e=>e.target.style.borderColor="rgba(255,107,0,0.2)"}>{children}</select>; }

function Btn({ children, variant="primary", style={}, ...props }) {
  const v = { primary:{ background:"linear-gradient(135deg,#FF6B00,#FF3D00)", color:"#fff", boxShadow:"0 4px 14px rgba(255,107,0,0.3)", border:"none" }, ghost:{ background:"rgba(255,255,255,0.04)", color:"rgba(255,245,230,0.65)", border:"1px solid rgba(255,107,0,0.18)" }, danger:{ background:"rgba(255,61,0,0.08)", color:"#FF3D00", border:"1px solid rgba(255,61,0,0.22)" } };
  return <button {...props} style={{ fontFamily:"'Source Sans 3',sans-serif", fontWeight:800, fontSize:"0.88rem", borderRadius:10, cursor:props.disabled?"not-allowed":"pointer", display:"flex", alignItems:"center", gap:"0.4rem", padding:"0.6rem 1.1rem", opacity:props.disabled?0.55:1, transition:"opacity .2s", ...v[variant], ...style }}>{children}</button>;
}

// ── Image Upload ───────────────────────────────────────────────────────────────
function ImageUpload({ currentImage, onUpload, uploading, setUploading, token }) {
  const fileRef = useRef();
  const [preview, setPreview] = useState(currentImage||"");
  useEffect(()=>{ setPreview(currentImage||""); },[currentImage]);

  const handleFile = async (file) => {
    if (!file||!file.type.startsWith("image/")){ toast.error("Images only"); return; }
    if (file.size>5*1024*1024){ toast.error("Max 5MB"); return; }
    setPreview(URL.createObjectURL(file)); setUploading(true);
    try {
      const fd = new FormData(); fd.append("image", file);
      const res  = await authFetch("/api/products/upload-image", { method:"POST", body:fd }, token);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setPreview(data.url); onUpload(data.url); toast.success("Uploaded!");
    } catch(err){ toast.error(err.message); setPreview(currentImage||""); }
    finally{ setUploading(false); }
  };

  return (
    <div>
      <label style={S.label}>Product Image</label>
      <div onClick={()=>!uploading&&fileRef.current.click()} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();handleFile(e.dataTransfer.files[0]);}}
        style={{ border:"2px dashed rgba(255,107,0,0.25)", borderRadius:12, padding:"1rem", textAlign:"center", cursor:uploading?"not-allowed":"pointer", background:"rgba(255,107,0,0.02)", minHeight:110 }}>
        {uploading ? <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:"0.4rem",padding:"0.8rem 0" }}><Loader2 size={24} color="#FF6B00" style={{ animation:"spin 1s linear infinite" }} /><p style={{ color:"rgba(255,245,230,0.45)",fontSize:"0.8rem",margin:0 }}>Uploading…</p></div>
          : preview ? <img src={preview} alt="preview" style={{ width:"100%",maxHeight:130,objectFit:"cover",borderRadius:8 }} />
          : <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:"0.35rem",padding:"0.4rem 0" }}><Upload size={22} color="rgba(255,107,0,0.45)" /><p style={{ color:"rgba(255,245,230,0.45)",fontSize:"0.8rem",margin:0 }}>Click or drag & drop</p><p style={{ color:"rgba(255,245,230,0.28)",fontSize:"0.7rem",margin:0 }}>JPG, PNG, WebP · Max 5MB</p></div>}
      </div>
      <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e=>handleFile(e.target.files[0])} />
    </div>
  );
}

// ── Product Modal ──────────────────────────────────────────────────────────────
function ProductModal({ product, onClose, onSaved, token, categoryList=[] }) {
  const isEdit = !!product?._id;
  const [form,setForm]           = useState(isEdit?{...product,price:String(product.price),originalPrice:String(product.originalPrice||""),stock:String(product.stock),tags:(product.tags||[]).join(", ")}:{...EMPTY_FORM, category: categoryList[0]||"Sparklers"});
  const [saving,setSaving]       = useState(false);
  const [uploading,setUploading] = useState(false);

  const onChange = e => { const{name,value,type,checked}=e.target; setForm(f=>({...f,[name]:type==="checkbox"?checked:value,...(name==="name"&&!isEdit?{slug:toSlug(value)}:{})})); };

  const handleSubmit = async () => {
    if (!form.name||!form.price||!form.stock||!form.description){ toast.error("Fill required fields"); return; }
    if (!form.image){ toast.error("Upload an image"); return; }
    setSaving(true);
    try {
      const payload = { ...form, price:Number(form.price), originalPrice:form.originalPrice?Number(form.originalPrice):undefined, stock:Number(form.stock), isFeatured:!!form.isFeatured, isSafeForKids:!!form.isSafeForKids, tags:form.tags?form.tags.split(",").map(t=>t.trim()).filter(Boolean):[], slug:form.slug||toSlug(form.name) };
      const res  = await authFetch(
        isEdit ? `/api/products/${product._id}` : "/api/products",
        { method:isEdit?"PATCH":"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload) },
        token
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success(isEdit?"Updated!":"Product added!"); onSaved();
    } catch(err){ toast.error(err.message); } finally{ setSaving(false); }
  };

  return (
    <div style={{ position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,0.82)",backdropFilter:"blur(6px)",display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"1rem",overflowY:"auto" }}>
      <div style={{ background:"linear-gradient(160deg,#1A0800,#0D0500)",border:"1px solid rgba(255,107,0,0.2)",borderRadius:20,width:"100%",maxWidth:640,margin:"auto",padding:"1.8rem" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.3rem" }}>
          <h2 style={{ color:"#FFF5E6",fontFamily:"'Libre Baskerville',serif",fontSize:"1.1rem",margin:0 }}>{isEdit?"Edit Product":"Add Product"}</h2>
          <Btn variant="ghost" onClick={onClose} style={{ padding:"0.4rem" }}><X size={15} /></Btn>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.85rem" }}>
          <div style={{ gridColumn:"1/-1" }}><label style={S.label}>Name *</label><Input name="name" value={form.name} onChange={onChange} placeholder="Golden Sparklers Pack" /></div>
          <div style={{ gridColumn:"1/-1" }}><label style={S.label}>Slug</label><Input name="slug" value={form.slug} onChange={onChange} /></div>
          <div style={{ gridColumn:"1/-1" }}><label style={S.label}>Description *</label><Textarea name="description" value={form.description} onChange={onChange} rows={3} /></div>
          <div><label style={S.label}>Price (₹) *</label><Input name="price" value={form.price} onChange={onChange} type="number" /></div>
          <div><label style={S.label}>Original Price (₹)</label><Input name="originalPrice" value={form.originalPrice} onChange={onChange} type="number" /></div>
          <div><label style={S.label}>Category *</label><FSelect name="category" value={form.category} onChange={onChange}>{categoryList.map(c=><option key={c} value={c}>{c}</option>)}</FSelect></div>
          <div><label style={S.label}>Stock *</label><Input name="stock" value={form.stock} onChange={onChange} type="number" /></div>
          <div style={{ gridColumn:"1/-1" }}><label style={S.label}>Tags (comma separated)</label><Input name="tags" value={form.tags} onChange={onChange} placeholder="sparkler, golden, diwali" /></div>
          <div style={{ gridColumn:"1/-1",display:"flex",gap:"1.4rem" }}>
            {[["isFeatured","⭐ Featured"],["isSafeForKids","🧒 Kids Safe"]].map(([k,l])=>(
              <label key={k} style={{ display:"flex",alignItems:"center",gap:"0.45rem",cursor:"pointer",color:"rgba(255,245,230,0.7)",fontSize:"0.88rem",fontWeight:600 }}>
                <input type="checkbox" name={k} checked={!!form[k]} onChange={onChange} style={{ width:15,height:15,accentColor:"#FF6B00" }} />{l}
              </label>
            ))}
          </div>
          <div style={{ gridColumn:"1/-1" }}><ImageUpload currentImage={form.image} onUpload={url=>setForm(f=>({...f,image:url}))} uploading={uploading} setUploading={setUploading} token={token} /></div>
        </div>
        <div style={{ display:"flex",gap:"0.75rem",marginTop:"1.3rem" }}>
          <Btn variant="ghost" onClick={onClose} style={{ flex:1,justifyContent:"center" }}>Cancel</Btn>
          <Btn onClick={handleSubmit} disabled={saving||uploading} style={{ flex:2,justifyContent:"center" }}>
            {saving?<><Loader2 size={14} style={{ animation:"spin 1s linear infinite" }} />Saving…</>:isEdit?"Save Changes":"Add Product"}
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ── Delete Confirm ─────────────────────────────────────────────────────────────
function DeleteConfirm({ product, onClose, onDeleted, token }) {
  const [deleting,setDeleting] = useState(false);
  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await authFetch(`/api/products/${product._id}`, { method:"DELETE" }, token);
      if (!res.ok) throw new Error();
      toast.success("Deleted"); onDeleted();
    } catch { toast.error("Failed to delete"); } finally { setDeleting(false); }
  };
  return (
    <div style={{ position:"fixed",inset:0,zIndex:1001,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem" }}>
      <div style={{ background:"linear-gradient(160deg,#1A0800,#0D0500)",border:"1px solid rgba(255,61,0,0.3)",borderRadius:16,padding:"1.8rem",maxWidth:360,width:"100%",textAlign:"center" }}>
        <AlertCircle size={38} color="#FF3D00" style={{ marginBottom:"0.7rem" }} />
        <h3 style={{ color:"#FFF5E6",fontFamily:"'Libre Baskerville',serif",margin:"0 0 0.4rem" }}>Delete Product?</h3>
        <p style={{ color:"rgba(255,245,230,0.5)",fontSize:"0.86rem",margin:"0 0 1.4rem" }}><strong style={{ color:"#FFF5E6" }}>{product.name}</strong> will be permanently removed.</p>
        <div style={{ display:"flex",gap:"0.75rem" }}>
          <Btn variant="ghost" onClick={onClose} style={{ flex:1,justifyContent:"center" }}>Cancel</Btn>
          <Btn variant="danger" onClick={handleDelete} disabled={deleting} style={{ flex:1,justifyContent:"center" }}>
            {deleting?<Loader2 size={13} style={{ animation:"spin 1s linear infinite" }} />:<Trash2 size={13} />}{deleting?"Deleting…":"Delete"}
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ── Skeleton loaders ──────────────────────────────────────────────────────────
function SkeletonDashboard() {
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:"1.4rem" }}>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1rem" }}>
        {[...Array(4)].map((_,i)=><div key={i} className="skeleton" style={{ height:88,borderRadius:16 }} />)}
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"3fr 2fr",gap:"1.2rem" }}>
        <div className="skeleton" style={{ height:180,borderRadius:16 }} />
        <div className="skeleton" style={{ height:180,borderRadius:16 }} />
      </div>
      <div className="skeleton" style={{ height:160,borderRadius:16 }} />
    </div>
  );
}
function SkeletonTable() {
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:"0.6rem" }}>
      <div style={{ display:"flex",gap:"0.75rem",marginBottom:"0.6rem" }}>
        <div className="skeleton" style={{ height:40,flex:1,borderRadius:10 }} />
        <div className="skeleton" style={{ height:40,width:120,borderRadius:10 }} />
      </div>
      {[...Array(6)].map((_,i)=><div key={i} className="skeleton" style={{ height:52,borderRadius:10 }} />)}
    </div>
  );
}
function SkeletonGrid() {
  return (
    <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:"1rem" }}>
      {[...Array(8)].map((_,i)=><div key={i} className="skeleton" style={{ height:180,borderRadius:16 }} />)}
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────
const PAGE_SIZE = 15;

function usePagination(items) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(items.length / PAGE_SIZE);
  const paginated  = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const reset      = () => setPage(1);
  return { page, setPage, totalPages, paginated, reset };
}

function Pagination({ page, totalPages, setPage, total }) {
  if (totalPages <= 1) return null;
  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:"1rem", flexWrap:"wrap", gap:"0.5rem" }}>
      <span style={{ color:"rgba(255,245,230,0.38)", fontSize:"0.75rem" }}>
        Showing {((page-1)*PAGE_SIZE)+1}–{Math.min(page*PAGE_SIZE, total)} of {total}
      </span>
      <div style={{ display:"flex", gap:"0.3rem", flexWrap:"wrap" }}>
        <Btn variant="ghost" onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} style={{ padding:"0.3rem 0.7rem", fontSize:"0.78rem" }}>‹ Prev</Btn>
        {pages.map(p=>(
          <button key={p} onClick={()=>setPage(p)} style={{ width:32, height:32, borderRadius:8, border:"none", background:p===page?"linear-gradient(135deg,#FF6B00,#FF3D00)":"rgba(255,255,255,0.04)", color:p===page?"#fff":"rgba(255,245,230,0.55)", fontWeight:p===page?800:500, fontSize:"0.8rem", cursor:"pointer", fontFamily:"'Source Sans 3',sans-serif" }}>{p}</button>
        ))}
        <Btn variant="ghost" onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} style={{ padding:"0.3rem 0.7rem", fontSize:"0.78rem" }}>Next ›</Btn>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// DASHBOARD TAB
// ══════════════════════════════════════════════════════════════════════════════
function DashboardTab({ token, data, loading, onRefresh }) {
  if (loading || !data) return <SkeletonDashboard />;
  if (!data?.success) return <p style={{ color:"rgba(255,245,230,0.4)",textAlign:"center",padding:"3rem" }}>Failed to load dashboard data</p>;

  const { stats, recentOrders, monthlyRevenue, categoryBreakdown } = data;
  const maxRev = Math.max(...(monthlyRevenue||[]).map(m=>m.total),1);
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:"1.4rem" }}>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1rem" }}>
        <StatCard icon={<ShoppingBag size={20} color="#FF6B00" />} label="Total Orders"  value={stats.totalOrders}            color="#FF6B00" />
        <StatCard icon={<TrendingUp  size={20} color="#FFD700" />} label="Revenue (Delivered)" value={fmtPrice(stats.totalRevenue)} color="#FFD700" />
        <StatCard icon={<ContactRound size={20} color="#2ECC71" />} label="Customers"     value={stats.totalCustomers||0}      color="#2ECC71" />
        <StatCard icon={<Package     size={20} color="#00BFFF" />} label="Products"      value={stats.totalProducts}          color="#00BFFF" />
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"3fr 2fr",gap:"1.2rem" }}>
        <div style={S.card}>
          <h3 style={{ color:"#FFF5E6",fontWeight:800,fontSize:"0.92rem",margin:"0 0 1.2rem" }}>Monthly Revenue — Delivered Orders</h3>
          <div style={{ display:"flex",alignItems:"flex-end",gap:"0.6rem",height:110 }}>
            {(monthlyRevenue||[]).map((m,i)=>(
              <div key={i} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:"0.35rem",height:"100%" }}>
                <span style={{ color:"rgba(255,245,230,0.45)",fontSize:"0.6rem",fontWeight:700 }}>{m.total>0?`₹${(m.total/1000).toFixed(1)}k`:""}</span>
                <div style={{ flex:1,width:"100%",display:"flex",alignItems:"flex-end" }}>
                  <div style={{ width:"100%",height:`${Math.max((m.total/maxRev)*100,4)}%`,background:"linear-gradient(180deg,#FF6B00,#FF3D00)",borderRadius:"4px 4px 0 0",minHeight:4 }} />
                </div>
                <span style={{ color:"rgba(255,245,230,0.4)",fontSize:"0.62rem" }}>{m.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={S.card}>
          <h3 style={{ color:"#FFF5E6",fontWeight:800,fontSize:"0.92rem",margin:"0 0 0.9rem" }}>Recent Orders</h3>
          <div style={{ display:"flex",flexDirection:"column",gap:"0.55rem" }}>
            {(!recentOrders||recentOrders.length===0) && <p style={{ color:"rgba(255,245,230,0.35)",fontSize:"0.82rem" }}>No orders yet</p>}
            {(recentOrders||[]).map(o=>(
              <div key={o._id} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0.45rem 0",borderBottom:"1px solid rgba(255,107,0,0.07)" }}>
                <div>
                  <p style={{ color:"#FFF5E6",fontWeight:700,fontSize:"0.82rem",margin:0 }}>#{o.orderId}</p>
                  <p style={{ color:"rgba(255,245,230,0.4)",fontSize:"0.72rem",margin:0 }}>{o.customer?.name}</p>
                </div>
                <div style={{ textAlign:"right" }}>
                  <p style={{ color:"#FFD700",fontWeight:700,fontSize:"0.82rem",margin:"0 0 0.2rem" }}>{fmtPrice(o.pricing?.grandTotal)}</p>
                  <Badge status={o.orderStatus} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PRODUCTS TAB
// ══════════════════════════════════════════════════════════════════════════════
function ProductsTab({ token, data, loading, onRefresh, catData }) {
  const [products,setProducts]   = useState([]);
  const [search,setSearch]       = useState("");
  const [modal,setModal]         = useState(null);
  const [delTarget,setDelTarget] = useState(null);
  const catNames = (catData?.categories||[]).map(c=>c.name);

  useEffect(()=>{ if (data?.products) setProducts(data.products); },[data]);

  const fetchProducts = () => onRefresh();

  const filtered = products.filter(p=>p.name.toLowerCase().includes(search.toLowerCase())||p.category.toLowerCase().includes(search.toLowerCase()));
  const { page, setPage, totalPages, paginated, reset } = usePagination(filtered);
  useEffect(()=>{ reset(); },[search]); // eslint-disable-line
  return (
    <div>
      <div style={{ display:"flex",gap:"0.75rem",marginBottom:"1.2rem",flexWrap:"wrap" }}>
        <Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products…" style={{ flex:1,minWidth:180 }} />
        <Btn onClick={()=>setModal("add")}><Plus size={15} /> Add Product</Btn>
      </div>
      {loading ? <SkeletonTable /> : (
        <>
        <div style={{ background:"rgba(255,107,0,0.02)",border:"1px solid rgba(255,107,0,0.1)",borderRadius:14,overflow:"auto" }}>
          <table style={{ width:"100%",borderCollapse:"collapse",minWidth:600 }}>
            <thead><tr style={{ background:"rgba(255,107,0,0.05)",borderBottom:"1px solid rgba(255,107,0,0.1)" }}>{["Image","Name","Category","Price","Stock","Actions"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>
              {paginated.length===0 ? <tr><td colSpan={6} style={{ textAlign:"center",padding:"2.5rem",color:"rgba(255,245,230,0.38)" }}>No products found</td></tr>
                : paginated.map(p=>(
                <tr key={p._id} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,107,0,0.04)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={S.td}>{p.image?<img src={p.image} alt={p.name} style={{ width:42,height:42,objectFit:"cover",borderRadius:8,border:"1px solid rgba(255,107,0,0.12)" }} />:<div style={{ width:42,height:42,borderRadius:8,background:"rgba(255,107,0,0.07)",display:"flex",alignItems:"center",justifyContent:"center" }}><ImageIcon size={15} color="rgba(255,107,0,0.35)" /></div>}</td>
                  <td style={S.td}><p style={{ color:"#FFF5E6",fontWeight:700,fontSize:"0.86rem",margin:"0 0 0.2rem" }}>{p.name}</p><div style={{ display:"flex",gap:"0.3rem",flexWrap:"wrap" }}>{p.isFeatured&&<span style={{ fontSize:"0.58rem",background:"rgba(255,215,0,0.1)",color:"#FFD700",border:"1px solid rgba(255,215,0,0.22)",borderRadius:4,padding:"0.08rem 0.32rem",fontWeight:700 }}>⭐ Featured</span>}{p.isSafeForKids&&<span style={{ fontSize:"0.58rem",background:"rgba(46,204,113,0.08)",color:"#2ECC71",border:"1px solid rgba(46,204,113,0.22)",borderRadius:4,padding:"0.08rem 0.32rem",fontWeight:700 }}>🧒 Kids</span>}</div></td>
                  <td style={{ ...S.td,color:"rgba(255,245,230,0.5)",fontSize:"0.82rem" }}>{p.category}</td>
                  <td style={S.td}><p style={{ color:"#FFD700",fontWeight:700,fontSize:"0.88rem",margin:0 }}>₹{p.price.toLocaleString()}</p>{p.originalPrice&&<p style={{ color:"rgba(255,245,230,0.28)",fontSize:"0.7rem",textDecoration:"line-through",margin:0 }}>₹{p.originalPrice.toLocaleString()}</p>}</td>
                  <td style={S.td}><span style={{ color:p.stock<10?"#FF3D00":p.stock<30?"#FFD700":"#2ECC71",fontWeight:800 }}>{p.stock}</span></td>
                  <td style={S.td}><div style={{ display:"flex",gap:"0.4rem" }}><Btn variant="ghost" onClick={()=>setModal(p)} style={{ padding:"0.32rem 0.65rem",fontSize:"0.76rem" }}><Pencil size={11} /> Edit</Btn><Btn variant="danger" onClick={()=>setDelTarget(p)} style={{ padding:"0.32rem 0.65rem",fontSize:"0.76rem" }}><Trash2 size={11} /> Del</Btn></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} setPage={setPage} total={filtered.length} />
        </>
      )}
      {modal     && <ProductModal product={modal==="add"?null:modal} onClose={()=>setModal(null)} onSaved={()=>{setModal(null);fetchProducts();}} token={token} categoryList={catNames} />}
      {delTarget && <DeleteConfirm product={delTarget} onClose={()=>setDelTarget(null)} onDeleted={()=>{setDelTarget(null);fetchProducts();}} token={token} />}
    </div>
  );
}

// ── Category Modal (Add / Edit) ───────────────────────────────────────────────
const EMPTY_CAT = { name:"", image:"", color:"#FF6B00", bg:"#FFE0CC", order:0 };

function CategoryModal({ category, onClose, onSaved, token }) {
  const isEdit = !!category?._id;
  const [form, setForm] = useState(isEdit ? { name:category.name, image:category.image||"", color:category.color, bg:category.bg, order:category.order||0 } : EMPTY_CAT);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      const url    = isEdit ? `/api/admin/categories/${category._id}` : "/api/admin/categories";
      const method = isEdit ? "PATCH" : "POST";
      const res    = await authFetch(url, { method, headers:{"Content-Type":"application/json"}, body:JSON.stringify(form) }, token);
      const data   = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success(isEdit ? "Category updated!" : "Category created!"); onSaved();
    } catch(err) { toast.error(err.message); } finally { setSaving(false); }
  };

  return (
    <div style={{ position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,0.82)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem" }}>
      <div style={{ background:"linear-gradient(160deg,#1A0800,#0D0500)",border:"1px solid rgba(255,107,0,0.2)",borderRadius:20,width:"100%",maxWidth:460,padding:"1.8rem" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.3rem" }}>
          <h2 style={{ color:"#FFF5E6",fontFamily:"'Libre Baskerville',serif",fontSize:"1.1rem",margin:0 }}>{isEdit?"Edit Category":"Add Category"}</h2>
          <Btn variant="ghost" onClick={onClose} style={{ padding:"0.4rem" }}><X size={15} /></Btn>
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:"0.85rem" }}>
          <div><label style={S.label}>Name *</label><Input name="name" value={form.name} onChange={onChange} placeholder="e.g. Sparklers" /></div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.85rem" }}>
            <div style={{ gridColumn:"1/-1" }}>
              <label style={S.label}>Category Image</label>
              <div style={{ display:"flex", gap:"0.75rem", alignItems:"flex-start" }}>
                {form.image && <img src={form.image} alt="preview" style={{ width:60, height:60, objectFit:"cover", borderRadius:10, border:"1px solid rgba(255,107,0,0.2)", flexShrink:0 }} />}
                <div style={{ flex:1 }}>
                  <input type="file" accept="image/*" id={`cat-img-upload-${category?._id||"new"}`} style={{ display:"none" }} onChange={async e => {
                    const file = e.target.files[0];
                    if (!file) return;
                    if (file.size > 5*1024*1024) { toast.error("Max 5MB"); return; }
                    setUploading(true);
                    try {
                      const fd = new FormData(); fd.append("image", file);
                      const res = await authFetch("/api/products/upload-image", { method:"POST", body:fd }, token);
                      const data = await res.json();
                      if (!res.ok) throw new Error(data.message);
                      setForm(f => ({ ...f, image: data.url })); toast.success("Uploaded!");
                    } catch(err) { toast.error(err.message); } finally { setUploading(false); }
                  }} />
                  <label htmlFor={`cat-img-upload-${category?._id||"new"}`} style={{ display:"flex", alignItems:"center", gap:"0.4rem", background:"rgba(255,107,0,0.06)", border:"1.5px dashed rgba(255,107,0,0.25)", borderRadius:10, padding:"0.6rem 1rem", cursor:uploading?"not-allowed":"pointer", color:"rgba(255,245,230,0.6)", fontSize:"0.82rem", fontWeight:600 }}>
                    {uploading ? <><Loader2 size={14} style={{ animation:"spin 1s linear infinite" }} /> Uploading…</> : <><Upload size={14} /> {form.image ? "Change Image" : "Upload Image"}</>}
                  </label>
                  {form.image && <p style={{ color:"rgba(255,245,230,0.35)", fontSize:"0.68rem", margin:"0.3rem 0 0" }}>JPG, PNG, WebP · Max 5MB</p>}
                </div>
              </div>
            </div>
            <div><label style={S.label}>Order</label><Input name="order" value={form.order} onChange={onChange} type="number" placeholder="1" /></div>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.85rem" }}>
            <div>
              <label style={S.label}>Text Color</label>
              <div style={{ display:"flex",gap:"0.5rem",alignItems:"center" }}>
                <input type="color" name="color" value={form.color} onChange={onChange} style={{ width:42,height:36,borderRadius:8,border:"1.5px solid rgba(255,107,0,0.2)",background:"none",cursor:"pointer",padding:2 }} />
                <Input name="color" value={form.color} onChange={onChange} placeholder="#FF6B00" style={{ flex:1 }} />
              </div>
            </div>
            <div>
              <label style={S.label}>Background Color</label>
              <div style={{ display:"flex",gap:"0.5rem",alignItems:"center" }}>
                <input type="color" name="bg" value={form.bg} onChange={onChange} style={{ width:42,height:36,borderRadius:8,border:"1.5px solid rgba(255,107,0,0.2)",background:"none",cursor:"pointer",padding:2 }} />
                <Input name="bg" value={form.bg} onChange={onChange} placeholder="#FFE0CC" style={{ flex:1 }} />
              </div>
            </div>
          </div>
          {/* Preview */}
          <div style={{ background:form.bg, borderRadius:12, padding:"0.8rem 1rem", display:"flex", alignItems:"center", gap:"0.7rem", border:"1px solid rgba(0,0,0,0.08)" }}>
            {form.image
              ? <img src={form.image} alt="preview" style={{ width:36, height:36, objectFit:"cover", borderRadius:8 }} />
              : <span style={{ fontSize:"1.6rem" }}>🎆</span>}
            <span style={{ color:form.color, fontWeight:800, fontSize:"0.95rem" }}>{form.name||"Preview"}</span>
          </div>
        </div>
        <div style={{ display:"flex",gap:"0.75rem",marginTop:"1.3rem" }}>
          <Btn variant="ghost" onClick={onClose} style={{ flex:1,justifyContent:"center" }}>Cancel</Btn>
          <Btn onClick={handleSubmit} disabled={saving} style={{ flex:2,justifyContent:"center" }}>
            {saving?<><Loader2 size={14} style={{ animation:"spin 1s linear infinite" }} />Saving…</>:isEdit?"Save Changes":"Add Category"}
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ── Category Delete Confirm ────────────────────────────────────────────────────
function DeleteCategoryConfirm({ category, onClose, onDeleted, token }) {
  const [deleting, setDeleting] = useState(false);
  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await authFetch(`/api/admin/categories/${category._id}`, { method:"DELETE" }, token);
      if (!res.ok) throw new Error();
      toast.success("Category deleted"); onDeleted();
    } catch { toast.error("Failed to delete"); } finally { setDeleting(false); }
  };
  return (
    <div style={{ position:"fixed",inset:0,zIndex:1001,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem" }}>
      <div style={{ background:"linear-gradient(160deg,#1A0800,#0D0500)",border:"1px solid rgba(255,61,0,0.3)",borderRadius:16,padding:"1.8rem",maxWidth:360,width:"100%",textAlign:"center" }}>
        <AlertCircle size={38} color="#FF3D00" style={{ marginBottom:"0.7rem" }} />
        <h3 style={{ color:"#FFF5E6",fontFamily:"'Libre Baskerville',serif",margin:"0 0 0.4rem" }}>Delete Category?</h3>
        <p style={{ color:"rgba(255,245,230,0.5)",fontSize:"0.86rem",margin:"0 0 0.3rem" }}><strong style={{ color:"#FFF5E6" }}>{category.name}</strong> will be removed.</p>
        <p style={{ color:"rgba(255,107,0,0.7)",fontSize:"0.78rem",margin:"0 0 1.4rem" }}>⚠️ Existing products in this category will keep their category name.</p>
        <div style={{ display:"flex",gap:"0.75rem" }}>
          <Btn variant="ghost" onClick={onClose} style={{ flex:1,justifyContent:"center" }}>Cancel</Btn>
          <Btn variant="danger" onClick={handleDelete} disabled={deleting} style={{ flex:1,justifyContent:"center" }}>
            {deleting?<Loader2 size={13} style={{ animation:"spin 1s linear infinite" }} />:<Trash2 size={13} />}{deleting?"Deleting…":"Delete"}
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CATEGORIES TAB
// ══════════════════════════════════════════════════════════════════════════════
function CategoriesTab({ token, data, loading, onRefresh }) {
  const [modal, setModal]         = useState(null); // null | "add" | category object
  const [delTarget, setDelTarget] = useState(null);

  if (loading || !data) return <SkeletonGrid />;
  const cats = data?.categories || [];

  return (
    <div>
      {/* Header */}
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.2rem",flexWrap:"wrap",gap:"0.75rem" }}>
        <p style={{ color:"rgba(255,245,230,0.45)",fontSize:"0.82rem",margin:0 }}>{cats.length} categories</p>
        <Btn onClick={()=>setModal("add")}><Plus size={15} /> Add Category</Btn>
      </div>

      {/* Grid */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:"1rem" }}>
        {cats.map(c=>{
          const color = c.color || "#FF6B00";
          const bg    = c.bg    || "rgba(255,255,255,0.025)";
          return (
            <div key={c._id} style={{ background:`${bg}22`,border:`1.5px solid ${color}30`,borderRadius:16,padding:"1.2rem",transition:"transform .2s,box-shadow .2s",position:"relative" }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=`0 8px 28px ${color}20`;}}
              onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
              {/* Action buttons */}
              <div style={{ position:"absolute",top:"0.7rem",right:"0.7rem",display:"flex",gap:"0.3rem" }}>
                <button onClick={()=>setModal(c)} style={{ width:28,height:28,borderRadius:7,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,107,0,0.18)",color:"rgba(255,245,230,0.6)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}><Pencil size={11} /></button>
                <button onClick={()=>setDelTarget(c)} style={{ width:28,height:28,borderRadius:7,background:"rgba(255,61,0,0.06)",border:"1px solid rgba(255,61,0,0.2)",color:"#FF3D00",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}><Trash2 size={11} /></button>
              </div>
              <div style={{ display:"flex",alignItems:"center",gap:"0.65rem",marginBottom:"0.85rem" }}>
                {c.image
                  ? <img src={c.image} alt={c.name} style={{ width:40, height:40, objectFit:"cover", borderRadius:10, border:"1px solid rgba(255,107,0,0.15)", flexShrink:0 }} />
                  : <span style={{ fontSize:"2rem" }}>🎆</span>}
                <div>
                  <h3 style={{ color:"#FFF5E6",fontWeight:800,fontSize:"0.95rem",margin:0 }}>{c.name}</h3>
                  <span style={{ background:`${color}15`,color,border:`1px solid ${color}30`,borderRadius:6,padding:"0.1rem 0.45rem",fontSize:"0.65rem",fontWeight:700 }}>{c.count} products</span>
                </div>
              </div>
              {[["Stock",c.totalStock,color],["Avg Price",`₹${Math.round(c.avgPrice||0)}`,"rgba(255,245,230,0.65)"],["Featured",c.featured,"#FFD700"],["Kids Safe",c.kidsSafe,"#2ECC71"]].map(([l,v,cl])=>(
                <div key={l} style={{ display:"flex",justifyContent:"space-between",marginBottom:"0.3rem" }}>
                  <span style={{ color:"rgba(255,245,230,0.38)",fontSize:"0.74rem" }}>{l}</span>
                  <span style={{ color:cl,fontWeight:700,fontSize:"0.8rem" }}>{v}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {modal     && <CategoryModal category={modal==="add"?null:modal} onClose={()=>setModal(null)} onSaved={()=>{setModal(null);onRefresh();}} token={token} />}
      {delTarget && <DeleteCategoryConfirm category={delTarget} onClose={()=>setDelTarget(null)} onDeleted={()=>{setDelTarget(null);onRefresh();}} token={token} />}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// USERS TAB
// ══════════════════════════════════════════════════════════════════════════════
function UsersTab({ token, data, loading, onRefresh }) {
  const [users,setUsers]   = useState([]);
  const [search,setSearch] = useState("");

  useEffect(()=>{ if (data?.users) setUsers(data.users); },[data]);

  const fetchUsers = () => onRefresh();

  const updateRole = async (userId, role) => {
    try {
      const res  = await authFetch(`/api/admin/users/${userId}/role`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({role}) }, token);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success(`Role updated to ${role}`); fetchUsers();
    } catch(err){ toast.error(err.message); }
  };

  const filtered = users.filter(u=>!search||u.name.toLowerCase().includes(search.toLowerCase())||u.email.toLowerCase().includes(search.toLowerCase()));
  const { page, setPage, totalPages, paginated, reset } = usePagination(filtered);
  useEffect(()=>{ reset(); },[search]); // eslint-disable-line
  return (
    <div>
      <div style={{ display:"flex",gap:"0.75rem",marginBottom:"1.2rem" }}>
        <Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or email…" style={{ flex:1 }} />
        <Btn variant="ghost" onClick={fetchUsers}><RefreshCw size={14} /> Refresh</Btn>
      </div>
      {loading ? <SkeletonTable /> : (
        <>
        <div style={{ background:"rgba(255,107,0,0.02)",border:"1px solid rgba(255,107,0,0.1)",borderRadius:14,overflow:"auto" }}>
          <table style={{ width:"100%",borderCollapse:"collapse",minWidth:600 }}>
            <thead><tr style={{ background:"rgba(255,107,0,0.05)",borderBottom:"1px solid rgba(255,107,0,0.1)" }}>{["User","Email","Phone","Role","Joined","Change Role"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>
              {paginated.length===0 ? <tr><td colSpan={6} style={{ textAlign:"center",padding:"2.5rem",color:"rgba(255,245,230,0.38)" }}>No users found</td></tr>
                : paginated.map(u=>(
                <tr key={u._id} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,107,0,0.04)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={S.td}><div style={{ display:"flex",alignItems:"center",gap:"0.55rem" }}><div style={{ width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,rgba(255,107,0,0.18),rgba(255,61,0,0.08))",border:"1.5px solid rgba(255,107,0,0.22)",display:"flex",alignItems:"center",justifyContent:"center",color:"#FF6B00",fontWeight:800,fontSize:"0.88rem",flexShrink:0 }}>{u.name.charAt(0).toUpperCase()}</div><span style={{ color:"#FFF5E6",fontWeight:700,fontSize:"0.86rem" }}>{u.name}</span></div></td>
                  <td style={{ ...S.td,color:"rgba(255,245,230,0.55)",fontSize:"0.82rem" }}>{u.email}</td>
                  <td style={{ ...S.td,color:"rgba(255,245,230,0.45)",fontSize:"0.82rem" }}>{u.phone||"—"}</td>
                  <td style={S.td}><Badge status={u.role} /></td>
                  <td style={{ ...S.td,color:"rgba(255,245,230,0.4)",fontSize:"0.78rem" }}>{fmtDate(u.createdAt)}</td>
                  <td style={S.td}>
                    <select value={u.role} onChange={e=>updateRole(u._id,e.target.value)} style={{ background:"#1a0800",border:"1px solid rgba(255,107,0,0.18)",borderRadius:8,color:"#FFF5E6",padding:"0.28rem 0.55rem",fontSize:"0.76rem",cursor:"pointer",outline:"none" }}>
                      <option value="user">user</option><option value="admin">admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} setPage={setPage} total={filtered.length} />
        </>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ORDERS TAB
// ══════════════════════════════════════════════════════════════════════════════
function OrdersTab({ token, data, loading, onRefresh }) {
  const [orders,setOrders]     = useState([]);
  const [search,setSearch]     = useState("");
  const [filter,setFilter]     = useState("");
  const [expanded,setExpanded] = useState(null);

  useEffect(()=>{ if (data?.orders) setOrders(data.orders); },[data]);

  const fetchOrders = () => onRefresh();

  const updateStatus = async (orderId, field, value) => {
    try {
      const res  = await authFetch(`/api/admin/orders/${orderId}/status`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({[field]:value}) }, token);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Status updated!"); setOrders(prev=>prev.map(o=>o.orderId===orderId?data.order:o));
    } catch(err){ toast.error(err.message); }
  };

  const filtered = orders.filter(o=>!search||o.orderId.toLowerCase().includes(search.toLowerCase())||o.customer?.name?.toLowerCase().includes(search.toLowerCase())||o.customer?.phone?.includes(search));
  const { page, setPage, totalPages, paginated, reset } = usePagination(filtered);
  useEffect(()=>{ reset(); },[search, filter]); // eslint-disable-line
  return (
    <div>
      <div style={{ display:"flex",gap:"0.75rem",marginBottom:"1.2rem",flexWrap:"wrap" }}>
        <Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by Order ID, name, phone…" style={{ flex:1,minWidth:180 }} />
        <FSelect value={filter} onChange={e=>setFilter(e.target.value)} style={{ width:"auto",minWidth:150 }}>
          <option value="">All Orders</option>{ORDER_STATUS.map(s=><option key={s} value={s}>{s}</option>)}
        </FSelect>
        <Btn variant="ghost" onClick={fetchOrders}><RefreshCw size={14} /> Refresh</Btn>
      </div>
      {loading ? <SkeletonTable /> : (
        <>
        <div style={{ display:"flex",flexDirection:"column",gap:"0.65rem" }}>
          {paginated.length===0&&<p style={{ textAlign:"center",color:"rgba(255,245,230,0.38)",padding:"2rem" }}>No orders found</p>}
          {paginated.map(o=>(
            <div key={o._id} style={{ background:"rgba(255,107,0,0.02)",border:"1px solid rgba(255,107,0,0.1)",borderRadius:14,overflow:"hidden" }}>
              <div style={{ display:"flex",alignItems:"center",gap:"0.75rem",padding:"0.95rem 1.1rem",cursor:"pointer",flexWrap:"wrap" }} onClick={()=>setExpanded(expanded===o._id?null:o._id)}>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:"0.5rem",flexWrap:"wrap",marginBottom:"0.2rem" }}>
                    <span style={{ color:"#FFD700",fontWeight:800,fontSize:"0.88rem",fontFamily:"monospace" }}>#{o.orderId}</span>
                    <Badge status={o.orderStatus} /><Badge status={o.paymentStatus} />
                  </div>
                  <p style={{ color:"rgba(255,245,230,0.45)",fontSize:"0.76rem",margin:0 }}>{o.customer?.name} · {o.customer?.phone} · {fmtDate(o.createdAt)}</p>
                </div>
                <div style={{ textAlign:"right",flexShrink:0 }}>
                  <p style={{ color:"#FF6B00",fontWeight:900,fontSize:"0.95rem",margin:"0 0 0.15rem" }}>{fmtPrice(o.pricing?.grandTotal)}</p>
                  <p style={{ color:"rgba(255,245,230,0.35)",fontSize:"0.7rem",margin:0 }}>{o.items?.length} item{o.items?.length!==1?"s":""}</p>
                </div>
                <ChevronDown size={15} color="rgba(255,245,230,0.35)" style={{ transform:expanded===o._id?"rotate(180deg)":"none",transition:"transform .2s",flexShrink:0 }} />
              </div>
              {expanded===o._id&&(
                <div style={{ borderTop:"1px solid rgba(255,107,0,0.1)",padding:"1rem 1.1rem",display:"flex",flexDirection:"column",gap:"0.9rem" }}>
                  <div>
                    <p style={{ ...S.label,marginBottom:"0.5rem" }}>Items</p>
                    {o.items?.map((item,i)=>(
                      <div key={i} style={{ display:"flex",alignItems:"center",gap:"0.55rem",marginBottom:"0.45rem" }}>
                        {item.image&&<img src={item.image} alt={item.name} style={{ width:34,height:34,objectFit:"cover",borderRadius:6,border:"1px solid rgba(255,107,0,0.12)" }} />}
                        <span style={{ color:"rgba(255,245,230,0.75)",fontSize:"0.83rem",flex:1 }}>{item.name} <span style={{ color:"rgba(255,245,230,0.38)" }}>× {item.quantity}</span></span>
                        <span style={{ color:"#FFD700",fontWeight:700,fontSize:"0.83rem" }}>₹{(item.price*item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p style={{ ...S.label,marginBottom:"0.3rem" }}>Delivery Address</p>
                    <p style={{ color:"rgba(255,245,230,0.6)",fontSize:"0.82rem",margin:0,lineHeight:1.6 }}>{o.customer?.address}, {o.customer?.city}, {o.customer?.state} — {o.customer?.pincode}</p>
                  </div>
                  <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.9rem" }}>
                    <div><p style={{ ...S.label,marginBottom:"0.35rem" }}>Order Status</p><FSelect value={o.orderStatus} onChange={e=>updateStatus(o.orderId,"orderStatus",e.target.value)}>{ORDER_STATUS.map(s=><option key={s} value={s}>{s}</option>)}</FSelect></div>
                    <div><p style={{ ...S.label,marginBottom:"0.35rem" }}>Payment Status</p><FSelect value={o.paymentStatus} onChange={e=>updateStatus(o.orderId,"paymentStatus",e.target.value)}>{PAYMENT_STATUS.map(s=><option key={s} value={s}>{s}</option>)}</FSelect></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <Pagination page={page} totalPages={totalPages} setPage={setPage} total={filtered.length} />
        </>
      )}
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// CUSTOMERS TAB
// ══════════════════════════════════════════════════════════════════════════════
function CustomersTab({ token, data, loading, onRefresh }) {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const customers = data?.customers || [];

  const filtered = customers.filter(c =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );
  const { page, setPage, totalPages, paginated, reset } = usePagination(filtered);
  useEffect(() => { reset(); }, [search]); // eslint-disable-line

  const fmtDate = d => new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });

  if (loading) return <SkeletonTable />;

  return (
    <div>
      <div style={{ display:"flex", gap:"0.75rem", marginBottom:"1.2rem", flexWrap:"wrap", alignItems:"center" }}>
        <Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, phone or email…" style={{ flex:1, minWidth:200 }} />
        <Btn variant="ghost" onClick={onRefresh}><RefreshCw size={14} /> Refresh</Btn>
        <span style={{ color:"rgba(255,245,230,0.38)", fontSize:"0.78rem" }}>{customers.length} total customers</span>
      </div>

      <>
      <div style={{ background:"rgba(255,107,0,0.02)", border:"1px solid rgba(255,107,0,0.1)", borderRadius:14, overflow:"hidden" }}>
        {paginated.length === 0
          ? <p style={{ textAlign:"center", color:"rgba(255,245,230,0.35)", padding:"2.5rem" }}>No customers yet</p>
          : paginated.map(c => (
            <div key={c._id} style={{ borderBottom:"1px solid rgba(255,107,0,0.06)" }}>
              {/* Row */}
              <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", padding:"0.85rem 1rem", cursor:"pointer", flexWrap:"wrap" }}
                onClick={() => setExpanded(expanded === c._id ? null : c._id)}>
                {/* Avatar */}
                <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,rgba(255,107,0,0.18),rgba(255,61,0,0.08))", border:"1.5px solid rgba(255,107,0,0.22)", display:"flex", alignItems:"center", justifyContent:"center", color:"#FF6B00", fontWeight:800, fontSize:"0.95rem", flexShrink:0 }}>
                  {c.name.charAt(0).toUpperCase()}
                </div>
                {/* Name + contact */}
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ color:"#FFF5E6", fontWeight:700, fontSize:"0.88rem", margin:"0 0 0.15rem" }}>{c.name}</p>
                  <div style={{ display:"flex", gap:"0.8rem", flexWrap:"wrap" }}>
                    <a href={`tel:${c.phone}`} onClick={e=>e.stopPropagation()} style={{ color:"#FF6B00", fontSize:"0.75rem", display:"flex", alignItems:"center", gap:"0.25rem", textDecoration:"none" }}>
                      <Phone size={11} /> {c.phone}
                    </a>
                    {c.email && (
                      <a href={`mailto:${c.email}`} onClick={e=>e.stopPropagation()} style={{ color:"#00BFFF", fontSize:"0.75rem", display:"flex", alignItems:"center", gap:"0.25rem", textDecoration:"none" }}>
                        <Mail size={11} /> {c.email}
                      </a>
                    )}
                    <a href={`https://wa.me/91${c.phone.replace(/\D/g,"")}`} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} style={{ color:"#25D366", fontSize:"0.75rem", display:"flex", alignItems:"center", gap:"0.25rem", textDecoration:"none" }}>
                      💬 WhatsApp
                    </a>
                  </div>
                </div>
                {/* Stats */}
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <p style={{ color:"#FFD700", fontWeight:700, fontSize:"0.82rem", margin:"0 0 0.12rem" }}>₹{c.totalSpent.toLocaleString("en-IN")}</p>
                  <p style={{ color:"rgba(255,245,230,0.38)", fontSize:"0.7rem", margin:0 }}>{c.totalOrders} order{c.totalOrders!==1?"s":""} · {fmtDate(c.lastOrderAt)}</p>
                </div>
                <ChevronDown size={14} color="rgba(255,245,230,0.3)" style={{ transform:expanded===c._id?"rotate(180deg)":"none", transition:"transform .2s", flexShrink:0 }} />
              </div>
              {/* Expanded: addresses */}
              {expanded === c._id && (
                <div style={{ padding:"0.75rem 1rem 1rem 1rem", borderTop:"1px solid rgba(255,107,0,0.06)", background:"rgba(255,107,0,0.02)" }}>
                  <p style={{ ...S.label, marginBottom:"0.5rem" }}>Delivery Addresses</p>
                  {c.addresses.length === 0
                    ? <p style={{ color:"rgba(255,245,230,0.35)", fontSize:"0.8rem" }}>No addresses saved</p>
                    : c.addresses.map((a, i) => (
                      <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:"0.4rem", marginBottom:"0.4rem" }}>
                        <MapPin size={12} color="#FF6B00" style={{ marginTop:2, flexShrink:0 }} />
                        <p style={{ color:"rgba(255,245,230,0.6)", fontSize:"0.82rem", margin:0 }}>
                          {a.street}, {a.city}, {a.state} — {a.pincode}
                        </p>
                      </div>
                    ))
                  }
                  <p style={{ ...S.label, marginTop:"0.75rem", marginBottom:"0.3rem" }}>Last Order</p>
                  <p style={{ color:"rgba(255,245,230,0.55)", fontSize:"0.82rem", margin:0, fontFamily:"monospace" }}>#{c.lastOrderId}</p>
                </div>
              )}
            </div>
          ))
        }
      </div>
      <Pagination page={page} totalPages={totalPages} setPage={setPage} total={filtered.length} />
      </>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// LOGIN — real backend JWT auth
// ══════════════════════════════════════════════════════════════════════════════
function AdminLogin({ onLogin }) {
  const [email,setEmail]     = useState("");
  const [pw,setPw]           = useState("");
  const [error,setError]     = useState("");
  const [loading,setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !pw) { setError("Enter email and password"); return; }
    setLoading(true); setError("");
    try {
      const res  = await fetch(`${API}/api/auth/login`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ email, password:pw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      if (data.user?.role !== "admin") throw new Error("Not an admin account");
      onLogin(data.token, data.user);
    } catch(err){ setError(err.message); }
    finally{ setLoading(false); }
  };

  return (
    <div style={{ minHeight:"100vh",background:"#0D0600",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Source Sans 3',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@700&family=Source+Sans+3:wght@400;600;700;800&display=swap'); @keyframes spin { to { transform:rotate(360deg); } }`}</style>
      <div style={{ background:"linear-gradient(160deg,#1A0800,#0D0500)",border:"1px solid rgba(255,107,0,0.2)",borderRadius:20,padding:"2.5rem",width:"100%",maxWidth:360,textAlign:"center" }}>
        <div style={{ fontSize:"2.6rem",marginBottom:"0.6rem" }}>🔐</div>
        <h1 style={{ fontFamily:"'Libre Baskerville',serif",color:"#FFF5E6",fontSize:"1.25rem",margin:"0 0 0.3rem" }}>Admin Panel</h1>
        <p style={{ color:"rgba(255,245,230,0.38)",fontSize:"0.8rem",margin:"0 0 1.6rem" }}>SparkNest · Sivakasi</p>
        <div style={{ marginBottom:"0.85rem",textAlign:"left" }}>
          <label style={S.label}>Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} placeholder="admin@sparknest.in"
            style={{ ...S.input, border:`1.5px solid ${error?"#FF3D00":"rgba(255,107,0,0.2)"}` }} />
        </div>
        <div style={{ marginBottom:"0.6rem",textAlign:"left" }}>
          <label style={S.label}>Password</label>
          <input type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} placeholder="••••••••"
            style={{ ...S.input, border:`1.5px solid ${error?"#FF3D00":"rgba(255,107,0,0.2)"}` }} />
        </div>
        {error && <p style={{ color:"#FF3D00",fontSize:"0.78rem",margin:"0.45rem 0 0",textAlign:"left" }}>{error}</p>}
        <button onClick={handleLogin} disabled={loading}
          style={{ width:"100%",padding:"0.82rem",background:"linear-gradient(135deg,#FF6B00,#FF3D00)",border:"none",borderRadius:12,color:"#fff",fontWeight:800,fontSize:"1rem",cursor:loading?"not-allowed":"pointer",boxShadow:"0 4px 20px rgba(255,107,0,0.45)",fontFamily:"'Source Sans 3',sans-serif",marginTop:"1rem",opacity:loading?0.7:1,display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem" }}>
          {loading ? <><Loader2 size={16} style={{ animation:"spin 1s linear infinite" }} />Signing in…</> : "Login"}
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════════════════════
const TABS = [
  { id:"dashboard",  label:"Dashboard",  icon:<LayoutDashboard size={15} /> },
  { id:"products",   label:"Products",   icon:<Package size={15} /> },
  { id:"categories", label:"Categories", icon:<Tag size={15} /> },
  { id:"users",      label:"Users",      icon:<Users size={15} /> },
  { id:"orders",     label:"Orders",     icon:<ShoppingBag size={15} /> },
  { id:"customers",  label:"Customers",  icon:<ContactRound size={15} /> },
];

// ── Global data cache — fetched once on login, shared across all tabs ──────────
function useAdminData(token) {
  const [cache, setCache]     = useState({});
  const [loading, setLoading] = useState({});
  const inFlight = useRef({});   // track in-flight requests outside render cycle
  const cacheRef = useRef({});   // mirror cache in a ref so fetch$ sees latest value

  // Keep cacheRef in sync
  useEffect(() => { cacheRef.current = cache; }, [cache]);

  const fetch$ = useCallback(async (key, url) => {
    if (cacheRef.current[key] || inFlight.current[key]) return;
    inFlight.current[key] = true;
    setLoading(l => ({ ...l, [key]: true }));
    try {
      const res  = await authFetch(url, {}, token);
      const data = await res.json();
      setCache(c => ({ ...c, [key]: data }));
    } catch {}
    finally {
      inFlight.current[key] = false;
      setLoading(l => ({ ...l, [key]: false }));
    }
  }, [token]);

  const invalidate = useCallback((key) => {
    delete cacheRef.current[key];          // clear ref immediately
    delete inFlight.current[key];          // allow re-fetch
    setCache(c => { const n = { ...c }; delete n[key]; return n; });
  }, []);

  const reload = useCallback((key, url) => {
    invalidate(key);
    // fetch$ will now see empty cacheRef and empty inFlight
    setTimeout(() => fetch$(key, url), 0);
  }, [invalidate, fetch$]);

  // Prefetch all tabs immediately on mount
  useEffect(() => {
    fetch$("dashboard",  "/api/admin/dashboard");
    fetch$("products",   "/api/products?limit=100");
    fetch$("categories", "/api/admin/categories");
    fetch$("users",      "/api/admin/users?limit=50");
    fetch$("orders",     "/api/admin/orders?limit=50");
    fetch$("customers",  "/api/admin/customers?limit=100");
  }, [token]); // eslint-disable-line

  return { cache, loading, invalidate, reload };
}

export default function AdminPanel() {
  const [token,setToken] = useState(()=>sessionStorage.getItem("sn_admin_token")||null);
  const [user,setUser]   = useState(()=>{ try{ return JSON.parse(sessionStorage.getItem("sn_admin_user")); }catch{ return null; } });
  const [tab,setTab]     = useState("dashboard");

  const handleLogin  = (tok, usr) => {
    sessionStorage.setItem("sn_admin_token", tok);
    sessionStorage.setItem("sn_admin_user", JSON.stringify(usr));
    setToken(tok); setUser(usr);
  };
  const handleLogout = () => {
    sessionStorage.removeItem("sn_admin_token");
    sessionStorage.removeItem("sn_admin_user");
    setToken(null); setUser(null);
  };

  if (!token) return <AdminLogin onLogin={handleLogin} />;

  return <AdminShell token={token} user={user} onLogout={handleLogout} tab={tab} setTab={setTab} />;
}

// Separate shell so useAdminData only runs when logged in
function AdminShell({ token, user, onLogout, tab, setTab }) {
  const { cache, loading, reload } = useAdminData(token);

  return (
    <div style={{ minHeight:"100vh",background:"#0D0600",fontFamily:"'Source Sans 3',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Source+Sans+3:wght@300;400;600;700;800&display=swap');
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes shimmer { 0%{opacity:.4} 50%{opacity:.9} 100%{opacity:.4} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:5px; height:5px; }
        ::-webkit-scrollbar-track { background:rgba(255,107,0,0.04); }
        ::-webkit-scrollbar-thumb { background:rgba(255,107,0,0.25); border-radius:10px; }
        .skeleton { background:rgba(255,107,0,0.08); border-radius:8px; animation:shimmer 1.4s ease-in-out infinite; }
      `}</style>

      {/* Top Bar */}
      <div style={{ background:"rgba(6,3,0,0.98)",borderBottom:"1px solid rgba(255,107,0,0.13)",padding:"0 clamp(1rem,4vw,2rem)",height:58,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:200 }}>
        <span style={{ fontFamily:"'Libre Baskerville',serif",color:"#FFD700",fontSize:"1rem",fontWeight:700,display:"flex",alignItems:"center",gap:"0.45rem" }}>
          <Package size={17} color="#FF6B00" /> SparkNest Admin
        </span>
        <div style={{ display:"flex",alignItems:"center",gap:"0.85rem" }}>
          {user && <span style={{ color:"rgba(255,245,230,0.45)",fontSize:"0.78rem" }}>{user.name}</span>}
          <Btn variant="ghost" onClick={onLogout} style={{ padding:"0.38rem 0.75rem",fontSize:"0.78rem" }}><LogOut size={13} /> Logout</Btn>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background:"rgba(255,107,0,0.025)",borderBottom:"1px solid rgba(255,107,0,0.09)",padding:"0 clamp(1rem,4vw,2rem)",display:"flex",gap:"0.2rem",overflowX:"auto" }}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{ display:"flex",alignItems:"center",gap:"0.38rem",padding:"0.8rem 1rem",background:"none",border:"none",borderBottom:`2.5px solid ${tab===t.id?"#FF6B00":"transparent"}`,color:tab===t.id?"#FF6B00":"rgba(255,245,230,0.45)",fontWeight:700,fontSize:"0.83rem",cursor:"pointer",whiteSpace:"nowrap",fontFamily:"'Source Sans 3',sans-serif",transition:"color .18s",marginBottom:-1 }}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* Content — tabs receive cached data, no re-fetching on switch */}
      <div style={{ maxWidth:1200,margin:"0 auto",padding:"1.8rem clamp(1rem,4vw,2rem)" }}>
        {tab==="dashboard"  && <DashboardTab  token={token} data={cache.dashboard}  loading={!!loading.dashboard}  onRefresh={()=>reload("dashboard","/api/admin/dashboard")} />}
        {tab==="products"   && <ProductsTab   token={token} data={cache.products}   loading={!!loading.products}   onRefresh={()=>reload("products","/api/products?limit=100")} catData={cache.categories} />}
        {tab==="categories" && <CategoriesTab token={token} data={cache.categories} loading={!!loading.categories} onRefresh={()=>reload("categories","/api/admin/categories")} />}
        {tab==="users"      && <UsersTab      token={token} data={cache.users}      loading={!!loading.users}      onRefresh={()=>reload("users","/api/admin/users?limit=50")} />}
        {tab==="orders"     && <OrdersTab     token={token} data={cache.orders}     loading={!!loading.orders}     onRefresh={()=>reload("orders","/api/admin/orders?limit=50")} />}
        {tab==="customers"  && <CustomersTab  token={token} data={cache.customers}  loading={!!loading.customers}  onRefresh={()=>reload("customers","/api/admin/customers?limit=100")} />}
      </div>
    </div>
  );
}
