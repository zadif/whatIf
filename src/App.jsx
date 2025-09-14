import { useState } from "react";
import "./App.css";
import { Header } from "./components/Header";
import { Signup } from "./components/Signup";
import { Login } from "./components/Login";
import axios from "axios";
import api from "./components/api.js";

function App() {
  async function hello() {
    let response = await api.get("/hello");
    console.log(response);
  }
  //hello();
  return (
    <>
      <Header />
      <Login />

      <button onClick={hello}>GO</button>
    </>
  );
}

export default App;
