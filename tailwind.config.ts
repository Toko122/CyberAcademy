import type { Config } from "tailwindcss";

export default {
  theme: {
    extend: {
      perspective: {
        DEFAULT: "2000px",
      },
    },
  },
  plugins: [
    function ({ addUtilities }: any) {
      addUtilities({
        ".perspective": {
          perspective: "2000px",
        },
        ".transform-style": {
          transformStyle: "preserve-3d",
        },
        ".rotate-y-80": {
          transform: "rotateY(-80deg)",
        },
      });
    },
  ],
} satisfies Config;