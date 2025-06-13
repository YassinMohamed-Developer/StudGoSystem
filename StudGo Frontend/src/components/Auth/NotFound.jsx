import { useAuthStore } from "../../store/authStore.js";
import { motion } from "framer-motion";

export default function NotFound() {
  const { currentUser } = useAuthStore();

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Stars background */}
      <div className="absolute inset-0">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      {/* Animated planets */}
      <div className="absolute inset-0 z-0">
        {/* Large planet */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: 360,
          }}
          transition={{
            y: {
              duration: 6,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            },
            rotate: {
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            },
          }}
          className="absolute -right-20 top-20 w-64 h-64 rounded-full bg-gradient-to-br from-orange-400 to-red-600 opacity-30 blur-sm"
        />

        {/* Small planet */}
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className="absolute left-20 bottom-32 w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 opacity-40 blur-sm"
        />

        {/* Medium planet with ring */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: 360,
          }}
          transition={{
            scale: {
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            },
            rotate: {
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            },
          }}
          className="absolute left-1/4 top-1/4 w-40 h-40"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-400 to-emerald-600 opacity-30 blur-sm"></div>
          <div className="absolute inset-0 -rotate-45 scale-110">
            <div className="w-full h-6 bg-gradient-to-r from-purple-400/30 to-transparent blur-sm"></div>
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center w-full max-w-[400px] mx-auto"
        >
          {/* Animated astronaut */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
            className="w-full flex justify-center items-center"
          >
            <motion.img 
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, -5, 5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
              className="w-full max-w-[200px] sm:max-w-[240px] md:max-w-[280px] h-auto object-contain mx-auto mb-4" 
              src="./../../../notfound.png" 
              alt="Lost Astronaut"
            />
          </motion.div>
          
          {/* Enhanced text content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center flex flex-col items-center gap-y-3"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-x-4">
                <span className="font-bold text-4xl sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                  404
                </span>
                <div className="h-12 w-0.5 bg-gray-600 hidden sm:block"></div>
                <h1 className="hidden sm:block text-2xl sm:text-3xl font-bold text-white">
                  Page Not Found
                </h1>
              </div>
              <h1 className="sm:hidden text-2xl font-bold text-white">
                Page Not Found
              </h1>
              
              <div className="relative">
                <p className="text-lg sm:text-xl font-semibold text-white mb-2">
                  Lost in Deep Space!
                </p>
                <p className="text-sm sm:text-base text-gray-300 max-w-md mx-auto">
                  Houston, we have a problem! The page you're looking for seems to have drifted into a cosmic void.
                </p>
              </div>
            </div>

            {/* Enhanced button */}
            <motion.div 
              className="mt-6"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a
                href={currentUser?.role === "StudentActivity" ? "/student-activity" : "/"}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Return to Earth
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
