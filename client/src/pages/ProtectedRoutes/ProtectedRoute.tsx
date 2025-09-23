import { Navigate, useLocation } from "react-router-dom";
import { DecodedToken } from "../../utils/DecodedToken";
import { GetDecodedCookie } from "../../utils/DecodedCookie";
import React, { useEffect, useRef, useState } from "react";
import InstanceOfAxios from "../../utils/intanceAxios";
import styles from "./ProtectedRoutes.module.css";
import FadeLoader from "react-spinners/FadeLoader";

interface Props {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { pathname } = useLocation();
  const UserRoutes = ["/profile"];
  const AdminRoutes = [
    "/admin",
    "/admin/products",
    "/admin/clients",
    "/admin/sales",
    "/admin/supplier",
  ];

  const rolRef = useRef<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const token = GetDecodedCookie("cookieToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {
          const { success, id, error } = DecodedToken(token);
          if (success && id) {
            const data: any = await InstanceOfAxios(`/admin/${id}`, "GET");
            if (data && data.Rol) {
              rolRef.current = data.Rol;
            } else {
              console.error("Error: Data or data.Rol is undefined");
            }
          } else {
            console.error("Error decoding token:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (isLoading) {
    return (
      <div className={styles.loaderContainer}>
        <FadeLoader
          color="#603e20"
          height={23}
          width={5}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

  if (!token || !rolRef.current) {
    return <Navigate to={"/login"} />;
  }

  if (rolRef.current === "ROL_User" && !UserRoutes.includes(pathname)) {
    return <Navigate to={"/login"} />;
  }

  if (rolRef.current === "ROL_Admin" && !AdminRoutes.includes(pathname)) {
    return <Navigate to={"/login"} />;
  }

  return <>{children}</>;
};
