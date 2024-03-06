import React, { useEffect, useState } from "react";
import styles from "./header.module.css";
import Logo from "../../assets/guijama.svg";
import { GetDecodedCookie } from "../../utils/DecodedCookie";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

export default function Header() {
  const [login, setLogin] = useState(false);

  useEffect(() => {
    const token = GetDecodedCookie("cookieToken");
    if (token) {
      setLogin(true);
    } else {
      setLogin(false);
    }
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "¿Confirmar cierre de sesión?",
      text: "¡Tu sesión actual se cerrará!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        Cookies.remove("cookieToken");
        window.location.href = "/login";
      }
    });
  };

  return (
    <header className={styles.navbar}>
      <img src={Logo} alt="Logo" className={styles.logo} />
      {login ? (
        <button className={styles["logout-btn"]} onClick={handleLogout}>
          Cerrar sesión
        </button>
      ) : (
        <button className={styles["logout-btn"]} onClick={handleLogout}>
          Iniciar sesion
        </button>
      )}
    </header>
  );
}
