import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  code: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    required: true,
    default: "",
  },
  stock: {
    type: Number,
    default: null,
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
  amount: {
    type: String,
  },
  image: {
    type: Array,
    default: [],
  },
  sales: {
    type: Object,
    // default:{} ,
  },
});

export const Product = mongoose.model("Product", productSchema);
