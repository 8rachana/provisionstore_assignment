import React, { useState, useEffect } from "react";
import authService from "../services/authService";
import "./ProductList.css";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="pd-card">
      <img
        className="pd-img"
        alt="img"
        src={product.productCategory.productCategoryImage}
      />
      <div>
        <h6 className="pd-name">
          {product.productCategory.productCategoryName}
        </h6>
      </div>
    </div>
  );
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productList = await authService.getProductList();
        setProducts(productList.response);
      } catch (error) {
        console.error("Error fetching product list", error);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.productCategory.productCategoryName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  useEffect(() => {}, [products, searchTerm, filteredProducts]);

  return (
    <div className="pd-pg">
      <div className="pd-hd">
        <h2>Product List</h2>
        <div>
          <Link to="/about">
            <button className="pd-btn">About Page</button>
          </Link>
        </div>
      </div>
      <input
        type="text"
        placeholder="Search by product name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pd-search"
      />
      <div className="pd-list">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.productCategory.productCategoryId}
              product={product}
            />
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;
