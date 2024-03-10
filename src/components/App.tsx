import Constants from '../Constants';
import { getShade, isMobile } from '../Utilities'
import LobbyRoutes from './LobbyRoutes';
import PasscodeFilter from './PasscodeFilter';

function App() {
	return (
		<div className="App" style={{backgroundColor: getShade(1), color: Constants.textColor}}>
			<div style={{margin: "0 auto", maxWidth: isMobile() ? undefined : Constants.maxWidth, overflow: "hidden"}}>
				<PasscodeFilter>
					<LobbyRoutes/>
				</PasscodeFilter>
			</div>
		</div>
	)
}

export default App;
