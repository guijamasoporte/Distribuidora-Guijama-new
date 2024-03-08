import {Navigate, Outlet, useLocation} from 'react-router-dom';
import {DecodedToken} from '../../utils/DecodedToken';
import {GetDecodedCookie} from '../../utils/DecodedCookie';
import {useEffect, useRef, useState} from 'react';
import InstanceOfAxios from '../../utils/intanceAxios';

export const ProtectedRoute = ({children}) => {
  const {pathname} = useLocation ();
  const UserRoutes = ['/profile'];
  const AdminRoutes = [
    '/admin',
    '/admin/products',
    '/admin/clients',
    '/admin/sales',
  ];

  const rolRef = useRef (null);
  const [isLoading, setIsLoading] = useState (true);
  const token = GetDecodedCookie ('cookieToken');
  
  useEffect (
    () => {
      const fetchData = async () => {
        try {
          if (token) {
            const {success, id, error} = DecodedToken (token);
            if (success && id) {
              const data = await InstanceOfAxios (`/admin/${id}`);
              if (data && data.Rol) {
                rolRef.current = data.Rol; // Declara el rol
              } else {
                console.error ('Error: Data or data.Rol is undefined');
              }
            } else {
              console.error ('Error decoding token:', error);
            }
          }
        } catch (error) {
          console.error ('Error fetching data:', error);
        } finally {
          setIsLoading (false); // Finaliza la promesa y pone el loading en false
        }
      };

      fetchData ();
    },
    [token]
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!token || !rolRef.current) {
    // Si no hay token o no se obtuvo el rol, redirige al usuario a la página de inicio o de inicio de sesión
    return <Navigate to={'/login'} />;
  }

  if (rolRef.current === 'ROL_User' && !UserRoutes.includes (pathname)) {
    return <Navigate to={'/login'} />;
  }

  if (rolRef.current === 'ROL_Admin' && !AdminRoutes.includes (pathname)) {
    return <Navigate to={'/login'} />;
  }

  return children;
};
