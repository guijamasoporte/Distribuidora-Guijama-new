import React, { useState } from "react";
import { Dialog, TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import styles from "./modalEditPriceCategory.module.css";
import { GetDecodedCookie } from "../../../../utils/DecodedCookie";
import InstanceOfAxios from "../../../../utils/intanceAxios";
import Swal from "sweetalert2";

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
  categories: string[];
  brands: string[];
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
    image: [],
    sales: {},
  };

  const [product, setProduct] = useState<Product>(initialProduct);
  const [priceModifier, setPriceModifier] = useState<number>(0);

  const handleChange = (prop: string, value: string | number) => {
    if ((!isNaN(Number(value)) && Number(value) >= 0) || value === "") {
      setProduct({
        ...product,
        [prop]: value,
      });
    }
  };

  const handleAddIncrease = () => {
    const newPriceList = product.priceList * (1 + priceModifier);
    setProduct({
      ...product,
      priceList: newPriceList,
    });
    Swal.fire("¡Precio actualizado!", "El precio del rubro se ha actualizado.", "success");
    console.log("Producto con precios actualizados:", product);
    handleClose();
    setProduct(initialProduct);
  };
  

  const handleCategoryChange = (value: string | null) => {
    if (value !== null) {
      setPriceModifier(value === "Categoría1" ? 0.1 : 0);
      handleChange("category", value);
    }
  };

  return (
    <Dialog className={styles.containerForm} open={open} onClose={handleClose}>
      <p className={styles.titleForm}>Modificar precios por rubro</p>
      <div className={styles.formInputs}>
        <Autocomplete
          className={styles.formField}
          options={Array.isArray(categories) ? categories : []}
          getOptionLabel={(option) => option}
          onChange={(e, value) => handleCategoryChange(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Categoría"
              fullWidth
              value={product.category}
              onChange={(e) => handleChange("category", e.target.value)}
            />
          )}
        />
        <TextField
          className={styles.formField}
          name="priceList"
          label="%"
          fullWidth
          value={product.priceList * (1 + priceModifier)}
          onChange={(e) => handleChange("priceList", e.target.value)}
          inputProps={{
            maxLength: 4,
            type: "text",
            inputMode: "numeric",
            pattern: "[0-9]*",
          }}
        />
      </div>
      <button
        className={styles.buttonAdd}
        //   onClick={handleAddIncrease}
      >
        Aceptar
      </button>
    </Dialog>
  );
};

export default AddProductModal;
