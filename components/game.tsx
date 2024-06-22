import { CameraControls, Environment, OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { Board } from "./board";
import { RigidBody, vec3 } from "@react-three/rapier";
import { ShipLargeController } from "./ship-large-controller";
import { ShipSmallController } from "./ship-small-controller";
import { MissileController } from "./missile-controller";
import { MineController } from "./mine-controller";
import {
	GameState,
	PlayerState,
	Role,
	useGameEngine,
} from "@/hooks/use-game-engine";
import { isHost, myPlayer } from "playroomkit";
import { useThree } from "@react-three/fiber";
import { FireHit } from "./FireHit";

export default function Game() {
	const {
		piratePlayer,
		marinePlayer,
		mines,
		missiles,
		networkMines,
		networkMissiles,
		hitByMine,
		hitByMissile,
		networkHitByMine,
		networkHitByMissile,
		onHitByMine,
		onHitByMissile,
		onHitByMineEnded,
		onHitByMissileEnded,
	} = useGameEngine();
	const viewport = useThree((state) => state.viewport);
	const scalingRatio = Math.min(1, viewport.width / 3);

	return (
		<>
			<Board />

			<group scale={scalingRatio}>
				{(isHost() ? mines : networkMines).map((mine) => (
					<MineController
						key={mine.id}
						{...mine}
						onHit={(position) => onHitByMine(mine.id, position)}
					/>
				))}

				{(isHost() ? missiles : networkMissiles).map((missile) => (
					<MissileController
						key={missile.id}
						{...missile}
						onHit={(position) => onHitByMissile(missile.id, position)}
					/>
				))}

				{(isHost() ? hitByMine : networkHitByMine).map((hit) => (
					<FireHit
						key={hit.id}
						{...hit}
						onEnded={() => onHitByMineEnded(hit.id)}
					/>
				))}

				{(isHost() ? hitByMissile : networkHitByMissile).map((hit) => (
					<FireHit
						key={hit.id}
						{...hit}
						onEnded={() => onHitByMissileEnded(hit.id)}
					/>
				))}

				{piratePlayer && (
					<ShipSmallController
						state={piratePlayer.state}
						control={piratePlayer.joystick}
						isPlayer={myPlayer().id === piratePlayer.state.id}
					/>
				)}

				{marinePlayer && (
					<ShipLargeController
						state={marinePlayer.state}
						control={marinePlayer.joystick}
						isPlayer={myPlayer().id === marinePlayer.state.id}
					/>
				)}
			</group>
		</>
	);
}
