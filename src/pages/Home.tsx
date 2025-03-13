import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import Navbar from '../components/navbar';
import Registeration from '../components/Registeration';

const Home = () => {
  const homeRef = useRef<HTMLDivElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme ? savedTheme === 'dark' : systemDark;
  });

  useEffect(() => {
    // Apply animation on mount
    gsap.fromTo(
      homeRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
    );

    // Apply initial theme
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <div ref={homeRef} className="h-[100vh] w-screen bg-gray-200 dark:bg-gray-900 transition-colors duration-300">
      <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      <div className="flex items-center justify-center h-[85vh]">
        <Registeration />
      </div>
    </div>
  );
};

export default Home;