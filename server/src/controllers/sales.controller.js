import { Product } from "../models/products.js";
import Sale from "../models/sale.js";
import { formatError } from "../utils/formatError.js";

export const createSale = async (req, res) => {
  const { products, priceTotal, client,dues, invoice } = req.body;
  try {
    let currentDate = new Date();
    const timeZoneOffset = -3; // La diferencia de la zona horaria en horas
    currentDate.setHours(currentDate.getHours() + timeZoneOffset);

    let sale = new Sale({
      date: currentDate,
      products: products,
      priceTotal: priceTotal,
      dues:dues,
      client:client,
      invoice:invoice
    });

    // for (const el of List) {
    //   // Check if the element has an '_id' property before updating stock
    //   if (el._id) {
    //     const product = await Product.findById(el._id);
    //     const currentStock = product.stock;

    //     await Product.findByIdAndUpdate(el._id, {
    //       stock: currentStock - el.unity,
    //     });
    //   }
    // }

    await sale.save();
    return res.status(200).json({ msg: "Sale creado" });
  } catch (error) {
    res.status(400).json(formatError(error.message));
  }
};

export const GetAllSale = async (req, res) => {
  try {
    let sale = await Sale.find();
    return res.status(200).json(sale.reverse());
  } catch (error) {
    res.status(400).json(formatError(error.message));
  }
};

export const GetSaletById = async (req, res) => {
  const { id } = req.params;
  try {
    let sale = await Sale.findById(id);
    return res.status(200).json({ sale });
  } catch (error) {
    res.status(400).json(formatError(error.message));
  }
};

export const UpdateSaletById = async (req, res) => {
  const { id } = req.params;

  const { products, priceTotal, client, pdf  } = req.body;

  try {
    let sale = await Sale.findByIdAndUpdate(
      id,
      {
        product:products,
        priceTotal,
        client,
        pdf
      },
      { new: true }
    );
    return res.status(200).json({ sale });
  } catch (error) {
    res.status(400).json(formatError(error.message));
  }
};

export const DeleteSaleById = async (req, res) => {
  const { id } = req.params;

  try {
    await Sale.findByIdAndDelete(id);
    return res.status(200).json("Sale eliminado");
  } catch (error) {
    console.log(error);
    res.status(400).json(formatError(error.message));
  }
};
