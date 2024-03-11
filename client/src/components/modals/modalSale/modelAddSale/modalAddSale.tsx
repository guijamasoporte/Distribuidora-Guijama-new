import React, { useEffect, useState } from "react";
import { Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./modalAddSale.module.css";
import InstanceOfAxios from "../../../../utils/intanceAxios";
import { Client, Dues, Product } from "../../../../interfaces/interfaces";

interface ProductData {
  code(code: any): unknown;
  client: Client;
  product: Product;
  date: Date;
  dues: Dues;
  state: boolean;
  priceTotal: number;
  generic: boolean;
}

interface ApiError {
  message: string;
}

type ApiResponse = ProductData | ApiError;

interface ModalProps {
  open: boolean;
  onClose: () => void;
}
interface Filters {
  code: string;
  cant: number;
  importe: number;
  title: string;
}

const ModalComponent: React.FC<ModalProps> = ({ open, onClose }) => {
  const [dataProducts, setDataProducts] = useState<Product[]>([]);
  const [dataClients, setDataClients] = useState<Client[]>([]);
  const [List, setList] = useState<Product[]>([]);

  const [filter, setFilter] = useState<Filters>({
    code: "",
    cant: 1,
    importe: 1,
    title: "",
  });
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const resProducts: any = await InstanceOfAxios("/products", "GET");
    const resClients: any = await InstanceOfAxios("/clients", "GET");
    setDataProducts(resProducts);
    setDataClients(resClients);
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

      if (filteredData.length > 0) {
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

    // Calculate the overall total by summing up the individual totals
    let overallTotal = totalData.reduce((acc, curr) => acc + curr.total, 0);
    setTotal(overallTotal);
  };

  const handleAddGenericProduct = () => {
    setList([
      ...List,
      {
        code: "",
        title: "Producto Generico",
        priceCost: null,
        priceList: filter.importe,
        unity: filter.cant,
        generic: true,
        stock: 0,
        category: "",
        brand: "",
        image: [],
        sales: {},
        _id: "",
      },
    ]);
  };

  const handlerEditTitle = (elemento: Product) => {
    return (event: any) => {
      const newTitle = event.target.value;
      let productIndex = List.findIndex(
        (el: Product) => String(el.code) === String(elemento.code)
      );
      if (productIndex >= 0) {
        List[productIndex].title = newTitle;
        setList([...List]);
      }
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

  const handlerSubPrice = (product: any) => {
    const total = product.priceList * product.unity;
    return total.toLocaleString().replace(",", ".");
  };

  useEffect(() => {
    HandlerAddProduct();
    Calculartotal();
    HandlerAddProductWithTitle();
  }, [filter.code, , filter.title, List]);

  return (
    <Modal open={open} onClose={onClose}>
      <div className={styles.modal}>
        <h2 className={styles.titleNewSale}>Nueva Venta</h2>
        <div>
          <input
            type="text"
            placeholder="Código de producto"
            onChange={(e) => handleChangeFilter("code", e.target.value)}
            className={styles.inputAddCode}
            value={filter.code}
          />
          <input
            type="number"
            placeholder="Cantidad"
            onChange={(e) => handleChangeFilter("cant", e.target.value)}
            className={styles.inputAddCode}
            value={filter.cant}
          />
          <input
            type="number"
            placeholder="Importe"
            onChange={(e) => handleChangeFilter("importe", e.target.value)}
            className={styles.inputAddCode}
            value={filter.importe}
          />
          <input
            type="text"
            placeholder="Titulo"
            onChange={(e) => handleChangeFilter("title", e.target.value)}
            className={styles.inputAddCode}
            value={filter.title}
          />
          <p>total:${total}</p>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th>Código</th>
                <th>Título</th>
                <th>Cantidad</th>
                <th>Precio Compra</th>
                <th>Precio Venta</th>
                <th>Precio</th>
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
                        onChange={handlerEditTitle(product)}
                      />
                    ) : (
                      product.title
                    )}
                  </td>
                  <td>
                    <input
                      type="number"
                      value={product.unity}
                      onChange={handlerEditUnity(product, index)}
                      className={styles.input}
                      name="cant"
                    />
                  </td>
                  <td>
                    {product.priceCost
                      ? product.priceCost.toLocaleString().replace(",", ".")
                      : "-"}
                  </td>
                  <td>
                    {product.priceList
                      ? product.priceList.toLocaleString().replace(",", ".")
                      : "-"}
                  </td>
                  <td>{handlerSubPrice(product)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.buttonContainerSale}>
          <button onClick={handleAddGenericProduct} className={styles.button}>
            Agregar Producto
          </button>
          <button className={styles.button}>Cargar Venta</button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalComponent;
