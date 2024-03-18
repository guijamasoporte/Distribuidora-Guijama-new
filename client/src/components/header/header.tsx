import React, { useEffect, useState } from "react";
import styles from "./header.module.css";
import Logo from "../../assets/guijama.svg";
import { GetDecodedCookie } from "../../utils/DecodedCookie";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { NavLink } from "react-router-dom";
import { DecodedToken } from "../../utils/DecodedToken";
import InstanceOfAxios from "../../utils/intanceAxios";
import CloseIcon from "@mui/icons-material/Close";

export default function Header() {
  const [login, setLogin] = useState(false);
  const [rol, setRol] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const fetchAdmin = async (token: string) => {
      const { id } = DecodedToken(token);
      const data: any = await InstanceOfAxios(`/admin/${id}`, "GET");
      if (data && data.Rol) {
        setRol(data.Rol);
      } else {
        console.error("Error: Data or data.Rol is undefined");
      }
    };

    const token = GetDecodedCookie("cookieToken");
    if (token) {
      fetchAdmin(token);
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
        window.location.href = "/";
      }
    });
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <header className={styles.navbar}>
      <img src={Logo} alt="Logo" className={styles.logo} />
      <div className={styles.menuWrapper}>
        <div
          className={`${styles["nav-links"]} ${showMenu ? styles.active : ""}`}
        >
          <NavLink to="/">
            <button className={styles["logout-btn"]}>Catálogo</button>
          </NavLink>

          {login && rol === "ROL_Admin" && (
            <NavLink to="/admin/products">
              <button className={styles["logout-btn"]}>Admin</button>
            </NavLink>
          )}

          {login ? (
            <button className={styles["logout-btn"]} onClick={handleLogout}>
              Cerrar sesión
            </button>
          ) : (
            <NavLink to="/login">
              <button className={styles["logout-btn"]}>Iniciar sesion</button>
            </NavLink>
          )}
          <button className={styles.closeButton} onClick={toggleMenu}>
            <CloseIcon />
          </button>
        </div>
        <div className={styles.menuIcon} onClick={toggleMenu}>
          <div className={styles.menuLine}></div>
          <div className={styles.menuLine}></div>
          <div className={styles.menuLine}></div>
        </div>
      </div>
    </header>
  );
}
