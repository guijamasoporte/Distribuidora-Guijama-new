import React from "react";
import { Modal } from "@mui/material";
import { Supplier } from "../../../../interfaces/interfaces";
import styles from "./modalbuysSupplier.module.css";
import { PDFDownloadLink } from "@react-pdf/renderer";
import CloseIcon from "@mui/icons-material/Close";
import Pdfinvoice from "../../../pdfComponents/pdfInvoice";
import { formatNumberWithCommas } from "../../../../utils/formatNumberwithCommas";

interface PurchaseModalProps {
  open: boolean;
  onClose: () => void;
  dataBuy: Supplier;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({
  open,
  onClose,
  dataBuy: dataSale,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className={styles.purchaseModal}>
        <div className={styles.closeButtonModal}>
          <button className={styles.buttonClose} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <h2 className={styles.clientBuysTitle}>Compras del Proveedor</h2>
        <>
          <div className={styles.idNameContainer}>
            <p>
              <strong> Proveedor N°:</strong> {dataSale.idSupplier}
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
              <th>Remito</th>
            </tr>
          </thead>
          <tbody>
            {dataSale &&
              dataSale.buys.map((purchase: any, purchaseIndex: number) => (
                <tr key={purchaseIndex}>
                  <td>{purchase.idSale}</td>
                  <td>
                    {purchase.date
                      ? new Date(purchase.date).toISOString().split("T")[0]
                      : ""}
                  </td>

                  <td>${formatNumberWithCommas(purchase.priceTotal)}</td>
                  <td>
                    <PDFDownloadLink
                      document={
                        <Pdfinvoice
                          sales={""}
                          id={purchaseIndex}
                          saleClient={dataSale}
                        />
                      }
                      fileName="invoice.pdf"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={styles.iconPDF}
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                        <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                        <path d="M9 9l1 0" />
                        <path d="M9 13l6 0" />
                        <path d="M9 17l6 0" />
                      </svg>
                    </PDFDownloadLink>
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
