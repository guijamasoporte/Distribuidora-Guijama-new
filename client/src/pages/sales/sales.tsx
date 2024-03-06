import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import styles from "./sales.module.css";
import fakeSales from "./fakeSales";
import SearchBar from "../../components/searchBar/searchBar";
import InstanceOfAxios from "../../utils/intanceAxios";

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

const SalesPage: React.FC<SalesProps> = () => {
  const [filters, setFilters] = useState<Partial<Sale>>({});

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    InstanceOfAxios("/clients", "GET").then((data) => {
      console.log(data);
    });
  }, []);

  const handleChange = (value: string | null, field: keyof Sale) => {
    setFilters({
      ...filters,
      [field]: value !== null ? String(value) : "", // Convertir a string
    });
  };

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  const filteredSales = fakeSales.filter((sale) => {
    return (
      Object.keys(filters).every((key) =>
        filters[key as keyof Sale]
          ? String(sale[key as keyof Sale])
              .toLowerCase()
              .includes(
                (filters[key as keyof Sale] || "").toString().toLowerCase()
              )
          : true
      ) &&
      (searchTerm === "" ||
        Object.values(sale).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        ))
    );
  });

  return (
    <div className={styles.tableContainer}>
      <h1 className={styles.title}>Listado de ventas</h1>
      <div className={styles.filters}>
        <Autocomplete
          disablePortal
          id="combo-box-id"
          options={Array.from(
            new Set(fakeSales.map((sale) => sale.id.toString()))
          )}
          sx={{ width: 200 }}
          renderInput={(params) => <TextField {...params} label="ID" />}
          onChange={(event, value) => handleChange(value, "id")}
        />
        <Autocomplete
          disablePortal
          id="combo-box-nombre"
          options={Array.from(new Set(fakeSales.map((sale) => sale.nombre)))}
          sx={{ width: 200 }}
          renderInput={(params) => <TextField {...params} label="Nombre" />}
          onChange={(event, value) => handleChange(value, "nombre")}
        />
        <Autocomplete
          disablePortal
          id="combo-box-apellido"
          options={Array.from(new Set(fakeSales.map((sale) => sale.apellido)))}
          sx={{ width: 200 }}
          renderInput={(params) => <TextField {...params} label="Apellido" />}
          onChange={(event, value) => handleChange(value, "apellido")}
        />
        <Autocomplete
          disablePortal
          id="combo-box-fecha"
          options={Array.from(new Set(fakeSales.map((sale) => sale.fecha)))}
          sx={{ width: 200 }}
          renderInput={(params) => <TextField {...params} label="Fecha" />}
          onChange={(event, value) => handleChange(value, "fecha")}
        />
        <Autocomplete
          disablePortal
          id="combo-box-total"
          options={Array.from(
            new Set(fakeSales.map((sale) => sale.total.toString()))
          )} 
          sx={{ width: 200 }}
          renderInput={(params) => <TextField {...params} label="Total" />}
          onChange={(event, value) => handleChange(value, "total")}
        />
        <SearchBar onSearch={handleSearch} />
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
