import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Select,
  MenuItem,
  IconButton,
  SelectChangeEvent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Product } from "../../../../interfaces/interfaces"; // Importa la interfaz Product
import styles from "./modalViewSales.module.css";

interface SalesData {
  month: string;
  year: number;
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
  const [selectedYear, setSelectedYear] = useState<number | "">("");

  const handleMonthChange = (event: SelectChangeEvent<string>) => {
    setSelectedMonth(event.target.value as string);
  };

  const handleYearChange = (event: SelectChangeEvent<number>) => {
    setSelectedYear(event.target.value as number);
  };

  const salesForSelectedMonthYear = product.sales.find(
    (sale) => sale.month === selectedMonth && sale.year === selectedYear
  );

  const uniqueYears = Array.from(
    new Set(product.sales.map((sale) => sale.year))
  );

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className={styles.modalBox}>
        <IconButton className={styles.closeButton} onClick={handleClose}>
          <CloseIcon />
        </IconButton>
        <Typography
          variant="h6"
          component="h2"
          className={styles.titleProductModal}
        >
          {product.title}
        </Typography>
        {product.sales.length > 0 ? (
          <div className={styles.selectContainer}>
            <Select
              value={selectedMonth}
              onChange={handleMonthChange}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Seleccionar Mes
              </MenuItem>
              {product.sales.map((sale, index) => (
                <MenuItem key={index} value={sale.month}>
                  {sale.month}
                </MenuItem>
              ))}
            </Select>
            <Select
              value={selectedYear}
              onChange={handleYearChange}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Seleccionar Año
              </MenuItem>
              {uniqueYears.map((year, index) => (
                <MenuItem key={index} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </div>
        ) : (
          <Typography
            variant="body1"
            component="p"
            className={styles.textModalEmpty}
          >
            Aún no hay ventas del producto seleccionado
          </Typography>
        )}
        {selectedMonth && selectedYear && salesForSelectedMonthYear && (
          <Typography
            variant="body1"
            component="p"
            className={styles.textSalesModal}
          >
            Vendidos en {selectedMonth} {selectedYear}:{" "}
            {salesForSelectedMonthYear.amount}
          </Typography>
        )}
      </Box>
    </Modal>
  );
};

export default ModalViewSales;
