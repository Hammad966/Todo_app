import React from "react";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Manager from "./components/Manager";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div>
      <Navbar />
        <Manager />
      <Footer />
    </div>
  );
};

export default App;
