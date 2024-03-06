import mongoose from "mongoose";


// Función auxiliar para rellenar con ceros a la izquierda

function padWithZeros(number, length) {
  let result = '' + number;
  while (result.length < length) {
    result = '0' + result;
  }
  return result;
}
const clientsSchema = new mongoose.Schema({
  idClient: {
    type: String,
  },
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
  buys: { type: Array, default: [] },
});


clientsSchema.pre('save', async function (next) {
  if (!this.isNew) {
    return next();
  }

  try {
    const lastClient = await Client.findOne({}, {}, { sort: { 'idClient': -1 } });

    if (lastClient) {
      this.idClient = padWithZeros(Number(lastClient.idClient) + 1, 4);
    } else {
      this.idClient = '0001';
    }

    next();
  } catch (error) {
    next(error);
  }
});

export const Client = mongoose.model("Client", clientsSchema);
