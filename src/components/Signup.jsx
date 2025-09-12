import { useState } from "react";
import axios from "axios";
import { generateUsername } from "unique-username-generator";

export function Signup() {
  let name = generateUsername();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(name);

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

    if (!email || !password || !username) {
      alert("Credentials are missing");
      return;
    }

    if (!popularDomains.some((domain) => email.endsWith(domain))) {
      alert("Email is wrong");
      return;
    }
    if (password.length < 7) {
      alert("Password is small");
      return;
    }
    let hasUpperCase = /[A-Z]/.test(password);
    let hasNumber = /[0-9]/.test(password);
    let hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!(hasUpperCase && hasNumber && hasSpecialChar)) {
      alert("Weak password");
      return;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      alert("Incalid username");
      return;
    }

    const { response, error } = await axios.post(
      "http://localhost:3000/signup",
      {
        email: email,
        password: password,
        username: username,
      }
    );
    if (error) {
      console.error("Error signing up user: ", error);
      return;
    }
    console.log(response);
  }

  function reloadUsername() {
    setUsername(generateUsername());
  }

  return (
    <>
      <h2> Sign Up </h2>
      <h3>Email : </h3>
      <input
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <h3>Password : </h3>
      <input
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        type="password"
      />

      <h3>Username: </h3>
      <input
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      />
      <button onClick={reloadUsername}>Reload Username </button>

      <br />
      <button onClick={submit}>Submit </button>
    </>
  );
}
