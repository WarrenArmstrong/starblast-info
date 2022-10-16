import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { getShade, isMobile } from '../Utilities'
import LobbyBrowser from './LobbyBrowser'
import LobbyPage from './LobbyPage'
import { Option } from 'ts-option'
import { Lobby } from '../Types'
import useLobbies from '../hooks/useLobbies'
import Constants from '../Constants'

function App() {
	const lobbies: Option<Array<Lobby>> = useLobbies("lobbyBrowser.lobbies")

	return (
	<div className="App" style={{backgroundColor: getShade(1), color: Constants.textColor}}>
		<div style={{margin: "0 auto", maxWidth: isMobile() ? undefined : Constants.maxWidth, userSelect: "none", overflow: "hidden"}}>
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
		</div>
	</div>
  );
}

export default App;
