import { Lobby } from "../Types"
import { getShade, getTimeElapsedString } from "../Utilities"

interface Props {
	lobby: Lobby,
	isFirstRow: boolean
}

export default function LobbyBrowserRow(props: Props) {
	return <div className="lobby-browser-row clickable" style={{borderTopWidth: props.isFirstRow ? 0 : 2, borderTopStyle: "solid", borderColor: getShade(1)}}>
		<a className="valign-wrapper" href={`https://starblast.io/#${props.lobby.id}`}>
			<span style={{margin: 5, overflow: "hidden", borderRadius: 4, borderStyle: "solid", borderWidth: 2, borderColor: getShade(1), width: 100, height: 100}}>

			</span>
			<span style={{padding: 10}}>
				<div style={{fontSize: "x-large", fontWeight: "bold"}}>System {props.lobby.id}</div>
				<div style={{fontSize: "medium"}}>{props.lobby.playerCount} players</div>
				<div style={{fontSize: "medium"}}>Started {getTimeElapsedString(props.lobby.timeElapsed)}</div>
			</span>
		</a>
	</div>
}

