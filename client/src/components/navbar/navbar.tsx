import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./navbar.module.css";

const NavBar: React.FC = () => {
  const [selectedButton, setSelectedButton] = useState("");

  const handleButtonClick = (buttonName: string) => {
    setSelectedButton(buttonName);
  };

  return (
    <div className={styles.navBar}>
      <Link to="/admin/products">
        <button
          className={`${styles.button} ${
            selectedButton === "products" ? styles.selectedButton : ""
          }`}
          onClick={() => handleButtonClick("products")}
        >
          Productos
        </button>
      </Link>
      <Link to="/admin/clients">
        <button
          className={`${styles.button} ${
            selectedButton === "clients" ? styles.selectedButton : ""
          }`}
          onClick={() => handleButtonClick("clients")}
        >
          Clientes
        </button>
      </Link>
      <Link to="/admin/sales">
        <button
          className={`${styles.button} ${
            selectedButton === "sales" ? styles.selectedButton : ""
          }`}
          onClick={() => handleButtonClick("sales")}
        >
          Ventas
        </button>
      </Link>
    </div>
  );
};

export default NavBar;
