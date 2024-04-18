import React, { useEffect, useState } from "react";
import {
  Document,
  Page,
  StyleSheet,
  Image,
  View,
  Text,
} from "@react-pdf/renderer";

// import guijama from "../../assets/guijamapdf.png";
import guijama from "../../assets/guijamaLogo.png";
import guijamaFondo from "../../assets/fondoInvoice.png";
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
}> = ({ sales, id, saleClient }) => {
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
    documentImage: {
      position: "absolute",
      width: "100%",
      height: "auto",
      left: "5%",
      zIndex: -1,
      opacity: 0.12,
    },
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
      flex: 1,
      padding: 3,
      borderLeft: "1px solid black",
      borderRight: "1px solid black",
    },

    productsContainText: {
      flex: 1,
      borderLeft: "1px solid black",
      borderRight: "1px solid black",
      fontSize: 15,
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
      borderLeft: "1px solid black",
      borderRight: "1px solid black",
      padding: 3,
    },

    strong: {
      fontSize: 20,
    },
    image: {
      width: "5cm",
      marginBottom: 10,
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

  return (
    <>
      {dataInvoice && (
        <Document>
          <Page size="A4" style={styles.page}>
            <Image src={guijamaFondo} style={styles.documentImage} />
            <View style={styles.Header}>
              <View style={styles.HeaderPresupuesto}>
                <Image src={guijama} style={styles.image} />
                <Text style={{ fontSize: 15 }}>
                  Tel: 221 591-6564 / 221 673-2423
                </Text>
                <Text style={{ fontSize: 15 }}>221 615-5073</Text>
              </View>

              <View style={styles.HeaderPresupuesto}>
                <Text style={styles.strong}>PRESUPUESTO X</Text>
                <Text>Documento no válido como factura</Text>
                <Text>N° {dataInvoice.idSale}</Text>
              </View>
            </View>
            <View style={styles.infoClientContain}>
              <View>
                <Text>Cliente N°: {dataInvoice.idClient}</Text>
                <Text>
                  Nombre: {dataInvoice.name + " " + dataInvoice.lastName}
                </Text>
              </View>

              <View>
                <Text>Direccion: {dataInvoice.address}</Text>

                <Text>Fecha: {obtenerFechaSinHora(dataInvoice.date)}</Text>
              </View>
            </View>

            <View style={styles.productsContain}>
              <View style={styles.productsContainTable}>
                <Text style={styles.productsContainTitle}>Cantidad</Text>
                <Text style={styles.productsContainTitle}>Detalle</Text>
                <Text style={styles.productsContainTitle}>Precio unitario</Text>
                <Text style={styles.productsContainTitle}>Total</Text>
              </View>

              <View>
                {dataInvoice.products.map((el: any) => (
                  <View style={styles.productsContainTable}>
                    <Text style={styles.productsContainText}>{el.unity}</Text>
                    <Text style={styles.productsContainText}>{el.title}</Text>
                    <Text style={styles.productsContainText}>
                      ${formatNumberWithCommas(el.priceList)}
                    </Text>
                    <Text style={styles.productsContainText}>
                      ${formatNumberWithCommas(el.priceList * el.unity)}
                    </Text>
                  </View>
                ))}

                <View style={styles.productsContainTotal}>
                  <Text style={styles.productsContainTotaltext}> </Text>
                  <Text style={styles.productsContainTotaltext}> </Text>
                  <Text style={styles.productsContainTotaltext}> </Text>
                  <Text style={styles.productsContainTotaltext}>
                    Total: ${formatNumberWithCommas(dataInvoice.priceTotal)}
                  </Text>
                </View>
              </View>
            </View>
          </Page>
        </Document>
      )}
    </>
  );
};

export default Pdfinvoice;
