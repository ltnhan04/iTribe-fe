/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        blue: "#4880FF",
        blackLight: "#202224",
        grayLight: "#F8F8FF",
        grayBorder: "#d9d9d9",
      },
    },
  },
  plugins: [],
};
