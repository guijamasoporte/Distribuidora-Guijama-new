import { Navigate, useLocation } from "react-router-dom";
import { DecodedToken } from "../../utils/DecodedToken";
import { GetDecodedCookie } from "../../utils/DecodedCookie";
import React, { useEffect, useRef, useState } from "react";
import InstanceOfAxios from "../../utils/intanceAxios";

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
  ];

  const rolRef = useRef<{} | null>(null);
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
              rolRef.current = data.Rol; // Declara el rol
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
        setIsLoading(false); // Finaliza la promesa y pone el loading en false
      }
    };

    fetchData();
  }, [token]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!token || !rolRef.current) {
    // Si no hay token o no se obtuvo el rol, redirige al usuario a la página de inicio o de inicio de sesión
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
