import { formatError } from "../utils/formatError.js";
import { Client } from "../models/clients.js";

export const createClient = async (req, res) => {
  const { name, lastName } = req.body;
  try {
    let client = new Client({
      name: name[0].toUpperCase() + name.slice(1),
      lastName: lastName[0].toUpperCase() + lastName.slice(1),
      ...req.body,
    });
    await client.save();
    return res.status(200).json({ msg: "client creado" });
  } catch (error) {
    res.status(400).json(formatError(error.message));
  }
};

export const getAllClient = async (req, res) => {
  try {
    let clients = await Client.find();
    res.status(200).json({ clients });
  } catch (error) {
    res.status(400).json(formatError(error.message));
  }
};

export const getClientById = async (req, res) => {
  const { id } = req.params;
  try {
    let client = await Client.findById(id);
    res.status(200).json(client);
  } catch (error) {
    res.status(400).json(formatError(error.message));
  }
};

export const updateClientnById = async (req, res) => {
  const { id } = req.params;

  const { name, lastName } = req.body;
  try {
    let client = await Client.findByIdAndUpdate(
      id,
      {
        name: name[0].toUpperCase() + name.slice(1),
        lastName: lastName[0].toUpperCase() + lastName.slice(1),
        ...req.body,
      },
      { new: true }
    );
    res.status(200).json({ client });
  } catch (error) {
    res.status(400).json(formatError(error.message));
  }
};

export const deleteClientById = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findByIdAndUpdate(
      id,
      { state: false },
      { new: true }
    );

    res.status(200).json(client);
  } catch (error) {
    res.status(400).json(formatError(error.message));
  }
};
