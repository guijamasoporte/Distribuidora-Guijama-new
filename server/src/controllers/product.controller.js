import { Error } from "mongoose";
import { Product } from "../models/products.js";
import { formatError } from "../utils/formatError.js";

export const createProduct = async (req, res) => {
  const { resLink } = req.body;
  const { title, category, brand, code, priceList, priceCost, stock } =
    req.body.product;
  try {
    let product = new Product({
      code,
      title: title[0].toString().toUpperCase() + title.toString().slice(1),
      category,
      brand,
      stock,
      priceList,
      priceCost,
      image: resLink,
    });
    await product.save();
    return res.status(200).json({ msg: "producto creado" });
  } catch (error) {
    console.log(error);
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
  const { title } = req.body.product;
  const { resLink } = req.body;

  try {
    let product = await Product.findByIdAndUpdate(
      id,
      {
        ...req.body.product,
        title: title[0]?.toUpperCase() + title?.slice(1),
        image: resLink,
      },
      { new: true }
    );
    return res.status(200).json({ product });
  } catch (error) {
    //cuando vendo, baja el stock y aumenta depende el mes con getMonth() a sales si existe el mes sino agrega y suma la cant vendida
    console.log(error);
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

export const getAllCategories = async (req, res) => {
  try {
    let products = await Product.find();
    const categoriesPrimary = new Set(products.map((el) => el.category));
    const uniqueCategoriesPrimary = Array.from(categoriesPrimary);

    return res.status(200).json({
      categories: uniqueCategoriesPrimary,
    });
  } catch (error) {
    res.status(400).json(formatError(error.message));
  }
};

export const getAllBrands = async (req, res) => {
  try {
    let products = await Product.find();
    const categoriesPrimary = new Set(products.map((el) => el.brand));
    const uniqueCategoriesPrimary = Array.from(categoriesPrimary);

    return res.status(200).json({
      brands: uniqueCategoriesPrimary,
    });
  } catch (error) {
    res.status(400).json(formatError(error.message));
  }
};

export const EditPriceAllProducts = async (req, res) => {
  try {
    const { category, priceModifier } = req.body;
    const products = await Product.find({ category });

    for (const product of products) {
      if (typeof product.priceCost === "number") {
        const newPriceCost = Math.ceil(
          product.priceCost + (product.priceCost * priceModifier) / 100
        );
        product.priceCost = newPriceCost;
      }
      if (typeof product.priceList === "number") {
        const newPriceList = Math.ceil(
          product.priceList + (product.priceList * priceModifier) / 100
        );
        product.priceList = newPriceList;
      }

      await product.save();
    }

    return res
      .status(200)
      .json({ message: "Precios actualizados correctamente" });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
