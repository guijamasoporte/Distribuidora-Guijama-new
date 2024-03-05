import { Invoice } from "../models/invoice.js";
import { Product } from "../models/products.js";
import { formatError } from "../utils/formatError.js";

export const createInvoice = async (req, res) => {
  const { products, priceTotal, client, pdf } = req.body;
  try {
    let currentDate = new Date();
    const timeZoneOffset = -3; // La diferencia de la zona horaria en horas
    currentDate.setHours(currentDate.getHours() + timeZoneOffset);

    let invoice = new Invoice({
      date: currentDate,
      products: products,
      priceTotal: priceTotal,
      client:client,
      pdf:pdf
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

    await invoice.save();
    return res.status(200).json({ msg: "invoice creado" });
  } catch (error) {
    res.status(400).json(formatError(error.message));
  }
};

export const GetAllInvoice = async (req, res) => {
  try {
    let invoice = await Invoice.find();
    return res.status(200).json(invoice.reverse());
  } catch (error) {
    res.status(400).json(formatError(error.message));
  }
};

export const GetInvoicetById = async (req, res) => {
  const { id } = req.params;
  try {
    let invoice = await Invoice.findById(id);
    return res.status(200).json({ invoice });
  } catch (error) {
    res.status(400).json(formatError(error.message));
  }
};

export const UpdateInvoicetById = async (req, res) => {
  const { id } = req.params;

  const { products, priceTotal, client, pdf  } = req.body;

  try {
    let invoice = await Invoice.findByIdAndUpdate(
      id,
      {
        product:products,
        priceTotal,
        client,
        pdf
      },
      { new: true }
    );
    return res.status(200).json({ invoice });
  } catch (error) {
    res.status(400).json(formatError(error.message));
  }
};

export const DeleteInvoiceById = async (req, res) => {
  const { id } = req.params;

  try {
    await Invoice.findByIdAndDelete(id);
    return res.status(200).json("invoice eliminado");
  } catch (error) {
    console.log(error);
    res.status(400).json(formatError(error.message));
  }
};
