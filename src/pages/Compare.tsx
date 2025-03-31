import BarChart from "../components/BarChart";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const Compare = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center p-4">
      <div className="h-full md:h-[95vh] w-full max-w-7xl bg-white rounded-2xl shadow-2xl flex flex-col">
        {/* Header with Glassmorphism Effect */}
        <div className="p-6 bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 md:mb-0">
              <span className="text-blue-600">Aman</span>
              <span className="mx-3 text-gray-400">vs</span>
              <span className="text-pink-600">Stuti</span>
            </h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-600 mr-2"></div>
                <span className="text-sm text-gray-600">Aman's Marks</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-pink-600 mr-2"></div>
                <span className="text-sm text-gray-600">Stuti's Marks</span>
              </div>
            </div>
          </div>
          <p className="text-center md:text-left text-gray-500 mt-2 text-sm">
            Academic Performance Comparison Dashboard
          </p>
        </div>

        {/* Chart Section */}
          <div className="flex-1 p-4 md:p-6 overflow-hidden">
            <div className="h-full w-full rounded-xl border border-gray-100 bg-white shadow-sm p-2 md:p-4">
              <div className="h-full w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <div className="md:min-w-[600px] min-w-[1000px] h-full"> 
                  <BarChart />
                </div>
              </div>
            </div>
          </div>

        {/* Stats Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 border-t border-gray-100 bg-gray-50/50">
          {/* Rank Comparison Card */}
          <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">Rank Comparison</h3>
            <div className="flex justify-between items-center">
              <span className="text-blue-600 font-bold text-2xl">1</span>
              <span className="text-pink-600 font-bold text-2xl">5</span>
            </div>
          </div>

          {/* CGPA Comparison Card */}
          <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">CGPA Comparison</h3>
            <div className="flex justify-between items-center">
              <span className="text-blue-600 font-bold text-2xl">8.7</span>
              <span className="text-pink-600 font-bold text-2xl">8.2</span>
            </div>
          </div>

          {/* Total Credits Card */}
          <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">Total Credits</h3>
            <div className="flex justify-between items-center">
              <span className="text-blue-600 font-bold text-2xl">160</span>
              <span className="text-pink-600 font-bold text-2xl">155</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compare;