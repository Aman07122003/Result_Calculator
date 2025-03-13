import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { Suspense, lazy } from "react";

const Result = lazy(() => import("../pages/result"));

const Loader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tl = gsap.timeline();

    // Rotate Animation
    tl.to(".loader-logo", { rotation: 360, duration: 2, ease: "power2.out" })
      .to(".loader-text", { opacity: 1, y: -10, duration: 1 }, "-=1.5")
      .to(".loader", { opacity: 0, duration: 1, ease: "power2.inOut", delay: 1 })
      .call(() => setLoading(false)); // Hide loader after animation
  }, []);

  return loading ? (
    <div className="loader fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white">
      <motion.div
        className="loader-logo w-16 h-16 bg-white rounded-full flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        🔄
      </motion.div>
      <motion.p
        className="loader-text mt-4 text-lg font-semibold opacity-0"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.5 }}
      >
        Loading your result....
      </motion.p>
    </div>
  ) : (
    <Suspense>
      <Result />
    </Suspense>
  );
};

export default Loader;
