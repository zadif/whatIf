import { useState } from "react";
import "./App.css";
import { Header } from "./components/Header";
import { Signup } from "./components/Signup";
import { Login } from "./components/Login";
import axios from "axios";
import api from "./components/api.js";
import { WhatIfs } from "./components/WhatIfs.jsx";

function App() {
  let [login, setLogin] = useState(0);

  async function hello2() {
    let response = await api.get("/logout");
    console.log(response);
  }
  return (
    <>
      <Header />
      <button
        onClick={() => {
          setLogin(!login);
        }}
      >
        Login
      </button>
      <button onClick={hello2}>Logout</button>

      {login && <Login />}

      <WhatIfs />
    </>
  );
}

export default App;
