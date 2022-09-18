
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

export type System = {
	name: string,
	id: number,
	mode: Mode,
	players: number,
	unlisted: boolean,
	open: boolean,
	survival: boolean,
	time: number,
	criminal_activity: number,
}

export type Usage = {
	cpu: number,
	memory: number,
	ctime: number,
	elapsed: number,
	timestamp: number,
	pid: number,
	ppid: number
}

export type Server = {
	location: Location,
	address: string,
	current_players: number,
	systems: Array<System>
}