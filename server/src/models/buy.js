import mongoose from "mongoose";

const BuySchema = new mongoose.Schema({
  idBuy: {
    type: String,
  },
  date: {
    type: Date,
  },
  products: {
    type: Array,
  },
  priceTotal: {
    type: Number,
  },
  supplier: {
    type: Object,
    default: {},
  },
  dues: {
    type: Object,
    default: {
      payd: [false],
      cant: 1,
    },
  },
  createdBy: {
    type: String,
    default: "",
  },
  method: {
    type: String,
    default: "Efectivo",
  },
  state: {
    type: Boolean,
    default: false, //sale open
  },
});

BuySchema.pre("save", async function (next) {
  if (!this.isNew) {
    return next();
  }
  // Función auxiliar para rellenar con ceros a la izquierda
  function padWithZeros(number, length) {
    let result = "" + number;
    while (result.length < length) {
      result = "0" + result;
    }
    return result;
  }
  try {
    const lastBuy = await Buy.findOne().sort({ idBuy: -1 });

    if (lastBuy) {
      this.idBuy = padWithZeros(Number(lastBuy.idBuy) + 1, 8);
    } else {
      this.idBuy = "00000001";
    }

    next();
  } catch (error) {
    console.error("Error during pre-save hook:", error);
    next(error);
  }
});

export const Buy = mongoose.model("Buy", BuySchema);
