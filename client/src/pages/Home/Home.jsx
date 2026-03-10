import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  Factory, ShieldCheck, Truck,
  Users, Package, Star,
  Baby, Gift, Flame, Tag, MapPin
} from "lucide-react";
import AISearch from "../../components/AISearch/AISearch";

const categories = [
  { name:"Sparklers",   img:"https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80", count:24, color:"#FFD700", stripe:"linear-gradient(90deg,#FFD700,#FF8C00)" },
  { name:"Rockets",     img:"https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=600&q=80", count:18, color:"#FF6B9D", stripe:"linear-gradient(90deg,#FF6B9D,#C0392B)" },
  { name:"Bombs",       img:"https://images.unsplash.com/photo-1514254040595-6e0d913fc1e4?w=600&q=80", count:15, color:"#FF4500", stripe:"linear-gradient(90deg,#FF4500,#FF6B00)" },
  { name:"Flower Pots", img:"https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=600&q=80", count:21, color:"#FF1493", stripe:"linear-gradient(90deg,#FF1493,#FF69B4)" },
  { name:"Sky Shots",   img:"https://images.unsplash.com/photo-1533230408708-8f9f91d1235a?w=600&q=80", count:12, color:"#00BFFF", stripe:"linear-gradient(90deg,#00BFFF,#7B2FBE)" },
  { name:"Kids Special",img:"https://images.unsplash.com/photo-1604881991720-f91add269bed?w=600&q=80", count:32, color:"#2ECC71", stripe:"linear-gradient(90deg,#2ECC71,#1ABC9C)" },
  { name:"Combo Packs", img:"https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&q=80", count:15, color:"#F39C12", stripe:"linear-gradient(90deg,#F39C12,#E67E22)" },
  { name:"Gift Boxes",  img:"https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80", count: 9, color:"#9B59B6", stripe:"linear-gradient(90deg,#9B59B6,#6C3483)" },
];

const marqueeItems = [
  { text: "✨ Premium Sivakasi Quality",  color: "#FFD700" },
  { text: "🚚 Pan India Delivery",         color: "#00BFFF" },
  { text: "🛡️ 100% Safe & Certified",     color: "#2ECC71" },
  { text: "🎆 Diwali Special Combos",      color: "#FFD700" },
  { text: "🧒 Kids Safe Collection",       color: "#2ECC71" },
  { text: "💳 Razorpay Secure Payments",   color: "#00BFFF" },
  { text: "⭐ 10,000+ Happy Customers",    color: "#FF6B9D" },
  { text: "🪔 Happy Diwali 2025",          color: "#FFD700" },
  { text: "🎇 Free Shipping above ₹999",   color: "#2ECC71" },
  { text: "🏭 Direct from Sivakasi",       color: "#FF6B9D" },
];


export default function Home() {
  const [aiResults, setAiResults] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const setSize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    setSize();
    window.addEventListener("resize", setSize);

    const colors = ["#FFD700","#FF6B00","#FF1493","#00BFFF","#2ECC71","#9B59B6","#FF4500","#FFA500","#FF69B4","#FFFFFF","#FF4444","#44FFAA"];

    // ── Floating background particles (original) ──
    const bgParticles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2.5 + 0.4,
      speedY: -(Math.random() * 0.3 + 0.08),
      speedX: (Math.random() - 0.5) * 0.12,
      opacity: Math.random() * 0.5 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    // ── Firework burst particle ──
    class BurstParticle {
      constructor(x, y, color) {
        this.x = x; this.y = y;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3.5 + 1.5;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1;
        this.decay = Math.random() * 0.010 + 0.007;
        this.size = Math.random() * 3 + 1;
        this.gravity = 0.12;
        this.trail = Math.random() > 0.5;
        this.px = x; this.py = y;
      }
      update() {
        this.px = this.x; this.py = this.y;
        this.x += this.vx; this.y += this.vy;
        this.vy += this.gravity; this.vx *= 0.97;
        this.alpha -= this.decay;
      }
      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        if (this.trail) {
          ctx.beginPath(); ctx.moveTo(this.px, this.py); ctx.lineTo(this.x, this.y);
          ctx.strokeStyle = this.color; ctx.lineWidth = this.size * 0.8;
          ctx.shadowBlur = 10; ctx.shadowColor = this.color; ctx.stroke();
        } else {
          ctx.fillStyle = this.color; ctx.shadowBlur = 14; ctx.shadowColor = this.color;
          ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
      }
      isDead() { return this.alpha <= 0; }
    }

    // ── Rising rocket ──
    class Rocket {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
        this.y = canvas.height + 10;
        this.vy = -(Math.random() * 7 + 9);
        this.vx = (Math.random() - 0.5) * 1.5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.targetY = Math.random() * canvas.height * 0.45 + canvas.height * 0.05;
        this.exploded = false;
        this.trail = [];
      }
      update() {
        this.trail.push({ x: this.x, y: this.y, alpha: 0.7 });
        if (this.trail.length > 18) this.trail.shift();
        this.trail.forEach(t => t.alpha -= 0.05);
        this.x += this.vx; this.y += this.vy; this.vy += 0.18;
        if (this.y <= this.targetY) this.exploded = true;
      }
      drawTrail(ctx) {
        this.trail.forEach((t, i) => {
          ctx.save();
          ctx.globalAlpha = Math.max(0, t.alpha * (i / this.trail.length));
          ctx.fillStyle = this.color; ctx.shadowBlur = 8; ctx.shadowColor = this.color;
          const sz = (i / this.trail.length) * 3;
          ctx.beginPath(); ctx.arc(t.x, t.y, sz, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        });
      }
      draw(ctx) {
        this.drawTrail(ctx);
        ctx.save(); ctx.globalAlpha = 1; ctx.fillStyle = "#FFFFFF";
        ctx.shadowBlur = 16; ctx.shadowColor = this.color;
        ctx.beginPath(); ctx.arc(this.x, this.y, 3, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    }

    // ── Sparkler ring burst ──
    class SparklerBurst {
      constructor(x, y) {
        this.x = x; this.y = y; this.particles = [];
        const count = Math.floor(Math.random() * 20 + 28);
        const baseColor = colors[Math.floor(Math.random() * colors.length)];
        const accent    = colors[Math.floor(Math.random() * colors.length)];
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2;
          const speed = Math.random() * 2.5 + 1;
          this.particles.push({ x, y, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed,
            color: Math.random() > 0.5 ? baseColor : accent, alpha: 1, size: Math.random()*2+1, decay: 0.022 });
        }
      }
      update() { this.particles.forEach(p => { p.x+=p.vx; p.y+=p.vy; p.vy+=0.06; p.alpha-=p.decay; }); }
      draw(ctx) {
        this.particles.forEach(p => {
          if (p.alpha <= 0) return;
          ctx.save(); ctx.globalAlpha = p.alpha; ctx.fillStyle = p.color;
          ctx.shadowBlur = 10; ctx.shadowColor = p.color;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill(); ctx.restore();
        });
      }
      isDead() { return this.particles.every(p => p.alpha <= 0); }
    }

    const rockets = []; const bursts = []; const sparklerBursts = [];
    let frameCount = 0;
    rockets.push(new Rocket());

    const animate = () => {
      frameCount++;
      ctx.fillStyle = "rgba(0,0,0,0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      bgParticles.forEach(p => {
        p.y += p.speedY; p.x += p.speedX; p.opacity -= 0.001;
        if (p.y < -10 || p.opacity <= 0) {
          p.y = canvas.height + 10; p.x = Math.random() * canvas.width;
          p.opacity = Math.random() * 0.5 + 0.1;
        }
        ctx.save(); ctx.globalAlpha = p.opacity; ctx.fillStyle = p.color;
        ctx.shadowBlur = 6; ctx.shadowColor = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill(); ctx.restore();
      });

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        if (!r.exploded) { r.update(); r.draw(ctx); }
        else {
          const burstCount = Math.floor(Math.random() * 40 + 60);
          for (let j = 0; j < burstCount; j++)
            bursts.push(new BurstParticle(r.x, r.y, colors[Math.floor(Math.random()*colors.length)]));
          sparklerBursts.push(new SparklerBurst(r.x, r.y));
          ctx.save(); ctx.globalAlpha = 0.35;
          const grad = ctx.createRadialGradient(r.x, r.y, 0, r.x, r.y, 80);
          grad.addColorStop(0, r.color); grad.addColorStop(1, "transparent");
          ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(r.x, r.y, 80, 0, Math.PI*2); ctx.fill(); ctx.restore();
          rockets.splice(i, 1);
        }
      }

      for (let i = bursts.length-1; i >= 0; i--) { bursts[i].update(); bursts[i].draw(ctx); if (bursts[i].isDead()) bursts.splice(i,1); }
      for (let i = sparklerBursts.length-1; i >= 0; i--) { sparklerBursts[i].update(); sparklerBursts[i].draw(ctx); if (sparklerBursts[i].isDead()) sparklerBursts.splice(i,1); }

      if (frameCount % 220 === 0) rockets.push(new Rocket());
      if (frameCount % 550 === 0) rockets.push(new Rocket());
      requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", setSize); };
  }, []);

  return (
    <div style={{ width:"100%", overflowX:"hidden" }}>
      <style>{`
        html, body { overflow-x:hidden; max-width:100%; }

        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .marquee-track { display:flex; gap:3rem; animation:marquee 22s linear infinite; width:max-content; white-space:nowrap; }

        @keyframes float     { 0%,100%{transform:translateY(0)}  50%{transform:translateY(-12px)} }
        @keyframes shimmer   { 0%{background-position:0% center} 100%{background-position:200% center} }
        @keyframes glow-pulse{ 0%,100%{box-shadow:0 0 20px #FFD70044,0 0 40px #FF6B0033} 50%{box-shadow:0 0 40px #FFD70099,0 0 80px #FF6B0055} }

        .diwali-lamp { animation:float 3s ease-in-out infinite; display:inline-block; }
        .hero-badge  { animation:glow-pulse 2.5s ease-in-out infinite; }
        .hero-shimmer {
          background:linear-gradient(90deg,#FFD700,#FF6B00,#FF1493,#9B59B6,#00BFFF,#2ECC71,#FFD700);
          background-size:200% auto;
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          animation:shimmer 3s linear infinite;
        }

        .shop-btn {
          background: linear-gradient(90deg, #FF3D00, #FF6B00, #FFD700, #FF6B00, #FF3D00);
          background-size: 300% auto;
          animation: gradient-slide 3s linear infinite;
          color: #1A0500 !important;
          padding: 0.9rem 2.4rem; border-radius: 100px;
          font-size: 0.95rem; font-weight: 800;
          text-decoration: none; display: inline-block;
          box-shadow: 0 8px 30px rgba(255,107,0,0.4);
          transition: transform .2s, box-shadow .2s;
        }
        .shop-btn:hover { transform:scale(1.06); box-shadow:0 12px 40px rgba(255,107,0,0.65); }

        .kids-btn {
          background: linear-gradient(90deg, #1ABC9C, #2ECC71, #A8E063, #2ECC71, #1ABC9C);
          background-size: 300% auto;
          animation: gradient-slide 3s linear infinite;
          color: #fff !important;
          padding: 0.9rem 2.4rem; border-radius: 100px;
          font-size: 0.95rem; font-weight: 800;
          text-decoration: none; display: inline-block;
          box-shadow: 0 8px 30px rgba(46,204,113,0.4);
          transition: transform .2s, box-shadow .2s;
        }
        .kids-btn:hover { transform:scale(1.06); box-shadow:0 12px 40px rgba(46,204,113,0.65); }

        @keyframes gradient-slide {
          0%   { background-position: 0% center; }
          100% { background-position: 300% center; }
        }

        /* ── Category section — cream masonry ── */
        .cat-section-outer {
          position: relative; z-index: 2;
          background: linear-gradient(160deg, #FFF8F0 0%, #FFF3E0 40%, #FEF9F0 100%);
          padding: 5rem clamp(1.2rem, 5vw, 4rem) 5.5rem;
          overflow: hidden;
        }

        .cat-section-inner { max-width: 1240px; margin: 0 auto; }

        /* masonry columns */
        .masonry-grid { columns: 4; column-gap: 1rem; }
        .masonry-item {
          break-inside: avoid; margin-bottom: 1rem;
          border-radius: 18px; overflow: hidden;
          position: relative; cursor: pointer;
          text-decoration: none; display: block;
          transition: transform .38s cubic-bezier(.22,1,.36,1), box-shadow .38s;
          box-shadow: 0 4px 18px rgba(0,0,0,0.12);
          background: #fff;
        }
        .masonry-item:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 55px rgba(0,0,0,0.18);
        }
        .masonry-item:hover .cat-img { transform: scale(1.07); }


        .masonry-info {
          background: #fff; padding: 0.9rem 1rem 1rem;
          position: relative;
          border-top: 3px solid transparent;
          border-image: var(--cat-stripe) 1;
        }
        .masonry-info::before {
          content: ''; position: absolute;
          top: 0; left: 0; right: 0; height: 3px;
          background: var(--cat-stripe);
        }
        .masonry-cat-name {
          font-size: 0.92rem; font-weight: 800;
          color: #1a0800; letter-spacing: 0.01em; margin-bottom: 0.15rem;
        }
        .masonry-cat-count {
          font-size: 0.62rem; font-weight: 600;
          color: #aaa; letter-spacing: 0.08em; text-transform: uppercase;
          margin-bottom: 0.55rem;
        }
        .masonry-pill {
          display: inline-flex; align-items: center; gap: 0.25rem;
          border-radius: 100px; padding: 0.24rem 0.8rem;
          font-size: 0.65rem; font-weight: 800; letter-spacing: 0.04em;
          border: 1.5px solid; cursor: pointer;
        }

        /* ── Trust card ── */
        .trust-card {
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.1);
          border-radius:22px; padding:2rem 1.5rem; text-align:center;
          transition:transform .3s, border-color .3s, box-shadow .3s;
          backdrop-filter:blur(12px);
        }
        .trust-card:hover { transform:translateY(-6px); border-color:rgba(255,215,0,.35); box-shadow:0 20px 50px rgba(255,215,0,.1); }

        .desktop-ai-search { display: block; width: 100%; }

        @media(max-width:900px) {
          .masonry-grid { columns: 2; }
          .trust-grid   { grid-template-columns:repeat(3,1fr) !important; }
        }
        @media(max-width:560px) {
          .hero-section   { padding:6rem 1.2rem 3rem !important; }
          .hero-lamps     { font-size:1.5rem !important; gap:0.7rem !important; }
          .hero-badge-wrap{ margin-bottom:1.4rem !important; font-size:0.68rem !important; }
          .cta-row        { flex-direction:column; align-items:center; gap:0.8rem !important; }
          .shop-btn, .kids-btn { width:100%; text-align:center; padding:0.9rem 1.5rem; justify-content:center; }
          .stats-row { display:grid !important; grid-template-columns:1fr 1fr !important; gap:1.2rem !important; margin-top:2.5rem !important; }
          .cat-section-outer { padding:3rem 1rem 4rem; }
          .masonry-grid   { columns: 2; column-gap: 0.6rem; }
          .masonry-item   { margin-bottom: 0.6rem; border-radius: 12px; }
          .masonry-canvas-wrap { height: 130px !important; }
          .masonry-info   { padding: 0.65rem 0.75rem 0.75rem; }
          .masonry-cat-name { font-size: 0.78rem; }
          .banner-section { padding:0 0 3rem !important; }
          .banner-inner   { padding:2.5rem 1.2rem !important; }
          .banner-emojis  { font-size:1.6rem !important; letter-spacing:0.3rem !important; }
          .banner-title   { font-size:1.2rem !important; }
          .banner-sub     { font-size:0.88rem !important; }
          .trust-section  { padding:1rem 1.2rem 4rem !important; }
          .trust-grid     { grid-template-columns:1fr !important; gap:1rem !important; }
          .trust-card     { padding:1.5rem 1.2rem !important; }
        }
        @media(max-width:380px) {
          .masonry-grid { columns: 1; }
          .stats-row    { gap:0.8rem !important; }
        }
      `}</style>

      {/* Particle Canvas */}
      <canvas ref={canvasRef} style={{ position:"fixed", top:0, left:0, width:"100%", height:"100%", zIndex:0, pointerEvents:"none" }} />

      {/* ════════════ HERO ════════════ */}
      <section className="hero-section" style={{
        minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
        position:"relative", zIndex:2,
        padding:"6rem clamp(1.2rem,5vw,3rem) 2rem",
        textAlign:"center",
        background:"radial-gradient(ellipse 100% 80% at 50% -10%,rgba(255,107,0,.2) 0%,rgba(155,89,182,.12) 45%,transparent 70%)",
        overflow:"hidden",
      }}>
        <div style={{ position:"absolute", fontSize:"18vw", opacity:.04, fontWeight:900, userSelect:"none",
          top:"50%", left:"50%", transform:"translate(-50%,-50%)", whiteSpace:"nowrap", color:"#FFD700", zIndex:0 }}>
          DIWALI
        </div>
        <div style={{ maxWidth:860, width:"100%", position:"relative", zIndex:1 }}>
          <div className="hero-lamps" style={{ fontSize:"2rem", marginBottom:"1.2rem", display:"flex", justifyContent:"center", gap:"1.2rem" }}>
            {["🪔","✨","🎆","🎇","🪔"].map((e,i)=>( <span key={i} className="diwali-lamp" style={{ animationDelay:`${i*0.4}s` }}>{e}</span> ))}
          </div>
          <div className="hero-badge hero-badge-wrap" style={{
            display:"inline-flex", alignItems:"center", gap:"0.5rem",
            background:"linear-gradient(135deg,rgba(255,215,0,.15),rgba(255,107,0,.1))",
            border:"1px solid rgba(255,215,0,.5)", borderRadius:100,
            padding:"0.5rem 1.4rem", fontSize:"0.75rem", letterSpacing:"0.15em",
            textTransform:"uppercase", color:"#FFD700", marginBottom:"2rem",
          }}>
            ✨ Premium Crackers from Sivakasi
          </div>
          <h1 style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:"clamp(1.5rem,5vw,3rem)", fontWeight:900, lineHeight:1.15, marginBottom:"1.2rem" }}>
            <span style={{ display:"block", color:"#FFF5E6", textShadow:"0 0 40px rgba(255,215,0,.4)" }}>Spark the Joy of Every</span>
            <span className="hero-shimmer" style={{ display:"block" }}>Festival</span>
          </h1>
          <p style={{ fontSize:"clamp(0.88rem,2.5vw,1.05rem)", color:"rgba(255,245,230,.75)", maxWidth:520, margin:"0 auto 1.2rem", lineHeight:1.8, fontWeight:300 }}>
            Premium crackers from <span style={{ color:"#FFD700", fontWeight:700 }}>Sivakasi</span> 🏭 &nbsp;·&nbsp; Pan India delivery 🚚
          </p>
          <div className="desktop-ai-search">
            <AISearch onResults={(r) => setAiResults(r)} />
          </div>
          <div className="cta-row" style={{ display:"flex", gap:"1rem", justifyContent:"center", flexWrap:"wrap", marginTop:"1.2rem" }}>
            <Link to="/products" className="shop-btn" style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem" }}>
              Shop Now <Flame size={18} strokeWidth={2} />
            </Link>
            <Link to="/products?isSafeForKids=true" className="kids-btn" style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem" }}>
              Kids Safe <Baby size={18} strokeWidth={2} />
            </Link>
          </div>
          <div className="stats-row" style={{ display:"flex", justifyContent:"center", gap:"3rem", flexWrap:"wrap", marginTop:"3.5rem", paddingTop:"2rem", borderTop:"1px solid rgba(255,255,255,.07)" }}>
            {[
              { Icon:Users,   num:"10,000+", label:"Happy Customers", color:"#FFD700" },
              { Icon:Package, num:"500+",    label:"Products",        color:"#FF6B9D" },
              { Icon:Star,    num:"4.9",     label:"Rating",          color:"#2ECC71" },
              { Icon:Truck,   num:"Free",    label:"Shipping ₹999+",  color:"#00BFFF" },
            ].map(s=>(
              <div key={s.label} style={{ textAlign:"center" }}>
                <div style={{ display:"flex", justifyContent:"center", marginBottom:"0.4rem" }}>
                  <s.Icon size={22} color={s.color} strokeWidth={1.6} style={{ filter:`drop-shadow(0 0 6px ${s.color}99)` }} />
                </div>
                <div style={{ fontSize:"clamp(1.2rem,3vw,1.6rem)", fontWeight:800, color:s.color, textShadow:`0 0 20px ${s.color}88` }}>{s.num}</div>
                <div style={{ fontSize:"0.7rem", color:"rgba(255,245,230,.45)", marginTop:"0.25rem", textTransform:"uppercase", letterSpacing:"0.08em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ MARQUEE ════════════ */}
      <div style={{ position:"relative", zIndex:2, overflow:"hidden", width:"100%", background:"#0D0D0D", borderTop:"2px solid rgba(255,215,0,.35)", borderBottom:"2px solid rgba(255,215,0,.35)", padding:"0.85rem 0" }}>
        <div className="marquee-track">
          {[...marqueeItems,...marqueeItems].map((item,i)=>(
            <span key={i} style={{ fontSize:"0.8rem", letterSpacing:"0.12em", textTransform:"uppercase", color:item.color, fontWeight:700, flexShrink:0 }}>
              {item.text}
              <span style={{ marginLeft:"3rem", color:"rgba(255,255,255,.15)" }}>◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ════════════ CATEGORIES — cream masonry ════════════ */}
      <div className="cat-section-outer">
        <div className="cat-section-inner">
          <div style={{ textAlign:"center", marginBottom:"2.8rem" }}>
            <p style={{ fontSize:"0.7rem", letterSpacing:"0.22em", textTransform:"uppercase", color:"#FF6B00", fontWeight:700, marginBottom:"0.5rem", display:"flex", alignItems:"center", justifyContent:"center", gap:"0.4rem" }}>
              <Tag size={11} color="#FF6B00" strokeWidth={2.5} /> Browse Categories
            </p>
            <h2 style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:"clamp(1.4rem,3vw,2.6rem)", color:"#1a0a00", fontWeight:900, lineHeight:1.2 }}>
              Shop by{" "}
              <span style={{ background:"linear-gradient(135deg,#FF6B00,#FF1493,#9B59B6,#00BFFF)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                Category
              </span>
            </h2>
            <p style={{ marginTop:"0.6rem", color:"#999", fontSize:"0.82rem" }}>
              8 categories · 144+ products · direct from Sivakasi
            </p>
          </div>

          <div className="masonry-grid">
            {categories.map((cat, i) => (
              <Link key={cat.name}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="masonry-item"
                style={{ "--cat-stripe": cat.stripe }}
              >
                {/* Real photo panel */}
                <div style={{ height:160, position:"relative", overflow:"hidden", background:"#111" }}>
                  <img
                    src={cat.img}
                    alt={cat.name}
                    style={{
                      width:"100%", height:"100%", objectFit:"cover",
                      display:"block", transition:"transform .45s ease",
                    }}
                    onError={e => { e.target.style.display="none"; e.target.parentNode.style.background=`radial-gradient(ellipse at 40% 50%,${cat.color}55,#050200)`; }}
                  />
                  {/* dark overlay for text legibility */}
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.38) 100%)", pointerEvents:"none" }} />
                  {/* category colour tint overlay */}
                  <div style={{ position:"absolute", inset:0, background:`${cat.color}18`, mixBlendMode:"multiply", pointerEvents:"none" }} />
                  {/* number badge */}
                  <div style={{ position:"absolute", top:9, left:9, width:26, height:26, borderRadius:7, background:"rgba(0,0,0,0.52)", backdropFilter:"blur(6px)", border:"1px solid rgba(255,255,255,0.18)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.58rem", fontWeight:900, color:"#fff", letterSpacing:"0.04em" }}>
                    {String(i+1).padStart(2,"0")}
                  </div>
                </div>
                {/* Info */}
                <div className="masonry-info">
                  <div className="masonry-cat-name">{cat.name}</div>
                  <div className="masonry-cat-count">{cat.count} products</div>
                  <div className="masonry-pill" style={{ background:`${cat.color}18`, borderColor: cat.color, color: cat.color }}>
                    ⚡ Shop Now
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════ DIWALI BANNER ════════════ */}
      <section className="banner-section" style={{ position:"relative", zIndex:2, padding:"0 0 4rem" }}>
        <div className="banner-inner" style={{ position:"relative", borderRadius:0, overflow:"hidden", background:"rgba(10,5,0,0.6)", backdropFilter:"blur(20px)", border:"none", borderTop:"1px solid rgba(255,215,0,0.15)", borderBottom:"1px solid rgba(255,215,0,0.15)", boxShadow:"0 30px 80px rgba(0,0,0,0.5)", padding:"4rem clamp(1.2rem,5vw,4rem)", textAlign:"center" }}>
          <div style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:"-30%", left:"-10%", width:"55%", height:"160%", background:"radial-gradient(ellipse,rgba(255,107,0,0.18) 0%,transparent 65%)" }} />
            <div style={{ position:"absolute", top:"-30%", right:"-10%", width:"55%", height:"160%", background:"radial-gradient(ellipse,rgba(155,89,182,0.18) 0%,transparent 65%)" }} />
            <div style={{ position:"absolute", bottom:"-20%", left:"30%", width:"40%", height:"100%", background:"radial-gradient(ellipse,rgba(255,215,0,0.1) 0%,transparent 65%)" }} />
          </div>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg,#FFD700,#FF6B00,#FF1493,#9B59B6,#00BFFF,#2ECC71,#FFD700)", backgroundSize:"200% auto", animation:"shimmer 3s linear infinite" }} />
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:3, background:"linear-gradient(90deg,#2ECC71,#00BFFF,#9B59B6,#FF1493,#FF6B00,#FFD700,#2ECC71)", backgroundSize:"200% auto", animation:"shimmer 3s linear infinite" }} />
          <div style={{ position:"relative", zIndex:1 }}>
            <div className="banner-emojis" style={{ fontSize:"2.2rem", marginBottom:"1.2rem", letterSpacing:"0.5rem", display:"flex", justifyContent:"center", gap:"1rem", flexWrap:"wrap" }}>
              {["🪔","🎆","🎇","🧨","🎆","🪔"].map((e,i)=>( <span key={i} className="diwali-lamp" style={{ animationDelay:`${i*0.25}s` }}>{e}</span> ))}
            </div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", background:"linear-gradient(135deg,rgba(255,215,0,0.15),rgba(255,107,0,0.1))", border:"1px solid rgba(255,215,0,0.4)", borderRadius:100, padding:"0.4rem 1.2rem", fontSize:"0.7rem", letterSpacing:"0.18em", textTransform:"uppercase", color:"#FFD700", marginBottom:"1.2rem", fontWeight:700, WebkitFontSmoothing:"antialiased" }}>
              <Flame size={13} color="#FFD700" strokeWidth={2} /> Limited Time Offer
            </div>
            <h3 className="banner-title" style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:"clamp(1.2rem,3vw,2.4rem)", fontWeight:900, marginBottom:"0.8rem", background:"linear-gradient(135deg,#FFD700,#FF6B00,#FF1493)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              Diwali Special Sale — Up to 40% Off!
            </h3>
            <p className="banner-sub" style={{ color:"rgba(255,245,230,0.7)", fontSize:"clamp(0.85rem,2vw,1rem)", marginBottom:"2rem", fontWeight:300, WebkitFontSmoothing:"antialiased" }}>
              Limited time offers on premium combo packs &amp; gift boxes 🎁
            </p>
            <Link to="/products?category=Combo%20Packs" style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", background:"linear-gradient(135deg,#FFD700,#FF6B00)", borderRadius:100, padding:"0.9rem 2.4rem", color:"#1A0500", fontSize:"0.95rem", fontWeight:800, textDecoration:"none", letterSpacing:"0.02em", boxShadow:"0 8px 30px rgba(255,107,0,0.4), 0 0 0 1px rgba(255,215,0,0.3)", transition:"transform .2s, box-shadow .2s", WebkitFontSmoothing:"antialiased" }}
              onMouseEnter={e=>{ e.currentTarget.style.transform="scale(1.06)"; e.currentTarget.style.boxShadow="0 12px 40px rgba(255,107,0,0.6), 0 0 0 1px rgba(255,215,0,0.5)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow="0 8px 30px rgba(255,107,0,0.4), 0 0 0 1px rgba(255,215,0,0.3)"; }}
            >
              Grab Diwali Deals <Gift size={18} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════ TRUST ════════════ */}
      <section className="trust-section" style={{ position:"relative", zIndex:2, padding:"1rem clamp(1.2rem,4vw,2rem) 5rem" }}>
        <div style={{ textAlign:"center", marginBottom:"2rem" }}>
          <p style={{ fontSize:"0.72rem", letterSpacing:"0.22em", textTransform:"uppercase", color:"#FFD700", fontWeight:700, marginBottom:"0.5rem", display:"flex", alignItems:"center", justifyContent:"center", gap:"0.4rem" }}>
            <MapPin size={12} color="#FFD700" strokeWidth={2} /> Why SparkNest?
          </p>
          <h2 style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:"clamp(1.1rem,2.5vw,2rem)", color:"#FFF5E6", fontWeight:900 }}>
            Trusted by <span style={{ color:"#FFD700" }}>10,000+</span> Happy Customers
          </h2>
        </div>
        <div className="trust-grid" style={{ maxWidth:960, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1.2rem" }}>
          {[
            { Icon: Factory,     title:"Direct from Sivakasi", desc:"Sourced directly from India\'s cracker capital — freshest stock every season.", color:"#FFD700" },
            { Icon: ShieldCheck, title:"Safety Certified",     desc:"All products comply with Govt. safety standards. Kids & family safe.",       color:"#2ECC71" },
            { Icon: Truck,       title:"Pan India Delivery",   desc:"Fast & secure delivery across all 28 states. Free above ₹999.",              color:"#00BFFF" },
          ].map(({ Icon, title, desc, color }) => (
            <div key={title} className="trust-card">
              <div style={{ width:80, height:80, background:`linear-gradient(135deg,${color}18,${color}08)`, border:`1.5px solid ${color}44`, borderRadius:22, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1.4rem", boxShadow:`0 0 30px ${color}22, 0 8px 24px rgba(0,0,0,0.4)` }}>
                <Icon size={36} color={color} strokeWidth={1.4} style={{ filter:`drop-shadow(0 0 10px ${color}bb)` }} />
              </div>
              <div style={{ fontWeight:800, color:"#FFF5E6", fontSize:"clamp(0.9rem,2vw,1.05rem)", marginBottom:"0.5rem" }}>{title}</div>
              <div style={{ fontSize:"clamp(0.78rem,1.5vw,0.85rem)", color:"rgba(255,245,230,.55)", lineHeight:1.7 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
