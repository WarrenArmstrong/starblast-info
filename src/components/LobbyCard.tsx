import { useRef } from "react"
import useSystemInfo from "../hooks/useSystemInfo"
import { Lobby } from "../Types"
import { abbreviate, capitalize, getShade, getShadeFromHue, getTimeElapsedString } from "../Utilities"
import LoadingSpinner from "./LoadingSpinner"

interface Props {
	lobby: Lobby,
	cardSize: number,
	cardMargin: number
}

export default function LobbyCard(props: Props) {
	const card = useRef<HTMLDivElement>(null)
	const systemInfo = useSystemInfo(props.lobby, card)

	return <div ref={card} style={{fontSize: props.cardSize/25, listStyleType: "none", width: props.cardSize, height: props.cardSize, backgroundColor: getShade(0), borderRadius: props.cardMargin, margin: props.cardMargin}}>
		<a href={`https://starblast.io/#${props.lobby.id}`} style={{height: "100%", width: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", textAlign: "center"}}>
			<div style={{fontWeight: "bold", fontSize: props.cardSize/15}}>{props.lobby.id}<sup style={{fontSize: props.cardSize/50}}>{props.lobby.fromCache ? "*" : ""}</sup></div>
			<div>{props.lobby.location}, {capitalize(props.lobby.mode)} mode</div>
			<div>{getTimeElapsedString(props.lobby.timeElapsed)}</div>
			<div style={{display: "flex", justifyContent: "space-evenly", height: props.cardSize * 0.7, backgroundColor: getShade(2), padding: props.cardMargin, margin: props.cardMargin, marginTop: props.cardMargin/2, borderRadius: props.cardMargin/2}}>
			{
				systemInfo.isDefined ? (
					systemInfo.get.factions.map(faction => {
						return <div key={faction.hue} style={{width: props.cardSize/4, height: "100%", backgroundColor: getShadeFromHue(faction.hue, 0), borderRadius: props.cardMargin/2, opacity: 0.7, overflow: "clip"}}>
							<div style={{color: "white", fontSize: props.cardSize/30, fontWeight: "bold", whiteSpace: "nowrap", backgroundColor: getShadeFromHue(faction.hue, 2), paddingTop: props.cardSize/200, marginBottom: props.cardSize/200}}>
								<div>{abbreviate(faction.name, 14)}</div>
								<div style={{paddingBottom: props.cardSize/200}}>Level {faction.baseLevel}</div>
								<div style={{height: props.cardSize/200, width: `${100 * faction.baseProgress / (400*(Math.pow(2,faction.baseLevel)))}%`, backgroundColor: "white"}}></div>
							</div>
							{
								systemInfo.get.players.filter(player => player.hue === faction.hue).map((player, index) => {
									return <div key={index} style={{color: "white", fontSize: Math.min(props.cardSize/40, 16), whiteSpace: "nowrap"}}>{player.name}</div>
								})
							}
						</div>
					})
				) : (
					<LoadingSpinner/>
				)
			}
			</div>
		</a>
	</div>
}