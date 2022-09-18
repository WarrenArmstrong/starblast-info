import { useState } from "react"
import { none, Option, some } from "ts-option"
import LoadingSpinner from "./LoadingSpinner"
import LobbyBrowserRow from "./LobbyBrowserRow"
import { capitalize, getShade } from "../Utilities"
import Constants from "../Constants"
import { allLocations, allModes, Lobby, Location, Mode } from "../Types"
import useLobbies from "../hooks/useLobbies"

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
		</div>
		<div style={{color: Constants.textColor, backgroundColor: getShade(0)}}>
			{
				lobbies.isDefined ? (
					lobbies.get
						.filter(lobby => {
							console.log(lobby.location)
							return selectedLocations.has(lobby.location)
						})
						.filter(lobby => selectedModes.has(lobby.mode))
						.map(lobby => <LobbyBrowserRow key={lobby.id} lobby={lobby}/>)
				) : (
					Array.from(Array(3).keys()).map(key => <div key={key} style={{height: "64pt", padding: "10pt", borderBottomWidth: "2pt", borderBottomStyle: "solid", borderColor: getShade(1)}}>
						<LoadingSpinner color={Constants.textColor}/>
					</div>)
				)
			}
		</div>
	</div>
}