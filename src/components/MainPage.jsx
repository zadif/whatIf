import { useState } from "react";
import { Signup } from "./Signup";
import { Login } from "./Login";
import api from "./api.js";
import { Link } from "react-router-dom";

export function MainPage() {
  let [login, setLogin] = useState(0);
  let [signup, setSignup] = useState(0);

  async function hello2() {
    let response = await api.get("/logout");
  }
  return (
    <>
      <button
        onClick={() => {
          setSignup(!signup);
        }}
      >
        Signup
      </button>
      <button
        onClick={() => {
          setLogin(!login);
        }}
      >
        Login
      </button>
      <button onClick={hello2}>Logout</button>

      {login ? <Login /> : <></>}
      {signup ? <Signup /> : <></>}

      <button>
        {" "}
        <Link to="addNew">Generate a world</Link>{" "}
      </button>
      <button>
        {" "}
        <Link to="feed">Feed</Link>{" "}
      </button>
    </>
  );
}

export default MainPage;
