import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import styles from "./sales.module.css";
import SearchBar from "../../components/searchBar/searchBar";
import InstanceOfAxios from "../../utils/intanceAxios";

interface Client {
  name: string;
  lastName: string;
}

interface Dues {
  payd: number;
  cant: number;
}

interface Sale {
  idSale: number;
  client: Client;
  product: object; // Asumí que "product" es un objeto
  date: string;
  priceTotal: number;
  dues: Dues;
  invoice: string;
}

interface SalesProps {
  sales: Sale[];
}

const SalesPage: React.FC<SalesProps> = () => {
  const [filters, setFilters] = useState<Partial<Sale>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [dataSales, setDataSales] = useState<Sale[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: any = await InstanceOfAxios("/sales", "GET");
        setDataSales(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (value: string | null, field: keyof Sale) => {
    setFilters({
      ...filters,
      [field]: value !== null ? value : "",
    });
  };

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  const filteredSales = Array.isArray(dataSales)
    ? dataSales.filter((sale) => {
        return (
          Object.keys(filters).every((key) =>
            filters[key as keyof Sale]
              ? key === "client"
                ? String(sale.client.name)
                    .toLowerCase()
                    .includes(
                      (filters[key as keyof Sale] || "")
                        .toString()
                        .toLowerCase()
                    )
                : String(sale[key as keyof Sale])
                    .toLowerCase()
                    .includes(
                      (filters[key as keyof Sale] || "")
                        .toString()
                        .toLowerCase()
                    )
              : true
          ) &&
          (searchTerm === "" ||
            Object.values(sale).some((value) =>
              String(value).toLowerCase().includes(searchTerm.toLowerCase())
            ))
        );
      })
    : [];

  const formatDateModal = (isoDate: string): string => {
    const date = new Date(isoDate);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    };

    const formattedDate: string = new Intl.DateTimeFormat(
      "es-AR",
      options
    ).format(date);
    return formattedDate;
  };
  return (
    <div className={styles.tableContainer}>
      <h1 className={styles.title}>Listado de ventas</h1>
      <div className={styles.filters}>
        <Autocomplete
          disablePortal
          id="combo-box-id"
          options={Array.from(
            new Set(dataSales.map((sale) => sale.idSale?.toString() || ""))
          )}
          sx={{ width: 200 }}
          renderInput={(params) => <TextField {...params} label="ID" />}
          onChange={(event, value) => handleChange(value, "idSale")}
        />
        <Autocomplete
          disablePortal
          id="combo-box-nombre"
          options={Array.from(
            new Set(dataSales.map((sale) => sale.client.name))
          )}
          sx={{ width: 200 }}
          renderInput={(params) => <TextField {...params} label="Nombre" />}
          onChange={(event, value) => handleChange(value, "client")}
        />

        {/* Repeat the Autocomplete block for other fields */}
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
              <td>{sale.idSale}</td>
              <td>{sale.client.name}</td>
              <td>{sale.client.lastName}</td>
              <td>{formatDateModal(sale.date)}</td>
              <td>{sale.priceTotal}</td>
              <td>
                {sale.dues.payd}/{sale.dues.cant}
              </td>{" "}
              {/* Updated from 'cuotas' */}
              <td>{sale.invoice}</td>
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
