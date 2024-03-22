import React from "react";
import Login from "../../components/login/login";
import styles from "./login.module.css"
import { GetDecodedCookie } from "../../utils/DecodedCookie";

const LoginPage: React.FC = () => {
  const token = GetDecodedCookie("cookieToken");
  if(token){
    window.location.href=("/")
  }
  return (
    <div className={styles.login}>
      <div className={styles.loginForm}>
      <Login />
      </div>
    </div>
  );
};

export default LoginPage;
