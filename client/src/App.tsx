import React, { useEffect, useState } from "react";
import "./App.css";
import NavBar from "./components/navbar/navbar";

const App: React.FC = () => {
  const [contador, setcontador] = useState(0);
  useEffect(() => {
    setcontador(contador + 1);
  }, []);
  return (
    <div className="App">
      <p>Hola {contador}</p>
      <NavBar />
    </div>
  );
};

export default App;
