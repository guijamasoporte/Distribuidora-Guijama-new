import React, { useState } from "react";
import { Modal, TextField, Button, Dialog } from "@mui/material";
import styles from "./modalEditClient.module.css";
import { GetDecodedCookie } from "../../../../utils/DecodedCookie";
import InstanceOfAxios from "../../../../utils/intanceAxios";

interface CreateClientModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (newClient: any) => void;
  client: any;
}

const EditClientModal: React.FC<CreateClientModalProps> = ({
  open,
  onClose,
  onCreate,
  client,
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
    // onCreate(newClient);
    const token = GetDecodedCookie("cookieToken");
    await InstanceOfAxios(`/clients/${client._id}`, "PUT", newClient, token);
    onClose();
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
              inputProps={{ maxLength: 20 }}
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
