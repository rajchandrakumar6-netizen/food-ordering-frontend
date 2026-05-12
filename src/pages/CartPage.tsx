import { useState, useEffect } from 'react';
import { getCart, removeFromCart, updateCartItem, placeOrder, processPayment } from '../services/api';
import type { Cart } from '../types';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await getCart();
      setCart(response.data);
    } catch (err) {
      console.error('Failed to load cart', err);
      setMessage('Failed to load cart');
    }
  };

  const handleRemove = async (cartItemId: number) => {
    try {
      await removeFromCart(cartItemId);
      await fetchCart();
    } catch (err) {
      console.error('Failed to remove item', err);
      setMessage('Failed to remove item');
    }
  };

  const handleUpdateQuantity = async (cartItemId: number, quantity: number) => {
    if (quantity < 1) return;
    try {
      await updateCartItem(cartItemId, quantity);
      await fetchCart();
    } catch (err) {
      console.error('Failed to update quantity', err);
    }
  };

  const getTotalAmount = () => {
    if (!cart?.cartItems || cart.cartItems.length === 0) return 0;
    return cart.cartItems.reduce((total, item) => {
      return total + item.foodItem.price * item.quantity;
    }, 0);
  };

  const handlePlaceOrder = async () => {
    if (!cart?.cartItems || cart.cartItems.length === 0) {
      setMessage('Cart is empty!');
      return;
    }
    setLoading(true);
    try {
      const orderData = {
        items: cart.cartItems.map((item) => ({
          foodItemId: item.foodItem.id,
          quantity: item.quantity,
          price: item.foodItem.price,
        })),
        totalAmount: getTotalAmount(),
      };

      const orderResponse = await placeOrder(orderData);

      await processPayment({
        orderId: orderResponse.data.id,
        amount: getTotalAmount(),
      });

      // Clear cart in UI immediately
      setCart(null);
      setMessage('🎉 Order placed successfully!');
      setTimeout(() => navigate('/orders'), 2000);
    } catch (err) {
      console.error('Failed to place order', err);
      setMessage('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">🛒 Your Cart</h1>

        {message && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">
            {message}
          </div>
        )}

        {!cart?.cartItems || cart.cartItems.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-xl">Your cart is empty!</p>
            <button
              onClick={() => navigate('/foods')}
              className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
            >
              Browse Foods
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {cart.cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
                  <img
                    src={item.foodItem.imageUrl || 'https://via.placeholder.com/80'}
                    alt={item.foodItem.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.foodItem.name}</h3>
                    <p className="text-orange-500 font-bold">${item.foodItem.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                    >-</button>
                    <span className="font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                    >+</button>
                  </div>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-500 hover:text-red-700 font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow p-6 h-fit">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Total</span>
                <span className="font-bold text-orange-500">
                  ${getTotalAmount().toFixed(2)}
                </span>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;