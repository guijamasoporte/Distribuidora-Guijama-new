import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Dialog, TextField } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import InstanceOfAxios from "../../../../utils/intanceAxios";
import styles from "./modalEditProduct.module.css";
import { GetDecodedCookie } from "../../../../utils/DecodedCookie";
import Swal from "sweetalert2";
import { fileUpload } from "../../../../utils/fileUpload";
import { Product } from "../../../../interfaces/interfaces";

interface EditProductModalProps {
  open: boolean;
  handleClose: () => void;
  productSelect: Product;
  setProductSelect: Dispatch<SetStateAction<Product | null>>;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  open,
  handleClose,
  productSelect,
  setProductSelect,
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
      pricex10: productSelect.pricex10,
      pricex100: productSelect.pricex100,
      image: productSelect.image,
      _id: productSelect._id,
      unity: "",
      generic: false,
      variant: productSelect.variant,
    };
  }, [productSelect]);

  const [product, setProduct] = useState<Product>(initialProduct);

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const maxImages = 1;
  const inputRef: React.MutableRefObject<HTMLInputElement | null> =
    useRef(null);

  useEffect(() => {
    setSelectedImages(initialProduct.image);
  }, [initialProduct.image]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const selected = Array.from(files as FileList);

    if (selectedImages.length + selected.length > maxImages) {
      alert(`Máximo ${maxImages} imágenes permitidas.`);
    } else {
      setSelectedImages((prevSelected) => [...prevSelected, ...selected]);
    }
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleImageRemove = (index: number) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(index, 1);
    setSelectedImages(updatedImages);
  };

  const handleChange = (prop: keyof Product, value: string | number) => {
    setProduct({
      ...product,
      [prop]: value,
    });
  };

  const handleEditProduct = async () => {
    try {
      const token = GetDecodedCookie("cookieToken");
      const resLink: any = await fileUpload(selectedImages, "products");

      await InstanceOfAxios(
        `/products/${productSelect._id}`,
        "PUT",
        { product, resLink },
        token
      );

      Swal.fire(
        "¡Producto editado!",
        "El producto se ha editado exitosamente.",
        "success"
      );
      handleClose();
      setProductSelect(null);
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
          inputProps={{ maxLength: 30 }}
        />
        <TextField
          className={styles.formField}
          name="variant"
          label="Variedad"
          value={product.variant}
          onChange={(e) => handleChange("variant", e.target.value)}
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
        <TextField
          className={styles.formField}
          name="pricex10"
          label="Precio x 10 unidades"
          value={product.pricex10}
          onChange={(e) => handleChange("pricex10", e.target.value)}
          fullWidth
          inputProps={{ maxLength: 20 }}
        />
        <TextField
          className={styles.formField}
          name="pricex100"
          label="Precio x 100 unidades"
          value={product.pricex100}
          onChange={(e) => handleChange("pricex100", e.target.value)}
          fullWidth
          inputProps={{ maxLength: 20 }}
        />
        {selectedImages &&
          selectedImages.map((image, index) => (
            <div className={styles.imageContainer}>
              <button
                className={styles.removeImageButton}
                onClick={() => handleImageRemove(index)}
              >
                <ClearIcon />
              </button>
              <img
                className={styles.image}
                src={
                  typeof image === "string" ? image : URL.createObjectURL(image)
                }
                alt={`Imagen ${index + 1}`}
              />
            </div>
          ))}
        <input
          accept="image/*"
          className={styles.input}
          id="image-input"
          multiple={false}
          type="file"
          onChange={(e) => handleImageUpload(e)}
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
