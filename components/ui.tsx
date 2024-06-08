import { useRef } from "react";

export const UI = () => {
	const atbBarRef = useRef<HTMLDivElement>(null);

	return (
		<main className="fixed top-0 left-0 right-0 bottom-0 z-10 flex flex-col gap-4 items-stretch justify-between pointer-events-none">
			<div
				ref={atbBarRef}
				className="h-12 rounded-2xl bg-slate-600 border-slate-300 border-2 m-6"
			></div>
		</main>
	);
};
