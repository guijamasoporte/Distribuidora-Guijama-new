import React, { ReactNode } from "react";
import styles from "./pdfInvoice.module.css";
import {
  Document,
  Text,
  Page,
  StyleSheet,
  Image,
  View,
} from "@react-pdf/renderer";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Product, Sales } from "../../../interfaces/interfaces"; // Importa la interfaz Sale

interface SalesPdf {
  [x: string]: any;
  //   products: Product[];
  date: ReactNode;
  client: any;
  // sales:Sales
}

const Pdfinvoice: React.FC<{ sales: SalesPdf }> = ({ sales }) => {
  console.log(sales);

  function obtenerFechaSinHora(fechaConHora: any) {
    const fecha = new Date(fechaConHora);
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1; // ¡Recuerda que los meses van de 0 a 11!
    const año = fecha.getFullYear();

    // Formatea el día y el mes para que tengan dos dígitos
    const diaFormateado = dia < 10 ? "0" + dia : dia;
    const mesFormateado = mes < 10 ? "0" + mes : mes;

    return `${año}-${mesFormateado}-${diaFormateado}`;
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

  const styles = StyleSheet.create({
    page: {
      display: "flex",
      padding: "1cm",
    },
    Header: {
      display: "flex",
      flexDirection: "row",
      marginBottom: 40,
      paddingBottom: "3rem",
      borderBottom: "3px solid black",
    },
    HeaderPresupuesto: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      marginHorizontal: 20,
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
  });

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.Header}>
          <View style={styles.HeaderPresupuesto}>
            <Text style={{ fontSize: 15 }}>
              Tel:221 591-6564 / 221 673-2423
            </Text>
          </View>

          <View style={styles.HeaderPresupuesto}>
            <Text>PRESUPUESTO</Text>
            <Text>Documento NO valido como factura</Text>
            <Text>N° {sales.idSale}</Text>
          </View>
        </View>

        <View style={styles.infoClientContain}>
          <View>
            <Text>Datos del Cliente</Text>
            <Text>
              Nombre: {sales.client.name + " " + sales.client.lastName}
            </Text>
            <Text>Direccion: {sales.client.adress}</Text>
          </View>

          <View>
            <Text>Email: {sales.client.email}</Text>
            <Text>Fecha: {obtenerFechaSinHora(sales.date)}</Text>
          </View>
        </View>

        <View style={styles.productsContain}>
          <View style={styles.productsContainTable}>
            <Text style={styles.productsContainTitle}>Cantidad</Text>
            <Text style={styles.productsContainTitle}>Detalle</Text>
            <Text style={styles.productsContainTitle}>Precio unitario</Text>
            <Text style={styles.productsContainTitle}>Total</Text>
          </View>

          {sales.products.map((el: Product) => (
            <View style={styles.productsContainTable}>
              <Text style={styles.productsContainTitle}>{el.unity}</Text>
              <Text style={styles.productsContainTitle}>{el.title}</Text>
              <Text style={styles.productsContainTitle}>
                ${formatNumberWithCommas(el.priceList)}
              </Text>
              <Text style={styles.productsContainTitle}>
               ${formatNumberWithCommas(el.priceList * el.unity)}
              </Text>
            </View>
          ))}
          <View style={styles.productsContainTotal}>
            <Text style={styles.productsContainTitle}> </Text>
            <Text style={styles.productsContainTitle}> </Text>
            <Text style={styles.productsContainTitle}> </Text>

            <Text style={styles.productsContainTotaltext}>
              ${formatNumberWithCommas(sales.priceTotal)}
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

{
  /* <PDFDownloadLink document={<PDF />} fileName="myfirstpdf.pdf">
{({ loading, url, error, blob }) =>
loading ? (
  <button>Loading Document ...</button>
) : (
  <button>Download now!</button>
)
}
</PDFDownloadLink> */
}
