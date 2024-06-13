import { CameraControls, Environment, OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import { Board } from "./board";
import { RigidBody } from "@react-three/rapier";
import { ShipLargeController } from "./ship-large-controller";
import { ShipSmallController } from "./ship-small-controller";
import { MissileController } from "./missile-controller";
import { MineController } from "./mine-controller";
import { GameState, useGameEngine } from "@/hooks/use-game-engine";
import { myPlayer } from "playroomkit";

export const Experience = () => {
	const { mines, missiles } = useGameEngine();

	return (
		<>
			<OrbitControls />
			<Environment preset="sunset" />

			{mines.map((mine) => (
				<MineController position-x={5} key={mine} />
			))}

			{missiles.map((missile) => (
				<MissileController position-x={10} key={missile} />
			))}

			<ShipSmallController position-z={-5} />

			<ShipLargeController position-z={10} />

			<Board />
		</>
	);
};

const CameraManager = () => {
	const cameraRef = useRef<CameraControls>(null);

	return <CameraControls ref={cameraRef} />;
};
