import mongoose from "mongoose";

const SaleSchema = new mongoose.Schema({
  date: {
    type: Date,
  },
  products: {
    type: Array,
  },
  priceTotal: {
    type: Number,
  },
  client: {
    type: Object,
  },
  pdf: {
    type: String,
    default:""
  },
});

export const Sale = mongoose.model("Sale", SaleSchema);
