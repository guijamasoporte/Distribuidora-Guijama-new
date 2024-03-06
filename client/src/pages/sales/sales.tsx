import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import EditIcon from "@mui/icons-material/Edit";
import styles from "./sales.module.css";
import SearchBar from "../../components/searchBar/searchBar";
import InstanceOfAxios from "../../utils/intanceAxios";
import Pagination from "../../components/pagination/pagination";

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
  product: object;
  date: string;
  priceTotal: number;
  dues: Dues;
  invoice: string;
  state: boolean;
}

interface SalesProps {
  sales: Sale[];
}

const SalesPage: React.FC<SalesProps> = ({ sales }) => {
  const [filters, setFilters] = useState<Partial<Sale>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const salesPerPage = 15;
  const [dataSales, setDataSales] = useState<Sale[]>([]);
  const [stateFilter, setStateFilter] = useState<string | null>(null);

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

  const filteredSales = dataSales.filter((sale) => {
    const clientName = sale.client ? sale.client.name.toLowerCase() : "";
    const clientLastName = sale.client
      ? sale.client.lastName.toLowerCase()
      : "";
    const saleId = sale.idSale ? sale.idSale.toString().toLowerCase() : "";
    const date = sale.date ? sale.date.toLowerCase() : "";
    const priceTotal = sale.priceTotal
      ? sale.priceTotal.toString().toLowerCase()
      : "";
    const duesPayd = sale.dues ? sale.dues.payd.toString().toLowerCase() : "";
    const duesCant = sale.dues ? sale.dues.cant.toString().toLowerCase() : "";
    const invoice = sale.invoice ? sale.invoice.toLowerCase() : "";
    const searchTermLower = searchTerm.toLowerCase();
    const state = sale.state ? "Cerrada" : "Pendiente";

    return (
      (clientName.includes(searchTermLower) ||
        clientLastName.includes(searchTermLower) ||
        saleId.includes(searchTermLower) ||
        date.includes(searchTermLower) ||
        priceTotal.includes(searchTermLower) ||
        duesPayd.includes(searchTermLower) ||
        duesCant.includes(searchTermLower) ||
        invoice.includes(searchTermLower)) &&
      (stateFilter
        ? state.toLowerCase().includes(stateFilter.toLowerCase())
        : true) &&
      (filters.idSale
        ? saleId.includes(filters.idSale.toString().toLowerCase())
        : true) &&
      (filters.client
        ? clientName.includes(filters.client.toString().toLowerCase())
        : true)
    );
  });

  const indexOfLastSale = currentPage * salesPerPage;
  const indexOfFirstSale = indexOfLastSale - salesPerPage;
  const currentSales = filteredSales.slice(indexOfFirstSale, indexOfLastSale);

  const handlePaginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
        <Autocomplete
          disablePortal
          id="combo-box-estado"
          options={["Cerrada", "Pendiente"]}
          sx={{ width: 200 }}
          renderInput={(params) => <TextField {...params} label="Estado" />}
          onChange={(event, value) => setStateFilter(value)}
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
            <th>Estado</th>
            <th>Editar</th>
          </tr>
        </thead>
        <tbody>
          {filteredSales.map((sale, index) => (
            <tr key={index}>
              <td>{sale.idSale}</td>
              <td>{sale.client.name}</td>
              <td>{sale.client.lastName}</td>
              <td>{formatDateModal(sale.date)}</td>
              <td>$ {sale.priceTotal}</td>
              <td>
                {sale.dues.payd}/{sale.dues.cant}
              </td>
              <td>{sale.invoice}</td>
              <td>{sale.state ? "Cerrada" : "Pendiente"}</td>
              <td>
                <button className={styles.buttonEdit}>
                  <EditIcon />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        totalItems={filteredSales.length}
        itemsPerPage={salesPerPage}
        currentPage={currentPage}
        paginate={handlePaginate}
      />
      <div className={styles.buttonsFooter}>
        <button className={styles.buttonAdd}>Cargar nueva venta</button>
      </div>
    </div>
  );
};

export default SalesPage;
