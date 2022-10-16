import { none, option, Option, some } from "ts-option"
import LoadingSpinner from "./LoadingSpinner"
import { capitalize, getLobbySortFunction, getShade, getTimeElapsedString, isMobile, pascalCaseToWords } from "../Utilities"
import Constants from "../Constants"
import { allLobbyColumns, allLocations, allModes, ColumnSortState, Lobby, LobbyColumn } from "../Types"
import useFilters from "../hooks/useFilters"
import ToggleFilters from "./ToggleFilters"
import ColumnHeader from "./ColumnHeader"
import usePersistentState from "../hooks/usePersistentState"
import LobbyCard from "./LobbyCard"
import { useEffect, useState } from "react"

interface Props {
	lobbies: Option<Array<Lobby>>
}

export default function LobbyBrowser(props: Props) {
	const [selectedLocations, toggleLocation] = useFilters(allLocations, "lobbyBrowser.selectedLocations")
	const [selectedModes, toggleMode] = useFilters(allModes, "lobbyBrowser.selectedModes")
	const [sortColumn, setSortColumn] = usePersistentState<LobbyColumn>(LobbyColumn.TimeElapsed, "lobbyBrowser.sortColumn")
	const [sortAscending, setSortAscending] = usePersistentState<boolean>(true, "lobbyBrowser.sortAscending")
	const [useCardView, setUseCardView] = usePersistentState<boolean>(false, "lobbyBrowser.useCardView")
	const [cardSize, setCardSize] = useState<number>(isMobile() ? 300 : 400)
	const [joinNextSystemAt, setJoinNextSystemAt] = useState<Option<number>>(none)
	const [joinNextSystemError, setJoinNextSystemError] = useState<boolean>(false)

	function onClickJoinNextNewSystem() {
		setJoinNextSystemError(false)
		if (joinNextSystemAt.isDefined) {
			setJoinNextSystemAt(none)
		} else {
			setJoinNextSystemAt(some(Date.now()))
		}
	}

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

	const filteredLobbies: Option<Array<Lobby>> = props.lobbies.isDefined ? (
		some(
			props.lobbies.get
				.filter(lobby => selectedLocations.has(lobby.location))
				.filter(lobby => selectedModes.has(lobby.mode))
				.sort(getLobbySortFunction(sortColumn, sortAscending))
		)
	) : (
		none
	)

	useEffect(() => {
		if (joinNextSystemAt.isDefined && filteredLobbies.isDefined && filteredLobbies.get.length > 0) {
			const newestLobby = filteredLobbies.get.sort((a,b)=> a.timeElapsed-b.timeElapsed)[0]
			if (newestLobby.fetchedAt - newestLobby.timeElapsed*1000 > joinNextSystemAt.get) {
				const result = window.open(`https://starblast.io/#${newestLobby.id}`, "_blank")
				if (result == null) {
					setJoinNextSystemError(true)
				}
				setJoinNextSystemAt(none)
			}
		}
	}, [props.lobbies])

	return <div>
		<h1 className="center" >System Browser</h1>
		<ToggleFilters title="Locations" allFilters={allLocations} selectedFilters={selectedLocations} toggleFilter={toggleLocation}/>
		<ToggleFilters title="Modes" allFilters={allModes} selectedFilters={selectedModes} toggleFilter={toggleMode}/>
		<div style={{display: "flex", justifyContent: "space-between", alignItems: "stretch", borderTopWidth: 2, borderTopStyle: "solid", backgroundColor: getShade(0), borderColor: getShade(1)}}>
			<div className="clickable" style={{display: "flex", flexDirection: "column", justifyContent: "center", backgroundColor: Constants.joinButtonColor, borderRadius: 5, margin: 5, paddingLeft: 5, paddingRight: 5}} onClick={onClickJoinNextNewSystem}>
				{
					joinNextSystemError ? (
						<b>UNABLE TO CREATE NEW WINDOW</b>
					) : (
						joinNextSystemAt.isDefined ? (
							<div style={{display: "flex", justifyContent: "space-between", alignItems: "stretch", gap: 10}}>
								<b>JOINING NEXT NEW SYSTEM</b>
								<div style={{height: 24, width: 24}}><LoadingSpinner/></div></div>
						) : (
							<b>JOIN NEXT NEW SYSTEM</b>
						)
					)
				}
			</div>
			<div style={{display: "flex", justifyContent: "flex-end", alignItems: "stretch"}}>
			{
				useCardView && !isMobile() ? (
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
		</div>
		{
			useCardView ? (
				<div style={{display: "grid", justifyContent: "center", padding: "initial", 
					gridTemplateColumns: `repeat(auto-fit, minmax(${cardSize+(cardSize/20)}px, max-content))`, marginTop: cardSize/40}}>
					{
						filteredLobbies.isDefined ? (
							filteredLobbies.get.map(lobby => <div style={{margin: cardSize/40}}>
								<LobbyCard key={lobby.id} lobby={lobby} cardSize={cardSize} backgroundDarkness={0}/>
							</div>)
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