import usePersistentState from "./usePersistentState"

export default function useFilters<T extends string>(allFilters: Array<T>, localStorageKey: string): [Set<T>, (filter: T) => void] {
	const [selectedFiltersArray, setSelectedFiltersArray] = usePersistentState<Array<T>>(allFilters, localStorageKey)
	const selectedFilters: Set<T> = new Set(selectedFiltersArray)

	function toggleFilter(filter: T) {
		if (selectedFilters.has(filter)) {
			selectedFilters.delete(filter)
		} else {
			selectedFilters.add(filter)
		}
		setSelectedFiltersArray(Array.from(selectedFilters))
	}

	return [selectedFilters, toggleFilter]
}