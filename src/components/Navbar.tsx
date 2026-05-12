import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-orange-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/foods" className="text-2xl font-bold">
          🍕 FoodOrder
        </Link>

        <div className="flex items-center gap-6">
          {isAdmin ? (
            <Link to="/admin" className="hover:text-orange-200 transition">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/foods" className="hover:text-orange-200 transition">
                Menu
              </Link>
              <Link to="/cart" className="hover:text-orange-200 transition">
                🛒 Cart
              </Link>
              <Link to="/orders" className="hover:text-orange-200 transition">
                📦 Orders
              </Link>
            </>
          )}

          <div className="flex items-center gap-3">
            <span className="text-orange-200 text-sm">
              Hello, {user?.fullName}
            </span>
            <button
              onClick={handleLogout}
              className="bg-white text-orange-500 px-4 py-1 rounded-lg hover:bg-orange-100 transition font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;