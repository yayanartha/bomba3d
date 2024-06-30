import { motion } from "framer-motion";
interface Props {
	icon: string;
	value: number;
	maxValue: number;
}

export const StatusBar = ({ icon, value, maxValue }: Props) => {
	return (
		<div className="flex flex-row gap-3">
			<div className="text-2xl">{icon}</div>
			<div className="w-full h-6 bg-yellow-900/30 -skew-x-12 rounded-md">
				<motion.div
					layout
					initial={{ width: 0 }}
					animate={{ width: `${(value / maxValue) * 100}%` }}
					className="absolute h-full bg-yellow-300 rounded-md"
				/>
				<div className=" w-full h-full flex flex-row items-center justify-between px-2">
					<div className="skew-x-12 text-slate-700 text-xl">{value}</div>
					{value >= maxValue && (
						<div className="absolute right-1 text-xl text-red-700">MAX</div>
					)}
				</div>
			</div>
		</div>
	);
};
