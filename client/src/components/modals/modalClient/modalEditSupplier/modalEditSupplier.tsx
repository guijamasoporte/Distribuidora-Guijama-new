import React, { Dispatch, SetStateAction, useState } from "react";
import { TextField, Dialog } from "@mui/material";
import styles from "./modalEditSupplier.module.css";
import { GetDecodedCookie } from "../../../../utils/DecodedCookie";
import InstanceOfAxios from "../../../../utils/intanceAxios";
import Swal from "sweetalert2";
import { Supplier } from "../../../../interfaces/interfaces";

interface CreateSupplierModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (newClient: any) => void;
  supplier: Supplier;
  setSupplierSelect: Dispatch<SetStateAction<Supplier | null>>;
}

const EditSupplierModal: React.FC<CreateSupplierModalProps> = ({
  open,
  onClose,
  onCreate,
  supplier,
  setSupplierSelect: setClientSelect,
}) => {
  const [newSupplier, setNewSupplier] = useState({
    name: supplier.name,
    lastName: supplier.lastName,
    phone: supplier.phone,
    email: supplier.email,
    adress: supplier.adress,
    buys: supplier.buys,
  });

  const handleChange = (prop: string, value: string) => {
    setNewSupplier({
      ...newSupplier,
      [prop]: value,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      // onCreate(newClient);
      const token = GetDecodedCookie("cookieToken");
      await InstanceOfAxios(
        `/supplier/${supplier._id}`,
        "PUT",
        newSupplier,
        token
      );
      Swal.fire(
        "Proveedor actualizado!",
        "Los cambios se han guardado exitosamente.",
        "success"
      );
      onClose();
      setClientSelect(null);
    } catch (error) {
      console.error("Error al actualizar el proveedor:", error);
    }
  };

  return (
    <Dialog className={styles.containerForm} open={open} onClose={onClose}>
      <div className={styles.modal}>
        <p className={styles.titleForm}>Editar proveedor</p>
        <div className={styles.formInputs}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <TextField
              className={styles.formField}
              name="name"
              label="Nombre"
              value={newSupplier.name}
              fullWidth
              inputProps={{ maxLength: 25 }}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <TextField
              className={styles.formField}
              name="lastName"
              label="Apellido"
              value={newSupplier.lastName}
              fullWidth
              inputProps={{ maxLength: 20 }}
              onChange={(e) => handleChange("lastName", e.target.value)}
            />
            <TextField
              className={styles.formField}
              name="phone"
              label="Teléfono"
              value={newSupplier.phone}
              fullWidth
              inputProps={{ maxLength: 20 }}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
            <TextField
              className={styles.formField}
              name="email"
              label="Email"
              value={newSupplier.email}
              fullWidth
              inputProps={{ maxLength: 20 }}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            <TextField
              className={styles.formField}
              name="adress"
              label="Dirección"
              value={newSupplier.adress}
              fullWidth
              inputProps={{ maxLength: 20 }}
              onChange={(e) => handleChange("adress", e.target.value)}
            />

            <button className={styles.buttonAdd} type="submit">
              Editar proveedor
            </button>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default EditSupplierModal;
