import { Link } from "react-router-dom";

export default function MenuCard(props) {
  const item = props.item;

  return (
    <div className="w-[300px] h-[420px] bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 flex flex-col overflow-hidden m-3">

      {/* IMAGE */}
      <div className="relative w-full h-[230px]">
        <img
          className="w-full h-full object-cover rounded-t-2xl"
          src={
            item.image?.startsWith("http")
              ? item.image
              : `http://localhost:5000/uploads/${item.image}`
          }
          alt={item.name}
        />

        {/* Availability Badge */}
        <span
          className={`absolute top-3 left-3 text-white text-xs px-2 py-1 rounded-full shadow-md ${
            item.isAvailable ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {item.isAvailable ? "Available" : "Sold Out"}
        </span>
      </div>

      {/* INFO */}
      <div className="flex flex-col justify-between flex-grow px-4 py-3">

        {/* Name */}
        <h1 className="text-lg font-bold text-secondary truncate">
          {item.name}
        </h1>

        {/* Price */}
        <p className="text-lg text-accent font-bold">
          Rs. {item.price}
        </p>

        {/* Meta Info */}
        <div className="mt-2">
          <p className="text-xs text-secondary/60">
            Category: {item.category}
          </p>
          <p className="text-xs text-secondary/60">
            Prep Time: {item.prepTime} mins
          </p>
        </div>

        {/* BUTTON */}
        <Link
          to={`/menu/${item._id}`}
          className="w-full mt-3 py-2 rounded-xl border text-center border-boardercolor text-accent font-semibold hover:bg-accent hover:text-white transition duration-300"
        >
          View Item
        </Link>

      </div>
    </div>
  );
}