import React from "react";
import styles from "./header.module.css";
import Logo from "../../assets/guijama.svg";

export default function Header() {
  return (
    <header className={styles.navbar}>
      <img src={Logo} alt="Logo" className={styles.logo} />
      <button className={styles["logout-btn"]}>Cerrar sesión</button>
    </header>
  );
}
