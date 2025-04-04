import { useRef } from 'react';
import gsap from 'gsap';
import Navbar from '../components/navbar';
import Registeration from '../components/Registeration';

const Home = () => {
  const homeRef = useRef<HTMLDivElement>(null);

  useRef(() => {
    gsap.fromTo(
      homeRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    );
  });

  return (
    <div 
      ref={homeRef} 
      className="min-h-screen w-screen bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-16 md:py-0"
    >
      <Navbar />
      
      <div className="flex items-center justify-center h-screen pb-8">
        <div className="relative w-full max-w-md md:max-w-xl">
          <div className="relative bg-gray-800/80 backdrop-blur-md md:backdrop-blur-xl rounded-xl md:rounded-3xl shadow-lg md:shadow-2xl border border-gray-700/30 overflow-hidden">
            <div className="mt-5 md:p-10 space-y-6 md:space-y-8">
              <div className="text-center space-y-3 md:space-y-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-400 to-indigo-600 bg-clip-text text-transparent">
                  Student Portal
                </h1>
                <p className="text-green-500 text-base md:text-lg ">
                  Secure Academic System
                </p>
              </div>

              <div className="flex justify-center items-center p-3">
                <Registeration />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;