import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Document,
  Page,
  StyleSheet,
  Image,
  View,
  Text,
} from "@react-pdf/renderer";

import guijama from "../../assets/guijamapdf.png";
import { Client, Sales } from "../../interfaces/interfaces";
import { formatNumberWithCommas } from "../../utils/formatNumberwithCommas";

interface InvoiceDetail {
  idSale: string;
  idClient: string;
  name: string;
  lastName: string;
  address: string;
  products: any[];
  priceTotal: number;
  date: string;
}

const Pdfinvoice: React.FC<{
  sales: Sales | string;
  id: number;
  saleClient: Client | string;
  setLoadingpdf: Dispatch<SetStateAction<boolean>>;
  loadingpdf: boolean;
}> = ({ sales, id, saleClient, setLoadingpdf, loadingpdf }) => {
  function obtenerFechaSinHora(fechaConHora: string) {
    const fecha = new Date(fechaConHora);
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1; // ¡Recuerda que los meses van de 0 a 11!
    const año = fecha.getFullYear();

    // Formatea el día y el mes para que tengan dos dígitos
    const diaFormateado = dia < 10 ? "0" + dia : dia;
    const mesFormateado = mes < 10 ? "0" + mes : mes;

    return `${diaFormateado}-${mesFormateado}-${año}`;
  }

  const styles = StyleSheet.create({
    page: {
      display: "flex",
      padding: "1cm",
    },
    header: {
      display: "flex",
      flexDirection: "row",
      marginBottom: 40,
      paddingBottom: 30,
      borderBottom: "3px solid black",
    },
    headerText: {
      fontSize: 15,
    },
    strong: {
      fontSize: 20,
    },
    image: {
      width: "5cm",
      marginBottom: 10,
    },
    section: {
      marginBottom: 10,
    },
    title: {
      fontSize: 18,
      marginBottom: 5,
    },
    content: {
      fontSize: 12,
    },
  });

  const [dataInvoice, setDataInvoice] = useState<InvoiceDetail | null>(null);

  useEffect(() => {
    if (sales !== "" && typeof sales !== "string") {
      setDataInvoice({
        idSale: sales.idSale,
        idClient: sales.client.idClient,
        name: sales.client.name,
        lastName: sales.client.lastName,
        address: sales.client.adress,
        products: sales.products,
        priceTotal: sales.priceTotal,
        date: sales.date,
      });
    } else if (saleClient !== "" && typeof saleClient !== "string") {
      setDataInvoice({
        idSale: saleClient.buys[id].idSale,
        idClient: saleClient.idClient,
        name: saleClient.name,
        lastName: saleClient.lastName,
        address: saleClient.adress,
        products: saleClient.buys[id].products,
        priceTotal: saleClient.buys[id].priceTotal,
        date: saleClient.buys[id].date,
      });
    } else {
      setDataInvoice(null);
    }
  }, [sales, saleClient, id]);

  const renderProductRows = () => {
    if (!dataInvoice) return null;

    return dataInvoice.products.map((product, index) => (
      <View key={index} style={styles.section}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.content}>
          Cantidad: {product.quantity} Precio unitario: ${product.price}
        </Text>
      </View>
    ));
  };

  return (
    <>
      {dataInvoice && (
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.header}>
              <View>
                <Image src={guijama} style={styles.image} />
                <Text style={styles.headerText}>
                  Tel: 221 591-6564 / 221 673-2423
                </Text>
              </View>

              <View>
                <Text style={styles.strong}>PRESUPUESTO</Text>
                <Text>Documento no válido como factura</Text>
                <Text>N° {dataInvoice.idSale}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.title}>Detalles del Cliente:</Text>
              <Text style={styles.content}>
                Cliente N°: {dataInvoice.idClient}
              </Text>
              <Text style={styles.content}>
                Nombre: {dataInvoice.name} {dataInvoice.lastName}
              </Text>
              <Text style={styles.content}>
                Dirección: {dataInvoice.address}
              </Text>
              <Text style={styles.content}>
                Fecha: {obtenerFechaSinHora(dataInvoice.date)}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.title}>Productos:</Text>
              {renderProductRows()}
            </View>

            <View style={styles.section}>
              <Text style={styles.title}>Total:</Text>
              <Text style={styles.content}>
                Total: ${formatNumberWithCommas(dataInvoice.priceTotal || 0)}
              </Text>
            </View>
          </Page>
        </Document>
      )}
    </>
  );
};

export default Pdfinvoice;
