import React, { useEffect, useState } from "react";
import styles from "./clients.module.css";
import { Autocomplete, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import SearchBar from "../../components/searchBar/searchBar";
import InstanceOfAxios from "../../utils/intanceAxios";
import Pagination from "../../components/pagination/pagination";
import Swal from "sweetalert2";
import CreateClientModal from "../../components/modals/modalClient/modalAddClient/modalAddClient";
import EditClientModal from "../../components/modals/modalClient/modalEditClient/modalEditClient";
import PurchaseModal from "../../components/modals/modalClient/modalBuysClient/modalBuysClient";
import { GetDecodedCookie } from "../../utils/DecodedCookie";
import { Client } from "../../interfaces/interfaces";
import { FadeLoader } from "react-spinners";

const ClientsPage: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openPurchaseModal, setOpenPurchaseModal] = useState(false);
  const initialFilters: Record<keyof Client, string | any> = {
    _id: "",
    idClient: "",
    name: "",
    lastName: "",
    phone: "",
    email: "",
    adress: "",
    date: "",
    buys: [],
    idSupplier: undefined
  };

  const [filters, setFilters] = useState(initialFilters);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(parseInt(localStorage.getItem('currentPageClients') || '1', 10));
  const clientsPerPage = 15;
  const [dataSale, setDataSale] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [clientSelect, setClientSelect] = useState<Client | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch data
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response: any = await InstanceOfAxios("/clients", "GET");
        if (Array.isArray(response.clients)) {
          setDataSale(response.clients);
          setLoading(false);
        } else {
          console.error("La respuesta no contiene un array de clientes:", response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchClient();
  }, [openModal, openModalEdit]);

  // Save current page to localStorage
  useEffect(() => {
    localStorage.setItem('currentPageClients', currentPage.toString());
  }, [currentPage]);

  // Filter clients
  useEffect(() => {
    const filteredData = dataSale.filter((client) => {
      return (
        Object.keys(filters).every((key) =>
          filters[key as keyof Client]
            ? String(client[key as keyof Client])
                .toLowerCase()
                .includes(String(filters[key as keyof Client]).toLowerCase())
            : true
        ) &&
        (searchTerm === "" ||
          Object.values(client).some(
            (value) =>
              typeof value === "string" &&
              value.toLowerCase().includes(searchTerm.toLowerCase())
          ))
      );
    });
    setFilteredClients(filteredData);
    setCurrentPage(1); // Reset to page 1 when filters or search term change
  }, [dataSale, filters, searchTerm]);

  // Handle client creation
  const handleCreateClient = async (newClient: Client) => {
    try {
      await InstanceOfAxios("/clients", "POST", newClient);
      setDataSale([...dataSale, newClient]);
      Swal.fire("¡Éxito!", "Cliente creado correctamente.", "success");
    } catch (error) {
      console.error("Error creating client:", error);
      Swal.fire("¡Error!", "Error al crear el cliente.", "error");
    }
  };

  // Handle filter change
  const handleFilterChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: string | null,
    field: keyof Client
  ) => {
    setFilters({
      ...filters,
      [field]: value || "",
    });
  };

  // Handle search term change
  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  // Handle client deletion
  const handleDelete = (id: string) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Sí, eliminarlo!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const token = GetDecodedCookie("cookieToken");
        InstanceOfAxios(`/clients/${id}`, "DELETE", undefined, token);
        Swal.fire("¡Eliminado!", "El cliente ha sido eliminado.", "success");
        // Fetch the updated list of clients after deletion
     
      }
    });
  };

  // Paginate clients
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(
    indexOfFirstClient,
    indexOfLastClient
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className={styles.tableContainer}>
      <h1 className={styles.title}>Listado de clientes</h1>
      {loading === true ? (
        <div className={styles.loaderContainer}>
          <FadeLoader
            color="#603e20"
            height={23}
            width={5}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <>
          <div className={styles.filters}>
            <Autocomplete
              className={styles.autocomplete}
              disablePortal
              id="combo-box-id"
              options={Array.from(
                new Set(currentClients.map((client) => client.idClient))
              )}
              sx={{ width: 200 }}
              renderInput={(params) => <TextField {...params} label="Id" />}
              onChange={(event, value) =>
                handleFilterChange(
                  event,
                  value ? value.toString() : null,
                  "idClient"
                )
              }
            />

            <Autocomplete
              className={styles.autocomplete}
              disablePortal
              id="combo-box-nombre"
              options={Array.from(
                new Set(currentClients.map((client) => client.name))
              )}
              sx={{ width: 200 }}
              renderInput={(params) => <TextField {...params} label="Nombre" />}
              onChange={(event, value) =>
                handleFilterChange(
                  event,
                  value ? value.toString() : null,
                  "name"
                )
              }
            />

            <Autocomplete
              className={styles.autocomplete}
              disablePortal
              id="combo-box-apellido"
              options={Array.from(
                new Set(currentClients.map((client) => client.lastName))
              )}
              sx={{ width: 200 }}
              renderInput={(params) => (
                <TextField {...params} label="Apellido" />
              )}
              onChange={(event, value) =>
                handleFilterChange(
                  event,
                  value ? value.toString() : null,
                  "lastName"
                )
              }
            />

            <SearchBar onSearch={handleSearch} />
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th className={styles.nameTable}>Nombre</th>
                  <th>Apellido</th>
                  <th>Teléfono</th>
                  <th>E-mail</th>
                  <th className={styles.adressTable}>Dirección</th>
                  <th>Compras</th>
                  <th>Editar</th>
                  <th>Borrar</th>
                </tr>
              </thead>
              <tbody>
                {currentClients.map((client, index) => (
                  <tr key={index}>
                    <td>{client.idClient}</td>
                    <td className={styles.nameTable}>{client.name}</td>
                    <td>{client.lastName}</td>
                    <td>{client.phone}</td>
                    <td>{client.email}</td>
                    <td className={styles.adressTable}>{client.adress}</td>
                    <td>
                      <button
                        className={styles.buttonSee}
                        onClick={() => {
                          setOpenPurchaseModal(true);
                          setClientSelect(client);
                        }}
                      >
                        <SearchIcon />
                      </button>
                    </td>
                    <td>
                      <button
                        className={styles.buttonEdit}
                        onClick={() => {
                          setOpenModalEdit(true);
                          setClientSelect(client);
                        }}
                      >
                        <EditIcon />
                      </button>
                    </td>
                    <td>
                      <button
                        className={styles.buttonDelete}
                        onClick={() => handleDelete(`${client._id}`)}
                      >
                        <DeleteIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            totalItems={filteredClients.length}
            itemsPerPage={clientsPerPage}
            currentPage={currentPage}
            paginate={paginate}
          />
          <div className={styles.buttonsFooter}>
            <button
              className={styles.buttonAdd}
              onClick={() => setOpenModal(true)}
            >
              Agregar nuevo cliente
            </button>
          </div>
        </>
      )}
      <CreateClientModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onCreate={handleCreateClient}
        handleClose={() => setOpenModal(false)}
        categories={[]}
        brands={[]}
        variant={[]}
      />
      {clientSelect && (
        <EditClientModal
          open={openModalEdit}
          onClose={() => setOpenModalEdit(false)}
          onCreate={() => {}}
          client={clientSelect}
          setClientSelect={setClientSelect}
        />
      )}
      {clientSelect && (
        <PurchaseModal
          open={openPurchaseModal}
          onClose={() => setOpenPurchaseModal(false)}
          dataSale={clientSelect}
        />
      )}
    </div>
  );
};

export default ClientsPage;
