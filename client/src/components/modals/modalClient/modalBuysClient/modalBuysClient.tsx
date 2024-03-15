import React from "react";
import { Modal, Button } from "@mui/material";
import { Client } from "../../../../interfaces/interfaces";

interface PurchaseModalProps {
  open: boolean;
  onClose: () => void;
  client: Client | null;
  buys: string[] | undefined;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({
  open,
  onClose,
  client,
  buys,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ backgroundColor: "white", padding: 20 }}>
        <h2>Compras del cliente</h2>
        {client && (
          <>
            <p>ID: {client.idClient}</p>
            <p>Nombre: {client.name}</p>
            <p>Apellido: {client.lastName}</p>
          </>
        )}
        <ul>
          {buys &&
            buys.map((purchase, index) => <li key={index}>{purchase}</li>)}
        </ul>
        <Button onClick={onClose} variant="contained">
          Cerrar
        </Button>
      </div>
    </Modal>
  );
};

export default PurchaseModal;
