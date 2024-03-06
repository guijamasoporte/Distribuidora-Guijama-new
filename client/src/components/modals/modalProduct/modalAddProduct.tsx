import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
} from "@mui/material";
import InstanceOfAxios from "../../../utils/intanceAxios";
import styles from "./modalAddProduct.module.css";

interface Product {
  code: string;
  title: string;
  category: string;
  brand: string;
  stock: number;
  priceCost: number;
  priceList: number;
  image: [];
  sales: {};
}

interface AddProductModalProps {
  open: boolean;
  handleClose: () => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  open,
  handleClose,
}) => {
  const initialProduct: Product = {
    code: "",
    title: "",
    category: "",
    brand: "",
    stock:0,
    priceCost: 0,
    priceList: 0,
    image: [],
    sales: {},
  };

  const [product, setProducts] = useState<Product>(initialProduct);

  const handleChange = (prop: string, value: string) => {
    setProducts({
      ...product,
      [prop]: value,
    });
  };

  const handleAddProduct = async () => {
    try {
      const response: any = await InstanceOfAxios("/products", "POST", product);
      console.log("Productos agregados exitosamente:", response.msg);

      handleClose();
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
        />
        <TextField
          className={styles.formField}
          name="title"
          label="Título"
          value={product.title}
          onChange={(e) => handleChange("title", e.target.value)}
          fullWidth
        />
        <TextField
          className={styles.formField}
          name="category"
          label="Categoría"
          value={product.category}
          onChange={(e) => handleChange("category", e.target.value)}
          fullWidth
        />
        <TextField
          className={styles.formField}
          name="brand"
          label="Marca"
          value={product.brand}
          onChange={(e) => handleChange("brand", e.target.value)}
          fullWidth
        />
        <TextField
          className={styles.formField}
          name="stock"
          label="Stock"
          value={product.stock}
          onChange={(e) => handleChange("stock", e.target.value)}
          fullWidth
        />
        <TextField
          className={styles.formField}
          name="priceCost"
          label="Precio de costo"
          value={product.priceCost}
          onChange={(e) => handleChange("priceCost", e.target.value)}
          fullWidth
        />
        <TextField
          className={styles.formField}
          name="priceList"
          label="Precio de lista"
          value={product.priceList}
          onChange={(e) => handleChange("priceList", e.target.value)}
          fullWidth
        />
      </div>
      <button className={styles.buttonAdd} onClick={handleAddProduct}>
        Agregar
      </button>
    </Dialog>
  );
};

export default AddProductModal;
