import React, { useState } from "react";
import { Dialog, TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import styles from "./modalEditPrice.module.css";
import { GetDecodedCookie } from "../../../../utils/DecodedCookie";
import InstanceOfAxios from "../../../../utils/intanceAxios";
import Swal from "sweetalert2";


interface editPriceCategoryModalProps {
  open: boolean;
  handleClose: () => void;
  categories: string[];
}

const ModalEditPrices: React.FC<editPriceCategoryModalProps> = ({
  open,
  handleClose,
  categories,
}) => {
 
  const [inputs, setInputs] = useState ({
    priceModifier: null,
    category: "",
  });


  const handleChange = (prop: string, value:any) => {
      setInputs({
        ...inputs,
        [prop]: value,
      });
   
  };

  const handleAddIncrease = async() => {
    const token = GetDecodedCookie("cookieToken");
    await InstanceOfAxios("/products/editprices","PUT",inputs,token)
    Swal.fire("¡Precio actualizado!", "El precio del rubro se ha actualizado.", "success");
    handleClose();
  };
  

  return (
    <Dialog className={styles.containerForm} open={open} onClose={handleClose}>
      <p className={styles.titleForm}>Modificar precios por rubro</p>
      <div className={styles.formInputs}>
        <Autocomplete
          className={styles.formField}
          options={Array.isArray(categories) ? categories : []}
          getOptionLabel={(option) => option}
          onChange={(e, value) => handleChange("category",value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Categoría"
              fullWidth
              value={categories}
              onChange={(e) => handleChange("category", e.target.value)}
            />
          )}
        />
        <TextField
          className={styles.formField}
          name="priceModifier"
          label="%"
          fullWidth
          value={inputs.priceModifier}
          onChange={(e) => handleChange("priceModifier", e.target.value)}
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
          onClick={handleAddIncrease}
      >
        Aceptar
      </button>
    </Dialog>
  );
};

export default ModalEditPrices;