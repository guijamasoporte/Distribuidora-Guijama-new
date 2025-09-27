import { Admin } from "../models/admin.js";
import { Supplier } from "../models/supplier.js";
import { Product } from "../models/products.js";
import { Buy } from "../models/buy.js";
import { DecodedToken } from "../utils/DecodedToken.js";
import { formatError } from "../utils/formatError.js";

function getMonthName(monthNumber) {
  const months = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  return months[monthNumber];
}

export const createBuy = async (req, res) => {
  const { List, supplier, token, method } = req.body;
  console.log(req.body);

  try {
    let currentDate = new Date();

    const timeZoneOffset = -3; // La diferencia de la zona horaria en horas
    currentDate.setHours(currentDate.getHours() + timeZoneOffset);

    const pricetotalFunction = () => {
      const total = List.reduce((acc, el) => {
        return acc + el.priceList * el.unity;
      }, 0);
      return total;
    };

    const iduser = DecodedToken(token);
    let user = await Admin.findById(iduser.id);

    // --------new Buy--------
    let buy = new Buy({
      date: currentDate,
      products: List,
      priceTotal: pricetotalFunction(),
      supplier: supplier,
      createdBy: user.email,
      method: method ? method : "Efectivo",
    });

    await buy.save();
    //--------new Buy--------

    // ELIMINADO: La sección que modificaba el stock y las compras del producto
    // Ya no se descuenta stock ni se actualizan las estadísticas de compras del producto

    //--------edit Supplier--------
    let id = supplier.id;

    await Supplier.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          buys: {
            date: currentDate,
            products: List,
            priceTotal: pricetotalFunction(),
            idBuy: buy.idBuy,
          },
        },
      }
    );
    //--------edit Supplier--------

    return res.status(200).json({ msg: "Buy creado" });
  } catch (error) {
    console.log(error);
    res.status(400).json(formatError(error.message));
  }
};

export const GetAllBuy = async (req, res) => {
  try {
    let buy = await Buy.find();
    return res.status(200).json(buy.reverse());
  } catch (error) {
    res.status(400).json(formatError(error.message));
  }
};

export const GetBuytById = async (req, res) => {
  const { id } = req.params;
  try {
    let buy = await Buy.findById(id);
    return res.status(200).json({ buy });
  } catch (error) {
    res.status(400).json(formatError(error.message));
  }
};

export const UpdateBuyById = async (req, res) => {
  const { id } = req.params;
  const { checkboxStates, client, method, List } = req.body;

  const pricetotalFunction = () => {
    if (List) {
      const total = List.reduce((acc, el) => {
        return acc + el.priceList * el.unity;
      }, 0);
      return total;
    }
    return 0; // Devolver un valor predeterminado si List no está definido
  };

  const calculateStatesTrue = () => {
    if (checkboxStates) {
      return checkboxStates.filter((state) => state === true).length;
    }
    return 0; // Devolver un valor predeterminado si checkboxStates no está definido
  };

  try {
    let updateFields = {
      products: List,
      client: client,
      method: method,
    };

    // Solo actualizar los campos relacionados con checkboxStates si está presente
    if (checkboxStates) {
      updateFields.dues = { cant: checkboxStates.length, payd: checkboxStates };
      updateFields.state = checkboxStates
        ? calculateStatesTrue() === checkboxStates.length
        : false;
    }

    // Obtener la venta actual
    let Buy = await Buy.findByIdAndUpdate(id, updateFields, { new: true });

    // Actualizar priceTotal si List está presente
    if (List) {
      Buy.priceTotal = pricetotalFunction();
      await Buy.save();
    }

    return res.status(200).json({ Buy });
  } catch (error) {
    console.log(error);
    res.status(400).json(formatError(error.message));
  }
};

export const DeleteBuyById = async (req, res) => {
  const { id } = req.params;
  try {
    await Buy.findByIdAndDelete(id);
    return res.status(200).json("compra eliminada");
  } catch (error) {
    console.log(error);
    res.status(400).json(formatError(error.message));
  }
};