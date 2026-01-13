import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        steady: "#10b981", // 绿色
        flow: "#eab308", // 黄色
        edge: "#f97316", // 橙色
        stop: "#ef4444", // 红色
      },
    },
  },
  plugins: [],
};
export default config;
