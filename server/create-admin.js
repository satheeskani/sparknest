// ── create-admin.js ───────────────────────────────────────────────────────────
// Run once to create your admin user:
//   node create-admin.js
//
// Make sure your .env file is present in the same folder (server/) with MONGO_URI set.
// ─────────────────────────────────────────────────────────────────────────────

import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

dotenv.config();

// ── Edit these before running ─────────────────────────────────────────────────
const ADMIN_NAME     = "SparkNest Admin";
const ADMIN_EMAIL    = "satheeskani1995@gmail.com";   // change to your email
const ADMIN_PASSWORD = "SparkNest@1195";      // change to a strong password
const ADMIN_PHONE    = "8015850365";           // optional, change or leave as-is
// ─────────────────────────────────────────────────────────────────────────────

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      family: 4,
    });
    console.log("✅ Connected to MongoDB Atlas");

    const db = mongoose.connection.db;
    const existing = await db.collection("users").findOne({ email: ADMIN_EMAIL });

    if (existing) {
      // If user exists but is not admin, promote them
      if (existing.role !== "admin") {
        await db.collection("users").updateOne(
          { email: ADMIN_EMAIL },
          { $set: { role: "admin" } }
        );
        console.log(`✅ Promoted existing user "${ADMIN_EMAIL}" to admin`);
      } else {
        console.log(`ℹ️  Admin user "${ADMIN_EMAIL}" already exists — nothing to do`);
      }
    } else {
      // Create a brand new admin user (password hashed via bcrypt, same as User model)
      const salt         = await bcrypt.genSalt(12);
      const hashedPw     = await bcrypt.hash(ADMIN_PASSWORD, salt);

      await db.collection("users").insertOne({
        name:            ADMIN_NAME,
        email:           ADMIN_EMAIL,
        password:        hashedPw,
        phone:           ADMIN_PHONE,
        role:            "admin",
        addresses:       [],
        wishlist:        [],
        purchaseHistory: [],
        createdAt:       new Date(),
        updatedAt:       new Date(),
      });

      console.log(`✅ Admin user created!`);
      console.log(`   Email    : ${ADMIN_EMAIL}`);
      console.log(`   Password : ${ADMIN_PASSWORD}`);
      console.log(`\n⚠️  Save these credentials somewhere safe and delete this script.`);
    }
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit(0);
  }
}

createAdmin();
