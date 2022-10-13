import { useRef } from "react"
import { none, option, Option } from "ts-option"
import useLobbies from "../hooks/useLobbies"
import useSystemInfo from "../hooks/useSystemInfo"
import { useParams } from "react-router-dom"
import { Lobby, SystemInfo } from "../Types"
import { abbreviate, capitalize, getShade, getShadeFromHue, getTimeElapsedString } from "../Utilities"
import LoadingSpinner from "./LoadingSpinner"

interface Props {
	lobbies: Option<Array<Lobby>>
}

export default function LobbyPage(props: Props) {
	const {lobbyId} = useParams()
	const lobby: Option<Lobby> = props.lobbies.isDefined && lobbyId ? (
		option(props.lobbies.get.find(lobby => lobby.id === parseInt(lobbyId)))
	) : (
		none
	)
	const systemInfo = useSystemInfo(lobby, none)

	return <div>
		<h1 className="center" >System {lobbyId}</h1>


		<div style={{display: "flex", justifyContent: "space-evenly", backgroundColor: getShade(2), padding: 10, margin: 10, marginTop: 5, borderRadius: 5, height: "75vh"}}>
			{
				systemInfo.isDefined ? (
					systemInfo.get.factions.map(faction => {
						return <div key={faction.hue} style={{backgroundColor: getShadeFromHue(faction.hue, 0), borderRadius: 5, opacity: 0.7, overflow: "clip", flexBasis: "25%"}}>
							{
								systemInfo.get.players.filter(player => player.hue === faction.hue).map((player, index) => {
									return <div key={index} style={{fontSize: "large", padding: 5, color: "white", whiteSpace: "nowrap", display: "flex", justifyContent: "space-between", backgroundColor: index % 2 == 1 ? getShadeFromHue(faction.hue, 1) : undefined}}>
										<div>{player.name}</div>
										<div>{player.score}</div>
									</div>
								})
							}
						</div>
					})
				) : (
					<LoadingSpinner/>
				)
			}
			</div>

	</div>
}