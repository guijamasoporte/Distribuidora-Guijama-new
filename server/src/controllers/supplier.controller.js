import { formatError } from "../utils/formatError.js";
import { Supplier } from "../models/supplier.js";

export const createSupplier = async (req, res) => {
  try {
    console.log(req.body);
    const { name, lastName, phone, adress, email, contactName, buys } =
      req.body; // extrae name y lastName del body
    const formattedName =
      name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    const formattedLastName =
      lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();

    const Supplier = new Supplier({
      name: formattedName,
      lastName: formattedLastName,
      phone,
      adress,
      email,
      contactName,
      buys,
    });

    await Supplier.save();
    return res.status(200).json({ msg: "Suppliere creado" });
  } catch (error) {
    res.status(400).json(formatError(error.message));
  }
};

export const getAllSupplier = async (req, res) => {
  try {
    let Suppliers = await Supplier.find();
    res.status(200).json({ Suppliers });
  } catch (error) {
    res.status(400).json(formatError(error.message));
  }
};

export const getSupplierById = async (req, res) => {
  const { id } = req.params;
  try {
    let Supplier = await Supplier.findById(id);
    res.status(200).json(Supplier);
  } catch (error) {
    res.status(400).json(formatError(error.message));
  }
};

export const updateSuppliernById = async (req, res) => {
  const { id } = req.params;

  const { name, lastName } = req.body;
  try {
    let Supplier = await Supplier.findByIdAndUpdate(
      id,
      {
        name: name[0].toUpperCase() + name.slice(1),
        lastName: lastName[0].toUpperCase() + lastName.slice(1),
        ...req.body,
      },
      { new: true }
    );
    res.status(200).json({ Supplier });
  } catch (error) {
    res.status(400).json(formatError(error.message));
  }
};

export const deleteSupplierById = async (req, res) => {
  try {
    const { id } = req.params;

    const Supplier = await Supplier.findByIdAndUpdate(
      id,
      { state: false },
      { new: true }
    );

    res.status(200).json(Supplier);
  } catch (error) {
    res.status(400).json(formatError(error.message));
  }
};
