import React, { useEffect, useState } from "react";
import {
  Document,
  Text,
  Page,
  StyleSheet,
  Image,
  View,
} from "@react-pdf/renderer";

import guijama from "../../assets/guijamapdf.png";
import { Client, Product, Sales } from "../../interfaces/interfaces"; // Importa la interfaz Sale

interface SalesPdf {
  idSale: Sales;
  idClient: Client;
  name: string;
  lastName: string;
  adress: string;
  email: string;
  products: Product[];
  priceTotal: number;
  date: string;
  buys: Sales;
}

const Pdfinvoice: React.FC<{
  sales: Sales | any;
  id: number;
  saleClient: SalesPdf | any;
}> = ({ sales, id, saleClient }) => {
  const styles = StyleSheet.create({
    page: {
      display: "flex",
      padding: "1cm",
    },
    Header: {
      display: "flex",
      flexDirection: "row",
      marginBottom: 40,
      paddingBottom: 30,
      borderBottom: "3px solid black",
    },
    HeaderPresupuesto: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      marginHorizontal: 20,
      fontSize: 15,
    },

    infoClientContain: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 40,
    },
    productsContain: {},

    productsContainTable: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      textAlign: "center",
      border: "1px solid black",
    },
    productsContainTitle: {
      padding: 3,
      borderRight: "1px solid black",
      flex: 1,
    },
    productsContainTotal: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      textAlign: "center",
      border: "1px solid black",
    },

    productsContainTotaltext: {
      flex: 1,
      padding: 3,
      borderRight: "1px solid black",
    },
    strong: {
      fontSize: 20,
    },
    image: {
      width: "5cm",
      marginBottom: 10,
    },
  });

  const [dataInvoice, setDataInvoice] = useState<SalesPdf | null | any | Sales>(
    null
  );

  function obtenerFechaSinHora(fechaConHora: any) {
    const fecha = new Date(fechaConHora);
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1; // ¡Recuerda que los meses van de 0 a 11!
    const año = fecha.getFullYear();

    // Formatea el día y el mes para que tengan dos dígitos
    const diaFormateado = dia < 10 ? "0" + dia : dia;
    const mesFormateado = mes < 10 ? "0" + mes : mes;

    return `${diaFormateado}-${mesFormateado}-${año}`;
  }

  function formatNumberWithCommas(number: number) {
    let numberString = String(number);
    let parts = [];
    while (numberString.length > 3) {
      parts.unshift(numberString.slice(-3));
      numberString = numberString.slice(0, -3);
    }
    parts.unshift(numberString);
    return parts.join(".");
  }
  console.log(sales);

  useEffect(() => {
    if (sales === "") {
      setDataInvoice({
        idSale: saleClient.buys[id].idSale,
        idClient: saleClient.idClient,
        name: saleClient.name,
        lastName: saleClient.lastName,
        adress: saleClient.adress,
        email: saleClient.email,
        products: saleClient.buys[id].products,
        priceTotal: saleClient.buys[id].priceTotal,
        date: saleClient.buys[id].date,
      });
    } else {
      setDataInvoice({
        idSale: sales.idSale ? sales.idSale : "",
        idClient: sales.client.idClient,
        name: sales.client.name,
        lastName: sales.client.lastName,
        adress: sales.client.adress,
        email: sales.client.email,
        products: sales.products,
        priceTotal: sales.priceTotal,
        date: sales.date,
      });
    }
  }, [sales, saleClient, id]);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.Header}>
          <View>
            <Image src={guijama} style={styles.image} />
            <Text style={{ fontSize: 15 }}>
              Tel: 221 591-6564 / 221 673-2423
            </Text>
          </View>

          <View>
            <Text style={styles.strong}>PRESUPUESTO</Text>
            <Text>Documento no valido como factura</Text>
            <Text>N° {dataInvoice?.idSale}</Text>
          </View>
        </View>

        <View style={styles.infoClientContain}>
          <View>
            <Text>Cliente N°: {dataInvoice?.idClient}</Text>
            <Text>
              Nombre: {dataInvoice?.name} {dataInvoice?.lastName}
            </Text>
          </View>

          <View>
            <Text>Direccion: {dataInvoice?.address}</Text>
            <Text>Fecha: {obtenerFechaSinHora(dataInvoice?.date || "")}</Text>
          </View>
        </View>

        <View style={styles.productsContain}>
          <View style={styles.productsContainTable}>
            <Text style={styles.productsContainTitle}>Cantidad</Text>
            <Text style={styles.productsContainTitle}>Detalle</Text>
            <Text style={styles.productsContainTitle}>Precio unitario</Text>
            <Text style={styles.productsContainTitle}>Total</Text>
          </View>

          {dataInvoice?.products.map((product: any, index: number) => (
            <View key={index} style={styles.productsContainTable}>
              <Text style={styles.productsContainTitle}>{product.unity}</Text>
              <Text style={styles.productsContainTitle}>{product.title}</Text>
              <Text style={styles.productsContainTitle}>
                ${formatNumberWithCommas(product.priceList)}
              </Text>
              <Text style={styles.productsContainTitle}>
                ${formatNumberWithCommas(product.priceList * product.unity)}
              </Text>
            </View>
          ))}

          <View style={styles.productsContainTotal}>
            <Text style={styles.productsContainTitle}></Text>
            <Text style={styles.productsContainTitle}></Text>
            <Text style={styles.productsContainTitle}>Total:</Text>
            <Text style={styles.productsContainTotaltext}>
              ${formatNumberWithCommas(dataInvoice?.priceTotal || 0)}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
export default Pdfinvoice;

//  <PDFViewer>
//  <PDF />
// </PDFViewer>

/* <PDFDownloadLink document={<PDF />} fileName="myfirstpdf.pdf">
{({ loading, url, error, blob }) =>
loading ? (
  <button>Loading Document ...</button>
) : (
  <button>Download now!</button>
)
}
</PDFDownloadLink> */
