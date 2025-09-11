import { useState } from "react";
import "./App.css";
import { Header } from "./components/Header";
import { Signup } from "./components/Signup";

function App() {
  return (
    <>
      <Header />
      <Signup />
    </>
  );
}

export default App;
