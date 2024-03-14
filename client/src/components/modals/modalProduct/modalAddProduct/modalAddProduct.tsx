import React, { useRef, useState } from "react";
import { Dialog, IconButton, TextField } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import Autocomplete from "@mui/material/Autocomplete";
import styles from "./modalAddProduct.module.css";
import { GetDecodedCookie } from "../../../../utils/DecodedCookie";
import InstanceOfAxios from "../../../../utils/intanceAxios";
import Swal from "sweetalert2";
import { fileUpload } from "../../../../utils/fileUpload";
import { Product, propsModals } from "../../../../interfaces/interfaces";

const AddProductModal: React.FC<propsModals> = ({
  open,
  handleClose,
  categories,
  brands,
  variant,
}) => {
  const initialProduct: Product = {
    code: "",
    title: "",
    category: categories[0] || "",
    brand: "",
    stock: 0,
    priceCost: 0,
    priceList: 0,
    image: [],
    unity: undefined,
    generic: false,
    _id: "",
    variant: "",
  };

  const [product, setProduct] = useState<Product>(initialProduct);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const maxImages = 1;
  const inputRef: React.MutableRefObject<HTMLInputElement | null> =
    useRef(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const selected = Array.from(files as FileList);

    if (selected.length > maxImages) {
      return;
    }

    setSelectedImages(selected);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleImageRemove = () => {
    setSelectedImages([]);
  };

  const handleChange = (prop: keyof Product, value: string | number) => {
    setProduct({
      ...product,
      [prop]: value,
    });
  };

  const handleAddProduct = async () => {
    try {
      const token = GetDecodedCookie("cookieToken");

      const resLink: any = await fileUpload(selectedImages, "products");

      if (
        product.title !== "" &&
        product.code !== "" &&
        product.category !== "" &&
        product.brand !== ""
      ) {
        await InstanceOfAxios("/products", "POST", { product, resLink }, token);

        Swal.fire(
          "¡Producto guardado!",
          "El producto se ha guardado exitosamente.",
          "success"
        );
      } else {
        Swal.fire({
          title: "Atencion!",
          text: "Faltan datos que completar.",
          icon: "warning",
        });
      }

      handleClose();
      setProduct(initialProduct);
      setSelectedImages([]);
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
        <Autocomplete
          className={styles.formAutocomplete}
          options={variant}
          getOptionLabel={(option) => option}
          value={product.variant}
          onChange={(_, newValue) => handleChange("variant", newValue || "")}
          inputValue={product.variant}
          onInputChange={(_, newInputValue) =>
            handleChange("variant", newInputValue ? newInputValue : "")
          }
          renderInput={(params) => (
            <TextField {...params} label="Variedad" fullWidth />
          )}
        />
        <div className={styles.inputsSelect}>
          <Autocomplete
            className={styles.formAutocomplete}
            options={categories}
            getOptionLabel={(option) => option}
            value={product.category}
            onChange={(_, newInputValue: any) =>
              handleChange("category", newInputValue ? newInputValue : "")
            }
            inputValue={product.category}
            onInputChange={(_, newInputValue) =>
              handleChange("category", newInputValue ? newInputValue : "")
            }
            renderInput={(params) => (
              <TextField {...params} label="Categoría" fullWidth />
            )}
          />

          <Autocomplete
            className={styles.formAutocomplete}
            options={brands}
            getOptionLabel={(option) => option}
            value={product.brand}
            onChange={(_, newValue) => handleChange("brand", newValue || "")}
            inputValue={product.brand}
            onInputChange={(_, newInputValue) =>
              handleChange("brand", newInputValue)
            }
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
          onChange={(e) => handleChange("stock", Number(e.target.value))}
          fullWidth
          inputProps={{ maxLength: 20 }}
          type="number"
        />
        <TextField
          className={styles.formField}
          name="priceCost"
          label="Precio de costo"
          value={product.priceCost}
          onChange={(e) => handleChange("priceCost", Number(e.target.value))}
          fullWidth
          inputProps={{ maxLength: 20 }}
          type="number"
        />
        <TextField
          className={styles.formField}
          name="priceList"
          label="Precio de lista"
          value={product.priceList}
          onChange={(e) => handleChange("priceList", Number(e.target.value))}
          fullWidth
          inputProps={{ maxLength: 20 }}
          type="number"
        />
        {selectedImages.length > 0 && (
          <div className={styles.imageContainer}>
            <button
              className={styles.removeImageButton}
              onClick={handleImageRemove}
            >
              <ClearIcon />
            </button>
            <img
              className={styles.image}
              src={URL.createObjectURL(selectedImages[0])}
              alt={`Imagen`}
            />
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
          onChange={(e) => handleImageUpload(e)}
          ref={inputRef}
        />
      </div>
      <button className={styles.buttonAdd} onClick={handleAddProduct}>
        Agregar
      </button>
    </Dialog>
  );
};

export default AddProductModal;
