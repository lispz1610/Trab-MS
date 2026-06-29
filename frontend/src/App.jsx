import React, { useState } from 'react';
import Login from "./pages/Login";
import Home from "./pages/Home"; 

export default function App() {
 //
 // comenta para teste:
    const [usuario, setUsuario] = useState(() => {
    //comenta para teste:
    const usuarioSalvo = localStorage.getItem("usuario");
    //descomenta para teste:
   //teste const [usuario, setUsuario] = useState({ nome: "User", email: "teste@rabisco.com" });
    //comenta para teste://
    return usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
});

  const fazerLogout = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
  };

  if (!usuario) {
    return <Login onLoginSucesso={setUsuario} />;
  }

  return <Home usuario={usuario} onLogout={fazerLogout} />;
}
