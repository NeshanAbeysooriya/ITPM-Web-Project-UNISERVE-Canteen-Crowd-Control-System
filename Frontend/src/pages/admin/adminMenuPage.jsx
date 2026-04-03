import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaRegEdit, FaRegPlusSquare, FaTrashAlt } from "react-icons/fa";
import { IoClose, IoTrashOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { Loder } from "../../components/loder";

/* ================= DELETE CONFIRM ================= */
function MenuDeleteConfirm(props) {
  const id = props.id;
  const close = props.close;
  const refresh = props.refresh;

  function deleteItem() {
    const token = localStorage.getItem("token");

    axios
      .delete(import.meta.env.VITE_API_URL + "/api/menus/" + id, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then(() => {
        close();
        toast.success("Menu Item Deleted Successfully");
        refresh();
      })
      .catch(() => {
        toast.error("Failed to Delete Menu Item");
      });
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex justify-center items-center px-4">
      <div className="bg-primary rounded-2xl shadow-xl w-full max-w-md relative p-6">
        
        <button
          onClick={close}
          className="absolute top-[-42px] right-[-42px] w-[40px] h-[40px] bg-white hover:bg-red-500 rounded-full flex justify-center items-center"
        >
          <IoClose className="text-gray-700 text-lg" />
        </button>

        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
            <FaTrashAlt className="text-2xl" />
          </div>
        </div>

        <h2 className="text-xl font-semibold text-center mb-2 text-gray-800">
          Delete Menu Item
        </h2>

        <p className="text-center text-gray-600 mb-6">
          Are you sure you want to delete this item?
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={close}
            className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={deleteItem}
            className="px-5 py-2 rounded-lg bg-red-600 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= MAIN PAGE ================= */
export default function AdminMenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [selectedID, setSelectedID] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) {
      axios
        .get(import.meta.env.VITE_API_URL + "/api/menus")
        .then((response) => {
          setMenuItems(response.data.data); // IMPORTANT FIX
          setIsLoading(false);
        })
        .catch(() => {
          toast.error("Failed to fetch menu items");
        });
    }
  }, [isLoading]);

  return (
    <div className="w-full h-full p-6 bg-primary">

      {isDeleteConfirmVisible && (
        <MenuDeleteConfirm
          id={selectedID}
          refresh={() => setIsLoading(true)}
          close={() => setIsDeleteConfirmVisible(false)}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-accent">Menu Management</h1>

        <Link
          to="/admin/add-menu"
          className="flex items-center gap-2 bg-accent text-white px-5 py-2 rounded-lg"
        >
          <FaRegPlusSquare />
          Add Menu Item
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl shadow-lg border border-boardercolor">
        {isLoading ? (
          <Loder />
        ) : (
          <table className="w-full border-collapse">
            <thead className="bg-accent text-white">
              <tr>
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Prep Time</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y">
              {menuItems.map((item) => (
                <tr key={item._id}>

                  <td className="py-3 px-4">
                    <img
                      src={item.image}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </td>

                  <td className="py-3 px-4 font-semibold">
                    {item.name}
                  </td>

                  <td className="py-3 px-4 text-green-600">
                    Rs.{item.price}
                  </td>

                  <td className="py-3 px-4">{item.category}</td>

                  <td className="py-3 px-4">{item.prepTime} min</td>

                  <td className="py-3 px-4">{item.quantity}</td>

                  <td className="py-3 px-4">
                    {item.isAvailable ? (
                      <span className="text-green-600">Available</span>
                    ) : (
                      <span className="text-red-500">Unavailable</span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex gap-4 justify-center">

                      <FaRegEdit
                        className="cursor-pointer hover:text-accent"
                        onClick={() => {
                          navigate("/admin/update-menu", {
                            state: item,
                          });
                        }}
                      />

                      <IoTrashOutline
                        className="cursor-pointer hover:text-red-500"
                        onClick={() => {
                          setSelectedID(item._id);
                          setIsDeleteConfirmVisible(true);
                        }}
                      />

                    </div>
                  </td>

                </tr>
              ))}

              {menuItems.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-10">
                    No menu items found.
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}