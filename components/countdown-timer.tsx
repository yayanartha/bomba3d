import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const CountdownTimer = () => {
	const [timer, setTimer] = useState(3);

	useEffect(() => {
		const interval = setInterval(() => {
			setTimer((t) => t - 1);
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	return (
		<motion.div
			className="text-9xl text-red-700 text-center"
			animate={{ scale: [1, 1, 1.5], opacity: [0, 1, 0] }}
			transition={{
				duration: 1,
				ease: "easeInOut",
				times: [0, 0.1, 1],
				repeat: 3,
			}}
		>
			{timer > 0 ? timer : "⚔️"}
		</motion.div>
	);
};
