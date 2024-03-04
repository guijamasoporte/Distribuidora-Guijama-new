import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  code: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
  },
  description: {
    type: String,
  },
  priceList: {
    type: Number,
    required: true,
  },
  priceCost: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
  },
  amount: { type: String },

  image: {
    type: Array,
    default: [],
  },
});

export const Product = mongoose.model("Product", productSchema);
