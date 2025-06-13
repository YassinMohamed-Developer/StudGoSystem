/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}',
    './index.html'
  ],
  theme: {
    extend: {
      colors:{
        main: "#111827", /* gray-900 */
        sec:" #1d4ed8", /* blue-700 */
        textColor: "#ffffff", /* white */
        lightColor:" #f0f3f2"
      },
      animation: {
        blob: "blob 7s infinite",
        'twinkle-1': 'twinkle 4s infinite',
        'twinkle-2': 'twinkle 6s infinite',
        'twinkle-3': 'twinkle 8s infinite',
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
        twinkle: {
          '0%, 100%': {
            opacity: 1,
          },
          '50%': {
            opacity: 0.3,
          },
        },
      },
    },
  },
  plugins: [],
}

