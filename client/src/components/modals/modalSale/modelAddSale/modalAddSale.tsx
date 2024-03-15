import React, { useEffect, useState } from "react";
import { Autocomplete, Modal, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import styles from "./modalAddSale.module.css";
import Swal from "sweetalert2";
import InstanceOfAxios from "../../../../utils/intanceAxios";
import {
  Client,
  Dues,
  Filters,
  Product,
} from "../../../../interfaces/interfaces";
import { GetDecodedCookie } from "../../../../utils/DecodedCookie";

interface ApiError {
  message: string;
}

type ApiResponse = Product[] | Client | ApiError;

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

const ModalComponent: React.FC<ModalProps> = ({ open, onClose }) => {
  const [dataProducts, setDataProducts] = useState<Product[]>([]);
  const [dataClients, setDataClients] = useState<Client[]>([]);
  const [List, setList] = useState<Product[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [openModalSelectProduct, setOpenModalSelectProduct] =
    useState<boolean>(false);

  const [matchProduct, setMatchProduct] = useState<Product[]>([]);

  const [filter, setFilter] = useState<Filters>({
    code: "",
    cant: 1,
    importe: 1,
    title: "",
  });
  const [total, setTotal] = useState<number>(0);

  const fetchData = async () => {
    const resProducts: any = await InstanceOfAxios("/products", "GET");
    const resClients: any = await InstanceOfAxios("/clients", "GET");
    setDataProducts(resProducts);
    setDataClients(resClients.clients);
  };

  const handleChangeFilter = (prop: string, value: any) => {
    setFilter({
      ...filter,
      [prop]: value,
    });
  };

  const HandlerAddProduct = () => {
    try {
      let filteredData: Product[] = dataProducts.filter(
        (el: Product) => String(el.code) === String(filter.code)
      );

      if (filteredData && filteredData.length > 1) {
        setOpenModalSelectProduct(true);
        setMatchProduct(filteredData);
      } else if (filteredData && filteredData.length === 1) {
        filteredData = filteredData.map((item) => ({
          ...item,
          unity: filter.cant,
        }));

        let productIndex = List.findIndex(
          (el: Product) => String(el.code) === String(filteredData[0].code)
        );

        if (productIndex >= 0) {
          List[productIndex].unity =
            Number(List[productIndex].unity) + Number(filter.cant);
          setList([...List]);
        } else {
          setList([...List, ...filteredData]);
        }
        setFilter({ ...filter, code: "" });
      }
    } catch (error) {
      console.error("Error handling facturation:", error);
    }
  };

  const HandlerAddProductWithTitle = () => {
    try {
      let filteredData: Product[] = dataProducts.filter(
        (el: Product) =>
          String(el.title).toLowerCase() === String(filter.title).toLowerCase()
      );

      if (filteredData.length > 0) {
        filteredData = filteredData.map((item) => ({
          ...item,
          unity: filter.cant,
        }));

        let productIndex = List.findIndex(
          (el: Product) => String(el.title) === String(filteredData[0].title)
        );

        if (productIndex >= 0) {
          List[productIndex].unity =
            Number(List[productIndex].unity) + Number(filter.cant);
          setList([...List]);
        } else {
          setList([...List, ...filteredData]);
        }
        setFilter({ ...filter, title: "" });
      }
    } catch (error) {
      console.error("Error handling facturation:", error);
    }
  };

  const Calculartotal = () => {
    let totalData = List.map((el: any) => ({
      ...el,
      total: el.priceList * el.unity,
    }));

    let overallTotal = totalData.reduce((acc, curr) => acc + curr.total, 0);
    setTotal(overallTotal);
  };

  const handleAddGenericProduct = () => {
    setList([
      ...List,
      {
        code: "",
        title: "Titulo",
        priceCost: null,
        priceList: filter.importe,
        unity: filter.cant,
        generic: true,
        stock: 0,
        category: "",
        brand: "",
        image: [],
        variant: "",
        _id: "",
      },
    ]);
  };

  const handlerEditTitle = (index: number) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const newTitle = event.target.value;
      let updatedList = [...List];
      updatedList[index].title = newTitle;
      setList(updatedList);
    };
  };

  const handlerEditUnity = (elemento: Product, index: number) => {
    return (event: any) => {
      const newUnity = event.target.value;

      List[index].unity = Number(newUnity);
      console.log(List[index]);
      setList([...List]);
    };
  };

  const handlerEditPrice = (elemento: Product, index: number) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const newPrice = event.target.value;
      List[index].priceList = Number(newPrice);
      setList([...List]);
    };
  };

  const handlerSubPrice = (product: any) => {
    const total = product.priceList * product.unity;
    return total.toLocaleString().replace(",", ".");
  };

  const handleDeleteProduct = (index: number) => {
    const newList = [...List];
    newList.splice(index, 1);
    setList(newList);
  };

  const handleSubmit = async () => {
    const token = GetDecodedCookie("cookieToken");

    if (selectedClient) {
      const dataClient = {
        name: selectedClient.name,
        lastName: selectedClient.lastName,
        id: selectedClient._id,
        email: selectedClient.email,
        adress: selectedClient.adress,
        idClient: selectedClient.idClient,
      };

      try {
        await InstanceOfAxios(
          "/sales",
          "POST",
          { List, client: dataClient },
          token
        );
        onClose();
        Swal.fire({
          icon: "success",
          title: "Venta guardada",
          text: "La venta se ha guardado exitosamente.",
        });
      } catch (error) {
        console.error("Error saving sale:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al guardar la venta. Por favor, inténtelo de nuevo.",
        });
      }
    }

    setList([]);
    setSelectedClient(null);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    HandlerAddProduct();
    Calculartotal();
    HandlerAddProductWithTitle();
  }, [filter.code, , filter.title, List]);

  const closeModal = () => {
    setOpenModalSelectProduct(false);
    setFilter({ ...filter, code: "" });
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <div className={styles.modal}>
          <div className={styles.closeButtonTitle}>
            <div>
              <button className={styles.closeButton} onClick={onClose}>
                <CloseIcon />
              </button>
            </div>
            <div className={styles.titleContainer}>
              <h2 className={styles.titleNewSale}>Nueva Venta</h2>
            </div>
          </div>
          <Autocomplete
            className={styles.clientSelect}
            fullWidth={true}
            options={dataClients}
            getOptionLabel={(option) =>
              `N° ${option.idClient} - ${option.name} ${option.lastName}`
            }
            value={selectedClient}
            onChange={(event, newValue) => {
              if (newValue) {
                setSelectedClient(newValue);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Seleccionar cliente"
                variant="outlined"
              />
            )}
          />
          <div className={styles.tablesContainer}>
            <div className={styles.inputContainer}>
              <label>Código</label>
              <input
                type="text"
                placeholder="Código de producto"
                onChange={(e) => handleChangeFilter("code", e.target.value)}
                className={styles.inputAddCode}
                value={filter.code}
              />

              <label>Título</label>
              <input
                type="text"
                placeholder="Buscar por título"
                onChange={(e) => handleChangeFilter("title", e.target.value)}
                className={styles.inputAddCode}
                value={filter.title}
              />

              <label>Cantidad</label>
              <input
                type="number"
                placeholder="Cantidad"
                onChange={(e) => handleChangeFilter("cant", e.target.value)}
                className={styles.inputAddCode}
                value={filter.cant}
              />

              <label>Importe $</label>
              <input
                type="number"
                placeholder="Importe"
                onChange={(e) => handleChangeFilter("importe", e.target.value)}
                className={styles.inputAddCode}
                value={filter.importe}
              />
            </div>

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Título</th>
                  <th>U.</th>
                  <th>Precio Compra</th>
                  <th>Precio Venta</th>
                  <th>Sub-Total</th>
                  <th>Borrar</th>
                </tr>
              </thead>
              <tbody>
                {List.map((product: Product, index) => (
                  <tr key={index}>
                    <td>{product.code}</td>
                    <td>
                      {product.generic ? (
                        <input
                          type="text"
                          id=""
                          value={product.title}
                          maxLength={20}
                          onChange={handlerEditTitle(index)}
                          className={`${styles.inputAddCode} ${styles.inputAddGeneric}`}
                        />
                      ) : (
                        product.title
                      )}
                    </td>
                    <td className={styles.quantityInputSale}>
                      <input
                        type="number"
                        value={product.unity}
                        onChange={handlerEditUnity(product, index)}
                        className={styles.input}
                        name="cant"
                      />
                    </td>
                    <td>
                      $
                      {product.priceCost
                        ? product.priceCost.toLocaleString().replace(",", ".")
                        : "-"}
                    </td>
                    <td>
                      {product.generic ? (
                        <input
                          type="number"
                          value={product.priceList}
                          onChange={handlerEditPrice(product, index)}
                          className={styles.inputEditPriceGeneric}
                        />
                      ) : (
                        `$ ${product.priceList
                          .toLocaleString()
                          .replace(",", ".")}`
                      )}
                    </td>
                    <td>$ {handlerSubPrice(product)}</td>
                    <td>
                      <button
                        className={styles.buttonDelete}
                        onClick={() => handleDeleteProduct(index)}
                      >
                        <DeleteIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.totalSaleButtonAddContainer}>
            <button
              onClick={handleAddGenericProduct}
              className={styles.buttonAddGeneric}
            >
              Agregar Genérico
            </button>
            <div className={styles.buttonContainerSale}>
              <button
                className={`${styles.buttonFinishSale} ${
                  List.length === 0 ? styles.buttonFinishSaleDisabled : ""
                }`}
                disabled={List.length === 0}
                onClick={handleSubmit}
              >
                Cargar Venta
              </button>
            </div>
            <div className={styles.totalSaleContainer}>
              <p className={styles.totalSale}>Total: $ {total}</p>
            </div>
          </div>
        </div>
      </Modal>
      <Modal open={openModalSelectProduct} onClose={closeModal}>
        <div className={styles.modalVariant}>
          <div className={styles.titleContainerVariant}>
            <p className={styles.titleVariantModal}>
              Selecciona la variedad del producto
            </p>
          </div>
          <div className={styles.gridContainer}>
            {matchProduct.map((product: Product, index: number) => (
              <div
                className={styles.gridItem}
                onClick={() => {
                  let productIndex = List.findIndex(
                    (el: Product) =>
                      String(el.code) === String(el.code) &&
                      el.variant === product.variant
                  );
                  if (productIndex >= 0) {
                    List[productIndex].unity =
                      Number(List[productIndex].unity) + Number(filter.cant);
                    setList([...List]);
                  } else {
                    setList([...List, { ...product, unity: Number(filter.cant) }]);
                  }

                  closeModal();
                }}
              >
                <p className={styles.titleVariant}>{product.variant}</p>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalComponent;
