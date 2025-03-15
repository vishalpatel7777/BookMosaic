import React, { useEffect, useState } from "react";
import "../../assets/Cart-page/cart.css";
import Loader from "../Loader/Loader";
import { FaShoppingCart } from "react-icons/fa";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import CartBookCard from "../BookCard/CartBookCard";
import CustomAlert from "../Alert/CustomAlert";


const API_URL = "http://localhost:1000"; // Hardcoded for now

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/v1/get-user-cart`, { headers });
        setCart(response.data.data || []);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setCart([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [cart]); // Removed cart from dependencies to avoid infinite loop

  useEffect(() => {
    if (cart && cart.length > 0) {
      const calculatedTotal = cart.reduce((acc, item) => acc + item.price, 0);
      setTotal(calculatedTotal.toFixed(2));
    } else {
      setTotal(0);
    }
  }, [cart]);

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        user: localStorage.getItem("id"),
        books: cart.map((book) => book._id),
        totalPrice: total,
        paymentMethod: "Online",
      };

      const response = await axios.post(`${API_URL}/api/v1/place-order`, orderData, { headers });
   
      await axios.delete(`${API_URL}/api/v1/clear-cart`, { headers });
      setCart([]);

      navigate("/payment-success", { state: { book: cart[0] } });
    } catch (error) {
      console.error("Error placing order:", error.response?.data || error.message);
      setAlertMessage("This Function is not implemented (This will work in the future..😉)");
      setShowAlert(true);
    }
  };

  return (
    <>
      {loading && <Loader />}
      {cart && cart.length === 0 && (
        <div className="h-screen">
          <div className="h-[100%] flex items-center justify-center flex-col">
            <h1 className="text-4xl font-semibold text-zinc-700">Empty Cart</h1>
            <FaShoppingCart className="cart-pulse" style={{ fontSize: "2.5rem", color: "#ff5555", marginBottom: "10px" }} />
          </div>
        </div>
      )}
      {cart && cart.length > 0 && (
        <div className="relative pt-[121px] overflow-x-hidden p-6">
          <div className="Cart-border-bottom-1">
            <span className="material-symbols-outlined" id="Cart-icon">shopping_cart</span>
            <h2 className="Cart-Us">Your Cart</h2>
          </div>
          <div className="grid grid-cols-5">
            {cart.map((book) => (
              <div key={book._id}>
                <CartBookCard data={book} cart={true} />
              </div>
            ))}
          </div>
        </div>
      )}
      {cart && cart.length > 0 && (
        <div className="mt-4 w-full flex items-center justify-end mb-10 pr-10">
          <div className="p-4 bg-[#63918b] rounded">
            <h1 className="text-3xl text-black font-semibold">Total Amount</h1>
            <div className="mt-3 flex gap-2 items-center justify-between text-xl text-black">
              <h2>{cart.length} books</h2>
              <h2>₹ {total}</h2>
            </div>
            <div className="w-[100%] mt-3">
              <button
                className="bg-zinc-100 rounded px-4 py-2 flex justify-center w-full font-semibold hover:bg-zinc-300"
                onClick={handlePlaceOrder}
              >
                Place Your Order
              </button>
            </div>
          </div>
        </div>
      )}
      {showAlert && <CustomAlert message={alertMessage} onClose={() => setShowAlert(false)} />}
    </>
  );
};

export default Cart;