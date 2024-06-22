interface Props {
	icon: string;
	value: number;
	maxValue: number;
}

export const StatusBar = ({ icon, value, maxValue }: Props) => {
	return (
		<div className="flex flex-row gap-3">
			<div className="text-2xl">{icon}</div>
			<div className="w-full h-7 bg-red-300 -skew-x-12 rounded-md">
				<div
					className="flex flex-row items-center h-full bg-red-500 rounded-md px-2"
					style={{ width: `${(value / maxValue) * 100}%` }}
				>
					<div className="skew-x-12 text-white text-2xl ">{value}</div>

					{value >= maxValue && (
						<div className="absolute right-1 text-xl text-yellow-200">MAX</div>
					)}
				</div>
			</div>
		</div>
	);
};
