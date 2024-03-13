import React, { useEffect, useState } from "react";
import styles from "./modalEditSale.module.css";
import CloseIcon from "@mui/icons-material/Close";
import Checkbox from "@mui/material/Checkbox";

interface EditSaleProps {
  saleId: number;
  priceTotal: number;
  onClose: () => void;
}

const EditSaleComponent: React.FC<EditSaleProps> = ({
  saleId,
  onClose,
  priceTotal,
}) => {
  const [saleData, setSaleData] = useState<any>(null);
  const [editedDues, setEditedDues] = useState<number | null>(null);
  const [dueValues, setDueValues] = useState<number[]>(Array.from({ length: 6 }, () => 0));

  const [checkboxStates, setCheckboxStates] = useState<boolean[]>([]);

  const fetchSaleData = async () => {
    try {
      const response = await fetch(`/sales/${saleId}`);
      //acá llamar saleprice
      const data = await response.json();
      setSaleData(data);
      const duesCount = Math.min(data?.dues?.cant || 1, 6);
      setEditedDues(duesCount);
      initializeCheckboxStates(duesCount);
    } catch (error) {
      console.error("Error fetching sale data:", error);
    }
  };

  useEffect(() => {
    fetchSaleData();
  }, []);

  const initializeCheckboxStates = (duesCount: number) => {
    const initialCheckboxStates = Array.from(
      { length: duesCount },
      () => false
    );
    setCheckboxStates(initialCheckboxStates);
  };

  const calculateDueValues = (totalPrice: number, duesCount: number) => {
    const pricePerDue = totalPrice / duesCount;
    const values = Array.from({ length: duesCount }, (_, index) => {
      return pricePerDue * (index + 1);
    });
    setDueValues(values);
  };

  const handleDuesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value >= 1 && value <= 6) {
      setEditedDues(value);
    } else if (event.target.value === "") {
      setEditedDues(null);
    } else {
      return;
    }

    setEditedDues(value);
    initializeCheckboxStates(value);

    if (saleData && saleData.price) {
        const totalPrice = saleData.price || 0;
        calculateDueValues(totalPrice, value);
        console.log("Total Price:", totalPrice);
      }
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

  const handleSave = () => {
    if (!saleData) {
      console.error("Error: No sale data available");
      return;
    }

    const totalPrice = saleData.price || 0;
    const pricePerDue = totalPrice / (editedDues || 1);
    console.log("Total Price:", totalPrice);
    console.log("Price Per Due:", pricePerDue);

    onClose();
  };

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Editar Venta</h2>
          <button className={styles.modalcloseButton} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <p>Total: $ {priceTotal}</p>
        <p>ID de Venta: {saleId}</p>

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
                checked={checkboxStates[index] || false}
                onChange={() => handleCheckboxChange(index)}
              />
              <span>
                Cuota {index + 1} - Monto de cuota: ${dueValues[index]}
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
  );
};

export default EditSaleComponent;
