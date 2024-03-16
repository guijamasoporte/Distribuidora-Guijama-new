import React, { useEffect, useState } from "react";
import InstanceOfAxios from "../../utils/intanceAxios";
import { Product } from "../../interfaces/interfaces";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import styles from "./home.module.css";

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [productsByCategory, setProductsByCategory] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response: any = await InstanceOfAxios("/products", "GET");
        if (Array.isArray(response)) {
          setProducts(response);
        } else {
          console.error("Error: Response is not an array:", response);
        }
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

  
  useEffect(() => {
    const productsByCategory: { category: string, products: Product[] }[] = [];
  
    products.forEach((product) => {
      const existingCategoryIndex = productsByCategory.findIndex(categoryObj => categoryObj.category === product.category);
      if (existingCategoryIndex === -1) {
        productsByCategory.push({ category: product.category, products: [product] });
      } else {
        productsByCategory[existingCategoryIndex].products.push(product);
      }
    });
  
    setProductsByCategory(productsByCategory);
  }, [products]);

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

      {productsByCategory.map((categoryObj) => (
        <div className={styles.listContainer} key={categoryObj.category}>
          <p className={styles.category}>{categoryObj.category}</p>
          <div className={styles.productList}>
            {categoryObj.products.map((el: Product) => (
              <div
                key={el.code}
                className={`${styles.product} ${
                  el.stock === 0 ? styles.disabled : ""
                }`}
              >
                <p className={styles.title}>
                  <strong>{el.title}</strong>
                </p>
                <p>Marca: {el.brand}</p>
                {el.stock === 0 && (
                  <p className={styles.stockWarning}>Artículo sin stock</p>
                )}
                <div className={styles.imageContainer}>
                  {Array.isArray(el.image) &&
                    el.image.map((imageUrl, index) => (
                      <img
                        key={index}
                        src={imageUrl}
                        alt={`${el.title}-${index}`}
                        className={styles.productImage}
                      />
                    ))}
                  <div className={styles.priceContainer}>
                    <p className={styles.priceLabel}>Precio:</p>
                    <p className={styles.priceValue}>
                      <strong>$ {el.priceList}</strong>
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
