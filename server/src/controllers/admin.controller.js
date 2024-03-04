import { formatError } from "../utils/formatError.js";
import { Admin } from "../models/admin.js";


export const createAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    let admin = await Admin.findOne({ email });
    if (admin) {
      throw new Error("Email ya registrado");
    }

    admin = new Admin({
      email,
      password,
      admission: Date.now(),
    });

    await admin.save();
    return res.status(200).json({ msg: "Admin creado" });
  } catch (error) {
    res.status(400).json(formatError(error.message));
  }
};

export const getAllAdmin = async (req, res) => {
  try {
    let admins = await Admin.find().select("-password");;
    res.status(200).json({ admins });
  } catch (error) {
    res.status(400).json(formatError(error.message));
  }
};

export const getAdminById = async (req, res) => {
  const { id } = req.params;
  try {
    let admin = await Admin.findById(id).select("-password");;
    res.status(200).json(admin);
  } catch (error) {
    res.status(400).json(formatError(error.message));
  }
};

export const updateAdminById = async (req, res) => {
  const { id } = req.params;

  const { name, lastName, country, state } = req.body;
  try {
    let admin = await Admin.findByIdAndUpdate(
      id,
      {
        name: name,
        lastName: lastName,
        country: country,
        state: state,
      },
      { new: true }
    );
    res.status(200).json({ admin });
  } catch (error) {
    res.status(400).json(formatError(error.message));
  }
};


export const deleteAdminById = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findByIdAndUpdate(
      id,
      { state: false },
      { new: true }
    );

    res.status(200).json(admin);
  } catch (error) {
    res.status(400).json(formatError(error.message));
  }
};
