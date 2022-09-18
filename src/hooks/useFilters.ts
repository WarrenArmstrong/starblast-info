import { useState } from "react"

export default function useFilters(allFilters: Array<string>): [Set<string>, (filter: string) => void] {
	const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set<string>(allFilters))

	function toggleFilter(filter: string) {
		if (selectedFilters.has(filter)) {
			selectedFilters.delete(filter)
		} else {
			selectedFilters.add(filter)
		}
		setSelectedFilters(new Set(selectedFilters))
	}

	return [selectedFilters, toggleFilter]
}