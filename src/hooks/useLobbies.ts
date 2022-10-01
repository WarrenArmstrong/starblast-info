import { useEffect } from "react"
import { Option, some, none } from "ts-option"
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
	systems: Array<System>,
	fetched_at: number,
	from_cache: boolean
}

export default function useLobbies(localStorageKey: string) {
	const [serversOrUndefined, setServersOrUndefined] = usePersistentState<Array<Server> | undefined>(undefined, localStorageKey)
	const [servers, setServers] = optionWrapSetStateAction<Array<Server>>(serversOrUndefined, setServersOrUndefined)

	async function refreshServers() {
		const res: Response = await fetch("https://starblast.io/simstatus.json")
		const newServers: Array<Server> = (await res.json() as Array<Server>).map(newServer => {
			newServer.fetched_at = Date.now()
			return newServer
		})
		setServers(servers => {
			if (servers.isDefined) {
				servers.get.forEach(server => {
					if (!newServers.find(newServer => newServer.address === server.address)
						&& Date.now() - server.fetched_at < Constants.maxStatusServerCacheTime) {
						server.from_cache = true
						newServers.push(server)
					}
				})
			}
			return some(newServers)
		})
	}

	useEffect(() => {
		refreshServers()
		const interval = setInterval(refreshServers, Constants.statusFetchFrequencyMs)
		return () => clearInterval(interval)
	}, [])

	const lobbies: Option<Array<Lobby>> = servers.isDefined ? (
		some(servers.get.flatMap(server => {
			return server.systems.map(system => {
				return {
					id: system.id,
					playerCount: system.players,
					location: server.location,
					mode: system.mode,
					timeElapsed: system.time + Math.floor((Date.now() - server.fetched_at)/1000),
					fromCache: server.from_cache
				}
			})
		}))
	) : (
		none
	)

	return lobbies
}