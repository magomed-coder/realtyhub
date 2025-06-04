/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
    // другие пути к вашим файлам, где используется Tailwind
  ],
  theme: {
    extend: {
      // сюда можно добавлять расширения для цветов, шрифтов, и т.д.
      colors: {
        brand: {
          50: "#f0f3f4", // светло-серый/пастельный
          100: "#C7D4E4", // бледный голубовато-серый
          200: "#E7E7EC", // самый светлый акцент
          300: "#AAAAAA", // средний серый
          400: "#55FF55", // ярко-зелёный
          500: "#00AA00", // насыщенный зелёный
          600: "#ABEBC6", // светло-зеленый
        },
        custom: {
          // логическая группа "custom"

          "background-light": "#e4e9f7",
          brand: "#009257",
          "brand-light": "#f6f5ff",
          "switch-bg": "#dddddd",
          "text-secondary": "#707070",
        },
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
