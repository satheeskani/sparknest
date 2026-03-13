export default function Blog() {
  return (
    <div style={{ minHeight: "100vh", background: "#0D0600", fontFamily: "'Source Sans 3',sans-serif", paddingTop: 88 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Source+Sans+3:wght@300;400;600;700&display=swap');
        .blog-card { background:rgba(255,107,0,0.03); border:1px solid rgba(255,107,0,0.12); border-radius:16px; padding:1.6rem; transition:border-color .2s; }
        .blog-card:hover { border-color:rgba(255,107,0,0.35); }
        .blog-tag { display:inline-block; background:rgba(255,107,0,0.1); border:1px solid rgba(255,107,0,0.25); border-radius:20px; padding:0.2rem 0.75rem; font-size:0.68rem; font-weight:700; color:#FF6B00; text-transform:uppercase; letter-spacing:0.07em; margin-bottom:0.75rem; }
        @media(max-width:700px){ .blog-grid { grid-template-columns:1fr !important; } }
      `}</style>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2.5rem 1.2rem 5rem" }}>

        {/* ── Hero ── */}
        <div style={{ marginBottom: "3rem" }}>
          <p style={{ color: "#FF6B00", fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.14em", margin: "0 0 0.6rem" }}>Diwali Crackers · Buying Guides · Safety Tips</p>
          <h1 style={{ fontFamily: "'Libre Baskerville',serif", color: "#FFF5E6", fontSize: "clamp(1.8rem,4vw,2.6rem)", margin: "0 0 1rem", lineHeight: 1.2 }}>
            SparkNest Blog
          </h1>
          <p style={{ color: "rgba(255,245,230,0.6)", fontSize: "1rem", maxWidth: 560, lineHeight: 1.7, margin: 0 }}>
            Tips on choosing the right crackers, safety guidelines, and everything you need to know about Diwali fireworks from Sivakasi's trusted cracker store.
          </p>
        </div>

        {/* ── Articles ── */}
        <div className="blog-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem" }}>

          <article className="blog-card">
            <span className="blog-tag">Safety Tips</span>
            <h2 style={{ color: "#FFF5E6", fontFamily: "'Libre Baskerville',serif", fontSize: "1.15rem", margin: "0 0 0.75rem", lineHeight: 1.4 }}>
              How to Celebrate Diwali Safely with Firecrackers
            </h2>
            <p style={{ color: "rgba(255,245,230,0.62)", fontSize: "0.9rem", lineHeight: 1.7, margin: "0 0 1rem" }}>
              Always light crackers in an open area away from buildings and dry leaves. Keep a bucket of water or sand nearby. Never lean over a cracker while lighting it. Use a long agarbatti (incense stick) to maintain safe distance. Children must be supervised by adults at all times. Wear cotton clothes — synthetic fabrics catch fire easily. Store unused crackers in a cool, dry place away from heat sources.
            </p>
            <p style={{ color: "rgba(255,245,230,0.38)", fontSize: "0.72rem", margin: 0 }}>October 2025 · 5 min read</p>
          </article>

          <article className="blog-card">
            <span className="blog-tag">Buyer's Guide</span>
            <h2 style={{ color: "#FFF5E6", fontFamily: "'Libre Baskerville',serif", fontSize: "1.15rem", margin: "0 0 0.75rem", lineHeight: 1.4 }}>
              Best Kid-Safe Crackers for Diwali 2025
            </h2>
            <p style={{ color: "rgba(255,245,230,0.62)", fontSize: "0.9rem", lineHeight: 1.7, margin: "0 0 1rem" }}>
              SparkNest's Kids Special collection is designed for children aged 5 and above. Sparklers are the most popular choice — they produce a beautiful golden or silver shower with no loud sound. Flower pots create a colourful fountain effect that kids love. Pop-pops and snake tablets are completely sound-free and safe for younger children. All our kids' products are PESO certified and tested for low chemical emission.
            </p>
            <p style={{ color: "rgba(255,245,230,0.38)", fontSize: "0.72rem", margin: 0 }}>September 2025 · 4 min read</p>
          </article>

          <article className="blog-card">
            <span className="blog-tag">About Sivakasi</span>
            <h2 style={{ color: "#FFF5E6", fontFamily: "'Libre Baskerville',serif", fontSize: "1.15rem", margin: "0 0 0.75rem", lineHeight: 1.4 }}>
              Why Sivakasi Crackers Are the Best in India
            </h2>
            <p style={{ color: "rgba(255,245,230,0.62)", fontSize: "0.9rem", lineHeight: 1.7, margin: "0 0 1rem" }}>
              Sivakasi, Tamil Nadu produces over 90% of India's fireworks. The city's dry climate, skilled workforce, and decades of manufacturing expertise make it the undisputed capital of Indian firecrackers. SparkNest sources all products directly from licensed Sivakasi manufacturers, cutting out middlemen so you get factory-fresh crackers at the best prices. Every product carries a valid PESO licence number printed on the box.
            </p>
            <p style={{ color: "rgba(255,245,230,0.38)", fontSize: "0.72rem", margin: 0 }}>September 2025 · 6 min read</p>
          </article>

          <article className="blog-card">
            <span className="blog-tag">Buyer's Guide</span>
            <h2 style={{ color: "#FFF5E6", fontFamily: "'Libre Baskerville',serif", fontSize: "1.15rem", margin: "0 0 0.75rem", lineHeight: 1.4 }}>
              How to Choose the Right Combo Pack for Your Budget
            </h2>
            <p style={{ color: "rgba(255,245,230,0.62)", fontSize: "0.9rem", lineHeight: 1.7, margin: "0 0 1rem" }}>
              Combo packs give you the best value — you get a mix of sparklers, flower pots, and sky shots at a bundled price. For a family of 4, our ₹999 combo is ideal. For larger gatherings or apartment community events, the Diwali Mega Combo at ₹1,499 covers everything from ground crackers to aerial shots. Gift boxes are perfect for corporate gifting — they come beautifully packed and include a mix of premium sparklers and colour pencils.
            </p>
            <p style={{ color: "rgba(255,245,230,0.38)", fontSize: "0.72rem", margin: 0 }}>September 2025 · 4 min read</p>
          </article>

          <article className="blog-card">
            <span className="blog-tag">Safety Tips</span>
            <h2 style={{ color: "#FFF5E6", fontFamily: "'Libre Baskerville',serif", fontSize: "1.15rem", margin: "0 0 0.75rem", lineHeight: 1.4 }}>
              How to Store Firecrackers Safely at Home
            </h2>
            <p style={{ color: "rgba(255,245,230,0.62)", fontSize: "0.9rem", lineHeight: 1.7, margin: "0 0 1rem" }}>
              Store crackers in a cool, dry place — never near a gas cylinder, electrical board, or in direct sunlight. Keep them in their original packaging. Don't store large quantities in a single box — spread them across multiple containers. Keep away from children's reach. Never store crackers in a car. If crackers get wet, do not attempt to dry them with heat — allow them to air dry naturally in a ventilated area.
            </p>
            <p style={{ color: "rgba(255,245,230,0.38)", fontSize: "0.72rem", margin: 0 }}>August 2025 · 3 min read</p>
          </article>

          <article className="blog-card">
            <span className="blog-tag">Education</span>
            <h2 style={{ color: "#FFF5E6", fontFamily: "'Libre Baskerville',serif", fontSize: "1.15rem", margin: "0 0 0.75rem", lineHeight: 1.4 }}>
              What is a PESO Certificate and Why It Matters
            </h2>
            <p style={{ color: "rgba(255,245,230,0.62)", fontSize: "0.9rem", lineHeight: 1.7, margin: "0 0 1rem" }}>
              PESO stands for Petroleum and Explosives Safety Organisation — the Indian government body that regulates and licenses fireworks manufacturers. A PESO certificate means the product has passed safety tests for chemical composition, noise levels, and packaging. It is illegal to manufacture or sell firecrackers without a valid PESO licence in India. When buying crackers online, always check that the seller sources from PESO-licensed factories. All SparkNest products are sourced exclusively from PESO-certified manufacturers in Sivakasi.
            </p>
            <p style={{ color: "rgba(255,245,230,0.38)", fontSize: "0.72rem", margin: 0 }}>August 2025 · 5 min read</p>
          </article>

        </div>

        {/* ── CTA ── */}
        <div style={{ marginTop: "3rem", textAlign: "center", padding: "2rem", background: "rgba(255,107,0,0.04)", border: "1px solid rgba(255,107,0,0.12)", borderRadius: 18 }}>
          <p style={{ color: "#FFD700", fontFamily: "'Libre Baskerville',serif", fontSize: "1.2rem", margin: "0 0 0.5rem" }}>Ready to shop for Diwali? 🎆</p>
          <p style={{ color: "rgba(255,245,230,0.6)", fontSize: "0.9rem", margin: "0 0 1.2rem" }}>Premium crackers, direct from Sivakasi. Free delivery above ₹999.</p>
          <a href="/products" style={{ display: "inline-block", background: "linear-gradient(135deg,#FF6B00,#FF3D00)", color: "#fff", fontWeight: 800, fontSize: "0.95rem", padding: "0.75rem 2rem", borderRadius: 12, textDecoration: "none", boxShadow: "0 4px 20px rgba(255,107,0,0.4)" }}>
            Shop Now
          </a>
        </div>

      </div>
    </div>
  );
}
