"use client";
import {
	type PlayerState as PlayroomPlayerState,
	myPlayer,
	usePlayersList,
	usePlayerState,
} from "playroomkit";
import { Board } from "./board";
import { Ship, Ships } from "./ship";
import { PlayerState, Role } from "@/hooks/use-game-engine";

export default function Lobby() {
	usePlayersList(true);
	const me = myPlayer();

	return (
		<>
			<Board />
			{me && <RoleSwitcher player={me} />}
		</>
	);
}

const RoleSwitcher = ({ player }: { player: PlayroomPlayerState }) => {
	const [role] = usePlayerState(player, PlayerState.Role, Role.Pirate);
	const model = Ships[role === Role.Pirate ? 0 : 1];

	return <Ship model={model} />;
};
