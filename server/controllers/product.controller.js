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

    const sortMap = {
      price_asc:  { price: 1 },
      price_desc: { price: -1 },
      rating:     { rating: -1 },
      newest:     { createdAt: -1 },
    };
    const sortObj = sortMap[sort] || { createdAt: -1 };

    const skip     = (Number(page) - 1) * Number(limit);
    const total    = await Product.countDocuments(filter);
    const products = await Product.find(filter).sort(sortObj).skip(skip).limit(Number(limit));

    res.json({ success: true, products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/products/featured
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true }).limit(8);
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/products/:slug
export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const related = await Product.find({
      _id: { $ne: product._id },
      $or: [{ category: product.category }, { isSafeForKids: product.isSafeForKids }],
    }).limit(4);

    res.json({ success: true, product, related });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/products  — create product with optional image upload
// Body: multipart/form-data  (field "image" = file) + other product fields as text
export const createProduct = async (req, res) => {
  try {
    const data = { ...req.body };

    // If multer uploaded a file, req.file.path is the Cloudinary URL
    if (req.file) {
      data.image        = req.file.path;          // secure HTTPS Cloudinary URL
      data.imagePublicId = req.file.filename;     // e.g. "sparknest/products/abc123"
    }

    // Coerce numeric / boolean fields that arrive as strings
    if (data.price)         data.price         = Number(data.price);
    if (data.originalPrice) data.originalPrice = Number(data.originalPrice);
    if (data.stock)         data.stock         = Number(data.stock);
    if (data.isFeatured)    data.isFeatured    = data.isFeatured === "true";
    if (data.isSafeForKids) data.isSafeForKids = data.isSafeForKids === "true";
    if (data.tags && typeof data.tags === "string") data.tags = data.tags.split(",").map(t => t.trim());

    const product = await Product.create(data);
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PATCH /api/products/:id  — update product; optionally replace image
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const data = { ...req.body };

    if (req.file) {
      // Delete old image from Cloudinary if it was a Cloudinary upload
      if (product.imagePublicId) {
        await cloudinary.uploader.destroy(product.imagePublicId);
      }
      data.image        = req.file.path;
      data.imagePublicId = req.file.filename;
    }

    if (data.price)         data.price         = Number(data.price);
    if (data.originalPrice) data.originalPrice = Number(data.originalPrice);
    if (data.stock)         data.stock         = Number(data.stock);
    if (data.isFeatured !== undefined)    data.isFeatured    = data.isFeatured === "true";
    if (data.isSafeForKids !== undefined) data.isSafeForKids = data.isSafeForKids === "true";
    if (data.tags && typeof data.tags === "string") data.tags = data.tags.split(",").map(t => t.trim());

    Object.assign(product, data);
    await product.save();

    res.json({ success: true, product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/products/:id — also removes image from Cloudinary
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    if (product.imagePublicId) {
      await cloudinary.uploader.destroy(product.imagePublicId);
    }

    await product.deleteOne();
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
