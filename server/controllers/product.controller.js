import Product from "../models/Product.model.js";
import cloudinary from "../config/cloudinary.js";

// GET /api/products
export const getProducts = async (req, res) => {
  try {
    const { category, kids, search, sort, page = 1, limit = 12 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (kids === "true") filter.isSafeForKids = true;
    if (search) filter.$or = [
      { name:     { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
      { tags:     { $in: [new RegExp(search, "i")] } },
    ];
    const sortMap = { price_asc:{price:1}, price_desc:{price:-1}, rating:{rating:-1}, newest:{createdAt:-1} };
    const sortObj = sortMap[sort] || { createdAt: -1 };
    const skip     = (Number(page) - 1) * Number(limit);
    const total    = await Product.countDocuments(filter);
    const products = await Product.find(filter).sort(sortObj).skip(skip).limit(Number(limit));
    res.json({ success:true, products, total, page:Number(page), pages:Math.ceil(total/Number(limit)) });
  } catch (err) { res.status(500).json({ success:false, message:err.message }); }
};

// GET /api/products/featured
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured:true }).limit(8);
    res.json({ success:true, products });
  } catch (err) { res.status(500).json({ success:false, message:err.message }); }
};

// GET /api/products/:slug
export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ success:false, message:"Product not found" });
    const related = await Product.find({
      _id: { $ne: product._id },
      $or: [{ category:product.category }, { isSafeForKids:product.isSafeForKids }],
    }).limit(4);
    res.json({ success:true, product, related });
  } catch (err) { res.status(500).json({ success:false, message:err.message }); }
};

// POST /api/products/upload-image
// Accepts multipart/form-data with field "image"
// Returns { url, publicId } — client stores URL, sends it with product create/update
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success:false, message:"No image file provided" });
    res.json({
      success:  true,
      url:      req.file.path,       // Cloudinary secure HTTPS URL
      publicId: req.file.filename,   // e.g. "sparknest/products/abc123"
    });
  } catch (err) { res.status(500).json({ success:false, message:err.message }); }
};

// POST /api/products — JSON body, image URL already uploaded via /upload-image
export const createProduct = async (req, res) => {
  try {
    const { name, slug, description, price, originalPrice, category, stock,
            isFeatured, isSafeForKids, tags, image, imagePublicId } = req.body;

    if (!name || !slug || !description || price == null || !category || stock == null || !image) {
      return res.status(400).json({ success:false, message:"Missing required fields" });
    }

    const product = await Product.create({
      name, slug, description,
      price:         Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      category, stock: Number(stock),
      isFeatured:    !!isFeatured,
      isSafeForKids: !!isSafeForKids,
      tags:          Array.isArray(tags) ? tags : [],
      image,
      imagePublicId: imagePublicId || "",
    });

    res.status(201).json({ success:true, product });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ success:false, message:"Slug already exists — use a unique slug" });
    res.status(400).json({ success:false, message:err.message });
  }
};

// PATCH /api/products/:id — JSON body
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success:false, message:"Product not found" });

    const { name, slug, description, price, originalPrice, category, stock,
            isFeatured, isSafeForKids, tags, image, imagePublicId } = req.body;

    // If image changed and old one was Cloudinary, delete old
    if (image && image !== product.image && product.imagePublicId) {
      try { await cloudinary.uploader.destroy(product.imagePublicId); } catch {}
    }

    if (name          != null) product.name          = name;
    if (slug          != null) product.slug          = slug;
    if (description   != null) product.description   = description;
    if (price         != null) product.price         = Number(price);
    if (originalPrice != null) product.originalPrice = Number(originalPrice);
    if (category      != null) product.category      = category;
    if (stock         != null) product.stock         = Number(stock);
    if (isFeatured    != null) product.isFeatured    = !!isFeatured;
    if (isSafeForKids != null) product.isSafeForKids = !!isSafeForKids;
    if (tags          != null) product.tags          = Array.isArray(tags) ? tags : [];
    if (image         != null) product.image         = image;
    if (imagePublicId != null) product.imagePublicId = imagePublicId;

    await product.save();
    res.json({ success:true, product });
  } catch (err) { res.status(400).json({ success:false, message:err.message }); }
};

// DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success:false, message:"Product not found" });
    if (product.imagePublicId) {
      try { await cloudinary.uploader.destroy(product.imagePublicId); } catch {}
    }
    await product.deleteOne();
    res.json({ success:true, message:"Product deleted" });
  } catch (err) { res.status(500).json({ success:false, message:err.message }); }
};
