import React from "react";
import Login from "../../components/login/login";
import styles from "./login.module.css"

const LoginPage: React.FC = () => {
  return (
    <div className={styles.login}>
      <div className={styles.loginForm}>
      <Login />
      </div>
    </div>
  );
};

export default LoginPage;
