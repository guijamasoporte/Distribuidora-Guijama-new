import React, { useState } from "react";
import { Select, MenuItem, SelectChangeEvent } from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import styles from "./sales.module.css";
import fakeSales from "./fakeSales";

interface Sale {
  id: number;
  nombre: string;
  apellido: string;
  fecha: string;
  total: number;
  cuotas: number;
  remito: string;
}

interface SalesProps {
  sales: Sale[];
}

const SalesPage: React.FC<SalesProps> = ({ sales }) => {
  const [filters, setFilters] = useState<{ [key: string]: string }>({
    id: "",
    nombre: "",
    apellido: "",
    fecha: "",
    total: "",
  });

  const handleChange = (
    event: SelectChangeEvent<string>,
    field: keyof Sale
  ) => {
    setFilters({
      ...filters,
      [field]: event.target.value,
    });
  };

  const filteredSales = fakeSales.filter((sale) => {
    return Object.keys(filters).every((key) =>
      filters[key as keyof Sale]
        ? String(sale[key as keyof Sale])
            .toLowerCase()
            .includes(filters[key as keyof Sale].toLowerCase())
        : true
    );
  });

  return (
    <div className={styles.tableContainer}>
      <h1>Ventas</h1>
      <div className={styles.filters}>
        <Select
          displayEmpty
          value={filters.id}
          onChange={(e) => handleChange(e, "id")}
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
          {Array.from(new Set(fakeSales.map((sale) => sale.id))).map((id) => (
            <MenuItem key={id} value={String(id)}>
              {id}
            </MenuItem>
          ))}
        </Select>
        <Select
          displayEmpty
          value={filters.nombre}
          onChange={(e) => handleChange(e, "nombre")}
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
          {Array.from(new Set(fakeSales.map((sale) => sale.nombre))).map(
            (nombre) => (
              <MenuItem key={nombre} value={nombre}>
                {nombre}
              </MenuItem>
            )
          )}
        </Select>
        <Select
          displayEmpty
          value={filters.apellido}
          onChange={(e) => handleChange(e, "apellido")}
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
          {Array.from(new Set(fakeSales.map((sale) => sale.apellido))).map(
            (apellido) => (
              <MenuItem key={apellido} value={apellido}>
                {apellido}
              </MenuItem>
            )
          )}
        </Select>
        <Select
          displayEmpty
          value={filters.fecha}
          onChange={(e) => handleChange(e, "fecha")}
          input={<OutlinedInput />}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return <em>Fecha</em>;
            }

            return selected;
          }}
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem value="">Todos</MenuItem>
          {Array.from(new Set(fakeSales.map((sale) => sale.fecha))).map(
            (fecha) => (
              <MenuItem key={fecha} value={fecha}>
                {fecha}
              </MenuItem>
            )
          )}
        </Select>
        <Select
          displayEmpty
          value={filters.total}
          onChange={(e) => handleChange(e, "total")}
          input={<OutlinedInput />}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return <em>Total</em>;
            }

            return selected;
          }}
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem value="">Todos</MenuItem>
          {Array.from(new Set(fakeSales.map((sale) => sale.total))).map(
            (total) => (
              <MenuItem key={total} value={String(total)}>
                {total}
              </MenuItem>
            )
          )}
        </Select>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Cuotas</th>
            <th>Remito</th>
            <th>Editar</th>
            <th>Borrar</th>
          </tr>
        </thead>
        <tbody>
          {filteredSales.map((sale, index) => (
            <tr key={index}>
              <td>{sale.id}</td>
              <td>{sale.nombre}</td>
              <td>{sale.apellido}</td>
              <td>{sale.fecha}</td>
              <td>{sale.total}</td>
              <td>{sale.cuotas}</td>
              <td>{sale.remito}</td>
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

export default SalesPage;
