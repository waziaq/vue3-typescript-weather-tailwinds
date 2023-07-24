/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "weather-primary": "#F96B01",
                "weather-secondary": "#CF3E82"
            },
            maxWidth: {
                '1/2': '50%',
                '2/3': '66.666%',
              }        
        },
        fontFamily: {
            roboto: ["Roboto, san-serif"]
        },
        container: {
            padding: "2rem",
            center: true
        },
        screens: {
            sm: "640px",
            md: "768px"
        }
    },
    plugins: [],
}