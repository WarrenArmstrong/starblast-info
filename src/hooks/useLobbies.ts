import { useEffect } from "react"
import { Option, some, none, option } from "ts-option"
import Constants from "../Constants"
import { Lobby, Location, Mode } from "../Types"
import { optionWrapSetStateAction } from "../Utilities"
import usePersistentState from "./usePersistentState"

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

export default function useLobbies(localStorageKey: string) {
	const [lobbiesOrUndefined, setLobbiesOrUndefined] = usePersistentState<Array<Lobby> | undefined>(undefined, localStorageKey)
	const [lobbies, setLobbies] = optionWrapSetStateAction<Array<Lobby>>(lobbiesOrUndefined, setLobbiesOrUndefined)

	async function refreshLobbies() {
		const res: Response = await fetch("https://starblast.io/simstatus.json")
		const newLobbies: Array<Lobby> = (await res.json() as Array<Server>).flatMap(server => {
			return server.systems.map(system => {
				return {
					id: system.id,
					playerCount: system.players,
					location: server.location,
					mode: system.mode,
					timeElapsed: system.time,
					fetchedAt: Date.now(),
					socketAddress: server.address
				}
			})
		})
		setLobbies(some(newLobbies))
	}

	useEffect(() => {
		refreshLobbies()
		const interval = setInterval(refreshLobbies, Constants.simStatusFetchFrequencyMs)
		return () => clearInterval(interval)
	}, [])

	return lobbies
}