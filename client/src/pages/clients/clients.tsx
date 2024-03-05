import React, { useState } from "react";
import styles from "./clients.module.css";
import { Select, MenuItem, SelectChangeEvent } from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import fakeClients from "./fakeClientes";
import SearchBar from "../../components/searchBar/searchBar";

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

const ClientsPage: React.FC<ClientsProps> = ({ clients }) => {
  const initialFilters = {
    id: "",
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    direccion: "",
    compras: "",
  };

  const [filters, setFilters] = useState<{ [key: string]: string }>(
    initialFilters
  );

  const [searchTerm, setSearchTerm] = useState("");

  const handleSelectChange = (
    event: SelectChangeEvent<string>,
    field: keyof Client
  ) => {
    setFilters({
      ...filters,
      [field]: event.target.value,
    });
  };

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
    setSearchTerm("");
  };

  const filteredClients = fakeClients.filter((client) => {
    return (
      Object.keys(filters).every((key) =>
        filters[key as keyof Client]
          ? String(client[key as keyof Client])
              .toLowerCase()
              .includes(filters[key as keyof Client].toLowerCase())
          : true
      ) &&
      (searchTerm === "" ||
        Object.values(client).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        ))
    );
  });

  return (
    <div className={styles.tableContainer}>
      <h1 className={styles.title}>Listado de clientes</h1>
      <div className={styles.filters}>
        <button className={styles.clearButton} onClick={handleClearFilters}>
          Limpiar filtros
        </button>
        <Select
          displayEmpty
          value={filters.id}
          onChange={(e) => handleSelectChange(e, "id")}
          input={<OutlinedInput />}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return <em>Id</em>;
            }
            return selected;
          }}
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem value="">Todos</MenuItem>
          {Array.from(new Set(fakeClients.map((sale) => sale.id))).map((id) => (
            <MenuItem key={id} value={String(id)}>
              {id}
            </MenuItem>
          ))}
        </Select>
        <Select
          displayEmpty
          value={filters.nombre}
          onChange={(e) => handleSelectChange(e, "nombre")}
          input={<OutlinedInput />}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return <em>Nombre</em>;
            }
            return selected;
          }}
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem value="">Todos</MenuItem>
          {Array.from(new Set(fakeClients.map((nombre) => nombre.nombre))).map(
            (nombre) => (
              <MenuItem key={nombre} value={String(nombre)}>
                {nombre}
              </MenuItem>
            )
          )}
        </Select>
        <Select
          displayEmpty
          value={filters.apellido}
          onChange={(e) => handleSelectChange(e, "apellido")}
          input={<OutlinedInput />}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return <em>Apellido</em>;
            }
            return selected;
          }}
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem value="">Todos</MenuItem>
          {Array.from(
            new Set(fakeClients.map((apellido) => apellido.apellido))
          ).map((apellido) => (
            <MenuItem key={apellido} value={String(apellido)}>
              {apellido}
            </MenuItem>
          ))}
        </Select>
        <SearchBar onSearch={handleSearch} />
      </div>
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
          {filteredClients.map((client, index) => (
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
};

export default ClientsPage;
