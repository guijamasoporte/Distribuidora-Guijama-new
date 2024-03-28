import React, { Dispatch, SetStateAction, useState } from "react";
import { TextField, Dialog } from "@mui/material";
import styles from "./modalEditClient.module.css";
import { GetDecodedCookie } from "../../../../utils/DecodedCookie";
import InstanceOfAxios from "../../../../utils/intanceAxios";
import Swal from "sweetalert2";
import { Client } from "../../../../interfaces/interfaces";

interface CreateClientModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (newClient: any) => void;
  client: Client;
  setClientSelect: Dispatch<SetStateAction<Client | null>>;
}

const EditClientModal: React.FC<CreateClientModalProps> = ({
  open,
  onClose,
  onCreate,
  client,
  setClientSelect,
}) => {
  const [newClient, setNewClient] = useState({
    name: client.name,
    lastName: client.lastName,
    phone: client.phone,
    email: client.email,
    adress: client.adress,
    buys: client.buys,
  });

  const handleChange = (prop: string, value: string) => {
    setNewClient({
      ...newClient,
      [prop]: value,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      // onCreate(newClient);
      const token = GetDecodedCookie("cookieToken");
      await InstanceOfAxios(`/clients/${client._id}`, "PUT", newClient, token);
      Swal.fire(
        "¡Cliente actualizado!",
        "Los cambios se han guardado exitosamente.",
        "success"
      );
      onClose();
      setClientSelect(null);
    } catch (error) {
      console.error("Error al actualizar el cliente:", error);
    }
  };

  return (
    <Dialog className={styles.containerForm} open={open} onClose={onClose}>
      <div className={styles.modal}>
        <p className={styles.titleForm}>Editar cliente</p>
        <div className={styles.formInputs}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <TextField
              className={styles.formField}
              name="name"
              label="Nombre"
              value={newClient.name}
              fullWidth
              inputProps={{ maxLength: 25 }}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <TextField
              className={styles.formField}
              name="lastName"
              label="Apellido"
              value={newClient.lastName}
              fullWidth
              inputProps={{ maxLength: 20 }}
              onChange={(e) => handleChange("lastName", e.target.value)}
            />
            <TextField
              className={styles.formField}
              name="phone"
              label="Teléfono"
              value={newClient.phone}
              fullWidth
              inputProps={{ maxLength: 20 }}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
            <TextField
              className={styles.formField}
              name="email"
              label="Email"
              value={newClient.email}
              fullWidth
              inputProps={{ maxLength: 20 }}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            <TextField
              className={styles.formField}
              name="adress"
              label="Dirección"
              value={newClient.adress}
              fullWidth
              inputProps={{ maxLength: 20 }}
              onChange={(e) => handleChange("adress", e.target.value)}
            />

            <button className={styles.buttonAdd} type="submit">
              Editar Cliente
            </button>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default EditClientModal;