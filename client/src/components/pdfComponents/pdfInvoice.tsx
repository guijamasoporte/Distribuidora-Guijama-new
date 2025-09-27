import React, { useEffect, useState } from "react";
import {
  Document,
  Page,
  StyleSheet,
  Image,
  View,
  Text,
} from "@react-pdf/renderer";

import guijama from "../../assets/guijamaLogo.png";
import guijamaFondo from "../../assets/fondoInvoice.png";
import { Client, Sales, Supplier } from "../../interfaces/interfaces";
import { formatNumberWithCommas } from "../../utils/formatNumberwithCommas";

interface InvoiceDetail {
  idSale: string;
  idClient?: string;
  idSupplier?: string;
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
  saleClient: Client | Supplier | string;
}> = ({ sales, id, saleClient }) => {
  function obtenerFechaSinHora(fechaConHora: string) {
    const fecha = new Date(fechaConHora);
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1;
    const año = fecha.getFullYear();

    const diaFormateado = dia < 10 ? "0" + dia : dia;
    const mesFormateado = mes < 10 ? "0" + mes : mes;

    return `${diaFormateado}-${mesFormateado}-${año}`;
  }

  const styles = StyleSheet.create({
    documentImage: {
      zIndex: -1,
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      opacity: 0.12,
      objectFit: "cover",
    },
    page: {
      display: "flex",
      padding: "1cm",
    },
    Header: {
      display: "flex",
      flexDirection: "row",
      paddingBottom: 20,
      justifyContent: "center",
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
    },
    productsContainTitle: {
      padding: 3,
      border: "1px solid black",
      borderTop: "2px solid black",
    },
    productsContainText: {
      border: "1px solid black",
      fontSize: 10,
      paddingVertical: 5,
    },
    productsContainTotal: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      textAlign: "center",
      border: "1px solid black",
    },
    productsContainTotaltext: {
      padding: 10,
    },
    strong: {
      fontSize: 20,
    },
    image: {
      width: "5cm",
      marginBottom: 10,
    },
    containSize: {
      flex: 1,
    },
    sizePrices: {
      width: 100,
    },
  });

  const [dataInvoice, setDataInvoice] = useState<InvoiceDetail | null>(null);

  useEffect(() => {
    if (sales !== "" && typeof sales !== "string") {
      // Caso 1: Datos desde Sales
      setDataInvoice({
        idSale: sales.idSale,
        idClient: sales.client?.idClient || "N/A",
        idSupplier: sales.client?.idSupplier || sales.supplier?.idSupplier, // Ajusta según tu estructura real
        name: sales.client?.name || "",
        lastName: sales.client?.lastName || "",
        address: sales.client?.adress || "",
        products: sales.products || [],
        priceTotal: sales.priceTotal || 0,
        date: sales.date || "",
      });
    } else if (
      saleClient !== "" &&
      typeof saleClient !== "string" &&
      saleClient.buys &&
      saleClient.buys[id]
    ) {
      // Caso 2: Datos desde Client (historial de compras)
      const compra = saleClient.buys[id];
      setDataInvoice({
        idSale: compra.idSale,
        idClient: "idClient" in saleClient ? saleClient.idClient : "N/A",
        idSupplier:
          compra.idSupplier ||
          ("idSupplier" in saleClient ? saleClient.idSupplier : undefined), // Ajusta según tu estructura
        name: saleClient.name || "",
        lastName: saleClient.lastName || "",
        address: saleClient.adress || "",
        products: compra.products || [],
        priceTotal: compra.priceTotal || 0,
        date: compra.date || "",
      });
    } else {
      setDataInvoice(null);
    }
  }, [sales, saleClient, id]);

  // Si no hay datos, no renderizar nada
  if (!dataInvoice) {
    return null;
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.Header}>
          <Image src={guijamaFondo} style={styles.documentImage} />
          <View style={styles.HeaderPresupuesto}>
            <Image src={guijama} style={styles.image} />
            <Text style={{ fontSize: 15 }}>
              Tel: 221 591-6564 / 221 673-2423
            </Text>
            <Text style={{ fontSize: 15 }}>221 615-5073</Text>
          </View>
        </View>

        <View style={styles.infoClientContain}>
          <Image src={guijamaFondo} style={styles.documentImage} />
          <View>
            <Text>Cliente N°: {dataInvoice.idClient}</Text>
            {dataInvoice.idSupplier && (
              <Text>Proveedor N°: {dataInvoice.idSupplier}</Text>
            )}
            <Text>Nombre: {dataInvoice.name + " " + dataInvoice.lastName}</Text>
            <Text>Direccion: {dataInvoice.address}</Text>
            <Text>Fecha: {obtenerFechaSinHora(dataInvoice.date)}</Text>
          </View>

          <View style={styles.HeaderPresupuesto}>
            <Text style={styles.strong}>PRESUPUESTO X</Text>
            <Text>Documento no válido como factura</Text>
            <Text>N° {dataInvoice.idSale}</Text>
          </View>
        </View>

        <View style={styles.productsContain}>
          <View style={styles.productsContainTable}>
            <Image src={guijamaFondo} style={styles.documentImage} />
            <Text style={[styles.productsContainTitle, styles.sizePrices]}>
              Cantidad
            </Text>
            <Text style={[styles.productsContainTitle, styles.containSize]}>
              Detalle
            </Text>
            <Text style={[styles.productsContainTitle, styles.sizePrices]}>
              Precio U.
            </Text>
            <Text style={[styles.productsContainTitle, styles.sizePrices]}>
              Total
            </Text>
          </View>

          <View>
            {dataInvoice.products.map((el: any, index: number) => (
              <View key={index} style={styles.productsContainTable}>
                <Image src={guijamaFondo} style={styles.documentImage} />
                <Text style={[styles.productsContainText, styles.sizePrices]}>
                  {el.unity}
                </Text>
                <Text style={[styles.productsContainText, styles.containSize]}>
                  {el.title}
                </Text>
                <Text style={[styles.productsContainText, styles.sizePrices]}>
                  ${formatNumberWithCommas(el.priceList)}
                </Text>
                <Text style={[styles.productsContainText, styles.sizePrices]}>
                  ${formatNumberWithCommas(el.priceList * el.unity)}
                </Text>
              </View>
            ))}

            <View style={styles.productsContainTotal}>
              <Image src={guijamaFondo} style={styles.documentImage} />
              <Text
                style={[styles.productsContainTotaltext, styles.containSize]}
              >
                {" "}
              </Text>
              <Text
                style={[styles.productsContainTotaltext, styles.containSize]}
              >
                {" "}
              </Text>
              <Text
                style={[styles.productsContainTotaltext, styles.sizePrices]}
              >
                Total:
              </Text>
              <Text style={styles.productsContainTotaltext}>
                ${formatNumberWithCommas(dataInvoice.priceTotal)}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default Pdfinvoice;
