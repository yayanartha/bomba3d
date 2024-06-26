"use client";
import { GameState, useGameEngine } from "@/hooks/use-game-engine";
import { Environment } from "@react-three/drei";
import dynamic from "next/dynamic";

const Lobby = dynamic(() => import("./lobby"), { ssr: false });
const Game = dynamic(() => import("./game"), { ssr: false });
const Podium = dynamic(() => import("./podium"), { ssr: false });

export const Experience = () => {
	const { gameState } = useGameEngine();
	const isInGame = [GameState.CountDown, GameState.Game].includes(gameState);

	return (
		<>
			{gameState === GameState.Lobby && <Lobby />}
			{isInGame && <Game />}
			{gameState === GameState.Winner && <Podium />}

			<directionalLight intensity={0.5} position={[5, 15, -5]} castShadow />
			<Environment preset="warehouse" />
			<fog
				attach="fog"
				args={["#FDF4C3", isInGame ? 40 : 10, isInGame ? 100 : 40]}
			/>
		</>
	);
};
