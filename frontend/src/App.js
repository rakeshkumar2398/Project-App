import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://54.163.8.169:5000"; // Update this with your backend server IP or domain

function App() {
  const [quotes, setQuotes] = useState([]);
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [error, setError] = useState(null);

  // Fetch quotes when the component loads
  useEffect(() => {
    axios
      .get(`${API_URL}/quotes`)
      .then((res) => setQuotes(res.data))
      .catch((err) => {
        console.error("Error fetching quotes:", err);
        setError("Failed to load quotes. Please try again.");
      });
  }, []);

  // Function to add a new quote
  const addQuote = () => {
    if (text && author) {
      axios
        .post(`${API_URL}/quotes`, { text, author })
        .then((res) => {
          setQuotes([...quotes, res.data]);
          setText("");
          setAuthor("");
        })
        .catch((err) => {
          console.error("Error adding quote:", err);
          setError("Failed to add quote. Please try again.");
        });
    } else {
      setError("Both quote and author fields are required.");
    }
  };

  // Function to delete a quote
  const deleteQuote = (id) => {
    axios
      .delete(`${API_URL}/quotes/${id}`)
      .then(() => {
        setQuotes(quotes.filter((q) => q._id !== id));
      })
      .catch((err) => {
        console.error("Error deleting quote:", err);
        setError("Failed to delete quote. Please try again.");
      });
  };

  return (
    <div className="container">
      <h1>Motivator App</h1>

      {/* Display error message if there's an error */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="input-group">
        <input
          type="text"
          placeholder="Enter quote"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div className="input-group">
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </div>
      <button onClick={addQuote}>Add Quote</button>

      <div>
        {quotes.map((quote) => (
          <div key={quote._id} className="quote">
            <div>
              <p>"{quote.text}"</p>
              <p>
                <strong>- {quote.author}</strong>
              </p>
            </div>
            <button className="delete-btn" onClick={() => deleteQuote(quote._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

