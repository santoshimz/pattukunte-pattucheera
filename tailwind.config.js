/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        progressAnimation: {
          "0%": { width: "0%" }
        }
      },
      colors: {
        "modal-bg-dark": "#1a1b1a",
        primary: "#000",
        secondary: "#fff",
        transparentBg: "#0000004f",
        darkComponentBg: "#3d3d3d",
        darkComponentText: "#808080"
      },
      spacing: {
        90: "22.5rem",
        1.25: "5px",
        2.75: "11px",
        90: "90%",
        85: "85%"
      },
      minWidth: {
        10: "2.5rem",
        33: "33.3333%",
        50: "50%",
        68: "68%",
        96: "24rem"
      },
      maxWidth: {
        82: "78%"
      },
      animation: {
        progress: "progressAnimation 1.5s ease-in-out"
      },
      zIndex: {
        1: "1"
      }
    },
    screens: {
      sm: "380px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px"
    }
  },
  plugins: []
};
