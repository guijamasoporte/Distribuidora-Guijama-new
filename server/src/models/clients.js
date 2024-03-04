import mongoose from "mongoose";

const clientsSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "",
  },
  lastName: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    default: "",
  },
  adress: {
    type: String,
    default: "",
  },
  invoices: { type: Array, default: [] },
});

export const Clients = mongoose.model("Clients", clientsSchema);
