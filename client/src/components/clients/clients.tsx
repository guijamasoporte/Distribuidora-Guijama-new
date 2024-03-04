// ClientsPage.tsx

import React from 'react';
import styles from './clients.module.css';
import fakeClients from './fakeClientes'; 


interface Client {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  direccion: string;
  compras: number;
}

interface ClientsProps {
  clients: Client[];
}

const ClientsPage: React.FC<ClientsProps> = () => {
  return (
    <div className={styles.tableContainer}>
      <h1>Clientes</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Teléfono</th>
            <th>E-mail</th>
            <th>Dirección</th>
            <th>Compras</th>
            <th>Editar</th>
            <th>Borrar</th>
          </tr>
        </thead>
        <tbody>
          {fakeClients.map((client, index) => (
            <tr key={index}>
              <td>{client.id}</td>
              <td>{client.nombre}</td>
              <td>{client.apellido}</td>
              <td>{client.telefono}</td>
              <td>{client.email}</td>
              <td>{client.direccion}</td>
              <td>{client.compras}</td>
              <td>
                <button className={styles.button}>Editar</button>
              </td>
              <td>
                <button className={styles.button}>Borrar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClientsPage;
