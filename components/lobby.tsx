"use client";
import {
	type PlayerState as PlayroomPlayerState,
	myPlayer,
	usePlayersList,
} from "playroomkit";
import { Board } from "./board";
import { Ship, Ships } from "./ship";
import { useState } from "react";
import { PlayerState, Role } from "@/hooks/use-game-engine";
import { Box, ContactShadows } from "@react-three/drei";

export default function Lobby() {
	const players = usePlayersList(true);
	const me = myPlayer();

	console.log("PLAYERS", players);

	return (
		<>
			<Board />
			{me && <RoleSwitcher player={me} />}
		</>
	);
}

const RoleSwitcher = ({ player }: { player: PlayroomPlayerState }) => {
	const [role, setRole] = useState<string>(player.getState(PlayerState.Role));
	const model = Ships.find((ship) => ship.role === role);

	return <Ship model={model} />;
};
