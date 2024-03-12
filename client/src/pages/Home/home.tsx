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

  const productsByCategory: { [category: string]: Product[] } = {};
  products.forEach((product) => {
    if (!productsByCategory[product.category]) {
      productsByCategory[product.category] = [];
    }
    productsByCategory[product.category].push(product);
  });

  return (
    <div className={styles.productCatalog}>
      <p className={styles.titleCatalogue}>Catálogo de Productos</p>
      <p className={styles.descriptionCatalogue}>
        Bienvenido al catálogo de productos de nuestra tienda de tabaquería.
        Aquí encontrarás una amplia selección de los mejores productos
        relacionados con tabaco, puros, accesorios y más. ¡Explora nuestras
        ofertas y descubre todo lo que necesitas para disfrutar de una
        experiencia única!
      </p>

      {Object.entries(productsByCategory).map(
        ([category, categoryProducts]) => (
          <div className={styles.listContainer} key={category}>
            <p className={styles.category}>{category}</p>
            <div className={styles.productList}>
              {categoryProducts.map((product) => (
                <div
                  key={product.code}
                  className={`${styles.product} ${
                    product.stock === 0 ? styles.disabled : ""
                  }`}
                >
                  <p>
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
                  </div>
                </div>
              ))}
            </div>
        
          </div>
        )
      )}
    </div>
  );
};

export default Home;
