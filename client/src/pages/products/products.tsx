import React, { useState } from "react";
import {
  Autocomplete,
  TextField,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import styles from "./products.module.css";
import fakeProducts from "./fakeStock";
import SearchBar from "../../components/searchBar/searchBar";

interface Product {
  codigo: string;
  titulo: string;
  rubro: string;
  marca: string;
  stock: number;
  precioCosto: number;
  precioVenta: number;
}

interface ProductsProps {
  products: Product[];
}

const ProductsPage: React.FC<ProductsProps> = () => {
  const initialFilters = {
    codigo: "",
    titulo: "",
    rubro: "",
    marca: "",
    stock: "",
    precioCosto: "",
    precioVenta: "",
  };

  const [filters, setFilters] = useState(initialFilters);
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: string | null,
    field: keyof Product
  ) => {
    setFilters({
      ...filters,
      [field]: value || "",
    });
  };

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  const handleClearFilters = () => {
    setFilters({
      ...initialFilters,
      codigo: "",
    });
    setSearchTerm("");
    
  };

  const filteredProducts = fakeProducts.filter((product) => {
    return (
      Object.keys(filters).every((key) => {
        const filterValue = filters[key as keyof Product];
        if (typeof filterValue === "string") {
          return (
            filterValue.toLowerCase() === "" ||
            String(product[key as keyof Product])
              .toLowerCase()
              .includes(filterValue.toLowerCase())
          );
        } else {
          return true;
        }
      }) &&
      (searchTerm === "" ||
        Object.values(product).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        ))
    );
  });

  return (
    <div className={styles.tableContainer}>
      <h1>Productos</h1>
      <div className={styles.filters}>
        <Autocomplete
          disablePortal
          id="combo-box-codigo"
          options={Array.from(
            new Set(fakeProducts.map((product) => product.codigo))
          )}
          sx={{ width: 200 }}
          renderInput={(params) => <TextField {...params} label="Código" />}
          onChange={(event, value) => handleChange(event, value, "codigo")}
        />
        <Autocomplete
          disablePortal
          id="combo-box-titulo"
          options={Array.from(
            new Set(fakeProducts.map((product) => product.titulo))
          )}
          sx={{ width: 200 }}
          renderInput={(params) => <TextField {...params} label="Título" />}
          onChange={(event, value) => handleChange(event, value, "titulo")}
        />
        <Autocomplete
          disablePortal
          id="combo-box-rubro"
          options={Array.from(
            new Set(fakeProducts.map((product) => product.rubro))
          )}
          sx={{ width: 200 }}
          renderInput={(params) => <TextField {...params} label="Rubro" />}
          onChange={(event, value) => handleChange(event, value, "rubro")}
        />
        <Autocomplete
          disablePortal
          id="combo-box-marca"
          options={Array.from(
            new Set(fakeProducts.map((product) => product.marca))
          )}
          sx={{ width: 200 }}
          renderInput={(params) => <TextField {...params} label="Marca" />}
          onChange={(event, value) => handleChange(event, value, "marca")}
        />
        <SearchBar onSearch={handleSearch} />
        <button className={styles.clearButton} onClick={handleClearFilters}>
          Limpiar filtros
        </button>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Código</th>
            <th>Título</th>
            <th>Rubro</th>
            <th>Marca</th>
            <th>Stock</th>
            <th>Precio Costo</th>
            <th>Precio Venta</th>
            <th>Editar</th>
            <th>Borrar</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product, index) => (
            <tr key={index}>
              <td>{product.codigo}</td>
              <td>{product.titulo}</td>
              <td>{product.rubro}</td>
              <td>{product.marca}</td>
              <td>{product.stock}</td>
              <td>{product.precioCosto}</td>
              <td>{product.precioVenta}</td>
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

export default ProductsPage;
