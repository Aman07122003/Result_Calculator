import { Link } from 'react-router-dom';

const Navbar = ({ toggleTheme, isDarkMode }: { toggleTheme: () => void; isDarkMode: boolean }) => {
  return (
    <div className="h-[10vh] w-full flex justify-between bg-gray-200 dark:bg-gray-900 transition-colors duration-300">
      <div className="h-full ml-3 md:ml-0 md:w-3/12 w-[45%] flex items-center justify-center text-2xl md:text-4xl font-bold font-mono text-gray-800 dark:text-white">
        Result Management
      </div>
      <div className="h-full md:w-3/12 w-[50%] flex items-center justify-center md:text-xl text-sm md:font-bold font-mono">
        <Link to='/login' className="hover:text-black delay-75 text-gray-400 dark:text-gray-300">
            Admin_Login
        </Link>

        {/* Toggle Switch */}
        <div
          onClick={toggleTheme}
          className={`md:w-14 md:h-7 w-11 h-5 flex items-center px-1 bg-gray-700 dark:bg-gray-300 rounded-full cursor-pointer shadow-md md:ml-7 ml-4 transition-all duration-300 ease-in`}
        >
          {/* Inner circle */}
          <div
            className={`md:w-5 md:h-5 w-4 h-4 bg-amber-200 rounded-full transition-transform duration-300 ${
              isDarkMode ? 'translate-x-7' : 'translate-x-0'
            }`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
