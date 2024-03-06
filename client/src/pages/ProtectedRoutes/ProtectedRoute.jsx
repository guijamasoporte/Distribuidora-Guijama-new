import {Navigate, Outlet, useLocation} from 'react-router-dom';
import {DecodedToken} from '../../utils/DecodedToken';
import {GetDecodedCookie} from '../../utils/DecodedCookie';
import {useEffect, useRef, useState} from 'react';
import InstanceOfAxios from '../../utils/intanceAxios';

export const ProtectedRoute = ({children}) => {
  const {pathname} = useLocation ();
  const UserRoutes = ['/profile'];
  const AdminRoutes = ['/admin/products', '/admin/clients', '/admin/sales'];

  const rolRef = useRef (null);
  const [isLoading, setIsLoading] = useState (true);
  const token = GetDecodedCookie ('cookieToken');

  useEffect (
    () => {
      const fetchData = async () => {
        if (token) {
          const {value} = DecodedToken (token);

          if (value) {
            try {
              const data = await InstanceOfAxios (`/admin/${value}`);
              rolRef.current = data.Rol; //Declara el rol
            } catch (error) {
              rolRef.current = null; //manejar el error
            } finally {
              setIsLoading (false); //finaliza la promesa y pone el loading en false
            }
          }
        }
      };

      fetchData ();
    },
    [token]
  );

  if (isLoading) {
    return <div>Loading...</div>;

    //aca poner un skeleton
  }

  if (!token) {
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
