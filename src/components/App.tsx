import { getShade, isMobile } from '../Utilities'
import SystemBrowser from './SystemBrowser'

function App() {
  return (
    <div className="App" style={{backgroundColor: getShade(1)}}>
		<div style={{margin: "0 auto", maxWidth: isMobile() ? undefined : "1000pt", userSelect: "none"}}>
			<SystemBrowser/>
		</div>
    </div>
  );
}

export default App;
