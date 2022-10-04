import { capitalize, getShade } from "../Utilities"

interface Props {
	title: string,
	allFilters: Array<string>,
	selectedFilters: Set<string>,
	toggleFilter: (filter: string) => void
}

export default function ToggleFilters(props: Props) {
	return <div style={{backgroundColor: getShade(0), overflow: "auto", borderTopWidth: 2, borderTopStyle: "solid", borderColor: getShade(1)}}>
		<span style={{float: "left", padding: 10, fontWeight: "bold", width: 100}}>{props.title}:</span>
		{
			props.allFilters.map(filter => {
				return <span key={filter} className="clickable" style={{display: "flex", alignItems: "center", float: "left", padding: 10}} onClick={() => props.toggleFilter(filter)}>
					<span className="material-symbols-outlined" style={{paddingRight: 2}}>
						{props.selectedFilters.has(filter) ? "check_box" : "check_box_outline_blank"}</span>{capitalize(filter)}
				</span>
			})
		}
	</div>
}