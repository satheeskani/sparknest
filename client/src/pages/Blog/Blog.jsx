import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Tag, ChevronRight } from "lucide-react";

const POSTS = [
  {
    slug:     "how-to-celebrate-diwali-safely",
    category: "Safety Tips",
    date:     "October 10, 2025",
    readTime: "5 min read",
    title:    "How to Celebrate Diwali Safely with Firecrackers",
    excerpt:  "Diwali is the festival of lights — but safety always comes first. Follow these expert tips from our Sivakasi specialists to enjoy a brilliant, accident-free celebration.",
    image:    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    tags:     ["Safety","Diwali","Family"],
    featured: true,
  },
  {
    slug:     "sivakasi-the-fireworks-capital-of-india",
    category: "Behind the Scenes",
    date:     "September 28, 2025",
    readTime: "7 min read",
    title:    "Sivakasi: The Fireworks Capital of India",
    excerpt:  "Over 90% of India's fireworks come from one city — Sivakasi, Tamil Nadu. Explore the history, craftsmanship, and passion that makes our crackers world-class.",
    image:    "https://images.unsplash.com/photo-1533230408708-8f9f91d1235a?w=800&q=80",
    tags:     ["Sivakasi","History","Manufacturing"],
    featured: true,
  },
  {
    slug:     "best-crackers-for-kids-2025",
    category: "Buyer's Guide",
    date:     "September 15, 2025",
    readTime: "4 min read",
    title:    "Best Kid-Safe Crackers for Diwali 2025",
    excerpt:  "Let the little ones join the celebration! We break down the safest, most fun crackers designed specifically for children aged 5 and above.",
    image:    "https://images.unsplash.com/photo-1604881991720-f91add269bed?w=800&q=80",
    tags:     ["Kids","Safe","Guide"],
    featured: false,
  },
  {
    slug:     "top-5-combo-packs-value-diwali",
    category: "Buyer's Guide",
    date:     "September 5, 2025",
    readTime: "4 min read",
    title:    "Top 5 Combo Packs for the Best Value This Diwali",
    excerpt:  "Don't overspend. Our curated combo packs give you the biggest bang-for-buck — from budget sparkler sets to premium sky-shot collections.",
    image:    "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&q=80",
    tags:     ["Combos","Value","Diwali"],
    featured: false,
  },
  {
    slug:     "understanding-peso-certifications",
    category: "Education",
    date:     "August 22, 2025",
    readTime: "6 min read",
    title:    "What is a PESO Certification and Why It Matters",
    excerpt:  "Every cracker sold legally in India must pass strict PESO (Petroleum & Explosives Safety Organisation) norms. Here's what that means for you as a buyer.",
    image:    "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800&q=80",
    tags:     ["Safety","PESO","Certified"],
    featured: false,
  },
  {
    slug:     "how-to-store-firecrackers-safely",
    category: "Safety Tips",
    date:     "August 10, 2025",
    readTime: "3 min read",
    title:    "How to Store Firecrackers Safely Before the Festival",
    excerpt:  "Bought your crackers early? Smart move. But storage matters more than most people realise. Learn the do's and don'ts of keeping firecrackers safe at home.",
    image:    "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800&q=80",
    tags:     ["Safety","Storage","Tips"],
    featured: false,
  },
];

const ALL_CATEGORIES = ["All", ...Array.from(new Set(POSTS.map(p => p.category)))];

const CATEGORY_COLORS = {
  "Safety Tips":      { bg: "rgba(46,204,113,0.12)",  border: "rgba(46,204,113,0.3)",  text: "#2ECC71" },
  "Behind the Scenes":{ bg: "rgba(255,215,0,0.12)",   border: "rgba(255,215,0,0.3)",   text: "#FFD700" },
  "Buyer's Guide":    { bg: "rgba(255,107,0,0.12)",   border: "rgba(255,107,0,0.3)",   text: "#FF6B00" },
  "Education":        { bg: "rgba(0,191,255,0.12)",   border: "rgba(0,191,255,0.3)",   text: "#00BFFF" },
};

function CategoryBadge({ cat }) {
  const c = CATEGORY_COLORS[cat] || { bg: "rgba(255,107,0,0.1)", border: "rgba(255,107,0,0.25)", text: "#FF6B00" };
  return (
    <span style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 6, padding: "0.2rem 0.6rem", fontSize: "0.68rem", fontWeight: 700, color: c.text, textTransform: "uppercase", letterSpacing: "0.07em", display: "inline-block" }}>
      {cat}
    </span>
  );
}

function PostCard({ post, featured = false }) {
  const [hovered, setHovered] = useState(false);

  if (featured) {
    return (
      <Link to={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{ borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,107,0,0.15)", background: "rgba(255,107,0,0.03)", display: "grid", gridTemplateColumns: "1.1fr 1fr", transition: "transform .25s, box-shadow .25s", transform: hovered ? "translateY(-4px)" : "none", boxShadow: hovered ? "0 12px 40px rgba(255,107,0,0.2)" : "none" }}>
          <div style={{ overflow: "hidden" }}>
            <img src={post.image} alt={post.title} style={{ width: "100%", height: 280, objectFit: "cover", transition: "transform .4s", transform: hovered ? "scale(1.05)" : "scale(1)" }} />
          </div>
          <div style={{ padding: "2rem", display: "flex", flexDirection: "column", justifyContent: "center", gap: "0.7rem" }}>
            <CategoryBadge cat={post.category} />
            <h2 style={{ color: "#FFF5E6", fontFamily: "'Libre Baskerville',serif", fontSize: "1.3rem", margin: 0, lineHeight: 1.35 }}>{post.title}</h2>
            <p style={{ color: "rgba(255,245,230,0.65)", fontSize: "0.9rem", lineHeight: 1.65, margin: 0 }}>{post.excerpt}</p>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.3rem" }}>
              <span style={{ color: "rgba(255,245,230,0.45)", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.3rem" }}><Clock size={12} />{post.readTime}</span>
              <span style={{ color: "rgba(255,245,230,0.45)", fontSize: "0.75rem" }}>{post.date}</span>
            </div>
            <span style={{ color: "#FF6B00", fontWeight: 700, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.3rem", marginTop: "0.3rem" }}>Read Article <ChevronRight size={15} /></span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,107,0,0.12)", background: "rgba(255,107,0,0.02)", display: "flex", flexDirection: "column", height: "100%", transition: "transform .25s, box-shadow .25s", transform: hovered ? "translateY(-4px)" : "none", boxShadow: hovered ? "0 10px 32px rgba(255,107,0,0.18)" : "none" }}>
        <div style={{ overflow: "hidden" }}>
          <img src={post.image} alt={post.title} style={{ width: "100%", height: 185, objectFit: "cover", transition: "transform .4s", transform: hovered ? "scale(1.06)" : "scale(1)" }} />
        </div>
        <div style={{ padding: "1.2rem", display: "flex", flexDirection: "column", gap: "0.6rem", flex: 1 }}>
          <CategoryBadge cat={post.category} />
          <h3 style={{ color: "#FFF5E6", fontFamily: "'Libre Baskerville',serif", fontSize: "1.05rem", margin: 0, lineHeight: 1.4 }}>{post.title}</h3>
          <p style={{ color: "rgba(255,245,230,0.6)", fontSize: "0.85rem", lineHeight: 1.6, margin: 0, flex: 1 }}>{post.excerpt}</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: "0.6rem", borderTop: "1px solid rgba(255,107,0,0.08)" }}>
            <span style={{ color: "rgba(255,245,230,0.4)", fontSize: "0.72rem", display: "flex", alignItems: "center", gap: "0.3rem" }}><Clock size={11} />{post.readTime}</span>
            <span style={{ color: "#FF6B00", fontWeight: 700, fontSize: "0.78rem", display: "flex", alignItems: "center", gap: "0.2rem" }}>Read <ChevronRight size={13} /></span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("All");

  const featured = POSTS.filter(p => p.featured);
  const filtered = activeCategory === "All"
    ? POSTS.filter(p => !p.featured)
    : POSTS.filter(p => p.category === activeCategory && !p.featured);
  const all = activeCategory !== "All" ? POSTS.filter(p => p.category === activeCategory) : null;

  return (
    <div style={{ minHeight: "100vh", background: "#0D0600", fontFamily: "'Source Sans 3',sans-serif", paddingTop: 88 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Source+Sans+3:wght@300;400;600;700&display=swap');
        .cat-btn { padding:0.45rem 1rem; border-radius:20px; border:1.5px solid rgba(255,107,0,0.22); background:transparent; color:rgba(255,245,230,0.65); font-weight:700; font-size:0.82rem; cursor:pointer; transition:all .2s; font-family:'Source Sans 3',sans-serif; }
        .cat-btn.active { background:rgba(255,107,0,0.12); border-color:#FF6B00; color:#FF6B00; }
        .cat-btn:hover:not(.active) { border-color:rgba(255,107,0,0.4); color:#FFF5E6; }
        @media(max-width:700px){ .feat-grid { grid-template-columns:1fr !important; } .feat-grid img { height:200px !important; } }
        @media(max-width:760px){ .posts-grid { grid-template-columns:1fr !important; } }
      `}</style>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "2rem 1rem 4rem" }}>

        {/* ── Hero ── */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <p style={{ color: "#FF6B00", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.14em", margin: "0 0 0.6rem" }}>Tips, guides & stories</p>
          <h1 style={{ fontFamily: "'Libre Baskerville',serif", color: "#FFF5E6", fontSize: "clamp(2rem,5vw,3rem)", margin: "0 0 0.8rem", lineHeight: 1.15 }}>
            The SparkNest <span style={{ color: "#FFD700" }}>Blog</span>
          </h1>
          <p style={{ color: "rgba(255,245,230,0.6)", fontSize: "1rem", maxWidth: 480, margin: "0 auto" }}>
            Safety guides, buying tips, and behind-the-scenes stories from the fireworks capital of India.
          </p>
        </div>

        {/* ── Category Filter ── */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "2.5rem" }}>
          {ALL_CATEGORIES.map(cat => (
            <button key={cat} className={`cat-btn${activeCategory === cat ? " active" : ""}`} onClick={() => setActiveCategory(cat)}>{cat}</button>
          ))}
        </div>

        {/* ── Featured (only when "All") ── */}
        {activeCategory === "All" && (
          <div style={{ marginBottom: "2.5rem" }}>
            <p style={{ color: "rgba(255,245,230,0.45)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Tag size={12} /> Featured
            </p>
            <div className="feat-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.2rem" }}>
              {featured.map(p => <PostCard key={p.slug} post={p} featured />)}
            </div>
          </div>
        )}

        {/* ── Posts Grid ── */}
        <div>
          {activeCategory === "All" && (
            <p style={{ color: "rgba(255,245,230,0.45)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>More Articles</p>
          )}
          <div className="posts-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.2rem" }}>
            {(all || filtered).map(p => <PostCard key={p.slug} post={p} />)}
          </div>
          {(all || filtered).length === 0 && (
            <p style={{ color: "rgba(255,245,230,0.45)", textAlign: "center", padding: "3rem 0" }}>No articles in this category yet.</p>
          )}
        </div>

      </div>
    </div>
  );
}
