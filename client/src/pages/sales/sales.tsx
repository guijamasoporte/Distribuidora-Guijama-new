import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import EditIcon from "@mui/icons-material/Edit";
import styles from "./sales.module.css";
import SearchBar from "../../components/searchBar/searchBar";
import InstanceOfAxios from "../../utils/intanceAxios";
import Pagination from "../../components/pagination/pagination";
import ModalComponent from "../../components/modals/modalSale/modalAddSale/modalAddSale";
import { Sales } from "../../interfaces/interfaces";
import { PDFDownloadLink } from "@react-pdf/renderer";

import Modal from "@mui/material/Modal";
import EditSaleComponent from "../../components/modals/modalSale/modalEditSale/modalEditSale";
import { formatNumberWithCommas } from "../../utils/formatNumberwithCommas";
import Pdfinvoice from "../../components/pdfComponents/pdfInvoice";

const SalesPage: React.FC = () => {
  const [dataSales, setDataSales] = useState<Sales[]>([]);
  const [salesSelected, setSalesSelected] = useState<Sales | null>(null);
  const [filters, setFilters] = useState<Partial<Sales>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const salesPerPage = 15;
  const [stateFilter, setStateFilter] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

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
  }, [modalOpen, editModalOpen]);

  const handleChange = (value: string | null, field: keyof Sales) => {
    setFilters({
      ...filters,
      [field]: value !== null ? value : "",
    });
  };

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };
  const filteredSales: any = dataSales.filter((sale) => {
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
    const createdBy = sale.createdBy
      ? sale.createdBy.toString().toLowerCase()
      : ""; // Añade esta línea

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
        createdBy.includes(searchTermLower)) && // Añade esta línea
      (stateFilter
        ? state.toLowerCase().includes(stateFilter.toLowerCase())
        : true) &&
      (filters.idSale
        ? saleId.includes(filters.idSale.toString().toLowerCase())
        : true) &&
      (filters.client
        ? clientName.includes(filters.client.toString().toLowerCase())
        : true) &&
      (filters.createBy
        ? createdBy.includes(filters.createBy.toString().toLowerCase())
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

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
  };
  console.log(dataSales);

  return (
    <div className={styles.tableContainer}>
      <h1 className={styles.title}>Listado de ventas</h1>
      <div className={styles.filters}>
        <Autocomplete
          className={styles.autocomplete}
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
          className={styles.autocomplete}
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
          className={styles.autocomplete}
          disablePortal
          id="combo-box-estado"
          options={["Cerrada", "Pendiente"]}
          sx={{ width: 200 }}
          renderInput={(params) => <TextField {...params} label="Estado" />}
          onChange={(event, value) => setStateFilter(value)}
        />

        <SearchBar onSearch={handleSearch} />
        <Autocomplete
          className={styles.autocomplete}
          disablePortal
          id="combo-box-creador"
          options={Array.from(new Set(dataSales.map((sale) => sale.createdBy)))}
          sx={{ width: 200 }}
          renderInput={(params) => <TextField {...params} label="Creador" />}
          onChange={(event, value) => handleChange(value, "createBy")} // Cambia "createBy" a "createdBy"
        />
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th className={styles.dateTable}>Fecha</th>
              <th>Total</th>
              <th>Cuotas</th>
              <th>Remito</th>
              <th>Estado</th>
              <th>Editar</th>
            </tr>
          </thead>

          <tbody>
            {filteredSales.map((sale: Sales, index: number) => (
              <tr key={index}>
                <td>{sale.idSale}</td>
                <td>{sale.client.name}</td>
                <td>{sale.client.lastName}</td>
                <td>{formatDateModal(sale.date)}</td>
                <td className={styles.amountTable}>
                  $ {formatNumberWithCommas(sale.priceTotal)}
                </td>
                <td>
                  {sale.dues.payd.filter((state) => state === true).length} /{" "}
                  {sale.dues.cant}
                </td>
                <td>
                  <PDFDownloadLink
                    document={
                      <Pdfinvoice sales={sale} id={index} saleClient={""} />
                    }
                    fileName="invoice.pdf"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={styles.iconPDF}
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                      <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                      <path d="M9 9l1 0" />
                      <path d="M9 13l6 0" />
                      <path d="M9 17l6 0" />
                    </svg>
                  </PDFDownloadLink>
                  {/* <PDFViewer>
                 <Pdfinvoice sales={sale} id={index} saleClient={""} />
                </PDFViewer> */}
                </td>
                <td>{sale.state ? "Cerrada" : "Pendiente"}</td>
                <td>
                  <button
                    className={styles.buttonEdit}
                    onClick={() => {
                      setEditModalOpen(true);
                      setSalesSelected(sale);
                    }}
                  >
                    <EditIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        totalItems={currentSales.length}
        itemsPerPage={salesPerPage}
        currentPage={currentPage}
        paginate={handlePaginate}
      />
      <div className={styles.buttonsFooter}>
        <button className={styles.buttonAdd} onClick={openModal}>
          Cargar nueva venta
        </button>
        <ModalComponent open={modalOpen} onClose={closeModal} />
      </div>
      <Modal open={editModalOpen} onClose={closeEditModal}>
        <div>
          {salesSelected && (
            <EditSaleComponent
              salesSelected={salesSelected}
              onClose={closeEditModal}
              setSalesSelected={setSalesSelected}
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default SalesPage;
