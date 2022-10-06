import { Lobby } from "../Types"
import { capitalize, getShade, getTimeElapsedString, s } from "../Utilities"

interface Props {
	lobby: Lobby,
	cardSize: number,
	cardMargin: number
}

export default function LobbyCard(props: Props) {
	return <div style={{listStyleType: "none", width: props.cardSize, height: props.cardSize, backgroundColor: getShade(0), borderRadius: props.cardMargin, margin: props.cardMargin}}>
		<a href={`https://starblast.io/#${props.lobby.id}`} style={{height: "100%", width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center"}}>
			<div style={{fontWeight: "bold", fontSize: "xx-large"}}>{props.lobby.id}<sup style={{fontSize: "x-small"}}>{props.lobby.fromCache ? "*" : ""}</sup></div>
			<div>{props.lobby.location}, {capitalize(props.lobby.mode)} mode</div>
			<div>{props.lobby.playerCount} player{s(props.lobby.playerCount)}</div>
			<div>{getTimeElapsedString(props.lobby.timeElapsed)}</div>
		</a>
	</div>
}