import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  Rol: {
    type: String,
    default: "ROL_Admin",
  },
});

adminSchema.pre("save", async function (next) {
  const admin = this;
  if (!admin.isModified("password")) return next();
  try {
    const salt = await bcryptjs.genSalt(10);
    admin.password = await bcryptjs.hash(admin.password, salt);
    next();
  } catch (error) {
    console.log(error);
  }
});
adminSchema.methods.comparePassword = async function (canditatePassword) {
  return await bcryptjs.compare(canditatePassword, this.password);
};
adminSchema.methods.toJSON = function () {
  const { __v, _id, ...admin } = this.toObject();
  admin.uid = _id;
  return admin;
};

export const Admin = mongoose.model("Admin", adminSchema);
