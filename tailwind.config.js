/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./src/app/components/**/*.{html,ts}", // Add path for user-related components
    "./src/app/admin/**/*.{html,ts}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "green-custom": "#32de84", // Base green color
        "green-custom-dark": "#2ec973", // Darker shade for hover
        "green-custom-light": "#57e89d", // Lighter shade for focus ring
      },
    },
  },
  plugins: [],
};
