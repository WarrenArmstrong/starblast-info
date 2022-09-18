import { none, Option, some } from "ts-option"
import LoadingSpinner from "./LoadingSpinner"
import LobbyBrowserRow from "./LobbyBrowserRow"
import { getShade } from "../Utilities"
import Constants from "../Constants"
import useLobbies from "../hooks/useLobbies"
import { Lobby } from "../Types"

export default function LobbyBrowser() {
	const lobbies: Option<Array<Lobby>> = useLobbies()

	return <div>
		<h1 className="center" style={{color: Constants.textColor}}>System Browser</h1>
		<div style={{color: Constants.textColor, backgroundColor: getShade(0)}}>
			{
				lobbies.isDefined ? (
					lobbies.get.map((lobby, index) => <LobbyBrowserRow key={lobby.id} lobby={lobby} isFirstRow={index === 0}/>)
				) : (
					Array.from(Array(3).keys()).map(key => <div key={key} style={{height: "64pt", padding: "10pt", borderBottomWidth: "2pt", borderBottomStyle: "solid", borderColor: getShade(1)}}>
						<LoadingSpinner/>
					</div>)
				)
			}
		</div>
	</div>
}