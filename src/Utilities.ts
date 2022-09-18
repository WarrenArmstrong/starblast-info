import Constants from "./Constants"
import { Lobby, LobbyColumn } from "./Types"

export function getShade(darkness: number) {
	return interpolateHexColors(Constants.shadeT0, Constants.shadeT1, darkness)
}

export function interpolateHexColors(color0Hex: string, color1Hex: string, t: number) {
	[color0Hex, color1Hex].forEach(colorHex => {
		if (colorHex === null || colorHex.length !== 7 || colorHex.charAt(0) !== "#") {
			throw new Error("colorHex must start with '#' and be 7 characters long.")
		}
	})
	const interpolatedValues: Array<number> = []
	for (let i = 0; i < 3; i++) {
		const color0Value = parseInt(color0Hex.substring(2*i+1, 2*(i)+3), 16)
		const color1Value = parseInt(color1Hex.substring(2*i+1, 2*(i)+3), 16)
		const interpolated = ((1-t)*color0Value) + (t*color1Value)
		interpolatedValues.push(Math.max(0, Math.min(Math.round(interpolated), 255)))
	}
	return `#${interpolatedValues.map(x => x.toString(16).padStart(2, "0")).reduce((a, b) => a + b)}`
}

export function isMobile(): boolean {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

export function getTimeElapsedString(seconds: number): string {
	if (seconds < 60) {
		return `${seconds} second${s(seconds)}`
	} else if (seconds < 3600) {
		return `${Math.floor(seconds/60)} minute${s(Math.floor(seconds/60))}`
	} else {
		return `${Math.floor(seconds/3600)} hour${s(Math.floor(seconds/3600))}`
	}
}

export function s(quantity: number) {
	return Math.abs(quantity) === 1 ? "" :  "s"
}

export function capitalize(str: string) {
	if (str.length < 1) {
		throw new Error("str must not be empty.")
	}
	return `${str.charAt(0).toUpperCase()}${str.substring(1)}`
}

export function getLobbySortFunction(column: LobbyColumn, sortAscending: boolean): (a: Lobby, b: Lobby) => number {
	switch (column) {
		case LobbyColumn.Id: return (a, b) => (a.id - b.id) * (sortAscending ? 1 : -1)
		case LobbyColumn.Location: return (a, b) => a.location.localeCompare(b.location) * (sortAscending ? 1 : -1)
		case LobbyColumn.Mode: return (a, b) => a.mode.localeCompare(b.mode) * (sortAscending ? 1 : -1)
		case LobbyColumn.PlayerCount: return (a, b) => (a.playerCount - b.playerCount) * (sortAscending ? 1 : -1)
		case LobbyColumn.TimeElapsed: return (a, b) => (a.timeElapsed - b.timeElapsed) * (sortAscending ? 1 : -1)
	}
}

export function pascalCaseToWords(str: string): string {
	return getChars(str)
		.map(segment => segment.toUpperCase() === segment ? ` ${segment}` : segment)
		.reduce((a,b) => `${a}${b}`)
}

export function getChars(str: string): Array<string> {
	const chars: Array<string> = []
	for (let i = 0; i < str.length; i++) {
		chars.push(str.substring(i, i+1))
	}
	return chars
}