import { Admin } from "../models/admin.js";
import { Client } from "../models/clients.js";
import { Product } from "../models/products.js";
import { Sale } from "../models/sale.js";
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

export const createSale = async (req, res) => {
  const { List, client, token, method } = req.body;

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

    // --------new sale--------
    let sale = new Sale({
      date: currentDate,
      products: List,
      priceTotal: pricetotalFunction(),
      client: client,
      createdBy: user.email,
      method: method ? method : "Efectivo",
    });

    await sale.save();
    //--------new sale--------

    for (const product of List) {
      if (product.generic === false || !product.generic) {
        const currentDate = new Date(); // Asegurarse de que currentDate esté definido
        const currentMonth = currentDate.getMonth(); // Obtener el mes actual (0 = enero, 1 = febrero, etc.)
        const currentYear = currentDate.getFullYear(); // Obtener el año actual
        const monthName = getMonthName(currentMonth);
    
      
     
   
        console.log(`Año actual: ${currentYear}`);
    
        const existingProduct = await Product.findById(product._id);
        existingProduct.stock -= product.unity;
    
        const salesEntry = existingProduct.sales.find(
          (sale) => sale.month === monthName && sale.year === currentYear
        );
        if (salesEntry) {
          salesEntry.amount += Number(product.unity);  
        } else {
          existingProduct.sales.push({
            month: monthName,
            year: currentYear,
            amount: Number(product.unity),
          });
         
        }
        existingProduct.markModified('sales'); // Marcar 'sales' como modificado
        await existingProduct.save();
      }
    }
    

    //--------edit product--------

    //--------edit Client--------
    let id = client.id;

    await Client.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          buys: {
            date: currentDate,
            products: List,
            priceTotal: pricetotalFunction(),
            idSale: sale.idSale,
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

export const UpdateSaleById = async (req, res) => {
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

  console.log(req.body);
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
    let sale = await Sale.findByIdAndUpdate(id, updateFields, { new: true });

    // Actualizar priceTotal si List está presente
    if (List) {
      sale.priceTotal = pricetotalFunction();
      await sale.save();
    }

    return res.status(200).json({ sale });
  } catch (error) {
    console.log(error);
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
