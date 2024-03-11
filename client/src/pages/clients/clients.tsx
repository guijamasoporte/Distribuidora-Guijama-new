import React, { useEffect, useState } from "react";
import styles from "./clients.module.css";
import { Autocomplete, Button, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import SearchBar from "../../components/searchBar/searchBar";
import InstanceOfAxios from "../../utils/intanceAxios";
import Pagination from "../../components/pagination/pagination";
import Swal from "sweetalert2";
import CreateClientModal from "../../components/modals/modalClient/modalAddClient/modalAddClient";
import EditClientModal from "../../components/modals/modalClient/modalEditClient/modalEditClient";
import { GetDecodedCookie } from "../../utils/DecodedCookie";
import { Client } from "../../interfaces/interfaces";



const ClientsPage: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const initialFilters = {
    idClient: "",
    name: "",
    lastName: "",
    phone: "",
    email: "",
    adress: "",
    buys: "",
  };

  const [filters, setFilters] = useState<{ [key: string]: string }>(
    initialFilters
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 15;
  const [dataSale, setDataSale] = useState<Array<Client>>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [clientSelect, setClientSelect] = useState<Client | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response: any = await InstanceOfAxios("/clients", "GET");
        if (Array.isArray(response.clients)) {
          setDataSale(response.clients);
        } else {
          console.error(
            "La respuesta no contiene un array de clientes:",
            response
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchClient();
  }, [openModal, openModalEdit]);

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

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  const handleEdit = (id: string) => {
    console.log(`Edit product with id ${id}`);
  };

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
      }
    });
  };

  useEffect(() => {
    const filteredData = dataSale.filter((client) => {
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
    setFilteredClients(filteredData);
  }, [dataSale, filters, searchTerm]);

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
      <div className={styles.filters}>
        <Autocomplete
          disablePortal
          id="combo-box-id"
          options={Array.from(
            new Set(currentClients.map((client, index) => client.idClient))
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
          disablePortal
          id="combo-box-nombre"
          options={Array.from(
            new Set(currentClients.map((client, index) => client.name))
          )}
          sx={{ width: 200 }}
          renderInput={(params) => <TextField {...params} label="Nombre" />}
          onChange={(event, value) =>
            handleFilterChange(event, value ? value.toString() : null, "name")
          }
        />

        <Autocomplete
          disablePortal
          id="combo-box-apellido"
          options={Array.from(
            new Set(currentClients.map((client, index) => client.lastName))
          )}
          sx={{ width: 200 }}
          renderInput={(params) => <TextField {...params} label="Apellido" />}
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
          {currentClients.map((client, index) => (
            <tr key={index}>
              <td>{client.idClient}</td>
              <td>{client.name}</td>
              <td>{client.lastName}</td>
              <td>{client.phone}</td>
              <td>{client.email}</td>
              <td>{client.adress}</td>
              <td>
                <button
                  className={styles.buttonSee}
                  onClick={() => handleEdit(`${client.buys}`)}
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
      <Pagination
        totalItems={filteredClients.length}
        itemsPerPage={clientsPerPage}
        currentPage={currentPage}
        paginate={paginate}
      />
      <div className={styles.buttonsFooter}>
        <button className={styles.buttonAdd} onClick={() => setOpenModal(true)}>
          Agregar nuevo cliente
        </button>
      </div>
      <CreateClientModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onCreate={handleCreateClient} handleClose={function (): void {
          throw new Error("Function not implemented.");
        } } categories={[]} brands={[]}      />
      {clientSelect && (
        <EditClientModal
          open={openModalEdit}
          onClose={() => setOpenModalEdit(false)}
          onCreate={setOpenModalEdit}
          client={clientSelect}
        />
      )}
    </div>
  );
};

export default ClientsPage;
