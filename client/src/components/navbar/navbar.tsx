import React, { useEffect, useState } from "react";
import ProductsPage from "../../pages/products/products";
import ClientsPage from "../../pages/clients/clients";
import SalesPage from "../../pages/sales/sales";

interface GuijamaPageProps {}

const NavBar: React.FC<GuijamaPageProps> = () => {
  const [contador, setcontador] = useState(0);
  const [currentPage, setCurrentPage] = useState<
    "products" | "clients" | "sales"
  >("products");

  useEffect(() => {
    setcontador(contador + 1);
  }, [currentPage]);

  const handleButtonClick = (page: "products" | "clients" | "sales") => {
    setCurrentPage(page);
  };
  return (
    <div>
      <h1>Guijama</h1>
      <p>Hola {contador}</p>
      <button onClick={() => handleButtonClick("products")}>Productos</button>
      <button onClick={() => handleButtonClick("clients")}>Clientes</button>
      <button onClick={() => handleButtonClick("sales")}>Ventas</button>
      {currentPage === "products" && <ProductsPage products={[]} />}
      {currentPage === "clients" && <ClientsPage clients={[]} />}
      {currentPage === "sales" && <SalesPage sales={[]} />}
    </div>
  );
};

export default NavBar;
