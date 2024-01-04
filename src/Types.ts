import { ShapeToType, s } from "shape-tape"

export const locationShape = s.union([s.literal("America"), s.literal("Asia"), s.literal("Europe")])
export type Location = ShapeToType<typeof locationShape>
export const modeShape = s.union([s.literal("team"), s.literal("survival"), s.literal("invasion")])
export type Mode = ShapeToType<typeof modeShape>


export type Lobby = {
	id: number,
	playerCount: number,
	location: Location,
	mode: Mode,
	timeElapsed: number,
	fetchedAt: number,
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
	hue: number,
	baseLevel: number,
	baseProgress: number
}

export type Player = {
	name: string,
	hue: number,
	score: number
}