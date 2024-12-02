/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');
import tailwindcssMotion from "tailwindcss-motion";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
          "pinkbg1": "#8A3F98",
          "pinkbg2": "#843B8D",
          "pinkbg3": "#350404",
          "light-pink-200": "#D68FED",
          "light-pink-300": "#A463BA",
      },
      fontFamily: {
        "iniria-serif":["Inria Serif", "serif"],
        "iniria-sans":["Inria Sans", "serif"] ,
        "italiana":["Italiana","serif"],
        "heading-font": ["Noto Serif Display","serif"]
      },
      borderWidth: {
        DEFAULT: '1px',
        '0': '0',
        '2': '2px',
        '3': '2.5px',
        '4': '4px',
        '6': '6px',
        '8': '8px',
      }  

    },
  },
  variants: {
    extend: {
        backgroundColor: ['label-checked'], // you need add new variant to a property you want to extend
    },
},
plugins: [
  plugin(({ addVariant, e }) => {
      addVariant('label-checked', ({ modifySelectors, separator }) => {
          modifySelectors(
              ({ className }) => {
                  const eClassName = e(`label-checked${separator}${className}`); // escape class
                  const yourSelector = 'input[type="radio"]'; // your input selector. Could be any
                  return `${yourSelector}:checked ~ .${eClassName}`; // ~ - CSS selector for siblings
              }
          )
      })
  }),
  tailwindcssMotion
],
}

