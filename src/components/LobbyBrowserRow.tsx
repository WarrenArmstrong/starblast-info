import { Lobby } from "../Types"
import { capitalize, getShade, getTimeElapsedString, s } from "../Utilities"

interface Props {
	lobby: Lobby
}

export default function SystemBrowserRow(props: Props) {
	return <div className="system-browser-row clickable" style={{borderTopWidth: 2, borderTopStyle: "solid", borderColor: getShade(1)}}>
		<a className="valign-wrapper" href={`https://starblast.io/#${props.lobby.id}`}>
			<span style={{margin: 5, overflow: "hidden", borderRadius: 4, borderStyle: "solid", borderWidth: 2, borderColor: getShade(1), width: 100, height: 100}}>

			</span>
			<span style={{padding: 10}}>
				<div style={{fontSize: "x-large", fontWeight: "bold"}}>System {props.lobby.id}</div>
				<div style={{fontSize: "medium"}}>Location: {props.lobby.location}</div>
				<div style={{fontSize: "medium"}}>Mode: {capitalize(props.lobby.mode)}</div>
				<div style={{fontSize: "medium"}}>Player Count: {props.lobby.playerCount} player{s(props.lobby.playerCount)}</div>
				<div style={{fontSize: "medium"}}>Started: {getTimeElapsedString(props.lobby.timeElapsed)}</div>
			</span>
		</a>
	</div>
}

