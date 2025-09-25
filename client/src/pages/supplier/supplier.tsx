import React, { useEffect, useState } from "react";
import styles from "./supplier.module.css";
import { Autocomplete, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import SearchBar from "../../components/searchBar/searchBar";
import InstanceOfAxios from "../../utils/intanceAxios";
import Pagination from "../../components/pagination/pagination";
import Swal from "sweetalert2";
import EditClientModal from "../../components/modals/modalClient/modalEditClient/modalEditClient";
import PurchaseModal from "../../components/modals/modalClient/modalBuysClient/modalBuysClient";
import { GetDecodedCookie } from "../../utils/DecodedCookie";
import { Supplier } from "../../interfaces/interfaces";
import { FadeLoader } from "react-spinners";
import CreateSupplierModal from "../../components/modals/modalClient/modalAddSupplier/modalAddSupplier";
import EditSupplierModal from "../../components/modals/modalClient/modalEditSupplier/modalEditSupplier";
import ModalSupplierBuyComponent from "../../components/modals/modalSupplier/modalAddSale/modalAddSale";

const SupplierPage: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openPurchaseModal, setOpenPurchaseModal] = useState(false);
  const [openBuyModal, setOpenBuyModal] = useState(false);
  const initialFilters: Record<keyof Supplier, string | any> = {
    _id: "",
    idSupplier: "",
    name: "",
    lastName: "",
    phone: "",
    email: "",
    adress: "",
    date: "",
    buys: [],
  };

  const [filters, setFilters] = useState(initialFilters);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(
    parseInt(localStorage.getItem("currentPageSupplier") || "1", 10)
  );
  const supplierPerPage = 15;
  const [dataSale, setDataSale] = useState<Supplier[]>([]);
  const [filteredSupplier, setFilteredSupplier] = useState<Supplier[]>([]);
  const [supplierSelect, setSupplierSelect] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch data
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response: any = await InstanceOfAxios("/supplier", "GET");

        if (Array.isArray(response.suppliers)) {
          setDataSale(response.suppliers);
          setLoading(false);
        } else {
          console.error(
            "La respuesta no contiene un array de proveedores:",
            response
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchClient();
  }, [openModal, openModalEdit]);

  // Save current page to localStorage
  useEffect(() => {
    localStorage.setItem("currentPageSupplier", currentPage.toString());
  }, [currentPage]);

  // Filter clients
  useEffect(() => {
    const filteredData = dataSale.filter((client) => {
      return (
        Object.keys(filters).every((key) =>
          filters[key as keyof Supplier]
            ? String(client[key as keyof Supplier])
                .toLowerCase()
                .includes(String(filters[key as keyof Supplier]).toLowerCase())
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
    setFilteredSupplier(filteredData);
    setCurrentPage(1); // Reset to page 1 when filters or search term change
  }, [dataSale, filters, searchTerm]);

  // Handle client creation
  const handleCreateClient = async (newSupplier: Supplier) => {
    try {
      await InstanceOfAxios("/supplier", "POST", newSupplier);
      setDataSale([...dataSale, newSupplier]);
      Swal.fire("¡Éxito!", "Proveedor creado correctamente.", "success");
    } catch (error) {
      console.error("Error creating supplier:", error);
      Swal.fire("¡Error!", "Error al crear el Proveedor.", "error");
    }
  };

  // Handle filter change
  const handleFilterChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: string | null,
    field: keyof Supplier
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
        InstanceOfAxios(`/supplier/${id}`, "DELETE", undefined, token);
        Swal.fire("¡Eliminado!", "El proveedor ha sido eliminado.", "success");
        // Fetch the updated list of clients after deletion
      }
    });
  };

  // Paginate clients
  const indexOfLastClient = currentPage * supplierPerPage;
  const indexOfFirstClient = indexOfLastClient - supplierPerPage;
  const currentSupplier = filteredSupplier.slice(
    indexOfFirstClient,
    indexOfLastClient
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className={styles.tableContainer}>
      <h1 className={styles.title}>Listado de proveedor</h1>
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
                new Set(currentSupplier.map((supplier) => supplier.idSupplier))
              )}
              sx={{ width: 200 }}
              renderInput={(params) => <TextField {...params} label="Id" />}
              onChange={(event, value) =>
                handleFilterChange(
                  event,
                  value ? value.toString() : null,
                  "idSupplier"
                )
              }
            />

            <Autocomplete
              className={styles.autocomplete}
              disablePortal
              id="combo-box-nombre"
              options={Array.from(
                new Set(currentSupplier.map((supplier) => supplier.name))
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
                new Set(currentSupplier.map((client) => client.lastName))
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
                {currentSupplier.map((client, index) => (
                  <tr key={index}>
                    <td>{client.idSupplier}</td>
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
                          setSupplierSelect(client);
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
                          setSupplierSelect(client);
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
            totalItems={filteredSupplier.length}
            itemsPerPage={supplierPerPage}
            currentPage={currentPage}
            paginate={paginate}
          />
          <div className={styles.buttonsFooter}>
            <button
              className={styles.buttonAdd}
              onClick={() => setOpenModal(true)}
            >
              Agregar nuevo proveedor
            </button>
            <button
              className={styles.buttonAdd}
              onClick={() => setOpenBuyModal(true)}
            >
              Crear Compra
            </button>
          </div>
        </>
      )}
      <CreateSupplierModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onCreate={handleCreateClient}
        handleClose={() => setOpenModal(false)}
        categories={[]}
        brands={[]}
        variant={[]}
      />
      {supplierSelect && (
        <EditSupplierModal
          open={openModalEdit}
          onClose={() => setOpenModalEdit(false)}
          onCreate={() => {}}
          supplier={supplierSelect}
          setSupplierSelect={setSupplierSelect}
        />
      )}
      {openBuyModal && (
        <ModalSupplierBuyComponent
          open={openBuyModal}
          onClose={() => setOpenBuyModal(false)}
        />
      )}
    </div>
  );
};

export default SupplierPage;
