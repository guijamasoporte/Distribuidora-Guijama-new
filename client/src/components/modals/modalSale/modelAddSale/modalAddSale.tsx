import React, { useEffect, useState } from "react";
import { Modal, TextField } from "@mui/material";
import styles from "./modalAddSale.module.css";
import InstanceOfAxios from "../../../../utils/intanceAxios";

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
  onAddProduct: (productData: {
    code: string;
    name: string;
    quantity: number;
    price: number;
    title: string;
    priceList: number;
    priceCost: number;
  }) => void;
}

const ModalComponent: React.FC<ModalProps> = ({
  open,
  onClose,
  onAddProduct,
}) => {
  const [productCode, setProductCode] = useState("");
  const [productName, setProductName] = useState("");
  const [productQuantity, setProductQuantity] = useState(0);
  const [productPrice, setProductPrice] = useState(0);

  useEffect(() => {
    if (open && productCode) {
      const fetchData = async () => {
        try {
          // Realizar la solicitud HTTP y obtener la respuesta
          const response = await InstanceOfAxios<ApiResponse>(
            `/products/${productCode}`,
            "GET"
          );

          // Verificar si la respuesta es de tipo ProductData
          if ("title" in response && "priceList" in response) {
            const { title, priceList } = response as ProductData;
            setProductName(title);
            setProductPrice(priceList);
          } else {
            console.error("Respuesta de API no válida:", response);
          }
        } catch (error) {
          console.error("Error al obtener los datos del producto:", error);
        }
      };
      fetchData();
    }
  }, [open, productCode]);

  const handleAddProduct = () => {
    onAddProduct({
      code: productCode,
      name: productName,
      quantity: productQuantity,
      price: productPrice,
      title: "",
      priceList: 0,
      priceCost: 0,
    });

    setProductCode("");
    setProductName("");
    setProductQuantity(0);
    setProductPrice(0);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className={styles.modal}>
        <h2>Productos Escaneados</h2>
        <table className={styles.productTable}>
          <thead>
            <tr>
              <th>Código de Barras</th>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  type="number"
                  value={productCode}
                  onChange={(e) => setProductCode(e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={productQuantity}
                  onChange={(e) => setProductQuantity(e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <button onClick={handleAddProduct}>Agregar Producto</button>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </Modal>
  );
};

export default ModalComponent;
