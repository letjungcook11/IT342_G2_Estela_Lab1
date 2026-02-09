import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:8080/api/auth/register", {
        email,
        username,
        password,
      });
      alert("Registered successfully!");
      navigate("/");
    } catch (err) {
      alert("Register failed");
    }
  };

  return (
    <div>
      <h2>Register</h2>

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />

      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />

      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        type="password"
      />

      <button onClick={handleRegister}>Register</button>
    </div>
  );
}
