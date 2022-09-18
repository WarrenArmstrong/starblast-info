import { none, Option, some } from "ts-option"
import LoadingSpinner from "./LoadingSpinner"
import SystemBrowserRow from "./SystemBrowserRow"
import { getShade } from "../Utilities"
import Constants from "../Constants"
import useSystems from "../hooks/useSystems"
import { System } from "../Types"

export default function SystemBrowser() {
	const systems: Option<Array<System>> = useSystems()

	return <div>
		<h1 className="center" style={{color: Constants.textColor}}>System Browser</h1>
		<div style={{color: Constants.textColor, backgroundColor: getShade(0)}}>
			{
				systems.isDefined ? (
					systems.get.map((system, index) => <SystemBrowserRow key={system.id} system={system} isFirstRow={index === 0}/>)
				) : (
					Array.from(Array(3).keys()).map(key => <div key={key} style={{height: "64pt", padding: "10pt", borderBottomWidth: "2pt", borderBottomStyle: "solid", borderColor: getShade(1)}}>
						<LoadingSpinner/>
					</div>)
				)
			}
		</div>
	</div>
}