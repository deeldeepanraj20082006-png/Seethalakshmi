import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { ProductModel, OrderModel, SettingsModel } from "./src/db/models.js";
import { PRODUCTS } from "./src/constants.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    const uri = "mongodb+srv://thiru:thiru123@localhub.tfr4o2r.mongodb.net/sweets?retryWrites=true&w=majority";
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    // Seed products if database is empty
    const count = await ProductModel.countDocuments();
    if (count === 0) {
      const productsToSeed = PRODUCTS.map(({ id, ...p }) => p);
      await (ProductModel as any).insertMany(productsToSeed);
      console.log("Seed products inserted");
    }

    // Seed settings if empty
    const settingsCount = await SettingsModel.countDocuments();
    if (settingsCount === 0) {
      await SettingsModel.create({});
      console.log("Seed settings created");
    }
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

connectDB();

// API Routes
app.get("/api/products", async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const product = new ProductModel(req.body);
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: "Failed to create product" });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    await (ProductModel as any).findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(400).json({ error: "Failed to delete product" });
  }
});

app.put("/api/products/:id", async (req, res) => {
  try {
    const product = await (ProductModel as any).findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: "Failed to update product" });
  }
});

app.get("/api/orders", async (req, res) => {
  try {
    const orders = await OrderModel.find().sort({ timestamp: -1 } as any);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    const order = new OrderModel(req.body);
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: "Failed to create order" });
  }
});

app.delete("/api/orders/:id", async (req, res) => {
  try {
    await (OrderModel as any).findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(400).json({ error: "Failed to delete order" });
  }
});

app.get("/api/settings", async (req, res) => {
  try {
    const settings = await SettingsModel.findOne();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

app.post("/api/settings", async (req, res) => {
  try {
    const settings = await (SettingsModel as any).findOneAndUpdate({}, req.body, { upsert: true, new: true });
    res.json(settings);
  } catch (error) {
    res.status(400).json({ error: "Failed to update settings" });
  }
});

// Vite Middleware
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

setupVite().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
