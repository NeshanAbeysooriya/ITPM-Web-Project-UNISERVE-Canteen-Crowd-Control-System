import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdStar } from "react-icons/md";
import Footer from "../components/footer";

export default function MenuPage() {
  const [menu, setMenu] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [favoriteIds, setFavoriteIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("userFavoriteMenuIds") || "[]");
    } catch {
      return [];
    }
  });

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

  useEffect(() => {
    localStorage.setItem("userFavoriteMenuIds", JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const toggleFavorite = (id) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  return (
    <div className="page-wrapper">
      <style>{`
        body {
          margin: 0;
          font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: radial-gradient(circle at 20% 10%, rgba(59,130,246,0.15), transparent 25%),
                      radial-gradient(circle at 80% 15%, rgba(16,185,129,0.12), transparent 22%),
                      #f5f8ff;
          color: #0f172a;
        }

        .page-wrapper {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          position: relative;
        }

        .container {
          flex: 1;
          padding: 48px 28px 24px;
          max-width: 1240px;
          margin: 0 auto;
        }

        h1 {
          text-align: center;
          color: #0f172a;
          font-size: 3rem;
          margin-bottom: 32px;
          letter-spacing: -0.04em;
          font-weight: 800;
        }

        .search-container {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 18px;
          margin-bottom: 42px;
          flex-wrap: wrap;
          background: rgba(255,255,255,0.92);
          border: 1px solid rgba(148,163,184,0.24);
          border-radius: 999px;
          padding: 14px 20px;
          box-shadow: 0 20px 50px rgba(15,23,42,0.08);
          backdrop-filter: blur(10px);
        }

        .search-input {
          padding: 16px 22px;
          width: 360px;
          border: none;
          border-radius: 999px;
          outline: none;
          transition: box-shadow 0.3s ease;
          font-size: 16px;
          background: #f8fbff;
          box-shadow: inset 0 2px 8px rgba(15,23,42,0.06);
          color: #0f172a;
        }

        .search-input:focus {
          box-shadow: inset 0 2px 14px rgba(59,130,246,0.18);
        }

        .category-select {
          padding: 16px 20px;
          border: none;
          border-radius: 999px;
          background: #ffffff;
          outline: none;
          cursor: pointer;
          font-size: 16px;
          box-shadow: inset 0 2px 10px rgba(15,23,42,0.05);
          color: #111827;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 28px;
        }

        .card {
          background: linear-gradient(180deg, rgba(255,255,255,0.96), rgba(248,250,252,0.96));
          border: 1px solid rgba(148,163,184,0.18);
          border-radius: 32px;
          padding: 28px;
          box-shadow: 0 22px 55px rgba(15,23,42,0.08);
          text-align: center;
          transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 520px;
        }

        .card:hover {
          transform: translateY(-8px);
          box-shadow: 0 30px 70px rgba(15,23,42,0.12);
          border-color: rgba(59,130,246,0.25);
        }

        .card img {
          width: 100%;
          height: 220px;
          object-fit: cover;
          border-radius: 28px;
          margin-bottom: 22px;
        }

        .card h3 {
          font-size: 1.6rem;
          margin-bottom: 10px;
          color: #111827;
        }

        .card p {
          color: #475569;
          line-height: 1.75;
        }

        .price {
          font-size: 1.8rem;
          font-weight: 800;
          color: #0f172a;
          margin: 18px 0 8px;
        }

        .status-tag {
          font-size: 0.95rem;
          font-weight: 700;
          margin-top: 16px;
        }

        .available { color: #16a34a; }
        .sold { color: #dc2626; }

        .btn {
          width: 100%;
          padding: 14px 20px;
          border: none;
          border-radius: 18px;
          background: linear-gradient(135deg, #f97316, #fb8500);
          color: white;
          font-weight: 700;
          font-size: 0.95rem;
          text-transform: uppercase;
          letter-spacing: 0.9px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 18px 36px rgba(251,133,0,0.2);
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 40px rgba(251,133,0,0.24);
        }

        .btn:active {
          transform: translateY(0);
        }

        .btn:disabled {
          background: #cbd5e1;
          box-shadow: none;
          cursor: not-allowed;
        }

        .star-button {
          width: 52px;
          min-width: 52px;
          height: 52px;
          padding: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 18px;
          border: 1px solid rgba(148,163,184,0.24);
          background: #ffffff;
          color: #94a3b8;
          box-shadow: 0 16px 32px rgba(15,23,42,0.08);
          transition: all 0.25s ease;
        }

        .star-button:hover {
          transform: translateY(-1px);
          background: #f8fafc;
        }

        .favorite-active {
          background: #facc15;
          color: #111827;
          border-color: #f59e0b;
          box-shadow: 0 16px 32px rgba(250,204,21,0.18);
        }

        .favorite-active:hover {
          background: #f59e0b;
          color: white;
        }
      `}</style>

      <div className="container" style={{ marginTop: "40px" }}>
        <h1 className="pt-16">🍽️ Canteen Menu</h1>

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

                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <button
                      className={`btn star-button ${favoriteIds.includes(item._id) ? "favorite-active" : ""}`}
                      type="button"
                      onClick={() => toggleFavorite(item._id)}
                      title={favoriteIds.includes(item._id) ? "Remove from favorites" : "Add to favorites"}
                    >
                      <MdStar size={18} />
                    </button>
                    <button
                      className="btn"
                      onClick={() => navigate("/menu/" + item._id)}
                      disabled={!item.isAvailable}
                      style={{ flex: 1, minWidth: 130 }}
                    >
                      {item.isAvailable ? "View Item" : "Sold Out"}
                    </button>
                  </div>
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