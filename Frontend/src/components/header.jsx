import { useState, useEffect } from "react";
import {
  MdMenu,
  MdOutlineShoppingCart,
  MdNotificationsNone,
} from "react-icons/md";
import { Link } from "react-router-dom";
import axios from "axios";
import UserData from "./userData";
import UserDataMobile from "./userDataMobile";

export default function Header() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  // 🔍 SEARCH STATES (added)
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);
  const [allMenu, setAllMenu] = useState([]);

  // 🔍 FETCH MENU DATA (added)
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/menus")
      .then((res) => setAllMenu(res.data.data))
      .catch((err) => console.log(err));
  }, []);

  // 🔍 HANDLE SEARCH (added)
  const handleSearch = (value) => {
    setSearchText(value);

    const filtered = allMenu.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase()),
    );

    setResults(filtered);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Main bar */}
      <div className="w-full h-16 sm:h-22 bg-gradient-to-r from-accent via-accent/95 to-green-700/90 backdrop-blur-md shadow-lg shadow-black/10">
        <div className="max-w-10xl mx-auto px-3 sm:px-5 lg:px-10 h-full flex items-center justify-between ">
          {/* ─── Left ─── Logo + Mobile Menu Btn */}
          <div className="flex justify-start gap-4 sm:gap-6 ">
            <button
              className="lg:hidden text-white text-3xl -ml-1 hover:scale-110 transition-transform"
              onClick={() => setIsSideBarOpen(true)}
              aria-label="Open menu"
            >
              <MdMenu />
            </button>

            <Link to="/" className="flex items-center gap-2">
              <img
                src="logo.png"
                alt="Logo"
                className="h-12 sm:h-20 w-auto object-contain drop-shadow-md"
              />
              <span className="hidden sm:inline font-bold text-xl tracking-tight text-white/95">
                UniServe
              </span>
            </Link>
          </div>

          {/* ─── Center ─── Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
            {[
              { name: "Home", path: "/" },
              { name: "Menu", path: "/menu" },
              { name: "Orders", path: "/orders" },
              { name: "About", path: "/about" },
              { name: "Feedback", path: "/feedback" },
            ].map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  relative py-1.5 px-1 text-white/90 font-medium tracking-wide
                  hover:text-white transition-colors duration-200
                  after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2
                  after:w-0 after:h-0.5 after:bg-highlight after:rounded-full
                  after:transition-all after:duration-300 hover:after:w-3/4
                `}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* ─── Right ─── Actions */}
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
            {/* Search (visible from xl up) */}
            <div className="relative hidden xl:flex items-center bg-white/15 backdrop-blur-sm rounded-full pl-4 pr-3 py-1.5 border border-white/10 focus-within:border-highlight/60 transition-all">
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchText.trim() !== "") {
                    navigate(`/menu?search=${searchText}`);
                  }
                }}
              />
              <span className="text-white/70 text-lg">🔍</span>

              {/* 🔽 SEARCH DROPDOWN (added) */}
              {searchText && (
                <div className="absolute top-12 left-0 w-72 bg-white rounded-xl shadow-lg overflow-hidden z-50">
                  {results.length > 0 ? (
                    results.slice(0, 5).map((item) => (
                      <Link
                        to={`/menu?search=${item.name}`}
                        key={item._id}
                        onClick={() => {
                          setSearchText("");
                          setResults([]);
                        }}
                      >
                        {item.name}
                      </Link>
                    ))
                  ) : (
                    <p className="p-4 text-gray-500">No results found</p>
                  )}
                </div>
              )}
            </div>

            {/* Notifications */}
            {/* <button
              className="relative text-white/90 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
              aria-label="Notifications"
            >
              <MdNotificationsNone size={24} />
              <span className="absolute -top-1 -right-1 bg-highlight text-[10px] font-bold text-white min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white shadow">
                3
              </span>
            </button> */}

            {/* Cart */}
            <Link
              to="/cart"
              className="relative text-white/90 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
              aria-label="Shopping Cart"
            >
              <MdOutlineShoppingCart size={24} />
              <span className="absolute -top-1 -right-1 bg-highlight text-[10px] font-bold text-white min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white shadow">
                2
              </span>
            </Link>

            {/* User Area */}
            <div className="hidden sm:block">
              <UserData />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Mobile Sidebar Overlay + Panel ─── */}
      {isSideBarOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsSideBarOpen(false)}
          />

          {/* Sidebar */}
          <div
            className={`
              fixed top-0 bottom-0 left-0 z-50 w-72 sm:w-80 bg-gradient-to-b from-primary via-primary to-slate-50
              transform transition-transform duration-300 ease-in-out lg:hidden
              ${isSideBarOpen ? "translate-x-0" : "-translate-x-full"}
              shadow-2xl
            `}
          >
            <div className="h-20 bg-gradient-to-r from-accent to-green-700 flex items-center justify-between px-5 text-white">
              <Link
                to="/"
                className="flex items-center gap-3"
                onClick={() => setIsSideBarOpen(false)}
              >
                <img
                  src="logo.png"
                  alt="Logo"
                  className="h-11 w-auto object-contain"
                />
                <span className="font-bold text-lg tracking-tight">Foodie</span>
              </Link>
              <button
                className="text-white text-3xl hover:scale-110 transition-transform"
                onClick={() => setIsSideBarOpen(false)}
              >
                <MdMenu />
              </button>
            </div>

            <nav className="flex flex-col py-6 px-2">
              {[
                { name: "Home", path: "/" },
                { name: "Menu", path: "/menu" },
                { name: "Orders", path: "/orders" },
                { name: "About", path: "/about" },
                { name: "Feedback", path: "/feedback" },
                { name: "Cart", path: "/cart" },
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsSideBarOpen(false)}
                  className={`
                    flex items-center gap-4 px-6 py-4 text-secondary font-medium
                    hover:bg-accent/10 hover:text-accent rounded-xl mx-3 transition-colors
                  `}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="mt-auto p-6 border-t border-bordercolor/30">
              <UserDataMobile />
            </div>
          </div>
        </>
      )}
    </header>
  );
}
