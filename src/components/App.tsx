import { getShade, isMobile } from '../Utilities'
import LobbyBrowser from './LobbyBrowser'

function App() {
  return (
    <div className="App" style={{backgroundColor: getShade(1)}}>
		<div style={{margin: "0 auto", maxWidth: isMobile() ? undefined : "1000pt", userSelect: "none", overflow: "hidden"}}>
			<LobbyBrowser/>
		</div>
    </div>
  );
}

export default App;
