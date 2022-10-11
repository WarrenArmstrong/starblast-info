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
		setReactState(oldReactState => {
			const t: T = typeof setStateAction === "function" ? (
				(setStateAction as (arg0: T) => T)(oldReactState)
			) : (
				setStateAction
			)
			localStorage.setItem(localStorageKey, JSON.stringify(t))
			return t
		})
	}

	return [reactState, setPersistentState]
}