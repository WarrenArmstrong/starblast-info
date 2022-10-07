import React, { useEffect, useRef, useState } from "react"
import { none, option, Option, some } from "ts-option"
import Constants from "../Constants"
import { Lobby, SystemInfo } from "../Types"
import { isOnScreen } from "../Utilities"


export default function useSystemInfo(lobby: Lobby, card: React.RefObject<HTMLDivElement>): Option<SystemInfo> {
	const prevLobby = useRef<Lobby>()
	const [systemInfo, setSystemInfo] = useState<Option<SystemInfo>>(none)
	const requestInFlight = useRef<boolean>(false)

	async function updateSystemInfo() {
		if (!requestInFlight.current) {
			try {
				requestInFlight.current = true
				const res: Response = await fetch(`${Constants.systemInfoEndpoint}/system/${lobby.socketAddress}/${lobby.id}`)
				requestInFlight.current = false
				if (!res.ok) throw new Error(res.statusText)
				const newSystemInfo = some(await res.json() as SystemInfo)
				setSystemInfo(newSystemInfo)
			} finally {
				requestInFlight.current = false
			}
		}
	}

	useEffect(() => {
		const cardOption: Option<HTMLDivElement> = option(card.current)
		if (prevLobby === undefined ||
			(lobby.timeElapsed !== prevLobby.current?.timeElapsed && cardOption.isDefined && isOnScreen(cardOption.get))) {
			prevLobby.current = lobby
			updateSystemInfo()
		}
	})

	return systemInfo
}