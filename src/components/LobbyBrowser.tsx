import { none, Option, some } from "ts-option"
import LoadingSpinner from "./LoadingSpinner"
import { capitalize, getLobbySortFunction, getShade, getTimeElapsedString, pascalCaseToWords } from "../Utilities"
import Constants from "../Constants"
import useLobbies from "../hooks/useLobbies"
import { allLobbyColumns, allLocations, allModes, ColumnSortState, Lobby, LobbyColumn } from "../Types"
import useFilters from "../hooks/useFilters"
import ToggleFilters from "./ToggleFilters"
import ColumnHeader from "./ColumnHeader"
import { useState } from "react"

export default function LobbyBrowser() {
	const lobbies: Option<Array<Lobby>> = useLobbies()
	const [selectedLocations, toggleLocation] = useFilters(allLocations)
	const [selectedModes, toggleMode] = useFilters(allModes)
	const [sortColumn, setSortColumn] = useState<LobbyColumn>(LobbyColumn.TimeElapsed)
	const [sortAscending, setSortAscending] = useState<boolean>(true)

	function updateSort(column: LobbyColumn) {
		return (ascending: boolean) => {
			setSortColumn(column)
			setSortAscending(ascending)
		}
	}

	function getColumnSortState(column: LobbyColumn) {
		if (sortColumn === column) {
			return sortAscending ? ColumnSortState.Ascending : ColumnSortState.Descending
		} else {
			return ColumnSortState.None
		}
	}

	return <div>
		<h1 className="center" style={{color: Constants.textColor}}>System Browser</h1>
		<div style={{color: Constants.textColor, backgroundColor: getShade(0)}}>
			<ToggleFilters title="Locations" allFilters={allLocations} selectedFilters={selectedLocations} toggleFilter={toggleLocation}/>
			<ToggleFilters title="Modes" allFilters={allModes} selectedFilters={selectedModes} toggleFilter={toggleMode}/>
			<table style={{borderTopWidth: 2, borderTopStyle: "solid", borderColor: getShade(1)}}>
				<thead style={{borderBottomWidth: 2, borderBottomStyle: "solid", borderColor: getShade(1)}}>
					<tr>
						{
							allLobbyColumns.map(column => <ColumnHeader key={column}
								title={pascalCaseToWords(LobbyColumn[column])} sortState={getColumnSortState(column)}
								updateSort={updateSort(column)}
							/>)
						}
					</tr>
				</thead>
				{
					lobbies.isDefined ? (
						<tbody>
							{
								lobbies.get
									.filter(lobby => selectedLocations.has(lobby.location))
									.filter(lobby => selectedModes.has(lobby.mode))
									.sort(getLobbySortFunction(sortColumn, sortAscending))
									.map(lobby => 
										<tr key={lobby.id}>
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