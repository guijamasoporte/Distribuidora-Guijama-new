import React from "react";
import { Modal, Button } from "@mui/material";
import { Client } from "../../../../interfaces/interfaces";
import styles from "./modalBuysClient.module.css";
import { PDFDownloadLink } from "@react-pdf/renderer";
import DescriptionIcon from "@mui/icons-material/Description";
import CloseIcon from "@mui/icons-material/Close";

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
      <div className={styles.purchaseModal}>
        <div className={styles.closeButtonModal}>
          <button className={styles.buttonClose} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <h2 className={styles.clientBuysTitle}>Compras del cliente</h2>
        <>
          <div className={styles.idNameContainer}>
            <p>
              <strong> Cliente N°:</strong> {dataSale.idClient}
            </p>
            <p>
              <strong>Nombre: </strong>
              {dataSale.name} {dataSale.lastName}
            </p>
          </div>
        </>

        <table className={styles.purchaseTable}>
          <thead>
            <tr>
              <th>ID de Venta</th>
              <th>Fecha</th>
              <th>Importe</th>
              <th>Invoice</th>
            </tr>
          </thead>
          <tbody>
            {dataSale &&
              dataSale.buys.map((purchase: any, purchaseIndex: number) => (
                <tr key={purchaseIndex}>
                  <td>{purchase.dataSale.idSale}</td>
                  <td>
                    {purchase.dataSale.date
                      ? new Date(purchase.dataSale.date)
                          .toISOString()
                          .split("T")[0]
                      : ""}
                  </td>

                  <td>${purchase.dataSale.priceTotal}</td>
                  <td>
                    <button className={styles.iconPDF}>
                      <DescriptionIcon />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
};

export default PurchaseModal;
