import React from "react";
import { Button } from "@mui/material";
import styles from "./pagination.module.css";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  paginate: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  paginate,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className={styles.pagination}>
      <Button
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
        className={styles.iconButton}
        sx={{ fontSize: 30 }}
      >
        <KeyboardArrowLeftIcon />
      </Button>
      <span className={styles.pageNumber}>{currentPage}</span>
      <Button
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={styles.iconButton}
        sx={{ fontSize: 60 }}
      >
        <KeyboardArrowRightIcon />
      </Button>
    </div>
  );
};

export default Pagination;
