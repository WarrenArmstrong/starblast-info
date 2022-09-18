import { useState } from "react"
import { option } from "ts-option"
import { Persistable } from "../Types"

export default function usePersistentState<T extends Persistable>(defaultValue: T, localStorageKey: string): [T, (t: T) => void] {
	const [reactState, setReactState] = useState<T>(() => {
		return option(localStorage.getItem(localStorageKey)).match({
			some: value => JSON.parse(value) as T,
			none: () => defaultValue
		})
	})

	function setPersistentState(t: T) {
		localStorage.setItem(localStorageKey, JSON.stringify(t))
		setReactState(t)
	}

	return [reactState, setPersistentState]
}