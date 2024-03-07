import React, { useEffect, useMemo, useState } from "react";
import { Dialog, TextField } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import InstanceOfAxios from "../../../../utils/intanceAxios";
import styles from "./modalEditProduct.module.css";
import { GetDecodedCookie } from "../../../../utils/DecodedCookie";
import Swal from "sweetalert2";

interface Product {
  _id: string;
  code: string;
  title: string;
  category: string;
  brand: string;
  stock: number;
  priceCost: number;
  priceList: number;
  image: string;
  sales: {};
}

interface EditProductModalProps {
  open: boolean;
  handleClose: () => void;
  productSelect: Product;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  open,
  handleClose,
  productSelect,
}) => {
  const initialProduct = useMemo(() => {
    return {
      code: productSelect.code,
      title: productSelect.title,
      category: productSelect.category,
      brand: productSelect.brand,
      stock: productSelect.stock,
      priceCost: productSelect.priceCost,
      priceList: productSelect.priceList,
      image: productSelect.image,
      sales: {},
      _id: productSelect._id,
    };
  }, [productSelect]);

  const [product, setProduct] = useState<Product>(initialProduct);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (open) {
      setProduct(productSelect);
      console.log(productSelect.image);
    } else {
      setProduct(initialProduct);
    }
  }, [open, productSelect, initialProduct]);

  const handleChange = (prop: string, value: string | number) => {
    setProduct({
      ...product,
      [prop]: value,
    });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      setImageFile(files[0]);
      setProduct((prevProduct) => ({
        ...prevProduct,
        image: URL.createObjectURL(files[0]),
      }));
    }
  };

  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          const target = e.target as FileReader;
          setProduct((prevProduct) => ({
            ...prevProduct,
            image: target.result as string,
          }));
        }
      };
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  const handleRemoveImage = () => {
    setProduct({
      ...product,
      image: "",
    });
    setImageFile(null);

    const inputFile = document.getElementById(
      "image-input"
    ) as HTMLInputElement;
    if (inputFile) {
      inputFile.value = "";
    }
  };

  const handleEditProduct = async () => {
    try {
      const formData = new FormData();
      formData.append("image", imageFile!);
      formData.append("code", product.code);
      formData.append("title", product.title);
      formData.append("category", product.category);
      formData.append("brand", product.brand);
      formData.append("stock", String(product.stock));
      formData.append("priceCost", String(product.priceCost));
      formData.append("priceList", String(product.priceList));
  
      await InstanceOfAxios(`/products/${productSelect._id}`, "PUT", formData);
  
      Swal.fire("¡Producto editado!", "El producto se ha editado exitosamente.", "success");
      handleClose();
    } catch (error) {
      console.error("Error al editar el producto:", error);
    }
  };
  

  return (
    <Dialog className={styles.containerForm} open={open} onClose={handleClose}>
      <p className={styles.titleForm}>Editar producto</p>
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
          inputProps={{ maxLength: 20 }}
        />
        <TextField
          className={styles.formField}
          name="category"
          label="Categoría"
          value={product.category}
          onChange={(e) => handleChange("category", e.target.value)}
          fullWidth
          inputProps={{ maxLength: 20 }}
        />
        <TextField
          className={styles.formField}
          name="brand"
          label="Marca"
          value={product.brand}
          onChange={(e) => handleChange("brand", e.target.value)}
          fullWidth
          inputProps={{ maxLength: 20 }}
        />
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
        <input
          accept="image/*"
          className={styles.input}
          id="image-input"
          multiple={false}
          type="file"
          onChange={handleImageChange}
        />
        <label htmlFor="image-input" className={styles.customImageButton}>
          Subir imagen
        </label>
      </div>
      <button className={styles.buttonAdd} onClick={handleEditProduct}>
        Editar
      </button>
    </Dialog>
  );
};

export default EditProductModal;
