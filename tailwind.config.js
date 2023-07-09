/** @type {import('tailwindcss').Config} */
module.exports = {
	daisyui: {
		themes: ["light", "forest"],
	},
	content: [
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",

		// Or if using `src` directory:
		"./src/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			backgroundImage: {
				"middle-bar":
					"url('https://ik.imagekit.io/e5ixuxrlb/esm/wp2629004-camouflage-wallpaper-hd.jpg?updatedAt=1684222571818')",
			},
			flexGrow: {
				2: '2',
				10: '10,'
			},
			colors: {
				'rainbow': 'linear-gradient(90deg, #ff6464 0%, #ffbf59 50%, #47c9ff 100%)',
			},
		},
	},
	plugins: [require("daisyui")],
};
