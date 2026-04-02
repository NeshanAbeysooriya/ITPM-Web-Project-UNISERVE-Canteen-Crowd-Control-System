import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer";

export default function MenuPage() {
  const [menu, setMenu] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const navigate = useNavigate();

  // Ensure this matches your backend route
  const API_URL = "http://localhost:5000/api/menus"; 

  const fetchMenu = async () => {
    try {
      let url = API_URL;
      // Appending query parameters for search and category
      if (search) {
        url += `?search=${search}`;
      } else if (category) {
        url += `?category=${category}`;
      }

      const res = await axios.get(url);
      setMenu(res.data.data);
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [search, category]);

  return (
    <div className="page-wrapper">
      <style>{`
        body {
          margin: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #f8f9fa;
        }

        .page-wrapper {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .container {
          flex: 1;
          padding: 40px 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        h1 {
          text-align: center;
          color: #333;
          font-size: 2.5rem;
          margin-bottom: 30px;
        }

        /* SEARCH & FILTER SECTION */
        .search-container {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 15px;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }

        .search-input {
          padding: 12px 20px;
          width: 350px;
          border: 2px solid #ddd;
          border-radius: 30px;
          outline: none;
          transition: border-color 0.3s;
          font-size: 16px;
        }

        .search-input:focus {
          border-color: #ff7a00;
        }

        .category-select {
          padding: 12px 15px;
          border: 2px solid #ddd;
          border-radius: 30px;
          background: white;
          outline: none;
          cursor: pointer;
          font-size: 16px;
        }

        /* GRID LAYOUT */
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 25px;
        }

        .card {
          background: white;
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
          text-align: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.1);
        }

        .card img {
          width: 100%;
          height: 180px;
          object-fit: cover;
          border-radius: 12px;
          margin-bottom: 15px;
        }

        .price {
          font-size: 1.2rem;
          font-weight: bold;
          color: #2d3436;
          margin: 10px 0;
        }

        .status-tag {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 15px;
        }

        .available { color: #2ecc71; }
        .sold { color: #e74c3c; }

        /* 🔥 ENHANCED VIEW ITEM BUTTON */
        .btn {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(135deg, #ff7a00, #ff9500);
          color: white;
          font-weight: bold;
          font-size: 16px;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(255, 122, 0, 0.3);
        }

        .btn:hover {
          background: linear-gradient(135deg, #e96d00, #ff7a00);
          box-shadow: 0 6px 20px rgba(255, 122, 0, 0.4);
          transform: scale(1.02);
        }

        .btn:active {
          transform: scale(0.98);
        }

        .btn:disabled {
          background: #ccc;
          box-shadow: none;
          cursor: not-allowed;
        }
      `}</style>

      <div className="container" style={{ marginTop: "100px" }}>
        <h1 className="pt-24">🍽️ Canteen Menu</h1>

        {/* 🔍 NEW SEARCH & FILTER UI */}
        <div className="search-container">
          <input
            className="search-input"
            type="text"
            placeholder="Search for your favorite food..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select 
            className="category-select"
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Beverages">Beverages</option>
            <option value="Snacks">Snacks</option>
            <option value="Desserts">Desserts</option>
          </select>
        </div>

        {/* 🛒 MENU GRID */}
        <div className="grid">
          {menu.length > 0 ? (
            menu.map((item) => (
              <div className="card" key={item._id}>
                <div>
                  <img
                    src={
                      item.image?.startsWith("http")
                        ? item.image
                        : `http://localhost:5000/uploads/${item.image}`
                    }
                    alt={item.name}
                  />
                  <h3>{item.name}</h3>
                  <p style={{ color: "#777", fontSize: "14px" }}>{item.description}</p>
                </div>

                <div>
                  <p className="price">Rs. {item.price.toFixed(2)}</p>
                  <p style={{ fontSize: "13px", color: "#555" }}>⏱ Prep: {item.prepTime} mins</p>

                  <div className="status-tag">
                    {item.isAvailable ? (
                      <span className="available">● Available</span>
                    ) : (
                      <span className="sold">● Sold Out</span>
                    )}
                  </div>

                  <button
                    className="btn"
                    onClick={() => navigate("/menu/" + item._id)}
                    disabled={!item.isAvailable}
                  >
                    {item.isAvailable ? "View Item" : "Sold Out"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', gridColumn: '1/-1' }}>No items found matching your search.</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}