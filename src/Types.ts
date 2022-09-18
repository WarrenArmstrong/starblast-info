export enum Location {
	America,
	Europe,
	Asia,
	Brazil
}

export enum Mode {
	survival,
	team,
	invasion
}

export type Lobby = {
	id: number,
	playerCount: number,
	location: Location,
	mode: Mode,
	timeElapsed: number
}