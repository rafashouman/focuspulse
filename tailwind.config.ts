import type { Config } from "tailwindcss";

const config: Config = {

  darkMode: "class",

  content: [

    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",

    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",

    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",

  ],

  theme: {

    extend: {

      colors: {

        background: "#08090A",

        surface: "#121417",

        "surface-border": "#1E2228",

        brand: {

          orange: "#F97316",

          amber: "#F59E0B",

          light: "#FB923C",

        },

      },

      boxShadow: {

        "orange-glow": "0 0 25px -5px rgba(249, 115, 22, 0.4)",

        "amber-glow": "0 0 25px -5px rgba(245, 158, 11, 0.4)",

      },

    },

  },

  plugins: [],

};

export default config;
