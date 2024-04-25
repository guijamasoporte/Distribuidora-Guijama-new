import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "./modalDueEditSale.module.css";
import CloseIcon from "@mui/icons-material/Close";
import Checkbox from "@mui/material/Checkbox";
import InstanceOfAxios from "../../../../utils/intanceAxios";
import { GetDecodedCookie } from "../../../../utils/DecodedCookie";
import { Sales } from "../../../../interfaces/interfaces";
import { formatNumberWithCommas } from "../../../../utils/formatNumberwithCommas";

interface EditSaleProps {
  salesSelected: Sales;
  setSalesSelected: Dispatch<SetStateAction<Sales | null>>;
  onClose: () => void;
}

const EditDueSaleComponent: React.FC<EditSaleProps> = ({
  salesSelected,
  onClose,
  setSalesSelected,
}) => {
  const [editedDues, setEditedDues] = useState<number | null>(
    salesSelected.dues.payd.length
  );
  const [checkboxStates, setCheckboxStates] = useState<boolean[]>(
    salesSelected.dues.payd
  );
  const [pricePerDue, setPricePerDue] = useState<number>(0);

  useEffect(() => {
    if (salesSelected.priceTotal && editedDues) {
      const pricePerDue = Math.round(salesSelected.priceTotal / editedDues); // Redondea el resultado
      setPricePerDue(pricePerDue);
    }
  }, [salesSelected.priceTotal, editedDues]);

  const initializeCheckboxStates = (duesCount: number) => {
    const initialCheckboxStates = Array.from(
      { length: duesCount },
      () => false
    );
    setCheckboxStates(initialCheckboxStates);
  };

  const handleDuesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value >= 1 && value <= 12) {
      setEditedDues(value);
    } else if (event.target.value === "") {
      setEditedDues(null);
    } else {
      return;
    }

    setEditedDues(value);
    initializeCheckboxStates(value);
  };

  const handleCheckboxChange = (index: number) => {
    setCheckboxStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = !newStates[index];

      if (newStates[index]) {
        for (let i = 0; i < index; i++) {
          newStates[i] = true;
        }
      }
      return newStates;
    });
  };

  const handleSave = async () => {
    const token = GetDecodedCookie("cookieToken");
    await InstanceOfAxios(
      `/sales/${salesSelected._id}`,
      "PUT",
      { checkboxStates },
      token
    );
    onClose();
    setSalesSelected(null);
  };

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <button className={styles.modalCloseButton} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <div className={styles.modalContainerData}>
          <div className={styles.priceID}>
            <p>Total: $ {formatNumberWithCommas(salesSelected.priceTotal)}</p>
            <p>Venta N°: {salesSelected.idSale}</p>
          </div>
          <div className={styles.inputField}>
            <label>Cuotas:</label>
            <input
              type="number"
              value={editedDues !== null ? editedDues : ""}
              min="1"
              onChange={handleDuesChange}
            />
          </div>

          <div className={styles.checkboxContainer}>
            {[...Array(editedDues || 0)].map((_, index) => (
              <div key={index} className={styles.checkboxItem}>
                <Checkbox
                  defaultChecked
                  sx={{
                    color: "#0abd04",
                    "&.Mui-checked": {
                      color: "#0abd04",
                    },
                  }}
                  checked={checkboxStates[index] || false}
                  onChange={() => handleCheckboxChange(index)}
                />
                <span>
                  Cuota {index + 1} - Monto de cuota: ${formatNumberWithCommas(pricePerDue)}
                </span>
              </div>
            ))}
          </div>

          <div className={styles.buttonContainer}>
            <button className={styles.saveButton} onClick={handleSave}>
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDueSaleComponent;
