import React, { useRef, useState, useEffect } from "react";
import Quagga from "quagga";
import Webcam from "react-webcam";
import { Product } from "../../interfaces/interfaces";

interface BarcodeScannerProps {
  setOpenCameraReadCode: React.Dispatch<React.SetStateAction<boolean>>;
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  filters: Record<keyof Product, string>;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  setOpenCameraReadCode,
  setFilters,
  filters,
}) => {
  const webcamRef = useRef<Webcam>(null);
  const [scannedBarcode, setScannedBarcode] = useState<string>("");

  useEffect(() => {
    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: webcamRef.current!.video as HTMLElement, // Utilizamos el elemento de video de react-webcam como destino
          constraints: {
            facingMode: "environment", // Usa la cámara trasera del dispositivo
          },
        },
        decoder: {
          readers: ["ean_reader"], // Tipo de códigos de barras a leer (puedes agregar más según tus necesidades)
        },
      },
      (err: any) => {
        if (err) {
          console.error("Error al inicializar Quagga:", err);
          return;
        }
        Quagga.start();
      }
    );

    Quagga.onDetected((data: any) => {
      const barcode = data?.codeResult?.code;
      if (barcode) {
        console.log("Código de barras detectado:", barcode);
        setScannedBarcode(barcode);
        setOpenCameraReadCode(true);
        setFilters({ ...filters, code: barcode });
        Quagga.stop();
        setOpenCameraReadCode(false);
        setScannedBarcode("");
      }
    });

    return () => {
      Quagga.stop();
    };
  }, [setOpenCameraReadCode]);

  useEffect(() => {
    // setFilters({ ...filters, code: scannedBarcode });
  }, [scannedBarcode]);

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        style={{ width: "100%" }}
        screenshotFormat="image/jpeg"
        onUserMedia={(err: MediaStream) =>
          console.error("Error al acceder a la cámara:", err)
        }
      />
      {scannedBarcode && (
        <p>Último código de barras escaneado: {scannedBarcode}</p>
      )}
    </div>
  );
};

export default BarcodeScanner;
