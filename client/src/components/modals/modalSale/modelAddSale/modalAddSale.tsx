import React, { useEffect, useState } from "react";
import { Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./modalAddSale.module.css";
import InstanceOfAxios from "../../../../utils/intanceAxios";
import { log } from "console";

interface Client {
  name: string;
  lastName: string;
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

const ModalComponent: React.FC<ModalProps> = ({
  open,
  onClose,
  onAddProduct,
}) => {
  const [productList, setProductList] = useState<ProductData[]>([]);
  const [productCode, setProductCode] = useState("");
  const [productTitle, setProductTitle] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [productQuantity, setProductQuantity] = useState(0);
  const [productPriceList, setProductPriceList] = useState(0);
  const [productPriceCost, setProductPriceCost] = useState(0);
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  useEffect(() => {
    if (open && productCode) {
      const fetchData = async () => {
        try {
          const response = await InstanceOfAxios<ApiResponse[] | ApiError>(
            `/products/`,
            "GET"
          );
          if ("message" in response) {
            console.error(
              "Error al obtener los datos del producto:",
              response.message
            );
            return;
          }

          const products = response as ProductData[];
          const product = products.find((item) => item.code === productCode);

          if (product) {
            setProductQuantity(product.quantity);
            setProductPrice(product.price);
            setProductTitle(product.title);
            setProductPriceList(product.priceList);
            setProductPriceCost(product.priceCost);
          } else {
            setProductQuantity(0);
            setProductPrice(0);
            setProductTitle("");
            setProductPriceList(0);
            setProductPriceCost(0);
          }
          console.log(product);
        } catch (error) {
          console.error("Error al obtener los datos del producto:", error);
        }
      };
      fetchData();
    }
  }, [open, productCode]);

  useEffect(() => {
    const totalPrice = productQuantity * productPriceList;
    setCalculatedPrice(totalPrice);
  }, [productQuantity, productPriceList]);

  const handleAddProduct = () => {
    const newProductData: ProductData = {
      client: {
        name: "",
        lastName: "",
      },
      product: {},
      date: "",
      code: productCode,
      name: "",
      quantity: productQuantity,
      price: productPrice,
      title: productTitle,
      priceList: productPriceList,
      priceCost: productPriceCost,
      dues: {
        payd: 0,
        cant: 0,
      },
      invoice: "",
      state: false,
      priceTotal: 0,
    };

    setProductList([...productList, newProductData]);
    setProductCode("");
    setProductQuantity(0);
    setProductPrice(0);
  };

  const handleFinishSale = () => {
    productList.forEach((product) => onAddProduct(product));
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className={styles.modal}>
        <h2 className={styles.titleNewSale}>Nueva Venta</h2>
        <div>
          <input
            type="number"
            placeholder="Código de producto"
            onChange={(e) => setProductCode(e.target.value)}
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
              {productList.map((product, index) => (
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
          <button onClick={handleAddProduct} className={styles.button}>
            Agregar Producto
          </button>
          <button onClick={handleFinishSale} className={styles.button}>
            Cargar Venta
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalComponent;
