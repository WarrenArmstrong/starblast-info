import { none, Option, some } from "ts-option"
import LoadingSpinner from "./LoadingSpinner"
import { capitalize, getShade, getTimeElapsedString } from "../Utilities"
import Constants from "../Constants"
import useLobbies from "../hooks/useLobbies"
import { allLocations, allModes, Lobby, Location, Mode } from "../Types"
import { useState } from "react"

export default function LobbyBrowser() {
	const lobbies: Option<Array<Lobby>> = useLobbies()
	const [selectedLocations, setSelectedLocations] = useState<Set<Location>>(new Set<Location>(allLocations))
	const [selectedModes, setSelectedModes] = useState<Set<Mode>>(new Set<Mode>(allModes))

	function onClickLocation(location: Location) {
		if (selectedLocations.has(location)) {
			selectedLocations.delete(location)
		} else {
			selectedLocations.add(location)
		}
		setSelectedLocations(new Set(selectedLocations))
	}

	function onClickMode(mode: Mode) {
		if (selectedModes.has(mode)) {
			selectedModes.delete(mode)
		} else {
			selectedModes.add(mode)
		}
		setSelectedModes(new Set(selectedModes))
	}

	return <div>
		<h1 className="center" style={{color: Constants.textColor}}>System Browser</h1>
		<div style={{color: Constants.textColor, backgroundColor: getShade(0)}}>


			<div style={{overflow: "auto"}}>
				<span className="valign-wrapper" style={{float: "left", padding: 10, fontWeight: "bold", width: 100}}>Locations:</span>
				{
					allLocations.map(location => {
						return <span key={location} className="valign-wrapper clickable" style={{float: "left", padding: 10}} onClick={() => onClickLocation(location)}>
							<span className="material-symbols-outlined" style={{paddingRight: 2}}>
								{selectedLocations.has(location) ? "check_box" : "check_box_outline_blank"}</span>{location}
						</span>
					})
				}
			</div>
			<div style={{overflow: "auto", borderTopWidth: 2, borderTopStyle: "solid", borderColor: getShade(1)}}>
				<span className="valign-wrapper" style={{float: "left", padding: 10, fontWeight: "bold", width: 100}}>Modes:</span>
				{
					allModes.map(mode => {
						return <span key={mode} className="valign-wrapper clickable" style={{float: "left", padding: 10}} onClick={() => onClickMode(mode)}>
							<span className="material-symbols-outlined" style={{paddingRight: 2}}>
								{selectedModes.has(mode) ? "check_box" : "check_box_outline_blank"}</span>{capitalize(mode)}
						</span>
					})
				}
			</div>

			<table style={{borderTopWidth: 2, borderTopStyle: "solid", borderColor: getShade(1)}}>
				<thead style={{borderBottomWidth: 2, borderBottomStyle: "solid", borderColor: getShade(1)}}>
					<tr>
						<th>Id</th>
						<th>Location</th>
						<th>Mode</th>
						<th>Players</th>
						<th>Time Started</th>
					</tr>
				</thead>
				{
					lobbies.isDefined ? (
						<tbody>
							{
								lobbies.get
									.filter(lobby => selectedLocations.has(lobby.location))
									.filter(lobby => selectedModes.has(lobby.mode))
									.map(lobby => 
										<tr>
											<td>{lobby.id}</td>
											<td>{lobby.location}</td>
											<td>{capitalize(lobby.mode)}</td>
											<td>{lobby.playerCount}</td>
											<td>{getTimeElapsedString(lobby.timeElapsed)}</td>
										</tr>
									)
							}
						</tbody>
					) : (
						<tbody/>
					)
				}
			</table>
			{
				lobbies.isEmpty ? (
					<div style={{height: 100, width: "100%", paddingTop: 50, paddingBottom: 50}}>
						<LoadingSpinner/>
					</div>
				) : (
					<div/>
				)
			}
		</div>
	</div>
}