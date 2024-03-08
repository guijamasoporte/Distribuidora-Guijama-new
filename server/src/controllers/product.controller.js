import { Error } from "mongoose";
import { Product } from "../models/products.js";
import { formatError } from "../utils/formatError.js";

export const createProduct = async (req, res) => {
  const { resLink } = req.body;
  const { title } = req.body.product;
  try {
    let product = new Product({
      ...req.body.product,
      title: title[0].toUpperCase() + title.slice(1),
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
        image:resLink,
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

    // Obtener productos filtrados por categoría
    const products = await Product.find({ category });

    // Actualizar los precios de cada producto
    for (const product of products) {
      // Verificar si el producto tiene la propiedad priceCost y si es un número
      if (typeof product.priceCost === "number") {
        // Calcular el nuevo priceCost basado en el porcentaje proporcionado
        const newPriceCost =
          product.priceCost + (product.priceCost * priceModifier) / 100;

        // Actualizar el priceCost en el producto
        product.priceCost = newPriceCost;
      }

      // Verificar si el producto tiene la propiedad priceList y si es un número
      if (typeof product.priceList === "number") {
        // Calcular el nuevo priceList basado en el porcentaje proporcionado
        const newPriceList =
          product.priceList + (product.priceList * priceModifier) / 100;

        // Actualizar el priceList en el producto
        product.priceList = newPriceList;
      }

      // Guardar el producto actualizado en la base de datos
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
