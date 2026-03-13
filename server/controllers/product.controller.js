import Product from "../models/Product.model.js";

// GET /api/products
export const getProducts = async (req, res) => {
  try {
    const { category, kids, search, sort, page = 1, limit = 12 } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (kids === "true") filter.isSafeForKids = true;
    if (search) filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
      { tags: { $in: [new RegExp(search, "i")] } },
    ];

    const sortMap = {
      price_asc:  { price: 1 },
      price_desc: { price: -1 },
      rating:     { rating: -1 },
      newest:     { createdAt: -1 },
    };
    const sortObj = sortMap[sort] || { createdAt: -1 };

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter).sort(sortObj).skip(skip).limit(Number(limit));

    res.json({
      success: true,
      products,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
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
      $or: [
        { category: product.category },
        { isSafeForKids: product.isSafeForKids },
      ],
    }).limit(4);

    res.json({ success: true, product, related });
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
