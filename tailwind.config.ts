import type { Config } from "tailwindcss"

export default {
    content: [
        "./app/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
    ],
    theme: {
        extend: {
            keyframes: {
                cardIn: {
                    from: { opacity: "0", transform: "translateY(14px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                trendIn: {
                    from: { width: "0" },
                    to: { width: "100%" },
                },
            },
            animation: {
                "card-in": "cardIn 0.4s ease forwards",
                "trend-in": "trendIn 0.8s ease forwards",
            },
        },
    },
    plugins: [],
} satisfies Config