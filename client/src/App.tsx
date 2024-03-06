import React from "react";
import "./App.css";
import NavBar from "./components/navbar/navbar";
import Header from "./components/Header/header";
import { Route, Routes } from "react-router-dom";
import ProductsPage from "./pages/products/products";
import ClientsPage from "./pages/clients/clients";
import SalesPage from "./pages/sales/sales";
import Home from "./pages/Home/home";
import LoginPage from "./pages/login/login";
import { ProtectedRoute } from "./pages/ProtectedRoutes/ProtectedRoute";

const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <NavBar />

      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/login" Component={LoginPage} />

        <Route
          path="/admin/products"
          element={
            <ProtectedRoute>
              <ProductsPage data={[]} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/clients"
          element={
            <ProtectedRoute>
              <ClientsPage clients={[]} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/sales"
          element={
            <ProtectedRoute>
              <SalesPage sales={[]} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
