import Constants from "./Constants"

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
		return `${seconds} second${s(seconds)} ago`
	} else if (seconds < 3600) {
		return `${Math.floor(seconds/60)} minute${s(Math.floor(seconds/60))} ago`
	} else {
		return `${Math.floor(seconds/3600)} hour${s(Math.floor(seconds/3600))} ago`
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