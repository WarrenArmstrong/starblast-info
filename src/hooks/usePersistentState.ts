import { useState } from "react"
import { option } from "ts-option"

export default function usePersistentState<T>(defaultValue: T, localStorageKey: string): [T, React.Dispatch<React.SetStateAction<T>>] {
	const [reactState, setReactState] = useState<T>(() => {
		return option(localStorage.getItem(localStorageKey)).match({
			some: value => JSON.parse(value) as T,
			none: () => defaultValue
		})
	})

	function setPersistentState(setStateAction: React.SetStateAction<T>) {
		const t: T = typeof setStateAction === "function" ? (
			(setStateAction as (arg0: T) => T)(reactState)
		) : (
			setStateAction
		)
		setReactState(t)
		localStorage.setItem(localStorageKey, JSON.stringify(t))
	}

	return [reactState, setPersistentState]
}