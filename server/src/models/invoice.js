import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema({
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

export const Invoice = mongoose.model("Invoice", InvoiceSchema);
