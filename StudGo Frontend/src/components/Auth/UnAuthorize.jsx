import { useAuthStore } from "../../store/authStore.js";
import { motion } from "framer-motion";

function UnAuthorize() {
  const { currentUser } = useAuthStore();

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Warning lights effect */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="warning-light-red"></div>
          <div className="warning-light-blue"></div>
        </div>
      </div>

      {/* Security pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="security-pattern"></div>
      </div>

      <div className="relative h-full flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[400px] text-center"
        >
          {/* Image container */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
            className="mb-8"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.02, 1],
                rotate: [0, -1, 1, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
              className="relative"
            >
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="absolute inset-0 blur-xl bg-red-500/20 rounded-full"
              />
              <img 
                className="w-full max-w-[150px] mx-auto"
                src="./../../../unAuth.png" 
                alt="Unauthorized Access"
              />
            </motion.div>
          </motion.div>

          {/* Content container */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* 401 number */}
            <motion.div 
              animate={{ 
                scale: [1, 1.02, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="flex items-center justify-center gap-4"
            >
              <div className="w-6 h-6 rounded-full bg-red-500 animate-pulse"></div>
              <span className="font-bold text-4xl sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-red-400 to-red-500">
                401
              </span>
              <div className="w-6 h-6 rounded-full bg-red-500 animate-pulse"></div>
            </motion.div>

            {/* Alert text */}
            <div className="space-y-4">
              <motion.h1 
                animate={{
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="text-xl sm:text-2xl font-bold text-white tracking-wider uppercase whitespace-nowrap"
              >
                SECURITY ALERT: ACCESS DENIED
              </motion.h1>
              
              <div className="p-4 border-2 border-red-500/30 rounded-lg bg-gray-900/50 backdrop-blur-sm">
                <p className="text-sm sm:text-base text-gray-300 font-medium">
                  ⚠️ RESTRICTED AREA ⚠️<br/>
                  Your security clearance is insufficient to access this area.<br/>
                  Please verify your credentials or contact system administrator.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/login"
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Verify Credentials
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={currentUser?.role === "StudentActivity" ? "/student-activity" : "/"}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700 flex items-center justify-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Return to Safe Zone
              </motion.a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default UnAuthorize;