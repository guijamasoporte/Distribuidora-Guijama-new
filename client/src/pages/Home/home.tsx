import React, { useEffect, useState } from "react";
import InstanceOfAxios from "../../utils/intanceAxios";
import { Product } from "../../interfaces/interfaces";
import styles from "./home.module.css";

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

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
  }, []);

  return (
    <div className={styles.productCatalog}>
      <h2>Productos Destacados</h2>
      <div className={styles.productList}>
        {products.map((product) => (
          <div key={product.code} className={styles.product}>
            <p>Titulo: {product.title}</p>
            <p>Stock: {product.stock}</p>
            <p>Precio: {product.priceList}</p>
            <p>Categoría: {product.category}</p>
            <p>Marca: {product.brand}</p>
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
