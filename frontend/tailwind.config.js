/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	prefix: "",
	darkMode: 'class', // Enables the dark: variants
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				// primary: {
				// 	DEFAULT: 'hsl(var(--primary))',
				// 	foreground: 'hsl(var(--primary-foreground))'
				// },
				primary: "#C3F53C",
				"primary-dark": "#aadd2b",
				"background-light": "#F8F9FA",
				"background-dark": "#0F172A",
				"card-light": "#FFFFFF",
				"card-dark": "#1E293B",
				"text-primary-light": "#111827",
				"text-primary-dark": "#F3F4F6",
				"text-secondary-light": "#6B7280",
				"text-secondary-dark": "#9CA3AF",
				"accent-green":"#4ade80",
				"accent-red":"#f87171",
				"card-hover":"#3f3f46",
				"card-hover-dark":"#374151",
			},
			secondary: {
				DEFAULT: 'hsl(var(--secondary))',
				foreground: 'hsl(var(--secondary-foreground))'
			},
			destructive: {
				DEFAULT: 'hsl(var(--destructive))',
				foreground: 'hsl(var(--destructive-foreground))'
			},
			muted: {
				DEFAULT: 'hsl(var(--muted))',
				foreground: 'hsl(var(--muted-foreground))'
			},
			accent: {
				DEFAULT: 'hsl(var(--accent))',
				foreground: 'hsl(var(--accent-foreground))'
			},
			popover: {
				DEFAULT: 'hsl(var(--popover))',
				foreground: 'hsl(var(--popover-foreground))'
			},
			card: {
				DEFAULT: 'hsl(var(--card))',
				foreground: 'hsl(var(--card-foreground))'
			},
			sidebar: {
				DEFAULT: 'hsl(var(--sidebar-background))',
				foreground: 'hsl(var(--sidebar-foreground))',
				primary: 'hsl(var(--sidebar-primary))',
				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
				accent: 'hsl(var(--sidebar-accent))',
				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
				border: 'hsl(var(--sidebar-border))',
				ring: 'hsl(var(--sidebar-ring))'
			}
		},
		borderRadius: {
			DEFAULT:"0.75rem",
			lg: 'var(--radius)',
			md: 'calc(var(--radius) - 2px)',
			sm: 'calc(var(--radius) - 4px)',
			'3xl': '1.5rem',
			'4xl': '2.5rem',
		},
		keyframes: {
			'accordion-down': {
				from: {
					height: '0'
				},
				to: {
					height: 'var(--radix-accordion-content-height)'
				}
			},
			'accordion-up': {
				from: {
					height: 'var(--radix-accordion-content-height)'
				},
				to: {
					height: '0'
				}
			}
		},
		animation: {
			'accordion-down': 'accordion-down 0.2s ease-out',
			'accordion-up': 'accordion-up 0.2s ease-out'
		},
	backgroundImage: {
		'green-gradient': 'linear-gradient(135deg, #D9FF50 0%, #B8E828 100%)',
		'footer-gradient': 'linear-gradient(180deg, #FFFFFF 0%, #EAFF96 100%)',
		'footer-gradient-dark': 'linear-gradient(180deg, #0F172A 0%, #1a2e1a 100%)',
	},
	fontFamily: {
		sans: ['Inter', 'sans-serif'],
		display: ['Space Grotesk', 'sans-serif'],
		serif:['Playfair Display', 'serif'],
		mono: ['SF Mono', 'monospace'],
	}
},

plugins: [
		require("tailwindcss-animate"),
		require('@tailwindcss/forms'),
		require('@tailwindcss/typography')
	],
}