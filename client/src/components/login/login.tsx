import React, { FormEvent, useState } from "react";
import InstanceOfAxios from "../../utils/intanceAxios";
import style from "./login.module.css";
import Cookies from "js-cookie";
import axios from "axios";

interface DataLogin {
  email: string;
  password: string;
}

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
    Cookies.remove("cookieToken");

    await InstanceOfAxios("/login", "POST", dataLogin).then((data: any) => {
      console.log(data);

      document.cookie =
        encodeURIComponent("cookieToken") +
        "=" +
        encodeURIComponent(data.token);
      window.location.href = "/admin/products";
    });
  };


  return (
    <div className={style.containForms}>
      <div className={style.login}>
        <h4>Inicio de Sesion</h4>
        <form onSubmit={handleSubmitLogin}>
          <input
            type="email"
            placeholder="Email"
            value={dataLogin.email}
            onChange={handleChangeLogin}
            name="email"
          />
          <input
            type="password"
            placeholder="contraseña"
            name="password"
            onChange={handleChangeLogin}
          />
          <button className="button-login" type="submit">
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
