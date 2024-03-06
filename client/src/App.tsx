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
          element={<ProductsPage data={[]} />}
        />
        <Route path="/admin/clients" element={<ClientsPage clients={[]} />} />
        <Route path="/admin/sales" element={<SalesPage sales={[]} />} />
      </Routes>
    </div>
  );
};

export default App;
