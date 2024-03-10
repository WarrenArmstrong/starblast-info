import { none, option, Option } from "ts-option"
import { useParams } from "react-router-dom"
import { Lobby } from "../Types"
import LoadingSpinner from "./LoadingSpinner"
import LobbyCard from "./LobbyCard"
import { isMobile } from "../Utilities"
import Constants from "../Constants"

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
	const cardSize = Math.min(window.innerHeight, isMobile() ? window.innerWidth : Constants.maxWidth)

	return <div style={{display: "flex", justifyContent: "center", alignItems: "flex-start"}}>
		{
			lobby.isDefined ? (
				<LobbyCard lobby={lobby.get} cardSize={cardSize} backgroundDarkness={1} fullPage={true}/>
			) : (
				<div style={{width: cardSize/2, height: cardSize/2, padding: cardSize/4}}><LoadingSpinner/></div>
			)
		}
	</div>
}