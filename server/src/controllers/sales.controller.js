import { Client } from "../models/clients.js";
import { Product } from "../models/products.js";
import { Sale } from "../models/sale.js";
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
export const createSale = async (req, res) => {
  const { List, client, dues, invoice } = req.body;
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

    //--------new sale--------
    let sale = new Sale({
      date: currentDate,
      products: List,
      priceTotal: pricetotalFunction(),
      client: client,
      invoice: invoice,
    });
    await sale.save();
    //--------new sale--------

    //--------edit product--------
    for (const product of List) {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth(); // Obtener el mes actual (0 = enero, 1 = febrero, etc.)
      const monthName = getMonthName(currentMonth);

      const existingProduct = await Product.findById(product._id);
      existingProduct.stock -= product.unity;

      const monthIndex = existingProduct.sales.findIndex(
        (sale) => sale.month === monthName
      );

      if (monthIndex !== -1) {
        const updatedSale = { ...existingProduct.sales[monthIndex] };
        updatedSale.amount += Number(product.unity);
        existingProduct.sales[monthIndex] = updatedSale;
      } else {
        existingProduct.sales.push({
          month: monthName,
          amount: Number(product.unity),
        });
      }
      await existingProduct.save();
    }

    //--------edit product--------

    //--------edit Client--------
    let id = client.id;

    let dataSale = {
      date: currentDate,
      products: List,
      priceTotal: pricetotalFunction(),
      invoice: invoice,
      dues: dues,
    };

    await Client.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          buys: {
            dataSale,
          },
        },
      }
    );
    //--------edit Client--------

    return res.status(200).json({ msg: "Sale creado" });
  } catch (error) {
    console.log(error);
    res.status(400).json(formatError(error.message));
  }
};

// Función para obtener el nombre del mes a partir de su número

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

  const { products, priceTotal, client, dues, invoice, state } = req.body;

  try {
    let sale = await Sale.findByIdAndUpdate(
      id,
      {
        date: currentDate,
        products: products,
        priceTotal: priceTotal,
        dues: dues,
        client: client,
        invoice: invoice,
        state: state,
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
