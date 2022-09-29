import { none, Option, some } from "ts-option"
import LoadingSpinner from "./LoadingSpinner"
import { capitalize, getLobbySortFunction, getShade, getTimeElapsedString, pascalCaseToWords } from "../Utilities"
import Constants from "../Constants"
import useLobbies from "../hooks/useLobbies"
import { allLobbyColumns, allLocations, allModes, ColumnSortState, Lobby, LobbyColumn } from "../Types"
import useFilters from "../hooks/useFilters"
import ToggleFilters from "./ToggleFilters"
import ColumnHeader from "./ColumnHeader"
import usePersistentState from "../hooks/usePersistentState"

export default function LobbyBrowser() {
	const lobbies: Option<Array<Lobby>> = useLobbies()
	const [selectedLocations, toggleLocation] = useFilters(allLocations, "starblast.info:lobbyBrowser:selectedLocations")
	const [selectedModes, toggleMode] = useFilters(allModes, "starblast.info:lobbyBrowser:selectedModes")
	const [sortColumn, setSortColumn] = usePersistentState<LobbyColumn>(LobbyColumn.TimeElapsed, "starblast.info:lobbyBrowser:sortColumn")
	const [sortAscending, setSortAscending] = usePersistentState<boolean>(true, "starblast.info:lobbyBrowser:sortAscending")

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
										<tr className="lobby-browser-row" key={lobby.id}>
											<td><a href={`https://starblast.io/#${lobby.id}`}>{lobby.id}</a></td>
											<td><a href={`https://starblast.io/#${lobby.id}`}>{lobby.location}</a></td>
											<td><a href={`https://starblast.io/#${lobby.id}`}>{capitalize(lobby.mode)}</a></td>
											<td><a href={`https://starblast.io/#${lobby.id}`}>{lobby.playerCount}</a></td>
											<td><a href={`https://starblast.io/#${lobby.id}`}>{getTimeElapsedString(lobby.timeElapsed)}</a></td>
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