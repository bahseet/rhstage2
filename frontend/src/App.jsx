import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_SERVER_URL;

function App() {
  const [name, setName] = useState("");
  const [greetings, setGreetings] = useState([]);

  const fetchGreetings = async () => {
    try {
      const res = await axios.get(`${API_URL}/hello`);
      setGreetings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGreetings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/hello`, { name });
      setName("");
      fetchGreetings();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Hello App 👋</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>

      <h2>Saved Names:</h2>
      <ul>
        {greetings.map((g) => (
          <li key={g.id}>{g.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;