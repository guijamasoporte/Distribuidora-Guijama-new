import React, { useCallback, useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import styles from "./products.module.css";
import SearchBar from "../../components/searchBar/searchBar";
import Pagination from "../../components/pagination/pagination";
import InstanceOfAxios from "../../utils/intanceAxios";
import Swal from "sweetalert2";
import AddProductModal from "../../components/modals/modalProduct/modalAddProduct/modalAddProduct";
import EditProductModal from "../../components/modals/modalProduct/modalEditProduct/modalEditProduct";
import { GetDecodedCookie } from "../../utils/DecodedCookie";
import { Client, Product } from "../../interfaces/interfaces";
import { formatNumberWithCommas } from "../../utils/formatNumberwithCommas";
import ModalEditPrices from "../../components/modals/modalProduct/modalEditPricesProduct/modalEditPrice";
import BarcodeScanner from "../../components/scannerCode/barcodeScanner";
import ModalViewSales from "../../components/modals/modalProduct/modalViewSales/modalViewSales"; // Importa el nuevo modal

const ProductsPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModifyPriceModal, setShowModifyPriceModal] = useState(false);
  const [showSalesModal, setShowSalesModal] = useState(false); // Estado para el nuevo modal
  const [selectedProductForSales, setSelectedProductForSales] = useState<
    | (Product & { sales: { month: string; year: number; amount: number }[] })
    | null
  >(null); // Producto seleccionado para el nuevo modal
  const initialFilters: Record<keyof Product, string> = {
    code: "",
    title: "",
    category: "",
    brand: "",
    stock: "",
    priceCost: "",
    priceList: "",
    pricex10: "",
    pricex100: "",
    image: "",
    unity: "",
    generic: "",
    _id: "",
    variant: "",
  };

  const [filters, setFilters] = useState(initialFilters);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(
    parseInt(localStorage.getItem("currentPageProducts") || "1", 10)
  );
  const productsPerPage = 15;
  const [currentProducts, setCurrentProducts] = useState<Product[]>([]);
  const [productSelect, setProductSelect] = useState<Product | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [variant, setVariant] = useState<string[]>([]);
  const [openCameraReadCode, setOpenCameraReadCode] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: any = await InstanceOfAxios("/products", "GET");
        setCurrentProducts(response);

        const resCategory: any = await InstanceOfAxios(
          "/products/categories",
          "GET"
        );
        setCategories(resCategory.categories);
        setBrands(resCategory.brands);
        setVariant(resCategory.variants);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [showModal, showModalEdit, showModifyPriceModal]);

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Sí, eliminarlo!",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = GetDecodedCookie("cookieToken");
          await InstanceOfAxios(`/products/${id}`, "DELETE", undefined, token);
          Swal.fire("¡Eliminado!", "El cliente ha sido eliminado.", "success");

          setCurrentProducts(
            currentProducts.filter((product) => product._id !== id)
          );
        } catch (error) {
          console.error("Error deleting product:", error);
          Swal.fire("Error", "Hubo un error al eliminar el producto.", "error");
        }
      }
    });
  };

  const applyFilters = useCallback(
    (product: Product) => {
      return Object.entries(filters).every(([key, value]) => {
        const productValue = String(
          product[key as keyof Product]
        ).toLowerCase();
        return (
          value.toLowerCase() === "" ||
          productValue.includes(value.toLowerCase())
        );
      });
    },
    [filters]
  );

  const handleFilterChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: string | null,
    field: keyof Product
  ) => {
    setFilters({
      ...filters,
      [field]: value || "",
    });
  };

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const slicedProducts = currentProducts
    .filter(applyFilters)
    .filter(
      (product) =>
        searchTerm === "" ||
        Object.values(product).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    )
    .slice(indexOfFirstProduct, indexOfLastProduct);

  const [totals, setTotals] = useState({
    costTotal: 0,
    saleTotal: 0,
    stockTotal: 0,
  });

  useEffect(() => {
    const calculateTotals = () => {
      const filteredProducts = currentProducts
        .filter(applyFilters)
        .filter(
          (product) =>
            searchTerm === "" ||
            Object.values(product).some((value) =>
              String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );

      // Calcular el total del costo multiplicando priceCost por stock
      const costTotal = filteredProducts.reduce(
        (acc, product) => acc + product.priceCost * product.stock,
        0
      );

      // Calcular el total de venta multiplicando priceList por stock
      const saleTotal = filteredProducts.reduce(
        (acc, product) => acc + product.priceList * product.stock,
        0
      );

      // Calcular el total de stock
      const stockTotal = filteredProducts.reduce(
        (acc, product) => acc + product.stock,
        0
      );

      setTotals({
        costTotal,
        saleTotal,
        stockTotal,
      });
    };

    calculateTotals();
  }, [currentProducts, applyFilters, searchTerm]);

  useEffect(() => {
    localStorage.setItem("currentPageProducts", currentPage.toString());
  }, [currentPage]);

  return (
    <div className={styles.tableContainer}>
      <h1 className={styles.title}>Listado de productos</h1>
      <div className={styles.filters}>
        <div className={styles.autocompleteCameraIcon}>
          <Autocomplete
            className={styles.autocomplete}
            disablePortal
            id="combo-box-codigo"
            options={Array.from(
              new Set(currentProducts.map((product) => product.code))
            )}
            sx={{ width: 200 }}
            renderInput={(params) => <TextField {...params} label="Código" />}
            onChange={(event, value) =>
              handleFilterChange(event, value, "code")
            }
          />
          <button
            className={styles.cameraIconScann}
            onClick={() => setOpenCameraReadCode(true)}
          >
            <CameraAltIcon />
          </button>
        </div>
        <Autocomplete
          className={styles.autocomplete}
          disablePortal
          id="combo-box-titulo"
          options={Array.from(
            new Set(currentProducts.map((product) => product.title))
          )}
          sx={{ width: 200 }}
          renderInput={(params) => <TextField {...params} label="Título" />}
          onChange={(event, value) => handleFilterChange(event, value, "title")}
        />
        <Autocomplete
          className={styles.autocomplete}
          disablePortal
          id="combo-box-rubro"
          options={Array.from(
            new Set(currentProducts.map((product) => product.category))
          )}
          sx={{ width: 200 }}
          renderInput={(params) => <TextField {...params} label="Rubro" />}
          onChange={(event, value) =>
            handleFilterChange(event, value, "category")
          }
        />
        <Autocomplete
          className={styles.autocomplete}
          disablePortal
          id="combo-box-marca"
          options={Array.from(
            new Set(currentProducts.map((product) => product.brand))
          )}
          sx={{ width: 200 }}
          renderInput={(params) => <TextField {...params} label="Marca" />}
          onChange={(event, value) => handleFilterChange(event, value, "brand")}
        />
        <SearchBar onSearch={handleSearch} />
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.titleCode}>Código</th>
              <th className={styles.titleTable}>Título</th>
              <th>Variedad</th>
              <th>Rubro</th>
              <th>Marca</th>
              <th>Stock</th>
              <th>Costo</th>
              <th>Venta</th>
              <th>x 10 U.</th>
              <th>x 100 U.</th>
              <th>Ventas</th>
              <th>Editar</th>
              <th>Borrar</th>
            </tr>
          </thead>
          <tbody>
            {slicedProducts.map((product, index) => (
              <tr key={index}>
                <td className={styles.titleCode}>{product.code}</td>
                <td className={styles.titleTable}>{product.title}</td>
                <td>{product.variant}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>{formatNumberWithCommas(product.stock)}</td>
                <td>${formatNumberWithCommas(product.priceCost)}</td>
                <td>${formatNumberWithCommas(product.priceList)}</td>
                <td>
                  {product.pricex10
                    ? `$ ${formatNumberWithCommas(product.pricex10)}`
                    : "-"}
                </td>
                <td>
                  {product.pricex100
                    ? `$ ${formatNumberWithCommas(product.pricex100)}`
                    : "-"}
                </td>
                <td>
                  <button
                    className={styles.buttonSee}
                    onClick={() => {
                      setShowSalesModal(true);
                      setSelectedProductForSales(
                        product as Product & {
                          sales: {
                            month: string;
                            year: number;
                            amount: number;
                          }[];
                        }
                      );
                    }}
                  >
                    <SearchIcon />
                  </button>
                </td>
                <td>
                  <button
                    className={styles.buttonEdit}
                    onClick={() => {
                      setShowModalEdit(true);
                      setProductSelect(product);
                    }}
                  >
                    <EditIcon />
                  </button>
                </td>
                <td>
                  <button
                    className={styles.buttonDelete}
                    onClick={() => handleDelete(product._id)}
                  >
                    <DeleteIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <div className={styles.totalsData}>
          <p className={styles.totalCat}>
            Stock total: {formatNumberWithCommas(totals.stockTotal)}
          </p>
          <p className={styles.totalCat}>
            Total de Costo: ${formatNumberWithCommas(totals.costTotal)}
          </p>
          <p className={styles.totalCat}>
            Total de Venta: ${formatNumberWithCommas(totals.saleTotal)}
          </p>
        </div>

        <div className={styles.paginationTotalContainer}>
          <Pagination
            totalItems={currentProducts.length}
            itemsPerPage={productsPerPage}
            currentPage={currentPage}
            paginate={paginate}
          />
        </div>
      </div>
      <div className={styles.buttonsFooter}>
        <button className={styles.buttonAdd} onClick={() => setShowModal(true)}>
          Agregar nuevo producto
        </button>
        <button
          className={styles.buttonModify}
          onClick={() => setShowModifyPriceModal(true)}
        >
          Modificar precios x Rubro
        </button>
      </div>
      <AddProductModal
        open={showModal}
        handleClose={() => setShowModal(false)}
        categories={categories}
        brands={brands}
        variant={variant}
        onClose={() => {}}
        onCreate={() => {}}
      />
      {productSelect && (
        <EditProductModal
          open={showModalEdit}
          productSelect={productSelect}
          handleClose={() => setShowModalEdit(false)}
          setProductSelect={setProductSelect}
        />
      )}
      <ModalEditPrices
        open={showModifyPriceModal}
        handleClose={() => setShowModifyPriceModal(false)}
        categories={categories}
      />
      {selectedProductForSales && (
        <ModalViewSales
          open={showSalesModal}
          handleClose={() => setShowSalesModal(false)}
          product={selectedProductForSales}
        />
      )}
      <div
        className={`${styles.scannerCode} ${
          openCameraReadCode ? styles.openCameraStyle : ""
        }`}
      >
        {openCameraReadCode && (
          <BarcodeScanner
            setOpenCameraReadCode={setOpenCameraReadCode}
            setFilters={setFilters}
            filters={filters}
          />
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
