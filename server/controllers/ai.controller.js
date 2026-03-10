import Anthropic from "@anthropic-ai/sdk";
import Product from "../models/Product.model.js";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// @POST /api/ai/search
export const aiSearch = async (req, res) => {
  try {
    const { query } = req.body;
    const allProducts = await Product.find(
      {},
      "name category price isSafeForKids tags description"
    );

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `You are a cracker store assistant for SparkNest.
          User is searching for: "${query}"
          Available products: ${JSON.stringify(allProducts)}
          Return ONLY a JSON array of product IDs that match.
          Example: ["id1", "id2", "id3"]`,
        },
      ],
    });

    const text = message.content[0].text;
    const ids = JSON.parse(text.replace(/```json|```/g, "").trim());
    const products = await Product.find({ _id: { $in: ids } });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @POST /api/ai/recommend
export const aiRecommend = async (req, res) => {
  try {
    const { productId, cartItems } = req.body;
    const allProducts = await Product.find({}, "name category price tags _id");
    const currentProduct = await Product.findById(productId);

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `You are a SparkNest recommendation engine.
          Customer is viewing: ${JSON.stringify(currentProduct)}
          Cart items: ${JSON.stringify(cartItems || [])}
          All products: ${JSON.stringify(allProducts)}
          Recommend 4 products. Return ONLY a JSON array of product IDs.
          Example: ["id1", "id2", "id3", "id4"]`,
        },
      ],
    });

    const text = message.content[0].text;
    const ids = JSON.parse(text.replace(/```json|```/g, "").trim());
    const products = await Product.find({ _id: { $in: ids } });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @POST /api/ai/chat
export const aiChat = async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: `You are SparkBot, the friendly AI assistant for SparkNest — India's smartest cracker store.
      Help customers with product recommendations, safety advice, occasion-based suggestions.
      Be friendly and festive! Use fire/sparkle emojis 🎆✨🔥
      Keep responses concise and helpful.`,
      messages: messages,
    });

    res.json({ success: true, message: response.content[0].text });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};