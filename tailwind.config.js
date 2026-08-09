/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        progressAnimation: {
          "0%": { width: "0%" }
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" }
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" }
        }
      },
      colors: {
        "modal-bg-dark": "#0f1419",
        primary: "#000",
        secondary: "#fff",
        transparentBg: "#0000004f",
        darkComponentBg: "#3d3d3d",
        darkComponentText: "#808080",
        neon: {
          pink: "#ff006e",
          purple: "#8f00ff",
          cyan: "#00d9ff",
          green: "#00ff88",
          orange: "#ff6b35"
        },
        gradient: {
          start: "#ff006e",
          mid: "#8f00ff",
          end: "#00d9ff"
        }
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
        progress: "progressAnimation 1.5s ease-in-out",
        slideUp: "slideUp 0.5s ease-out",
        slideDown: "slideDown 0.5s ease-out",
        fadeIn: "fadeIn 0.6s ease-in",
        scaleIn: "scaleIn 0.4s ease-out",
        shimmer: "shimmer 2s infinite"
      },
      backdropBlur: {
        md: "12px"
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
