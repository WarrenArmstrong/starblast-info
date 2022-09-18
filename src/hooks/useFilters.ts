import usePersistentState from "./usePersistentState"

export default function useFilters(allFilters: Array<string>, localStorageKey: string): [Set<string>, (filter: string) => void] {
	const [selectedFiltersArray, setSelectedFiltersArray] = usePersistentState<Array<string>>(allFilters, localStorageKey)
	const selectedFilters: Set<string> = new Set(selectedFiltersArray)

	function toggleFilter(filter: string) {
		if (selectedFilters.has(filter)) {
			selectedFilters.delete(filter)
		} else {
			selectedFilters.add(filter)
		}
		setSelectedFiltersArray(Array.from(selectedFilters))
	}

	return [selectedFilters, toggleFilter]
}