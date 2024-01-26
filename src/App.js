import React, { useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import ProductList from "./components/ProductList";
import About from "./components/About";
import "./App.css";
import logo from "./logo.png";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <BrowserRouter>
      <div>
        <header className="hdr">
          <img src={logo} alt="Logo" className="logos" />
          <h1>Provision Store</h1>
        </header>

        <Routes>
          <Route
            path="/login"
            element={
              !isLoggedIn ? (
                <Login onLogin={handleLogin} />
              ) : (
                <Navigate to="/product-list" />
              )
            }
          />
          <Route
            path="/product-list"
            element={isLoggedIn ? <ProductList /> : <Navigate to="/login" />}
          />
          {/* <Route
            path="/login"
            element= <login/>
          />
          <Route
            path="/product-list"
            element= <ProductList/>
          /> */}
          <Route
            path="/about"
            element={isLoggedIn ? <About /> : <Navigate to="/login" />}
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
