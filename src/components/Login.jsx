import { useState } from "react";
import axios from "axios";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit() {
    let popularDomains = [
      "@gmail.com",
      "@yahoo.com",
      "@outlook.com",
      "@hotmail.com",
      "@icloud.com",
      "@aol.com",
      "@protonmail.com",
      "@zoho.com",
      "@yandex.com",
      "@mail.com",
    ];
    if (!email || !password) {
      alert("Credentials are missing");
      return;
    }
    if (!popularDomains.some((domain) => email.endsWith(domain))) {
      alert("Email is wrong");
      return;
    }
    if (password.length < 7) {
      alert("Invalid password");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("email", response.data.email);
      //console.log("✅ Response:", response.data);
    } catch (error) {
      if (error.response) {
        // Server responded with a status (400, 401, 500…)
        console.error("❌ Server error:", error.response.data);
      } else if (error.request) {
        // Request was sent but no response
        console.error("❌ No response:", error.request);
      } else {
        // Something else went wrong
        console.error("❌ Error:", error.message);
      }
    }
  }

  return (
    <>
      <h2> Log in </h2>
      <h3>Email : </h3>
      <input
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        placeholder="Enter email or username"
      />
      <h3>Password : </h3>
      <input
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        type="password"
      />

      <br />
      <button onClick={submit}>Login </button>
    </>
  );
}
