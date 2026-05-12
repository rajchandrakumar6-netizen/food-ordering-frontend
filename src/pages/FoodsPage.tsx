import { useState, useEffect } from 'react';
import { getFoodItems, getCategories, addToCart } from '../services/api';
import type { FoodItem, Category } from '../types';
import Navbar from '../components/Navbar';

const FoodsPage = () => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchFoods();
    fetchCategories();
  }, []);

  const fetchFoods = async () => {
    const response = await getFoodItems();
    setFoods(response.data);
  };

  const fetchCategories = async () => {
    const response = await getCategories();
    setCategories(response.data);
  };

  const handleAddToCart = async (foodId: number) => {
    try {
      await addToCart({ foodItemId: foodId, quantity: 1 });
      setMessage('Added to cart!');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage('Failed to add to cart');
    }
  };

  const filteredFoods = selectedCategory
    ? foods.filter((f: any) => f.categoryId === selectedCategory)
    : foods;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">🍽️ Our Menu</h1>

        {message && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">
            {message}
          </div>
        )}

        {/* Category Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full ${!selectedCategory ? 'bg-orange-500 text-white' : 'bg-white text-gray-700'}`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full ${selectedCategory === cat.id ? 'bg-orange-500 text-white' : 'bg-white text-gray-700'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Food Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foods.map((food) => (
            <div key={food.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={food.imageUrl || 'https://via.placeholder.com/300x200'}
                alt={food.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{food.name}</h3>
                <p className="text-gray-500 text-sm mt-1">{food.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-orange-500 font-bold text-xl">${food.price}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${food.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {food.status}
                  </span>
                </div>
                <button
                  onClick={() => handleAddToCart(food.id)}
                  disabled={food.status === 'OUT_OF_STOCK'}
                  className="w-full mt-4 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FoodsPage;