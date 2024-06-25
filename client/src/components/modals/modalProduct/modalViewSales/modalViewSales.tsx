import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { Product } from "../../../../interfaces/interfaces"; // Importa la interfaz Product
import styles from "./modalViewSales.module.css";

interface SalesData {
  month: string;
  amount: number;
}

interface ModalViewSalesProps {
  open: boolean;
  handleClose: () => void;
  product: Product & { sales: SalesData[] }; // Añade sales a Product
}

const ModalViewSales: React.FC<ModalViewSalesProps> = ({
  open,
  handleClose,
  product,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const handleMonthChange = (event: SelectChangeEvent<string>) => {
    setSelectedMonth(event.target.value as string);
  };

  const salesForSelectedMonth = product.sales.find(
    (sale) => sale.month === selectedMonth
  );

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className={styles.modalBox}>
        <Typography variant="h6" component="h2">
          {product.title} - Ventas
        </Typography>
        <Select value={selectedMonth} onChange={handleMonthChange} displayEmpty>
          <MenuItem value="" disabled>
            Seleccionar Mes
          </MenuItem>
          {product.sales.map((sale, index) => (
            <MenuItem key={index} value={sale.month}>
              {sale.month}
            </MenuItem>
          ))}
        </Select>
        {selectedMonth && (
          <Typography variant="body1" component="p">
            Ventas en {selectedMonth}:{" "}
            {salesForSelectedMonth
              ? salesForSelectedMonth.amount
              : "No hay datos"}
          </Typography>
        )}
      </Box>
    </Modal>
  );
};

export default ModalViewSales;
