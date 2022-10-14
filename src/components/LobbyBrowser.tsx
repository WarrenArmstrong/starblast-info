import { none, Option, some } from "ts-option"
import LoadingSpinner from "./LoadingSpinner"
import { capitalize, getLobbySortFunction, getShade, getTimeElapsedString, isMobile, pascalCaseToWords } from "../Utilities"
import Constants from "../Constants"
import useLobbies from "../hooks/useLobbies"
import { allLobbyColumns, allLocations, allModes, ColumnSortState, Lobby, LobbyColumn } from "../Types"
import useFilters from "../hooks/useFilters"
import ToggleFilters from "./ToggleFilters"
import ColumnHeader from "./ColumnHeader"
import usePersistentState from "../hooks/usePersistentState"
import LobbyCard from "./LobbyCard"
import { useState } from "react"

export default function LobbyBrowser() {
	const lobbies: Option<Array<Lobby>> = useLobbies("lobbyBrowser.lobbies")
	const [selectedLocations, toggleLocation] = useFilters(allLocations, "lobbyBrowser.selectedLocations")
	const [selectedModes, toggleMode] = useFilters(allModes, "lobbyBrowser.selectedModes")
	const [sortColumn, setSortColumn] = usePersistentState<LobbyColumn>(LobbyColumn.TimeElapsed, "lobbyBrowser.sortColumn")
	const [sortAscending, setSortAscending] = usePersistentState<boolean>(true, "lobbyBrowser.sortAscending")
	const [useCardView, setUseCardView] = usePersistentState<boolean>(false, "lobbyBrowser.useCardView")
	const [cardSize, setCardSize] = useState<number>(isMobile() ? 300 : 400)
	const cardMargin = cardSize/40

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

	const filteredLobbies: Option<Array<Lobby>> = lobbies.isDefined ? (
		some(lobbies.get
			.filter(lobby => selectedLocations.has(lobby.location))
			.filter(lobby => selectedModes.has(lobby.mode))
			.sort(getLobbySortFunction(sortColumn, sortAscending)))
	) : (
		none
	)

	return <div style={{color: Constants.textColor}}>
		<h1 className="center">System Browser</h1>
		<ToggleFilters title="Locations" allFilters={allLocations} selectedFilters={selectedLocations} toggleFilter={toggleLocation}/>
		<ToggleFilters title="Modes" allFilters={allModes} selectedFilters={selectedModes} toggleFilter={toggleMode}/>
		<div style={{display: "flex", justifyContent: "flex-end", alignItems: "stretch", borderTopWidth: 2, borderTopStyle: "solid", backgroundColor: getShade(0), borderColor: getShade(1)}}>
			{
				useCardView ? (
					<div style={{display: "flex", justifyContent: "flex-end"}}>
						<span className="material-symbols-outlined" style={{padding: 10}}>remove</span>
						<span style={{width: 200, display: "flex", flexDirection: "column", justifyContent: "center"}}>
							<input className="clickable" type="range" min="200" max="1400" value={cardSize}
								onChange={e => setCardSize(parseInt(e.target.value))} style={{height: 2, background: Constants.textColor, accentColor: Constants.textColor, outline: "none", fill: Constants.textColor, appearance: "none"}}/>
						</span>
						<span className="material-symbols-outlined" style={{padding: 10}}>add</span>
					</div>
				) : (
					<div/>
				)
			}
			<span className="clickable material-symbols-outlined" onClick={() => setUseCardView(!useCardView)} style={{padding: 10}}>
				{useCardView ? "view_module" : "view_list"}
			</span>
		</div>
		{
			useCardView ? (
				<div style={{display: "grid", justifyContent: "center", padding: "initial", 
					gridTemplateColumns: `repeat(auto-fit, minmax(${cardSize+cardMargin*2}px, max-content))`, marginTop: cardMargin}}>
					{
						filteredLobbies.isDefined ? (
							filteredLobbies.get.map(lobby => <LobbyCard key={lobby.id} lobby={lobby} cardSize={cardSize} cardMargin={cardMargin}/>)
						) : (
							<div/>
						)
					}
				</div>
			) : (
				<div>
					<table style={{backgroundColor: getShade(0), borderTopWidth: 2, borderTopStyle: "solid", borderColor: getShade(1)}}>
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
							filteredLobbies.isDefined ? (
								<tbody>
									{
										filteredLobbies.get.map(lobby => 
											<tr className="lobby-browser-row" key={lobby.id}>
												<td><a href={`https://starblast.io/#${lobby.id}`}>{lobby.id}<sup style={{fontSize: "x-small"}}>{lobby.fromCache ? "*" : ""}</sup></a></td>
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
				</div>
			)
		}
		{
			filteredLobbies.isEmpty ? (
				<div style={{height: 100, width: "100%", paddingTop: 50, paddingBottom: 50}}>
					<LoadingSpinner/>
				</div>
			) : (
				<div/>
			)
		}
	</div>
}