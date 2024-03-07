import React, { useState } from "react";
import { Dialog, IconButton, TextField } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import Autocomplete from "@mui/material/Autocomplete";
import styles from "./modalAddProduct.module.css";
import { GetDecodedCookie } from "../../../../utils/DecodedCookie";
import InstanceOfAxios from "../../../../utils/intanceAxios";

interface Product {
  code: string;
  title: string;
  category: string;
  brand: string;
  stock: number;
  priceCost: number;
  priceList: number;
  image: string | null;
  sales: {};
}

interface AddProductModalProps {
  open: boolean;
  handleClose: () => void;
  categories: any[];
  brands: any[];
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  open,
  handleClose,
  categories,
  brands,
}) => {
  const initialProduct: Product = {
    code: "",
    title: "",
    category: "",
    brand: "",
    stock: 0,
    priceCost: 0,
    priceList: 0,
    image: null,
    sales: {},
  };

  const [product, setProduct] = useState<Product>(initialProduct);
  const [newCategory, setNewCategory] = useState<string>("");
  const [newBrand, setNewBrand] = useState<string>("");

  const handleChange = (prop: string, value: string) => {
    setProduct({
      ...product,
      [prop]: value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProduct({
          ...product,
          image: e.target?.result as string,
        });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setProduct({
      ...product,
      image: null,
    });
    const inputFile = document.getElementById(
      "image-input"
    ) as HTMLInputElement;
    if (inputFile) {
      inputFile.value = "";
    }
  };

  const handleAddProduct = async () => {
    try {
      const token = GetDecodedCookie("cookieToken");
      const updatedProduct: Product = {
        ...product,
        category: newCategory || product.category,
        brand: newBrand || product.brand,
      };
      await InstanceOfAxios("/products", "POST", updatedProduct, token);
      handleClose();
      setProduct(initialProduct);
      setNewCategory("");
      setNewBrand("");
    } catch (error) {
      console.error("Error al agregar los productos:", error);
    }
  };

  return (
    <Dialog className={styles.containerForm} open={open} onClose={handleClose}>
      <p className={styles.titleForm}>Agregar nuevo producto</p>
      <div className={styles.formInputs}>
        <TextField
          className={styles.formField}
          name="code"
          label="Código"
          value={product.code}
          onChange={(e) => handleChange("code", e.target.value)}
          fullWidth
          inputProps={{ maxLength: 20 }}
        />
        <TextField
          className={styles.formField}
          name="title"
          label="Título"
          value={product.title}
          onChange={(e) => handleChange("title", e.target.value)}
          fullWidth
          inputProps={{ maxLength: 20 }}
        />
        <div className={styles.inputsSelect}>
          <Autocomplete
            className={styles.formAutocomplete}
            options={Array.isArray(categories) ? categories : []}
            getOptionLabel={(option) => option}
            value={newCategory}
            onChange={(event: any, newValue: string | null) => {
              setNewCategory(newValue || "");
            }}
            inputValue={newCategory}
            onInputChange={(event, newInputValue) => {
              setNewCategory(newInputValue);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Categoría" fullWidth />
            )}
          />
          <Autocomplete
            className={styles.formAutocomplete}
            options={Array.isArray(brands) ? brands : []}
            getOptionLabel={(option) => option}
            value={newBrand}
            onChange={(event: any, newValue: string | null) => {
              setNewBrand(newValue || "");
            }}
            inputValue={newBrand}
            onInputChange={(event, newInputValue) => {
              setNewBrand(newInputValue);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Marca" fullWidth />
            )}
          />
        </div>
        <TextField
          className={styles.formField}
          name="stock"
          label="Stock"
          value={product.stock}
          onChange={(e) => handleChange("stock", e.target.value)}
          fullWidth
          inputProps={{ maxLength: 20 }}
        />
        <TextField
          className={styles.formField}
          name="priceCost"
          label="Precio de costo"
          value={product.priceCost}
          onChange={(e) => handleChange("priceCost", e.target.value)}
          fullWidth
          inputProps={{ maxLength: 20 }}
        />
        <TextField
          className={styles.formField}
          name="priceList"
          label="Precio de lista"
          value={product.priceList}
          onChange={(e) => handleChange("priceList", e.target.value)}
          fullWidth
          inputProps={{ maxLength: 20 }}
        />
        {product.image && (
          <div className={styles.imageContainer}>
            <button
              className={styles.removeImageButton}
              onClick={handleRemoveImage}
            >
              <ClearIcon />
            </button>
            <img className={styles.image} src={product.image} alt="Imagen" />
          </div>
        )}
        <label htmlFor="image-input" className={styles.customImageButton}>
          Subir imagen
        </label>
        <input
          accept="image/*"
          className={styles.input}
          id="image-input"
          multiple={false}
          type="file"
          onChange={handleImageChange}
        />
      </div>
      <button className={styles.buttonAdd} onClick={handleAddProduct}>
        Agregar
      </button>
    </Dialog>
  );
};

export default AddProductModal;
