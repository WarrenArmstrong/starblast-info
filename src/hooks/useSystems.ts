import { useEffect, useState } from "react"
import { Option, some, none } from "ts-option"
import { Server, System } from "../Types"

export default function useSystems() {
	const [systems, setSystems] = useState<Option<Array<System>>>(none)

	async function fetchServerList() {
		const res: Response = await fetch("https://starblast.io/simstatus.json")
		const servers: Array<Server> = await res.json() as Array<Server>
		const systems: Array<System> = servers.flatMap(server => server.systems)
		setSystems(some(systems))
	}

	useEffect(() => {
		const interval = setInterval(fetchServerList, 1000)
		return () => clearInterval(interval)
	}, [])

	return systems
}