import { Error } from "mongoose";
import { Product } from "../models/products.js";
import { formatError } from "../utils/formatError.js";

export const createProduct = async (req, res) => {
  const { resLink } = req.body;
  const {
    title,
    category,
    brand,
    code,
    priceList,
    priceCost,
    pricex10,
    pricex100,
    stock,
    variant,
  } = req.body.product;
  try {
    let product = new Product({
      code,
      title: title[0].toString().toUpperCase() + title.toString().slice(1),
      category:
        category[0].toString().toUpperCase() + category.toString().slice(1),
      brand: brand[0].toString().toUpperCase() + brand.toString().slice(1),
      variant:
        variant[0].toString().toUpperCase() + variant.toString().slice(1),
      stock,
      priceList,
      priceCost,
      pricex10,
      pricex100,
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
  const { title, category, brand, variant } = req.body.product;
  const { resLink } = req.body;

  try {
    let product = await Product.findByIdAndUpdate(
      id,
      {
        ...req.body.product,
        title: title[0]?.toString().toUpperCase() + title?.toString().slice(1),
        category:
          category[0].toString().toUpperCase() + category.toString().slice(1),
        brand: brand[0].toString().toUpperCase() + brand.toString().slice(1),
        variant:
          variant[0].toString().toUpperCase() + variant.toString().slice(1),
        image: resLink,
      },
      { new: true }
    );
    return res.status(200).json({ product });
  } catch (error) {
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

export const getAllCategoriesBrandsVariants = async (req, res) => {
  try {
    let products = await Product.find();
    const categoriesAlls = new Set(products.map((el) => el.category));
    const uniqueCategoriesAlls = Array.from(categoriesAlls);

    const brandsAlls = new Set(products.map((el) => el.brand));
    const uniqueBrands = Array.from(brandsAlls);

    const variantAlls = new Set(products.map((el) => el.variant));
    const uniqueVariantAlls = Array.from(variantAlls);

    return res.status(200).json({
      categories: uniqueCategoriesAlls,
      brands: uniqueBrands,
      variants: uniqueVariantAlls,
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
