import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Maisonette color palette
        'maisonette-blue': {
          50: '#F0F4F8',
          100: '#D4E4F7',
          200: '#B3D4E8',
          300: '#7B9EBF',
          400: '#6B8CAA',
          500: '#5B7C99',
          600: '#4A6FA5',
          700: '#3E5B7A',
          800: '#2C3E50',
          900: '#1A2B3A',
        },
        coral: {
          50: '#FFE5E5',
          100: '#FFCCCC',
          200: '#FFB3B3',
          300: '#FF9999',
          400: '#FF8080',
          500: '#FF6B6B',
          600: '#E85555',
          700: '#D14040',
          800: '#BA2A2A',
          900: '#A31515',
        },
        // EXACT MAISONETTE COLOR PALETTE
        'maisonette-main': '#F2E9DD', // Main background - EXACT color from picker
        'maisonette-alt': '#FAF7F2',  // Alternating sections
        'maisonette-cream': '#EDE4D3', // Special cream accent
        'card-white': '#FFFFFF',      // Pure white for cards/products
        'text-header': '#2B3640',     // Blue-gray headers (never pure black)
        'text-body': '#546B7A',       // Muted blue-gray body text
        'button-soft-blue': '#7B92A8', // Soft blue buttons
        'sale-coral': '#E8A598',      // Muted coral sale badges
        // Semantic color assignments
        primary: '#5B7C99',
        secondary: '#7B9EBF',
        accent: '#FF6B6B',
        'text-primary': '#2C3E50',
        'text-secondary': '#546E7A',
        'text-brand': '#7B9EBF',
        'text-light': '#8FA8B8',
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#666666',
          600: '#525252',
          700: '#404040',
          800: '#2C2C2C',
          900: '#171717',
        },
        // Kiddora Brand Colors
        'kiddora-pink': '#FE7FEE',
        'kiddora-blue': '#405AFF',
        'kiddora-cream': '#FFF4EO',
        'kiddora-teal': '#6EBAEE',
        'kiddora-dark': '#2E2E2E',
        'kiddora-gray': '#5E5E5E',
      },
      fontFamily: {
        sans: ['var(--font-nunito)', 'Nunito', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['var(--font-nunito)', 'Nunito', 'Georgia', 'serif'],
        heading: ['var(--font-nunito)', 'Nunito', 'system-ui', 'sans-serif'],
        body: ['var(--font-nunito)', 'Nunito', 'sans-serif'],
        nav: ['var(--font-nunito)', 'Nunito', 'sans-serif'],
        hebrew: ['var(--font-rubik)', 'Rubik', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-tajawal)', 'Tajawal', 'system-ui', 'sans-serif'],
      },
      animation: {
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-gentle': 'bounceGentle 0.5s ease-out',
      },
      keyframes: {
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceGentle: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '50%': { transform: 'translateY(-5px)', opacity: '1' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'minimal': '0 1px 3px rgba(0, 0, 0, 0.08)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'hover': '0 4px 12px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [
    require('tailwindcss-logical'),
  ],
  // Enable RTL support
  corePlugins: {
    // Keep all core plugins enabled
  },
};
export default config;
