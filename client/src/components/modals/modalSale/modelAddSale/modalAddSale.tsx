import React, { useEffect, useState } from "react";
import { Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./modalAddSale.module.css";
import InstanceOfAxios from "../../../../utils/intanceAxios";

interface Client {
  idClient: string;
  name: string;
  lastName: string;
  phone: string;
  email: string;
  adress: string;
  buys: [];
}

interface Dues {
  payd: number;
  cant: number;
}

interface ProductData {
  client: Client;
  product: object;
  date: string;
  code: string;
  name: string;
  quantity: number;
  price: number;
  title: string;
  priceList: number;
  priceCost: number;
  dues: Dues;
  invoice: string;
  state: boolean;
  priceTotal: number;
  generic:boolean
}

interface ApiError {
  message: string;
}

type ApiResponse = ProductData | ApiError;

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onAddProduct: (productData: ProductData) => void;
}
interface Filters {
  code: string;
  cant: number;
  importe: number;
}

const ModalComponent: React.FC<ModalProps> = ({ open, onClose }) => {
  const [productTitle, setProductTitle] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [productQuantity, setProductQuantity] = useState(0);
  const [productPriceList, setProductPriceList] = useState(0);
  const [productPriceCost, setProductPriceCost] = useState(0);
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  // new code
  const [List, setList] = useState<ProductData[]>([]);
  const [filter, setFilter] = useState<Filters>({
    code: "",
    cant: 1,
    importe: 1,
  });
  const [dataProducts, setDataProducts] = useState<ProductData[]>([]);
  const [dataClients, setDataClients] = useState<Client[]>([]);

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

  useEffect(() => {
    const totalPrice = productQuantity * productPriceList;
    setCalculatedPrice(totalPrice);
  }, [productQuantity, productPriceList]);

  const HandlerFacturacion = () => {
    try {
      let filteredData = dataProducts.filter(
        (el) => String(el.code) === String(filter.code)
      );

      if (filteredData.length > 0) {
        filteredData = filteredData.map((item) => ({
          ...item,
          unity: filter.cant,
        }));

        let productIndex = List.findIndex(
          (el) => String(el.code) === String(filteredData[0].code)
        );

        if (productIndex >= 0) {
          List[productIndex].quantity =
            Number(List[productIndex].quantity) + Number(filter.cant);
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

  useEffect(() => {
    HandlerFacturacion();
  }, [filter.code]);

  const handleAddGenericProduct = () => {
    // setList([
    //   ...List,
    //   {
    //     code: "",
    //     title: "Producto Generico",
    //     priceCost: 0,
    //     priceList: filter.importe,
    //     quantity: filter.cant,
    //     generic: true,
    //     client: undefined,
    //     product: undefined,
    //     date: "",
    //     name: "",
    //     price: 0,
    //     dues: undefined,
    //     invoice: "",
    //     state: false,
    //     priceTotal: 0
    //   },
    // ]);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className={styles.modal}>
        <h2 className={styles.titleNewSale}>Nueva Venta</h2>
        <div>
          <input
            type="number"
            placeholder="Código de producto"
            onChange={(e) => handleChangeFilter("code", e.target.value)}
            className={styles.inputAddCode}
          />
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
              {List.map((product, index) => (
                <tr key={index}>
                  <td>{product.code}</td>
                  <td>{product.title}</td>
                  <td>
                    <input
                      type="number"
                      value={product.quantity}
                      onChange={(e) =>
                        setProductQuantity(parseInt(e.target.value))
                      }
                      className={styles.input}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={product.priceCost}
                      onChange={(e) =>
                        setProductPriceCost(parseFloat(e.target.value))
                      }
                      className={styles.input}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={product.priceList}
                      onChange={(e) =>
                        setProductPriceList(parseFloat(e.target.value))
                      }
                      className={styles.input}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={calculatedPrice}
                      readOnly
                      className={styles.input}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.buttonContainerSale}>
          <button onClick={handleAddGenericProduct} className={styles.button}>
            Agregar Producto
          </button>
          {/* <button onClick={handleFinishSale} className={styles.button}>
            Cargar Venta
          </button> */}
        </div>
      </div>
    </Modal>
  );
};

export default ModalComponent;
