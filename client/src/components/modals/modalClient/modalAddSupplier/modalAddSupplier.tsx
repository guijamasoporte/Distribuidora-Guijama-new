import React, { useState } from "react";
import { TextField, Dialog } from "@mui/material";
import styles from "./modalAddSupplier.module.css";
import Swal from "sweetalert2";
import { propsModals, Supplier } from "../../../../interfaces/interfaces";

const CreateSupplierModal: React.FC<propsModals> = ({
  open,
  onClose,
  onCreate,
}) => {
  const [supplier, setNewSupplier] = useState<Supplier>({
    name: "",
    lastName: "",
    phone: "",
    email: "",
    adress: "",
    // no se usan ↓
    date: "",
    _id: "",
    idSupplier: "",
    buys: "",
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setNewSupplier({
      ...supplier,
      [name]: value,
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onCreate(supplier);
    Swal.fire(
      "proveedor creado!",
      "El proveedor se ha creado exitosamente.",
      "success"
    );
    onClose();
    setNewSupplier({
      name: "",
      lastName: "",
      phone: "",
      email: "",
      adress: "",
      date: "",
      _id: "",
      idSupplier: "",
      buys: "",
    });
  };

  return (
    <Dialog className={styles.containerForm} open={open} onClose={onClose}>
      <div className={styles.modal}>
        <p className={styles.titleForm}>Agregar nuevo proveedor</p>
        <div className={styles.formInputs}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <TextField
              className={styles.formField}
              name="name"
              label="Nombre"
              value={supplier.name}
              fullWidth
              onChange={(e) => handleChange(e)}
              inputProps={{ maxLength: 25 }}
            />
            <TextField
              className={styles.formField}
              name="lastName"
              label="Apellido"
              value={supplier.lastName}
              fullWidth
              onChange={(e) => handleChange(e)}
              inputProps={{ maxLength: 20 }}
            />
            <TextField
              className={styles.formField}
              name="phone"
              label="Teléfono"
              value={supplier.phone}
              fullWidth
              onChange={(e) => handleChange(e)}
              inputProps={{ maxLength: 20 }}
            />
            <TextField
              className={styles.formField}
              name="email"
              label="Email"
              value={supplier.email}
              fullWidth
              onChange={(e) => handleChange(e)}
            />
            <TextField
              className={styles.formField}
              name="adress"
              label="Dirección"
              value={supplier.adress}
              fullWidth
              onChange={(e) => handleChange(e)}
              inputProps={{ maxLength: 40 }}
            />

            <button className={styles.buttonAdd} type="submit">
              Agregar proveedor
            </button>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default CreateSupplierModal;
