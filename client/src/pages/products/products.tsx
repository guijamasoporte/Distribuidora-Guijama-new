import React, { useState } from "react";
import { Select, MenuItem, SelectChangeEvent } from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import styles from "./products.module.css";
import fakeProducts from "./fakeStock";

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
  const [filters, setFilters] = useState<{ [key: string]: string | undefined }>(
    {
      codigo: undefined,
      titulo: "",
      rubro: "",
      marca: "",
      stock: "",
      precioCosto: "",
      precioVenta: "",
    }
  );

  const handleChange = (
    event: SelectChangeEvent<string | number>,
    field: keyof Product
  ) => {
    setFilters({
      ...filters,
      [field]: String(event.target.value),
    });
  };

  const filteredProducts = fakeProducts.filter((product) => {
    return Object.keys(filters).every((key) => {
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
    });
  });

  return (
    <div className={styles.tableContainer}>
      <h1>Productos</h1>
      <div className={styles.filters}>
        <Select
          displayEmpty
          value={filters.codigo}
          onChange={(e) => handleChange(e, "codigo")}
          input={<OutlinedInput />}
          renderValue={(selected) => {
            if (!selected) {
              return <em>Código</em>;
            }
            return selected;
          }}
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem value="">Todos</MenuItem>
          {Array.from(
            new Set(fakeProducts.map((product) => product.codigo))
          ).map((codigo) => (
            <MenuItem key={codigo} value={codigo}>
              {codigo}
            </MenuItem>
          ))}
        </Select>
        <Select
          displayEmpty
          value={filters.titulo}
          onChange={(e) => handleChange(e, "titulo")}
          input={<OutlinedInput />}
          renderValue={(selected) => {
            if (selected === "") {
              return <em>Título</em>;
            }
            return selected;
          }}
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem value="">Todos</MenuItem>
          {Array.from(
            new Set(fakeProducts.map((product) => product.titulo))
          ).map((titulo) => (
            <MenuItem key={titulo} value={titulo}>
              {titulo}
            </MenuItem>
          ))}
        </Select>
        <Select
          displayEmpty
          value={filters.rubro}
          onChange={(e) => handleChange(e, "rubro")}
          input={<OutlinedInput />}
          renderValue={(selected) => {
            if (selected === "") {
              return <em>Rubro</em>;
            }
            return selected;
          }}
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem value="">Todos</MenuItem>
          {Array.from(
            new Set(fakeProducts.map((product) => product.rubro))
          ).map((rubro) => (
            <MenuItem key={rubro} value={rubro}>
              {rubro}
            </MenuItem>
          ))}
        </Select>
        <Select
          displayEmpty
          value={filters.marca}
          onChange={(e) => handleChange(e, "marca")}
          input={<OutlinedInput />}
          renderValue={(selected) => {
            if (selected === "") {
              return <em>Marca</em>;
            }
            return selected;
          }}
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem value="">Todas</MenuItem>
          {Array.from(
            new Set(fakeProducts.map((product) => product.marca))
          ).map((marca) => (
            <MenuItem key={marca} value={marca}>
              {marca}
            </MenuItem>
          ))}
        </Select>
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
