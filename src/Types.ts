enum LocationEnum {
	America,
	Asia,
	Europe
}
export type Location = keyof typeof LocationEnum
export const allLocations: Array<Location> = Object.values(LocationEnum)
	.filter((location) => isNaN(Number(location)))
	.map(location => location as Location)

enum ModeEnum {
	team,
	survival,
	invasion
}
export type Mode = keyof typeof ModeEnum
export const allModes: Array<Mode> = Object.values(ModeEnum)
	.filter((mode) => isNaN(Number(mode)))
	.map(mode => mode as Mode)

export type Lobby = {
	id: number,
	playerCount: number,
	location: Location,
	mode: Mode,
	timeElapsed: number,
	fetchedAt: number,
	fromCache: boolean,
	socketAddress: string
}

export enum LobbyColumn {
	Id,
	Location,
	Mode,
	PlayerCount,
	TimeElapsed
}
export const allLobbyColumns: Array<LobbyColumn> = Object.values(LobbyColumn)
	.filter((lobbyColumn) => !isNaN(Number(lobbyColumn)))
	.map(lobbyColumn => lobbyColumn as LobbyColumn)

export enum ColumnSortState {
	None,
	Ascending,
	Descending
}

export type SystemInfo = {
	fromDaemon: boolean
	factions: Array<Faction>
	players: Array<Player>
}

export type Faction = {
	name: string,
	hue: number
}

export type Player = {
	name: string,
	hue: number
}