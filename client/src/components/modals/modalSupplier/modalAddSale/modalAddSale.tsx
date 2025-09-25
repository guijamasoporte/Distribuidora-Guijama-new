import React, { useEffect, useState } from "react";
import { Autocomplete, Modal, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import styles from "./modalAddSale.module.css";
import Swal from "sweetalert2";
import InstanceOfAxios from "../../../../utils/intanceAxios";
import { Client, Filters, Product, Supplier } from "../../../../interfaces/interfaces";
import { GetDecodedCookie } from "../../../../utils/DecodedCookie";
import BarcodeScanner from "../../../scannerCode/barcodeScanner";
import { formatNumberWithCommas } from "../../../../utils/formatNumberwithCommas";

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

const ModalSupplierBuyComponent: React.FC<ModalProps> = ({ open, onClose }) => {
  const [dataProducts, setDataProducts] = useState<Product[]>([]);
  const [dataSupplier, setDataSupplier] = useState<Supplier[]>([]);
  const [List, setList] = useState<Product[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [openModalSelectProduct, setOpenModalSelectProduct] =
    useState<boolean>(false);

  const [matchProduct, setMatchProduct] = useState<Product[]>([]);

  const [filters, setFilters] = useState<Filters>({
    code: "",
    cant: 1,
    importe: 1,
    title: "",
  });
  const [total, setTotal] = useState<number>(0);
  const [method, setMethod] = useState<string | null>(null);
  const [openCameraReadCode, setOpenCameraReadCode] = useState<boolean>(false);

  const fetchData = async () => {
    const resProducts: any = await InstanceOfAxios("/products", "GET");
    const resSupplier: any = await InstanceOfAxios("/supplier", "GET");
    setDataProducts(resProducts);
    setDataSupplier(resSupplier.suppliers);
  };

  const handleChangeFilter = (prop: string, value: any) => {
    setFilters({
      ...filters,
      [prop]: value,
    });
  };

  const HandlerAddProduct = () => {
    try {
      let filteredData: Product[] = dataProducts.filter(
        (el: Product) => String(el.code) === String(filters.code)
      );

      if (filteredData && filteredData.length > 1) {
        setOpenModalSelectProduct(true);
        setMatchProduct(filteredData);
      } else if (filteredData && filteredData.length === 1) {
        filteredData = filteredData.map((item) => ({
          ...item,
          unity: filters.cant,
        }));

        let productIndex = List.findIndex(
          (el: Product) => String(el.code) === String(filteredData[0].code)
        );

        if (productIndex >= 0) {
          List[productIndex].unity =
            Number(List[productIndex].unity) + Number(filters.cant);
          setList([...List]);
        } else {
          setList([...List, ...filteredData]);
        }
        setFilters({ ...filters, code: "" });
      }
    } catch (error) {
      console.error("Error handling facturation:", error);
    }
  };

  const HandlerAddProductWithTitle = () => {
    try {
      let filteredData: Product[] = dataProducts.filter(
        (el: Product) =>
          String(el.title).toLowerCase() === String(filters.title).toLowerCase()
      );

      if (filteredData.length > 0) {
        filteredData = filteredData.map((item) => ({
          ...item,
          unity: filters.cant,
        }));

        let productIndex = List.findIndex(
          (el: Product) => String(el.title) === String(filteredData[0].title)
        );

        if (productIndex >= 0) {
          List[productIndex].unity =
            Number(List[productIndex].unity) + Number(filters.cant);
          setList([...List]);
        } else {
          setList([...List, ...filteredData]);
        }
        setFilters({ ...filters, title: "" });
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
        priceList: filters.importe,
        unity: filters.cant,
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

    if (selectedSupplier) {
      const dataClient = {
        name: selectedSupplier.name,
        lastName: selectedSupplier.lastName,
        id: selectedSupplier._id,
        email: selectedSupplier.email,
        adress: selectedSupplier.adress,
        idSupplier: selectedSupplier.idSupplier,
      };

      try {
        await InstanceOfAxios(
          "/supplier",
          "POST",
          { List, client: dataClient, token: token, method },
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
    setSelectedSupplier(null);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    HandlerAddProduct();
    Calculartotal();
    HandlerAddProductWithTitle();
  }, [
    filters.code,
    filters.title,
    List,
    Calculartotal,
    HandlerAddProduct,
    HandlerAddProductWithTitle,
  ]);

  const closeModal = () => {
    setMatchProduct([]);
    setOpenModalSelectProduct(false);
    setFilters({ ...filters, code: "" });
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <div className={styles.modal}>
          <div className={styles.closeButtonTitle}>
            <div className={styles.closeButtonContainer}>
              <button className={styles.closeButton} onClick={onClose}>
                <CloseIcon />
              </button>
            </div>
            <div className={styles.titleContainer}>
              <h2 className={styles.titleNewSale}>Nueva Compra a provedor</h2>
            </div>
          </div>
          <div className={styles.autocompleteAddSale}>
            <div>
              <Autocomplete
              sx={{width: 320}}
                className={styles.clientSelect}
                fullWidth={true}
                options={dataSupplier}
                getOptionLabel={(option) =>
                  `N° ${option.idSupplier} - ${option.name} ${option.lastName}`
                }
                value={selectedSupplier}
                onChange={(event, newValue) => {
                  if (newValue) {
                    setSelectedSupplier(newValue);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Seleccionar proveedor"
                    variant="outlined"
                  />
                )}
              />
            </div>
            <div>
              <Autocomplete
                className={styles.clientSelect}
                id="combo-box-mes"
                options={["Transferencia", "Efectivo"]} // Opciones de formas de pago como cadenas
                renderInput={(params) => (
                  <TextField {...params} label="Forma de pago" />
                )}
                onChange={(event, value) => setMethod(value)} // Establecer el valor seleccionado en el estado method
              />
            </div>
          </div>
          <div className={styles.tablesContainer}>
            <div className={styles.inputContainer}>
              <div className={styles.labelInputContainer}>
                <label className={styles.labels}>Código</label>
                <Autocomplete
                  className={styles.autocompleteMui}
                  sx={{
                    "& .MuiAutocomplete-inputRoot": {
                      backgroundColor: "#fff",
                      height: '40px',
                      paddingTop: '0px',
                      paddingBottom: '10px',
                    },
                    "& .MuiAutocomplete-listbox": {
                      backgroundColor: "#fff",
                    },
                  }}
                  disablePortal
                  id="combo-box-codigo"
                  options={Array.from(
                    new Set(dataProducts.map((product) => product.code))
                  )}
                  renderInput={(params) => <TextField {...params} label="" />}
                  onChange={(event, value) => handleChangeFilter("code", value)}
                />
                <button
                  className={styles.cameraIconScann}
                  onClick={() => setOpenCameraReadCode(true)}
                >
                  <CameraAltIcon />
                </button>
              </div>
              <div className={styles.labelautocompleteContainer}>
                <label className={styles.labels}>titulo</label>
                <Autocomplete
                  className={styles.autocompleteMui}
                  sx={{
                    "& .MuiAutocomplete-inputRoot": {
                      backgroundColor: "#fff",
                      height: '40px',
                      paddingTop: '0px',
                      paddingBottom: '10px',
                    },
                    "& .MuiAutocomplete-listbox": {
                      backgroundColor: "#fff",
                    },
                  }}
                  disablePortal
                  id="combo-box-titulo"
                  options={Array.from(
                    new Set(dataProducts.map((product) => product.title))
                  )}
                  renderInput={(params) => <TextField {...params} label="" />}
                  onChange={(event, value) => {
                    handleChangeFilter("title", value);
                  }}
                />
              </div>
              <div className={styles.labelInputContainer}>
                <label className={styles.labels}>Cantidad</label>
                <input
                  type="number"
                  placeholder="Cantidad"
                  onChange={(e) => handleChangeFilter("cant", e.target.value)}
                  className={styles.inputAddCode}
                  value={filters.cant}
                />
              </div>
              <div className={styles.labelInputContainer}>
                <label className={styles.labels}>Importe $</label>
                <input
                  type="number"
                  placeholder="Importe"
                  onChange={(e) =>
                    handleChangeFilter("importe", e.target.value)
                  }
                  className={styles.inputAddCode}
                  value={filters.importe}
                />
              </div>
            </div>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.titleCode}>Código</th>
                    <th className={styles.titleTable}>Título</th>
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
                      <td className={styles.titleCode}>{product.code}</td>
                      <td className={styles.titleTable}>
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
                      <td className={styles.prices}>
                        $
                        {product.priceCost
                          ? formatNumberWithCommas(product.priceCost)
                          : "-"}
                      </td>
                      <td className={styles.prices}>
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
                      <td className={styles.prices}>
                        $ {handlerSubPrice(product)}
                      </td>
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
          </div>
          <div className={styles.totalSaleButtonAddContainer}>
            <button
              onClick={handleAddGenericProduct}
              className={styles.buttonAddGeneric}
            >
              Agregar Genérico
            </button>
            <div className={styles.totalSaleContainer}>
              <p className={styles.totalSale}>
                Total: $ {formatNumberWithCommas(total)}
              </p>
            </div>
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
          </div>
          <div
            className={`${styles.scannerCode} ${
              openCameraReadCode ? styles.openCameraStyle : ""
            }`}
          >
            {openCameraReadCode && (
              <BarcodeScanner
                setOpenCameraReadCode={setOpenCameraReadCode}
                setFilters={setFilters}
                filters={filters}
              />
            )}
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
                key={index}
                className={styles.gridItem}
                onClick={() => {
                  let productIndex = List.findIndex(
                    (el: Product) =>
                      String(el.code) === String(el.code) &&
                      el.variant === product.variant
                  );
                  if (productIndex >= 0) {
                    List[productIndex].unity =
                      Number(List[productIndex].unity) + Number(filters.cant);
                    setList([...List]);
                  } else {
                    setList([
                      ...List,
                      { ...product, unity: Number(filters.cant) },
                    ]);
                  }

                  closeModal();
                }}
              >
                <p className={styles.titleVariant}>
                  {product.code} - {product.title} - {product.variant}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalSupplierBuyComponent;
