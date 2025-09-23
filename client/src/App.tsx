import React from "react";
import "./App.css";
import NavBar from "./components/navbar/navbar";

import { Route, Routes } from "react-router-dom";
import ProductsPage from "./pages/products/products";
import ClientsPage from "./pages/clients/clients";
import SalesPage from "./pages/sales/sales";
import Home from "./pages/Home/home";
import LoginPage from "./pages/login/login";
import { ProtectedRoute } from "./pages/ProtectedRoutes/ProtectedRoute";
import Header from "./components/header/header";
import SupplierPage from "./pages/supplier/supplier";

const App: React.FC = () => {
  return (
    <div className="App">
      <Header />

      <Routes>
        {/* Rutas sin NavBar */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
     

        {/* Rutas con NavBar */}
        <Route
          path="/admin/*"
          element={
            <>
              {" "}
              <ProtectedRoute>
                <NavBar />
                <Routes>
                  <Route
                    path="products"
                    element={
                      <ProtectedRoute>
                        <ProductsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="clients"
                    element={
                      <ProtectedRoute>
                        <ClientsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="sales"
                    element={
                      <ProtectedRoute>
                        <SalesPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="supplier"
                    element={
                      <ProtectedRoute>
                        <SupplierPage />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
                  
              </ProtectedRoute>
            </>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
