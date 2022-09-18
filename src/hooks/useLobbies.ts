import { useEffect, useState } from "react"
import { Option, some, none } from "ts-option"
import { Lobby, Location, Mode } from "../Types"

type System = {
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

type Usage = {
	cpu: number,
	memory: number,
	ctime: number,
	elapsed: number,
	timestamp: number,
	pid: number,
	ppid: number
}

type Server = {
	location: Location,
	address: string,
	current_players: number,
	systems: Array<System>
}

export default function useLobbies() {
	const [lobbies, setLobbies] = useState<Option<Array<Lobby>>>(none)

	async function fetchLobbies() {
		const res: Response = await fetch("https://starblast.io/simstatus.json")
		const servers: Array<Server> = await res.json() as Array<Server>
		const lobbies: Array<Lobby> = servers.flatMap(server => {
			return server.systems.map(system => {
				return {
					id: system.id,
					playerCount: system.players,
					location: server.location,
					mode: system.mode,
					timeElapsed: system.time
				}
			})
		})
		setLobbies(some(lobbies))
	}

	useEffect(() => {
		const interval = setInterval(fetchLobbies, 1000)
		return () => clearInterval(interval)
	}, [])

	return lobbies
}