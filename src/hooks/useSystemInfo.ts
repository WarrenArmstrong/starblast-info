import React, { useEffect, useRef, useState } from "react"
import { none, option, Option, some } from "ts-option"
import Constants from "../Constants"
import { Lobby, SystemInfo } from "../Types"
import { isOnScreen } from "../Utilities"


export default function useSystemInfo(lobby: Lobby, card: React.RefObject<HTMLDivElement>): Option<SystemInfo> {
	const [systemInfo, setSystemInfo] = useState<Option<SystemInfo>>(none)
	const lastRequestTime = useRef<number>(0)
	const requestInFlight = useRef<boolean>(false)

	async function refreshSystemInfo() {
		const cardOption: Option<HTMLDivElement> = option(card.current)
		if (!requestInFlight.current && cardOption.isDefined && isOnScreen(cardOption.get)
			&& ((systemInfo.isDefined && systemInfo.get.fromDaemon) || Date.now() - lastRequestTime.current > Constants.systemInfoNonDaemonFetchFrequencyMs)) {
			try {
				requestInFlight.current = true
				lastRequestTime.current = Date.now()
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
		refreshSystemInfo()
		const interval = setInterval(refreshSystemInfo, Constants.systemInfoFetchFrequencyMs)
		return () => clearInterval(interval)
	}, [])

	return systemInfo
}