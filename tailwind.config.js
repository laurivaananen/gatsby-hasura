module.exports = {
  purge: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  variants: {
    backgroundColor: [
      "responsive",
      "hover",
      "focus",
      "active",
      "group-hover",
      "disabled",
    ],
    cursor: ["responsive", "hover", "focus", "disabled"],
  },
  plugins: [],
}
