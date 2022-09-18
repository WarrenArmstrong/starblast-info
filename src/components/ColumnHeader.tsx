import { useState } from "react"
import { ColumnSortState } from "../Types"
import { getShade } from "../Utilities"

interface Props {
	title: string,
	sortState: ColumnSortState,
	updateSort: (ascending: boolean) => void
}

export default function ColumnHeader(props: Props) {
	const [mouseOver, setMouseOver] = useState<boolean>(false)

	function onClick() {
		props.updateSort(props.sortState !== ColumnSortState.Ascending)
	}

	function getIconCode() {
		switch (props.sortState) {
			case ColumnSortState.None: return "unfold_more"
			case ColumnSortState.Ascending: return "arrow_drop_up"
			case ColumnSortState.Descending: return "arrow_drop_down"
		}
	}

	return <th onClick={onClick} onMouseEnter={() => setMouseOver(true)} onMouseLeave={() => setMouseOver(false)}>
		<div className="valign-wrapper">
			<span>{props.title}</span>
			<span className="material-symbols-outlined" style={mouseOver || props.sortState !== ColumnSortState.None ? {} : {color: getShade(0)}}>{getIconCode()}
			</span>
		</div>
	</th>
}