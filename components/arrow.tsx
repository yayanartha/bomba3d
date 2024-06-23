export const Arrow = ({ stroke = false }: { stroke?: boolean }) => {
	return (
		<svg
			width="40"
			height="40"
			viewBox="0 0 26 30"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M2.25 11.9689L20.25 1.57661C22.5833 0.229453 25.5 1.91339 25.5 4.60769L25.5 25.3923C25.5 28.0866 22.5833 29.7705 20.25 28.4234L2.25 18.0311C-0.0833317 16.6839 -0.0833342 13.3161 2.25 11.9689Z"
				fill="#FFD700"
				stroke={stroke ? "#A0522D" : undefined}
			/>
		</svg>
	);
};
