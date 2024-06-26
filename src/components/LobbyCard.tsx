import { useRef } from "react"
import { some } from "ts-option"
import Constants from "../Constants"
import useSystemInfo from "../hooks/useSystemInfo"
import { Lobby } from "../Types"
import { abbreviate, capitalize, getShade, getShadeFromHue, getTimeElapsedString } from "../Utilities"
import LoadingSpinner from "./LoadingSpinner"

interface Props {
	lobby: Lobby,
	cardSize: number,
	backgroundDarkness: number,
	fullPage: boolean
}

export default function LobbyCard(props: Props) {
	const card = useRef<HTMLDivElement>(null)
	const joinButton = useRef<HTMLAnchorElement>(null)
	const systemInfo = useSystemInfo(props.lobby, some(card))
	const cardMargin = props.cardSize/40

	function getDisplayName(name: string) {
		if (name.startsWith("[TT6]")) {
			return <span><span style={{animation: "flashing-teal 0.5s alternate infinite"}}>[TT6]</span>{name.replace("[TT6]", "")}</span>
		} else {
			return <span>{name}</span>
		}
	}

	return <div ref={card} style={{position: "relative", fontSize: props.cardSize/25, listStyleType: "none", width: props.cardSize, height: props.fullPage ? undefined : props.cardSize, backgroundColor: getShade(props.backgroundDarkness), borderRadius: cardMargin, display: "flex", flexDirection: "column", textAlign: "center"}}>
		{
			props.fullPage ? (
				undefined
			) : (
				<a href={`/${props.lobby.id}`} style={{zIndex: 1, position: "absolute", top: 0, left: 0, bottom: 0, right: 0}}/>
			)
		}
		<div style={{fontWeight: "bold", fontSize: props.cardSize/15}}>{props.lobby.id}</div>
		<div>{props.lobby.location}, {capitalize(props.lobby.mode)} mode</div>
		<div>{getTimeElapsedString(props.lobby.timeElapsed)}</div>
		<div style={{display: "flex", justifyContent: "space-evenly", height: props.fullPage ? undefined : props.cardSize * 0.64, backgroundColor: getShade(2), padding: cardMargin, margin: cardMargin, marginTop: cardMargin/2, borderRadius: cardMargin/2, overflow: "clip"}}>
			{
				systemInfo.isDefined ? (
					systemInfo.get.factions.map(faction => {
						return <div key={faction.hue} style={{width: props.cardSize/4, height: "100%", backgroundColor: getShadeFromHue(faction.hue, 0), borderRadius: cardMargin/2, opacity: 0.7, overflow: "clip"}}>
							<div style={{color: "white", fontSize: Math.min(props.cardSize, 700)/30, fontWeight: "bold", whiteSpace: "nowrap", backgroundColor: getShadeFromHue(faction.hue, 2), paddingTop: props.cardSize/200}}>
								<div>{abbreviate(faction.name, 14)}</div>
								<div style={{paddingBottom: props.cardSize/200}}>Level {faction.baseLevel}</div>
								<div style={{height: props.cardSize/200, width: `${100 * faction.baseProgress / (400*(Math.pow(2,faction.baseLevel)))}%`, backgroundColor: "white"}}></div>
							</div>
							{
								systemInfo.get.players.filter(player => player.hue === faction.hue).map((player, index) => {
									return <div key={index} style={{color: "white", fontSize: Math.min(props.cardSize, 700)/40, whiteSpace: "nowrap", overflow: "clip", height: Math.min(props.cardSize, 700)/27, backgroundColor: getShadeFromHue(player.hue, index % 2 == 0 ? 0 : 0.75)}}>
										{
											props.fullPage ? (
												<div style={{display: "flex", justifyContent: "space-between", height: "100%"}}>
													<div style={{paddingLeft: props.cardSize/300, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center"}}>{getDisplayName(player.name)}</div>
													<div style={{paddingRight: props.cardSize/300, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center"}}>{player.score}</div>
												</div>
											) : (
												<div style={{height: "100%"}}>{getDisplayName(player.name)}</div>
											)
										}
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
		<a ref={joinButton} href={`https://starblast.io/#${props.lobby.id}`} style={{zIndex: 2, backgroundColor: Constants.joinButtonColor, borderRadius: props.cardSize/80, marginLeft: props.cardSize/40, marginRight: props.cardSize/40, marginBottom: props.cardSize/40}}><b>JOIN</b></a>
	</div>
}