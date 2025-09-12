import { useState } from "react";
import "./App.css";
import { Header } from "./components/Header";
import { Signup } from "./components/Signup";
import { Login } from "./components/Login";
function App() {
  return (
    <>
      <Header />
      <Login />
    </>
  );
}

export default App;
