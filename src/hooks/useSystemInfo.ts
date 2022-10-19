import React, { useEffect, useRef, useState } from "react"
import { none, option, Option, some } from "ts-option"
import Constants from "../Constants"
import { Lobby, SystemInfo } from "../Types"
import { isOnScreen } from "../Utilities"
import AES from "crypto-js/aes"
import enc from "crypto-js/enc-utf8"

export default function useSystemInfo(lobby: Lobby, card: Option<React.RefObject<HTMLElement>>): Option<SystemInfo> {
	const [systemInfoEndpoint] = useState<string>(() => {
		const passcode = JSON.parse(option(localStorage.getItem("passcode")).get)
		return enc.stringify(AES.decrypt(Constants.hashedSystemInfoEndpoint, passcode))
	})
	const [systemInfo, setSystemInfo] = useState<Option<SystemInfo>>(none)
	const lastRequestTime = useRef<number>(0)
	const requestInFlight = useRef<boolean>(false)

	async function refreshSystemInfo() {
		if (!requestInFlight.current && (card.isEmpty || (option(card.get.current).isDefined && isOnScreen(option(card.get.current).get)))
			&& ((systemInfo.isDefined && systemInfo.get.fromDaemon) || Date.now() - lastRequestTime.current > Constants.systemInfoNonDaemonFetchFrequencyMs)
			&& (lobby.mode === "team")) {
			try {
				requestInFlight.current = true
				lastRequestTime.current = Date.now()
				const res: Response = await fetch(`${systemInfoEndpoint}/system/${lobby.socketAddress}/${lobby.id}`)
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