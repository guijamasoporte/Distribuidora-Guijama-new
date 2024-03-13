import React, { useEffect, useState } from "react";
import InstanceOfAxios from "../../utils/intanceAxios";
import { Product } from "../../interfaces/interfaces";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import styles from "./home.module.css";

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response: any = await InstanceOfAxios("/products", "GET");
        setProducts(response);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();

    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const productsByCategory: { [category: string]: Product[] } = {};
  products.forEach((product) => {
    if (!productsByCategory[product.category]) {
      productsByCategory[product.category] = [];
    }
    productsByCategory[product.category].push(product);
  });

  const sortedCategories = Object.keys(productsByCategory).sort();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className={styles.productCatalog}>
      {showScrollButton && (
        <button className={styles.scrollToTopButton} onClick={scrollToTop}>
          <KeyboardDoubleArrowUpIcon />
        </button>
      )}
      <p className={styles.titleCatalogue}>Catálogo de Productos</p>
      <p className={styles.descriptionCatalogue}>
        Bienvenido a <strong>Guijama. </strong>
        Acá encontrarás una amplia selección de los mejores productos
        relacionados con tabaco, puros, accesorios y más.
        <br />
        ¡Explorá nuestros productos y encontrá todo lo que necesitas!
      </p>

      {sortedCategories.map((category) => (
        <div className={styles.listContainer} key={category}>
          <p className={styles.category}>{category}</p>
          <div className={styles.productList}>
            {productsByCategory[category].map((product) => (
              <div
                key={product.code}
                className={`${styles.product} ${
                  product.stock === 0 ? styles.disabled : ""
                }`}
              >
                <p className={styles.title}>
                  <strong>{product.title}</strong>
                </p>
                <p>Marca: {product.brand}</p>
                {product.stock === 0 && (
                  <p className={styles.stockWarning}>Artículo sin stock</p>
                )}
                <div className={styles.imageContainer}>
                  {Array.isArray(product.image) &&
                    product.image.map((imageUrl, index) => (
                      <img
                        key={index}
                        src={imageUrl}
                        alt={`${product.title}-${index}`}
                        className={styles.productImage}
                      />
                    ))}
                  <div className={styles.priceContainer}>
                    <p className={styles.priceLabel}>Precio:</p>
                    <p className={styles.priceValue}>
                      <strong>$ {product.priceList}</strong>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
