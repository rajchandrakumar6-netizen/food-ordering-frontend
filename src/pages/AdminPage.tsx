import { useState, useEffect } from 'react';
import {
  getCategories, createCategory, deleteCategory,
  getFoodItems, createFoodItem, deleteFoodItem, updateFoodStatus
} from '../services/api';
import type { Category, FoodItem } from '../types';
import Navbar from '../components/Navbar';

const AdminPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [activeTab, setActiveTab] = useState('categories');
  const [newFood, setNewFood] = useState({
    name: '', description: '', price: '', imageUrl: '', categoryId: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchFoods();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  const fetchFoods = async () => {
    try {
      const response = await getFoodItems();
      setFoods(response.data);
    } catch (err) {
      console.error('Failed to fetch foods', err);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await createCategory(newCategory.trim());
      setNewCategory('');
      await fetchCategories();
      setMessage('Category created!');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      console.error('Failed to create category', err);
      setMessage('Failed to create category');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteCategory(id);
      await fetchCategories();
    } catch (err) {
      console.error('Failed to delete category', err);
    }
  };

  const handleCreateFood = async () => {
    if (!newFood.name || !newFood.price || !newFood.categoryId) {
      setMessage('Please fill all required fields');
      return;
    }
    try {
      await createFoodItem({
        name: newFood.name,
        description: newFood.description,
        price: parseFloat(newFood.price),
        imageUrl: newFood.imageUrl,
        categoryId: parseInt(newFood.categoryId)
      });
      setNewFood({ name: '', description: '', price: '', imageUrl: '', categoryId: '' });
      await fetchFoods();
      setMessage('Food item created!');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      console.error('Failed to create food', err);
      setMessage('Failed to create food item');
    }
  };

  const handleDeleteFood = async (id: number) => {
    try {
      await deleteFoodItem(id);
      await fetchFoods();
    } catch (err) {
      console.error('Failed to delete food', err);
    }
  };

  const handleToggleStatus = async (id: number, status: string) => {
    try {
      const newStatus = status === 'AVAILABLE' ? 'OUT_OF_STOCK' : 'AVAILABLE';
      await updateFoodStatus(id, newStatus);
      await fetchFoods();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">⚙️ Admin Dashboard</h1>

        {message && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">{message}</div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-2 rounded-lg font-semibold ${activeTab === 'categories' ? 'bg-orange-500 text-white' : 'bg-white text-gray-700'}`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab('foods')}
            className={`px-6 py-2 rounded-lg font-semibold ${activeTab === 'foods' ? 'bg-orange-500 text-white' : 'bg-white text-gray-700'}`}
          >
            Food Items
          </button>
        </div>

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div>
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Add Category</h2>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Category name"
                  className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <button
                  onClick={handleCreateCategory}
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-gray-600">ID</th>
                    <th className="px-6 py-3 text-left text-gray-600">Name</th>
                    <th className="px-6 py-3 text-left text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                        No categories yet
                      </td>
                    </tr>
                  ) : (
                    categories.map((cat) => (
                      <tr key={cat.id} className="border-t">
                        <td className="px-6 py-4">{cat.id}</td>
                        <td className="px-6 py-4">{cat.name}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Foods Tab */}
        {activeTab === 'foods' && (
          <div>
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Add Food Item</h2>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={newFood.name}
                  onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                  placeholder="Food name *"
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <input
                  type="text"
                  value={newFood.description}
                  onChange={(e) => setNewFood({ ...newFood, description: e.target.value })}
                  placeholder="Description"
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <input
                  type="number"
                  value={newFood.price}
                  onChange={(e) => setNewFood({ ...newFood, price: e.target.value })}
                  placeholder="Price *"
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <input
                  type="text"
                  value={newFood.imageUrl}
                  onChange={(e) => setNewFood({ ...newFood, imageUrl: e.target.value })}
                  placeholder="Image URL"
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <select
                  value={newFood.categoryId}
                  onChange={(e) => setNewFood({ ...newFood, categoryId: e.target.value })}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="">Select Category *</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <button
                  onClick={handleCreateFood}
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
                >
                  Add Food
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-gray-600">Name</th>
                    <th className="px-6 py-3 text-left text-gray-600">Price</th>
                    <th className="px-6 py-3 text-left text-gray-600">Status</th>
                    <th className="px-6 py-3 text-left text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {foods.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                        No food items yet
                      </td>
                    </tr>
                  ) : (
                    foods.map((food) => (
                      <tr key={food.id} className="border-t">
                        <td className="px-6 py-4">{food.name}</td>
                        <td className="px-6 py-4">${food.price}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${food.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {food.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex gap-2">
                          <button
                            onClick={() => handleToggleStatus(food.id, food.status)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            Toggle
                          </button>
                          <button
                            onClick={() => handleDeleteFood(food.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;