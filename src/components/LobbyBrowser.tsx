import { none, Option, some } from "ts-option"
import LoadingSpinner from "./LoadingSpinner"
import { capitalize, getShade, getTimeElapsedString } from "../Utilities"
import Constants from "../Constants"
import useLobbies from "../hooks/useLobbies"
import { allLocations, allModes, Lobby } from "../Types"
import useFilters from "../hooks/useFilters"
import ToggleFilters from "./ToggleFilters"

export default function LobbyBrowser() {
	const lobbies: Option<Array<Lobby>> = useLobbies()
	const [selectedLocations, toggleLocation] = useFilters(allLocations)
	const [selectedModes, toggleMode] = useFilters(allModes)

	return <div>
		<h1 className="center" style={{color: Constants.textColor}}>System Browser</h1>
		<div style={{color: Constants.textColor, backgroundColor: getShade(0)}}>
			<ToggleFilters title="Locations" allFilters={allLocations} selectedFilters={selectedLocations} toggleFilter={toggleLocation}/>
			<ToggleFilters title="Modes" allFilters={allModes} selectedFilters={selectedModes} toggleFilter={toggleMode}/>
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