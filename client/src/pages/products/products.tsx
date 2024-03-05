import React, { useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import styles from "./products.module.css";
import fakeProducts from "./fakeStock";
import SearchBar from "../../components/searchBar/searchBar";
import Pagination from "../../components/pagination/pagination";

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
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 15;

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

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className={styles.tableContainer}>
      <h1 className={styles.title}>Listado de productos</h1>
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
          {currentProducts.map((product, index) => (
            <tr key={index}>
              <td>{product.codigo}</td>
              <td>{product.titulo}</td>
              <td>{product.rubro}</td>
              <td>{product.marca}</td>
              <td>{product.stock}</td>
              <td>{product.precioCosto}</td>
              <td>{product.precioVenta}</td>
              <td>
                <button className={styles.buttonEdit}>
                  <EditIcon />
                </button>
              </td>
              <td>
                <button className={styles.buttonDelete}>
                  <DeleteIcon />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        totalItems={filteredProducts.length}
        itemsPerPage={productsPerPage}
        currentPage={currentPage}
        paginate={paginate}
      />
      <div className={styles.buttonsFooter}>
        <button className={styles.buttonAdd}>Agregar nuevo producto</button>
        <button className={styles.buttonModify}>
          Modificar precios x Rubro
        </button>
      </div>
    </div>
  );
};

export default ProductsPage;
