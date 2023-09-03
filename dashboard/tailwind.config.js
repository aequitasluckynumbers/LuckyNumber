/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./popups/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#311951",
        "primary-varient": "#6E6893",
        secondary: "#25213B",
        danger: "#EB5757",
        border: "#d9d9d9",
        "border-500": "#DFDFEC",
        background: "#F8F8FF",
      },
    },
  },
  plugins: [],
};
