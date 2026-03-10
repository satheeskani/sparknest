import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, ShieldCheck, Truck, Star } from "lucide-react";
import { loginUser, registerUser } from "../../utils/api";
import { loginSuccess } from "../../redux/slices/authSlice";
import toast from "react-hot-toast";

const TRUST = [
  { icon: ShieldCheck, text: "100% Safe & Certified" },
  { icon: Truck,       text: "Free Shipping ₹999+"  },
  { icon: Star,        text: "4.9 ★ Rated"           },
];

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [showPass, setShowPass]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [errors, setErrors]         = useState({});
  const [form, setForm] = useState({ name:"", emailOrPhone:"", email:"", phone:"", password:"" });

  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const token     = useSelector(state => state.auth.token);

  // ── Redirect if already logged in ──
  useEffect(() => {
    if (token) navigate("/", { replace: true });
  }, [token, navigate]);

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (isRegister) {
      if (!form.name.trim())                       e.name  = "Full name is required";
      if (!form.email.trim())                      e.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(form.email))  e.email = "Enter a valid email";
      if (!form.phone.trim())                      e.phone = "Phone number is required";
      else if (!/^[6-9]\d{9}$/.test(form.phone))  e.phone = "Enter a valid 10-digit mobile number";
    } else {
      const val = form.emailOrPhone.trim();
      if (!val)
        e.emailOrPhone = "Email or phone number is required";
      else if (!/\S+@\S+\.\S+/.test(val) && !/^[6-9]\d{9}$/.test(val))
        e.emailOrPhone = "Enter a valid email or 10-digit phone";
    }
    if (!form.password)              e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Minimum 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      let payload;
      if (isRegister) {
        payload = { name: form.name, email: form.email, phone: form.phone, password: form.password };
      } else {
        const val = form.emailOrPhone.trim();
        payload = { [/^[6-9]\d{9}$/.test(val) ? "phone" : "email"]: val, password: form.password };
      }
      const { data } = isRegister ? await registerUser(payload) : await loginUser(payload);
      dispatch(loginSuccess({ user: data.user, token: data.token }));
      toast.success(`Welcome${isRegister ? "" : " back"}, ${data.user.name}! 🎆`);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsRegister(r => !r);
    setErrors({});
    setForm({ name:"", emailOrPhone:"", email:"", phone:"", password:"" });
    setShowPass(false);
  };

  const inp = (field) => ({
    width:"100%",
    background:"rgba(255,255,255,0.05)",
    border:`1.5px solid ${errors[field] ? "rgba(255,80,80,0.6)" : "rgba(255,245,230,0.1)"}`,
    borderRadius:14, padding:"0.88rem 1.1rem",
    color:"#FFF5E6", fontFamily:"'DM Sans', sans-serif",
    fontSize:"0.95rem", outline:"none",
    transition:"border-color 0.25s, box-shadow 0.25s",
    boxSizing:"border-box",
  });

  const errMsg = (field) => errors[field]
    ? <p style={{ color:"#FF5050", fontSize:"0.7rem", marginTop:"0.28rem", paddingLeft:"0.2rem" }}>{errors[field]}</p>
    : null;

  return (
    <div style={{ minHeight:"100vh", display:"flex", fontFamily:"'DM Sans', sans-serif", overflow:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@900&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,800&display=swap');
        * { box-sizing: border-box; }
        @keyframes shimmer { 0%{background-position:0% center} 100%{background-position:200% center} }
        @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to{transform:rotate(360deg)} }

        .auth-input:focus {
          border-color: rgba(255,107,0,0.55) !important;
          box-shadow: 0 0 0 3px rgba(255,107,0,0.1) !important;
          background: rgba(255,107,0,0.05) !important;
        }
        .auth-input::placeholder { color: rgba(255,245,230,0.45); }

        .submit-btn {
          width:100%; padding:0.92rem;
          background:linear-gradient(90deg,#FF3D00,#FF6B00,#FFD700,#FF6B00,#FF3D00);
          background-size:300% auto; animation:shimmer 3s linear infinite;
          border:none; border-radius:14px; color:#1A0500;
          font-family:'DM Sans',sans-serif; font-size:1rem; font-weight:800;
          cursor:pointer; display:flex; align-items:center; justify-content:center; gap:0.5rem;
          transition:transform 0.2s,box-shadow 0.2s;
          box-shadow:0 8px 28px rgba(255,107,0,0.38);
        }
        .submit-btn:hover:not(:disabled){ transform:translateY(-2px); box-shadow:0 12px 36px rgba(255,107,0,0.55); }
        .submit-btn:disabled{ opacity:0.65; cursor:not-allowed; animation:none; background:#FF6B00; }

        .lamp { animation:float 3s ease-in-out infinite; display:inline-block; }
        .form-wrap { animation:fadeUp 0.38s ease both; }
        .glow-orb { position:absolute; border-radius:50%; filter:blur(65px); pointer-events:none; }

        .login-brand {
          font-family: 'Cinzel Decorative', serif;
          font-size: 2.6rem;
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 0.5rem;
          background: linear-gradient(90deg,#FF6B00,#FF3D00,#FF1493,#FF6B00,#FF3D00,#FF6B00);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
          filter: drop-shadow(0 0 14px rgba(255,107,0,0.3));
          -webkit-font-smoothing: antialiased;
          text-rendering: geometricPrecision;
        }

        .switch-btn {
          background:none; border:none; cursor:pointer;
          font-family:'DM Sans',sans-serif; font-size:0.83rem; font-weight:700;
          color:#FF6B00; text-decoration:underline; text-underline-offset:3px; padding:0;
        }
        .switch-btn:hover { color:#FFD700; }

        @media(max-width:768px){
          .left-panel{ display:none !important; }
          .right-panel{ width:100% !important; }
        }
      `}</style>

      {/* ══════ LEFT PANEL ══════ */}
      <div className="left-panel" style={{
        width:"46%", flexShrink:0,
        background:"linear-gradient(160deg,#FFF8F0 0%,#FFF3E0 50%,#FEF9F0 100%)",
        position:"relative", overflow:"hidden",
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        padding:"3rem 2.5rem",
      }}>
        <div className="glow-orb" style={{ width:420,height:420,background:"rgba(255,107,0,0.08)",top:"-12%",left:"-18%" }}/>
        <div className="glow-orb" style={{ width:280,height:280,background:"rgba(255,215,0,0.1)",bottom:"8%",right:"-12%" }}/>
        <div className="glow-orb" style={{ width:180,height:180,background:"rgba(255,20,147,0.05)",top:"48%",left:"58%" }}/>
        {/* dot grid */}
        <div style={{ position:"absolute",inset:0,opacity:0.6,backgroundImage:"radial-gradient(rgba(255,107,0,0.25) 1px,transparent 1px)",backgroundSize:"28px 28px" }}/>

        <div style={{ position:"relative",zIndex:1,textAlign:"center",maxWidth:340 }}>
          {/* Lamps */}
          <div style={{ fontSize:"1.9rem",marginBottom:"2rem",display:"flex",justifyContent:"center",gap:"1rem" }}>
            {["🪔","✨","🎆","✨","🪔"].map((e,i)=>(
              <span key={i} className="lamp" style={{ animationDelay:`${i*0.4}s` }}>{e}</span>
            ))}
          </div>

          {/* SparkNest brand — Cinzel Decorative + rainbow shimmer, same as Home hero */}
          <div className="login-brand">SparkNest</div>

          <p style={{ color:"rgba(26,8,0,0.75)",fontSize:"0.76rem",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:"2.8rem",fontFamily:"'DM Sans',sans-serif" }}>
            Where Every Celebration Begins
          </p>

          {/* Centre firework */}
          <div className="lamp" style={{ fontSize:"6.5rem",marginBottom:"2.2rem",filter:"drop-shadow(0 0 36px rgba(255,215,0,0.5))",animationDelay:"0.6s",display:"block" }}>
            🎇
          </div>

          {/* Trust pills */}
          <div style={{ display:"flex",flexDirection:"column",gap:"0.65rem",alignItems:"center" }}>
            {TRUST.map(({ icon:Icon, text }) => (
              <div key={text} style={{ display:"inline-flex",alignItems:"center",gap:"0.45rem",background:"rgba(255,107,0,0.07)",border:"1px solid rgba(255,107,0,0.2)",borderRadius:100,padding:"0.42rem 1rem",fontSize:"0.75rem",color:"rgba(26,8,0,0.8)",fontWeight:500,fontFamily:"'DM Sans',sans-serif" }}>
                <Icon size={12} color="#FF6B00" strokeWidth={2.2}/> {text}
              </div>
            ))}
          </div>

          <p style={{ marginTop:"2.2rem",color:"rgba(26,8,0,0.65)",fontSize:"0.67rem",letterSpacing:"0.1em",fontFamily:"'DM Sans',sans-serif" }}>
            🏭 Direct from Sivakasi &nbsp;·&nbsp; Pan India Delivery 🚚
          </p>
        </div>
      </div>

      {/* ══════ RIGHT PANEL ══════ */}
      <div className="right-panel" style={{
        flex:1, background:"#0D0600",
        display:"flex", alignItems:"center", justifyContent:"center",
        padding:"2rem", position:"relative",
      }}>
        <div style={{ position:"absolute",top:"35%",left:"50%",transform:"translate(-50%,-50%)",width:480,height:480,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,107,0,0.055) 0%,transparent 70%)",pointerEvents:"none" }}/>

        <div className="form-wrap" style={{ width:"100%",maxWidth:390,position:"relative",zIndex:1 }}>

          {/* Heading */}
          <div style={{ marginBottom:"1.8rem" }}>
            <h1 style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"1.65rem",fontWeight:800,color:"#FFF5E6",marginBottom:"0.35rem",letterSpacing:"-0.01em" }}>
              {isRegister ? "Create Account" : "Welcome"}
            </h1>
            <p style={{ fontFamily:"'DM Sans',sans-serif",color:"rgba(255,245,230,0.9)",fontSize:"0.84rem",fontWeight:400 }}>
              {isRegister ? "Join 10,000+ happy customers 🎆" : "Sign in to your SparkNest account"}
            </p>
          </div>

          <div style={{ display:"flex",flexDirection:"column",gap:"0.85rem" }}>

            {/* ── REGISTER FIELDS ── */}
            {isRegister && (
              <>
                {/* Full Name */}
                <div>
                  <input className="auth-input" style={inp("name")} placeholder="Full Name"
                    value={form.name} onChange={e=>set("name",e.target.value)}/>
                  {errMsg("name")}
                </div>
                {/* Email */}
                <div>
                  <input className="auth-input" style={inp("email")} type="email" placeholder="Email Address"
                    value={form.email} onChange={e=>set("email",e.target.value)}/>
                  {errMsg("email")}
                </div>
                {/* Phone */}
                <div>
                  <div style={{ position:"relative" }}>
                    <span style={{ position:"absolute",left:"1.1rem",top:"50%",transform:"translateY(-50%)",color:"rgba(255,245,230,0.8)",fontSize:"0.9rem",fontWeight:600,borderRight:"1px solid rgba(255,245,230,0.1)",paddingRight:"0.65rem",pointerEvents:"none",fontFamily:"'DM Sans',sans-serif" }}>+91</span>
                    <input className="auth-input" style={{ ...inp("phone"),paddingLeft:"3.8rem" }}
                      placeholder="10-digit mobile number" value={form.phone} maxLength={10}
                      onChange={e=>set("phone",e.target.value.replace(/\D/g,""))}/>
                  </div>
                  {errMsg("phone")}
                </div>
              </>
            )}

            {/* ── LOGIN FIELD — single email or phone ── */}
            {!isRegister && (
              <div>
                <input className="auth-input" style={inp("emailOrPhone")}
                  placeholder="Email address or phone number"
                  value={form.emailOrPhone}
                  onChange={e=>set("emailOrPhone",e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>
                {errMsg("emailOrPhone")}
              </div>
            )}

            {/* Password */}
            <div>
              <div style={{ position:"relative" }}>
                <input className="auth-input" style={{ ...inp("password"),paddingRight:"3rem" }}
                  type={showPass?"text":"password"} placeholder="Password"
                  value={form.password} onChange={e=>set("password",e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>
                <button onClick={()=>setShowPass(s=>!s)} style={{ position:"absolute",right:"1rem",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"rgba(255,245,230,0.8)",padding:0,display:"flex",alignItems:"center",transition:"color 0.2s" }}
                  onMouseEnter={e=>e.currentTarget.style.color="rgba(255,245,230,0.7)"}
                  onMouseLeave={e=>e.currentTarget.style.color="rgba(255,245,230,0.6)"}>
                  {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
              {errMsg("password")}
            </div>

            {/* Forgot password */}
            {!isRegister && (
              <div style={{ textAlign:"right",marginTop:"-0.2rem" }}>
                <button style={{ background:"none",border:"none",cursor:"pointer",color:"rgba(255,215,0,0.8)",fontSize:"0.77rem",fontFamily:"'DM Sans',sans-serif",fontWeight:500,transition:"color 0.2s" }}
                  onMouseEnter={e=>e.currentTarget.style.color="rgba(255,215,0,0.8)"}
                  onMouseLeave={e=>e.currentTarget.style.color="rgba(255,215,0,0.8)"}>
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit */}
            <button className="submit-btn" onClick={handleSubmit} disabled={loading} style={{ marginTop:"0.2rem" }}>
              {loading ? (
                <><span style={{ width:15,height:15,border:"2px solid rgba(0,0,0,0.25)",borderTopColor:"#1A0500",borderRadius:"50%",display:"inline-block",animation:"spin 0.7s linear infinite" }}/> Please wait...</>
              ) : (
                <>{isRegister ? "Create Account" : "Sign In"} <ArrowRight size={16}/></>
              )}
            </button>

            {/* Switch login ↔ register */}
            <p style={{ textAlign:"center",fontSize:"0.82rem",color:"rgba(255,245,230,0.9)",paddingTop:"0.2rem",fontFamily:"'DM Sans',sans-serif" }}>
              {isRegister ? "Already have an account? " : "New to SparkNest? "}
              <button className="switch-btn" onClick={switchMode}>
                {isRegister ? "Sign In" : "Create Account"}
              </button>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
