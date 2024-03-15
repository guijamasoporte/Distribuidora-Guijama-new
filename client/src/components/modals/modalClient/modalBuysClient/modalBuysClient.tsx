import React from "react";
import { Modal, Button } from "@mui/material";
import { Client } from "../../../../interfaces/interfaces";

interface PurchaseModalProps {
  open: boolean;
  onClose: () => void;
  dataSale: Client;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({
  open,
  onClose,
  dataSale,
}) => {

  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ backgroundColor: "white", padding: 20 }}>
        <h2>Compras del cliente</h2>

        <>
          <p>ID: {dataSale.idClient}</p>
          <p>Nombre: {dataSale.name}</p>
          <p>Apellido: {dataSale.lastName}</p>
        </>

        <ul>
          {dataSale &&
            dataSale.buys.map(
              (purchase: any) =>
                purchase.products &&
                purchase.products.map((product: any, productIndex: number) => (
                  <li key={productIndex}>{product.title}</li>
                ))
            )}
        </ul>
        <Button onClick={onClose} variant="contained">
          Cerrar
        </Button>
      </div>
    </Modal>
  );
};

export default PurchaseModal;
