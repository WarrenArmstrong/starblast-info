import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LobbyBrowser from './LobbyBrowser'
import LobbyPage from './LobbyPage'
import { Option } from 'ts-option'
import { Lobby } from '../Types'
import useLobbies from '../hooks/useLobbies'

function LobbyRoutes() {
	const lobbies: Option<Array<Lobby>> = useLobbies("lobbyBrowser.lobbies")

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={
					<LobbyBrowser lobbies={lobbies}/>
				}/>
				<Route path="/:lobbyId" element={
					<LobbyPage lobbies={lobbies}/>
				}/>
			</Routes>
		</BrowserRouter>
	)
}

export default LobbyRoutes
