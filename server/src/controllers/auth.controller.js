import { formatError } from "../utils/formatError.js";
// import { User } from "../models/user.js";
import { generateRefreshToken, generateToken } from "../utils/tokenManager.js";
import { Admin } from "../models/admin.js";

// export const register = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     let user = await User.findOne({ email });
//     if (user) {
//       throw new Error("Email ya registrado");
//     }

//     let currentDate = new Date();
//     const timeZoneOffset = -3; // La diferencia de la zona horaria en horas
//     currentDate.setHours(currentDate.getHours() + timeZoneOffset);

//     user = new User({
//       email,
//       password,
//       admission: currentDate,
//     });

//     const { token, expiresIn } = generateToken(user._id);

//     await user.save();
//     // sendConfirmationEmail(token, email);
//     return res.status(200).json("usuario creado");
//   } catch (error) {
//     res.status(400).json(formatError(error.message));
//   }
// };

export const login = async (req, res) => {
  const { email, password } = req.body;
  let user;
  let emaillower = email.toLowerCase();
  try {
    // user = await User.findOne({ email });
    if (!user) {
      user = await Admin.findOne({ email: emaillower });
    }
    if (!user) {
      return res.status(404).json({ error: "No existe este usuario" });
    }
    // compara que las contraseñas coincidan
    const respuestaPassword = await user.comparePassword(password);
    if (!respuestaPassword) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const { token, expiresIn } = generateToken(user.id);
    generateRefreshToken(user.id, res);
    return res.status(200).json({ token, expiresIn, rol: user.Rol });
  } catch (error) {
    res.status(400).json(formatError(error.message));
  }
};
