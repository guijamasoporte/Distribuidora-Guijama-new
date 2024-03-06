import { Product } from "../models/products.js";
import { formatError } from "../utils/formatError.js";

export const createProduct = async (req, res) => {
  const { title } = req.body;
  try {
    console.log(req.body);
    let product = new Product({
      ...req.body,
      title: title[0].toUpperCase() + title.slice(1),
    });
    await product.save();
    return res.status(200).json({ msg: "producto creado" });
  } catch (error) {
    res.status(400).json(formatError(error.message));
  }
};

export const GetAllProduct = async (req, res) => {
  try {
    let products = await Product.find();
    return res.status(200).json(products.reverse());
  } catch (error) {
    res.status(400).json(formatError(error.message));
  }
};

export const GetProductById = async (req, res) => {
  const { id } = req.params;
  try {
    let product = await Product.findById(id);
    return res.status(200).json({ product });
  } catch (error) {
    res.status(400).json(formatError(error.message));
  }
};

export const UpdateProductById = async (req, res) => {
  const { id } = req.params;
  const {
    code,
    title,
    stock,
    description,
    priceList,
    priceCost,
    category,
    brand,
    amount,
    image,
  } = req.body;

  try {
    let product = await Product.findByIdAndUpdate(
      id,
      {
        code,
        title: title[0].toUpperCase() + title.slice(1),
        stock,
        description: description[0].toUpperCase() + description.slice(1),
        priceList,
        priceCost,
        category,
        brand,
        amount,
        image,
      },
      { new: true }
    );
    return res.status(200).json({ product });
  } catch (error) {
    //cuando vendo, baja el stock y aumenta depende el mes con getMonth() a sales si existe el mes sino agrega y suma la cant vendida
    res.status(400).json(formatError(error.message));
  }
};

export const DeleteProductById = async (req, res) => {
  const { id } = req.params;
  try {
    await Product.findByIdAndDelete(id);

    return res.status(200).json("producto eliminado");
  } catch (error) {
    console.log(error);
    res.status(400).json(formatError(error.message));
  }
};
