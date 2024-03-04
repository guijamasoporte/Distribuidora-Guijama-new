import React, { useState } from 'react';
import ProductsPage from '../../components/products/products'; 
import ClientsPage from '../../components/clients/clients'; 
import SalesPage from '../../components/sales/sales'; 

interface GuijamaPageProps {}

const GuijamaHome: React.FC<GuijamaPageProps> = () => {
  const [currentPage, setCurrentPage] = useState<'products' | 'clients' | 'sales'>('products');

  const handleButtonClick = (page: 'products' | 'clients' | 'sales') => {
    setCurrentPage(page);
  }

  return (
    <div>
      <h1>Guijama</h1>
      <button onClick={() => handleButtonClick('products')}>Productos</button>
      <button onClick={() => handleButtonClick('clients')}>Clientes</button>
      <button onClick={() => handleButtonClick('sales')}>Ventas</button>
      {currentPage === 'products' && <ProductsPage products={[]} />} 
      {currentPage === 'clients' && <ClientsPage clients={[]} />}
      {currentPage === 'sales' && <SalesPage sales={[]} />}
    </div>
  );
}

export default GuijamaHome;
