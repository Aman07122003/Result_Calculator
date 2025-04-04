import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="h-14 md:h-16 w-full px-4 md:px-6 flex items-center justify-between backdrop-blur-lg bg-gray-900/80 border-b border-gray-700/30 fixed top-0 z-50">
      <div className="flex items-center">
        <span className="text-2xl md:text-4xl lg:text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
          ResultHub
        </span>
      </div>

      <div className="flex items-center space-x-4 md:space-x-6">
        <Link 
          to="/login" 
          className="px-4 mr-4 py-2 bg-gradient-to-r from-green-400 to-indigo-400 text-white text-sm md:text-base font-semibold rounded-lg shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
        >
          Admin Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;