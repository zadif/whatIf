import "./App.css";
import { Header } from "./components/Header";

import { WhatIfs } from "./components/WhatIfs.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorPage from "./components/404Error";
import MainPage from "./components/MainPage";
import { Feed } from "./components/Feed.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="addNew" element={<WhatIfs />} />
          <Route path="feed" element={<Feed />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
