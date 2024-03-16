import React, { FormEvent, useState } from "react";
import InstanceOfAxios from "../../utils/intanceAxios";
import styles from "./login.module.css";
import Cookies from "js-cookie";
import { DataLogin } from "../../interfaces/interfaces";


const Login: React.FC = () => {
  const [dataLogin, setDataLogin] = useState<DataLogin>({
    email: "",
    password: "",
  });

  const handleChangeLogin = (event: React.ChangeEvent<HTMLInputElement>) => {
    const property = event.target.name;
    const value = event.target.value;
    setDataLogin({ ...dataLogin, [property]: value });
  };

  const handleSubmitLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await InstanceOfAxios("/login", "POST", dataLogin).then((data: any) => {
      Cookies.remove("cookieToken");
      document.cookie =
        encodeURIComponent("cookieToken") +
        "=" +
        encodeURIComponent(data.token);
      window.location.href = "/admin/products";
    });
  };

  return (
    <div className={styles.containForms}>
      <div className={styles.login}>
        <p>Inicio de Sesión</p>
        <form onSubmit={handleSubmitLogin}>
          <input
            type="email"
            placeholder="Email"
            value={dataLogin.email}
            onChange={handleChangeLogin}
            name="email"
            className={styles.input} 
          />
          <input
            type="password"
            placeholder="Contraseña"
            name="password"
            onChange={handleChangeLogin}
            className={styles.input} 
          />
          <button className={styles.buttonLogin} type="submit">
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;