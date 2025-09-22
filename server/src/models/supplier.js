import mongoose from "mongoose";

// Función auxiliar para rellenar con ceros a la izquierda

function padWithZeros(number, length) {
  let result = "" + number;
  while (result.length < length) {
    result = "0" + result;
  }
  return result;
}
const SupplierSchema = new mongoose.Schema({
  idSupplier: {
    type: String,
  },
  name: {
    type: String,
    default: "-",
  },
  lastName: {
    type: String,
    default: "-",
  },
  phone: {
    type: String,
    default: "-",
  },
  email: {
    type: String,
    default: "-",
  },
  adress: {
    type: String,
    default: "-",
  },
  contactName:{
    type:String
  },
  buys: { type: Array, default: [] },
});

SupplierSchema.pre("save", async function (next) {
  if (!this.isNew) {
    return next();
  }

  try {
    const lastSupplier = await Supplier.findOne(
      {},
      {},
      { sort: { idSupplier: -1 } }
    );

    if (lastSupplier) {
      this.idSupplier = padWithZeros(Number(lastSupplier.idSupplier) + 1, 4);
    } else {
      this.idSupplier = "0001";
    }

    next();
  } catch (error) {
    next(error);
  }
});

export const Supplier = mongoose.model("Supplier", SupplierSchema);
