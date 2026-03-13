import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "./models/Product.model.js";

dotenv.config();

const PRODUCTS = [
  { name:"Golden Sparklers Pack",      slug:"golden-sparklers-pack",      category:"Sparklers",    price:299,  originalPrice:399,  stock:45,  isSafeForKids:true,  isFeatured:true,  rating:4.8, numReviews:124, description:"Experience the magic of Diwali with our premium Golden Sparklers Pack. Each sparkler burns for 90 seconds with a brilliant golden shower effect. Perfect for family celebrations, weddings, and festivals.", image:"https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80", tags:["sparkler","golden","diwali"] },
  { name:"Sky Rocket 10-in-1",         slug:"sky-rocket-10-in-1",         category:"Rockets",      price:549,  originalPrice:699,  stock:28,  isSafeForKids:false, isFeatured:true,  rating:4.6, numReviews:89,  description:"Reach for the skies with our Sky Rocket 10-in-1 combo. Each box contains 10 rockets with different colour effects.", image:"https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=400&q=80", tags:["rocket","sky","combo"] },
  { name:"Rainbow Flower Pot Set",     slug:"rainbow-flower-pot-set",     category:"Flower Pots",  price:399,  originalPrice:499,  stock:60,  isSafeForKids:true,  isFeatured:true,  rating:4.9, numReviews:201, description:"A mesmerising flower pot set that creates a stunning rainbow-coloured fountain effect. Safe for the whole family.", image:"https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=400&q=80", tags:["flower pot","rainbow","family"] },
  { name:"Thunder Bomb Pack (20pcs)",  slug:"thunder-bomb-pack-20pcs",    category:"Bombs",        price:199,  originalPrice:249,  stock:100, isSafeForKids:false, isFeatured:false, rating:4.3, numReviews:56,  description:"Classic thunder crackers with a loud, satisfying bang. Pack of 20 individually wrapped crackers with long fuses.", image:"https://images.unsplash.com/photo-1514254040595-6e0d913fc1e4?w=400&q=80", tags:["bomb","thunder","loud"] },
  { name:"Sky Shot Premium Bundle",    slug:"sky-shot-premium-bundle",    category:"Sky Shots",    price:899,  originalPrice:1199, stock:15,  isSafeForKids:false, isFeatured:true,  rating:4.7, numReviews:143, description:"Our premium sky shot bundle delivers a professional fireworks show from your own backyard. Sequential firing with 3-second intervals.", image:"https://images.unsplash.com/photo-1533230408708-8f9f91d1235a?w=400&q=80", tags:["sky shot","premium","fireworks"] },
  { name:"Kids Fun Cracker Set",       slug:"kids-fun-cracker-set",       category:"Kids Special", price:349,  originalPrice:449,  stock:80,  isSafeForKids:true,  isFeatured:true,  rating:4.9, numReviews:312, description:"Specially designed for children aged 5 and above. Includes colourful sparklers, pop-pops, and snake tablets.", image:"https://images.unsplash.com/photo-1604881991720-f91add269bed?w=400&q=80", tags:["kids","safe","children"] },
  { name:"Diwali Mega Combo Pack",     slug:"diwali-mega-combo-pack",     category:"Combo Packs",  price:1499, originalPrice:1999, stock:20,  isSafeForKids:false, isFeatured:true,  rating:4.8, numReviews:267, description:"The ultimate Diwali celebration package! Includes rockets, flower pots, sparklers, bombs, and sky shots.", image:"https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&q=80", tags:["combo","diwali","mega"] },
  { name:"Premium Gift Box Deluxe",    slug:"premium-gift-box-deluxe",    category:"Gift Boxes",   price:799,  originalPrice:999,  stock:35,  isSafeForKids:true,  isFeatured:false, rating:4.6, numReviews:98,  description:"A beautifully packaged gift box perfect for Diwali gifting. Contains premium sparklers, colour pencils, and flower pots.", image:"https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&q=80", tags:["gift","box","premium"] },
  { name:"Silver Sparklers (50pcs)",   slug:"silver-sparklers-50pcs",     category:"Sparklers",    price:179,  originalPrice:199,  stock:120, isSafeForKids:true,  isFeatured:false, rating:4.5, numReviews:445, description:"Our best-selling Silver Sparklers pack — 50 sparklers with a classic silver shower effect.", image:"https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80", tags:["sparkler","silver","bestseller"] },
  { name:"Colour Rain Rockets",        slug:"colour-rain-rockets",        category:"Rockets",      price:649,  originalPrice:799,  stock:40,  isSafeForKids:false, isFeatured:false, rating:4.4, numReviews:72,  description:"A stunning rocket pack with a beautiful colour rain effect. Each rocket bursts into a cascade of multicoloured stars.", image:"https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=400&q=80", tags:["rocket","colour","rain"] },
  { name:"Mini Flower Pot (12pcs)",    slug:"mini-flower-pot-12pcs",      category:"Flower Pots",  price:249,  originalPrice:299,  stock:75,  isSafeForKids:true,  isFeatured:false, rating:4.7, numReviews:189, description:"Compact mini flower pots for balconies and courtyards. Pack of 12, each creating a colourful fountain for 90 seconds.", image:"https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=400&q=80", tags:["flower pot","mini","balcony"] },
  { name:"Atom Bomb Special (10pcs)",  slug:"atom-bomb-special-10pcs",    category:"Bombs",        price:149,  originalPrice:199,  stock:90,  isSafeForKids:false, isFeatured:false, rating:4.2, numReviews:33,  description:"The classic Atom Bomb cracker — a Diwali staple for decades. Pack of 10 with extra-long fuses.", image:"https://images.unsplash.com/photo-1514254040595-6e0d913fc1e4?w=400&q=80", tags:["bomb","atom","classic"] },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Product.deleteMany({});
    console.log("🗑️  Cleared existing products");

    const inserted = await Product.insertMany(PRODUCTS);
    console.log(`🌱 Seeded ${inserted.length} products`);

    await mongoose.disconnect();
    console.log("✅ Done!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err.message);
    process.exit(1);
  }
}

seed();
