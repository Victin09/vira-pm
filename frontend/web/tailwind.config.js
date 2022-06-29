module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      "colors": {
        'cornflower': { DEFAULT: '#8ECAE6', '50': '#FFFFFF', '100': '#FFFFFF', '200': '#F2F9FC', '300': '#D1E9F5', '400': '#AFDAED', '500': '#8ECAE6', '600': '#60B4DC', '700': '#329FD2', '800': '#257DA7', '900': '#1B5B79' },
        'eastern-blue': { DEFAULT: '#219EBC', '50': '#A5E1EF', '100': '#94DBEC', '200': '#71D0E6', '300': '#4FC4E0', '400': '#2CB8DA', '500': '#219EBC', '600': '#19768C', '700': '#104E5D', '800': '#08262D', '900': '#000000' },
        'green-vogue': { DEFAULT: '#023047', '50': '#09A8F8', '100': '#069BE6', '200': '#0580BE', '300': '#046696', '400': '#034B6F', '500': '#023047', '600': '#000B10', '700': '#000000', '800': '#000000', '900': '#000000' },
        'selective-yellow': { DEFAULT: '#FFB703', '50': '#FFEBBB', '100': '#FFE6A6', '200': '#FFDA7D', '300': '#FFCE55', '400': '#FFC32C', '500': '#FFB703', '600': '#CA9000', '700': '#926800', '800': '#5A4000', '900': '#221800' },
        'flush-orange': { DEFAULT: '#FB8500', '50': '#FFDCB4', '100': '#FFD29F', '200': '#FFBF76', '300': '#FFAC4E', '400': '#FF9825', '500': '#FB8500', '600': '#C36700', '700': '#8B4A00', '800': '#532C00', '900': '#1B0E00' },
      }
    },
  },
  plugins: [require("daisyui")],
}