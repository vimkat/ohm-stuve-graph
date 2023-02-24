import React from "react";

const css = `
	html[data-theme="dark"] .ohm-icon {
		fill: #FEFEFE;
	}
`;

const Logo = ({ size = 30 }) => (
	<svg
		width={size}
		height={size}
		version="1.1"
		viewBox="-.79428 -.79428 26.277 26.339"
		xmlns="http://www.w3.org/2000/svg"
	>
		<style>{css}</style>
		<path
			className="ohm-icon"
			fill="#0C0C0C"
			d="m-1.0164-0.78918h26.339v13.841l-4.89 5.5363h4.89v6.9562l-12.031-0.01v-20.879h-2.2662v20.879h-12.036v-6.9475h4.8888l-4.8888-5.5401v-13.841z"
		/>
	</svg>
);

export default Logo;

export const LogoIcon = () => <Logo size={30} />;
export const LogoFull = () => <Logo size={125} />;
