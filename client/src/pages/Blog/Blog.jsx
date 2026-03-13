import { Star } from "lucide-react";
import { Helmet } from "react-helmet-async";

const POSTS = [
  {
    tag: "Safety Tips",
    tagColor: "#2ECC71",
    title: "How to Celebrate Diwali Safely with Firecrackers",
    date: "October 2025",
    body: "Always light crackers in an open area away from buildings and dry leaves. Keep a bucket of water or sand nearby. Never lean over a cracker while lighting it. Use a long agarbatti to maintain safe distance. Children must be supervised by adults at all times. Wear cotton clothes — synthetic fabrics catch fire easily. Store unused crackers in a cool, dry place away from heat sources.",
  },
  {
    tag: "Buyer's Guide",
    tagColor: "#FF6B00",
    title: "Best Kid-Safe Crackers for Diwali 2025",
    date: "September 2025",
    body: "SparkNest's Kids Special collection is designed for children aged 5 and above. Sparklers are the most popular choice — they produce a beautiful golden or silver shower with no loud sound. Flower pots create a colourful fountain effect that kids love. Pop-pops and snake tablets are completely sound-free and safe for younger children. All our kids' products are PESO certified and tested for low chemical emission.",
  },
  {
    tag: "About Sivakasi",
    tagColor: "#7B2FBE",
    title: "Why Sivakasi Crackers Are the Best in India",
    date: "September 2025",
    body: "Sivakasi, Tamil Nadu produces over 90% of India's fireworks. The city's dry climate, skilled workforce, and decades of manufacturing expertise make it the undisputed capital of Indian firecrackers. SparkNest sources all products directly from licensed Sivakasi manufacturers, cutting out middlemen so you get factory-fresh crackers at the best prices. Every product carries a valid PESO licence number on the box.",
  },
  {
    tag: "Buyer's Guide",
    tagColor: "#FF6B00",
    title: "How to Choose the Right Combo Pack for Your Budget",
    date: "September 2025",
    body: "Combo packs give you the best value — a mix of sparklers, flower pots, and sky shots at a bundled price. For a family of 4, our ₹999 combo is ideal. For larger gatherings or apartment community events, the Diwali Mega Combo at ₹1,499 covers everything from ground crackers to aerial shots. Gift boxes are perfect for corporate gifting — beautifully packed with premium sparklers and colour pencils.",
  },
  {
    tag: "Safety Tips",
    tagColor: "#2ECC71",
    title: "How to Store Firecrackers Safely at Home",
    date: "August 2025",
    body: "Store crackers in a cool, dry place — never near a gas cylinder, electrical board, or in direct sunlight. Keep them in their original packaging. Don't store large quantities in a single box — spread them across multiple containers. Keep away from children's reach. Never store crackers in a car. If crackers get wet, allow them to air dry naturally in a ventilated area — never use heat.",
  },
  {
    tag: "Education",
    tagColor: "#0077B6",
    title: "What is a PESO Certificate and Why It Matters",
    date: "August 2025",
    body: "PESO stands for Petroleum and Explosives Safety Organisation — the Indian government body that licenses fireworks manufacturers. A PESO certificate means the product has passed safety tests for chemical composition, noise levels, and packaging. It is illegal to manufacture or sell firecrackers without a valid PESO licence in India. All SparkNest products are sourced exclusively from PESO-certified factories in Sivakasi.",
  },
];

export default function Blog() {
  return (
    <>
      <Helmet>
        <title>Blog — Diwali Cracker Tips, Safety Guides & Buying Advice | SparkNest</title>
        <meta name="description" content="Read SparkNest's expert guides on Diwali firecracker safety, how to choose the right crackers, kid-safe options, PESO certifications, and why Sivakasi crackers are the best in India." />
        <meta name="keywords" content="diwali cracker safety tips, best crackers for kids, sivakasi crackers, PESO certified fireworks, how to store firecrackers, diwali combo packs, buy crackers online india" />
        <link rel="canonical" href="https://sparknest-one.vercel.app/blog" />
        {/* Open Graph */}
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content="https://sparknest-one.vercel.app/blog" />
        <meta property="og:title"       content="Blog — Diwali Cracker Tips & Safety Guides | SparkNest" />
        <meta property="og:description" content="Expert guides on Diwali firecracker safety, kid-safe crackers, PESO certifications, and buying tips from Sivakasi's trusted cracker store." />
        <meta property="og:image"       content="https://sparknest-one.vercel.app/og-image.jpg" />
        {/* Twitter */}
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content="Blog — Diwali Cracker Tips & Safety Guides | SparkNest" />
        <meta name="twitter:description" content="Expert guides on Diwali firecracker safety, kid-safe crackers, PESO certifications, and buying tips from Sivakasi's trusted cracker store." />
        <meta name="twitter:image"       content="https://sparknest-one.vercel.app/og-image.jpg" />
      </Helmet>

      <div style={{ minHeight: "100vh", background: "#0D0600", fontFamily: "'Source Sans 3',sans-serif", paddingTop: 88 }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Nunito+Sans:wght@700;800&family=Source+Sans+3:wght@300;400;600;700&display=swap');
          .blog-card {
            background: #fff;
            border-radius: 20px;
            padding: 1.8rem;
            box-shadow: 0 3px 16px rgba(0,0,0,0.08);
            border: 1px solid rgba(255,107,0,0.08);
            transition: transform .3s, box-shadow .3s;
          }
          .blog-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 32px rgba(0,0,0,0.12);
          }
          @media(max-width:960px){ .blog-grid { grid-template-columns: repeat(2,1fr) !important; } }
          @media(max-width:600px){ .blog-grid { grid-template-columns: 1fr !important; } }
        `}</style>

        <section style={{ background: "linear-gradient(160deg,#FFF8F0 0%,#FFF3E0 40%,#FEF9F0 100%)", padding: "4rem clamp(1.2rem,5vw,4rem) 4.5rem" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>

            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "2.8rem" }}>
              <p style={{ fontSize: "0.85rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#FF6B00", fontWeight: 700, marginBottom: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", fontFamily: "'Nunito Sans',sans-serif" }}>
                <Star size={12} color="#FF6B00" strokeWidth={2.5} fill="#FF6B00" /> Tips, Guides &amp; Safety
              </p>
              <h1 style={{ fontFamily: "'Libre Baskerville',serif", textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "clamp(1.5rem,2.5vw,2.2rem)", color: "#1a0a00", fontWeight: 900, margin: "0 0 0.75rem" }}>
                The SparkNest{" "}
                <span style={{ background: "linear-gradient(135deg,#FF6B00,#C0392B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Blog
                </span>
              </h1>
              <p style={{ color: "rgba(26,8,0,0.55)", fontSize: "1.05rem", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
                Safety guides, buying tips, and everything you need to know about Diwali fireworks — straight from Sivakasi's trusted cracker store.
              </p>
            </div>

            {/* Articles Grid */}
            <div className="blog-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.4rem" }}>
              {POSTS.map((post, i) => (
                <article key={i} className="blog-card">
                  <span style={{ display: "inline-block", background: `${post.tagColor}18`, border: `1px solid ${post.tagColor}44`, borderRadius: 20, padding: "0.22rem 0.8rem", fontSize: "0.75rem", fontWeight: 700, color: post.tagColor, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.85rem" }}>
                    {post.tag}
                  </span>
                  <h2 style={{ fontFamily: "'Libre Baskerville',serif", fontSize: "1.1rem", color: "#1a0800", fontWeight: 700, margin: "0 0 0.85rem", lineHeight: 1.45 }}>
                    {post.title}
                  </h2>
                  <p style={{ fontSize: "0.95rem", color: "rgba(26,8,0,0.68)", lineHeight: 1.8, margin: "0 0 1.2rem" }}>
                    {post.body}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", borderTop: "1px solid rgba(255,107,0,0.1)", paddingTop: "0.85rem" }}>
                    <Star size={12} fill="#FF6B00" color="#FF6B00" />
                    <span style={{ fontSize: "0.8rem", color: "rgba(26,8,0,0.4)", fontWeight: 600 }}>SparkNest · {post.date}</span>
                  </div>
                </article>
              ))}
            </div>

            {/* CTA */}
            <div style={{ textAlign: "center", marginTop: "3.5rem" }}>
              <p style={{ color: "rgba(26,8,0,0.55)", fontSize: "1rem", margin: "0 0 1.1rem" }}>
                Ready to celebrate Diwali? Shop premium crackers direct from Sivakasi.
              </p>
              <a href="/products" style={{ display: "inline-block", background: "linear-gradient(135deg,#FF6B00,#FF3D00)", color: "#fff", fontWeight: 800, fontSize: "1rem", padding: "0.85rem 2.4rem", borderRadius: 12, textDecoration: "none", boxShadow: "0 4px 20px rgba(255,107,0,0.4)", fontFamily: "'Source Sans 3',sans-serif" }}>
                🎆 Shop Now
              </a>
            </div>

          </div>
        </section>
      </div>
    </>
  );
}
