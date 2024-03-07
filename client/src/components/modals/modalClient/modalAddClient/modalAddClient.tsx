import React, { useEffect, useState } from "react";
import { Modal, TextField, Button, Dialog } from "@mui/material";
import styles from "./modalAddClient.module.css";
import InstanceOfAxios from "../../../../utils/intanceAxios";

interface CreateClientModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (newClient: any) => void;
}

const CreateClientModal: React.FC<CreateClientModalProps> = ({
  open,
  onClose,
  onCreate,
}) => {
  const [newClient, setNewClient] = useState({
    idClient: "",
    name: "",
    lastName: "",
    phone: "",
    email: "",
    adress: "",
    buys: "",
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response: any = await InstanceOfAxios(
          "/products/categories",
          "GET"
        );
        console.log(response);

        setCategories(response.categories);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewClient({
      ...newClient,
      [name]: value,
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onCreate(newClient);
    onClose();
  };

  return (
    <Dialog className={styles.containerForm} open={open} onClose={onClose}>
      <div className={styles.modal}>
        <p className={styles.titleForm}>Agregar nuevo cliente</p>
        <div className={styles.formInputs}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <TextField
              className={styles.formField}
              name="idClient"
              label="Id Cliente"
              value={newClient.idClient}
              fullWidth
            />
            <TextField
              className={styles.formField}
              name="name"
              label="Nombre"
              value={newClient.name}
              fullWidth
            />
            <TextField
              className={styles.formField}
              name="lastName"
              label="Apellido"
              value={newClient.lastName}
              fullWidth
            />
            <TextField
              className={styles.formField}
              name="phone"
              label="Teléfono"
              value={newClient.phone}
              fullWidth
            />
            <TextField
              className={styles.formField}
              name="email"
              label="Email"
              value={newClient.email}
              fullWidth
            />
            <TextField
              className={styles.formField}
              name="adress"
              label="Dirección"
              value={newClient.adress}
              fullWidth
            />

            <button className={styles.buttonAdd} type="submit">
              Agregar Cliente
            </button>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default CreateClientModal;
