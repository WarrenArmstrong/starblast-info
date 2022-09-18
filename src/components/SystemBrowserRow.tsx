import { System } from "../Types"
import { getShade, getTimeElapsedString } from "../Utilities"

interface Props {
	system: System,
	isFirstRow: boolean
}

export default function SystemBrowserRow(props: Props) {
	return <div className="system-browser-row clickable" style={{borderTopWidth: props.isFirstRow ? 0 : 2, borderTopStyle: "solid", borderColor: getShade(1)}}>
		<a className="valign-wrapper" href={`https://starblast.io/#${props.system.id}`}>
			<span style={{margin: 5, overflow: "hidden", borderRadius: 4, borderStyle: "solid", borderWidth: 2, borderColor: getShade(1), width: 100, height: 100}}>

			</span>
			<span style={{padding: 10}}>
				<div style={{fontSize: "x-large", fontWeight: "bold"}}>System {props.system.id}</div>
				<div style={{fontSize: "medium"}}>{props.system.players} players</div>
				<div style={{fontSize: "medium"}}>Started {getTimeElapsedString(props.system.time)}</div>
			</span>
		</a>
	</div>
}

