import Constants from "../Constants"
import usePersistentState from "../hooks/usePersistentState"
import { getShade } from "../Utilities"
import sha256 from "crypto-js/sha256"
import Base64 from "crypto-js/enc-base64"

interface Props {
}

export default function PasscodeFilter(props: React.PropsWithChildren<Props>) {
	const [passcode, setPasscode] = usePersistentState<string>("", "passcode")

	if (Base64.stringify(sha256(passcode)) === Constants.hashedPasscode) {
		return <div>
			{props.children}
		</div>
	} else {
		return <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: 400}}>
			<h2>Passcode:</h2>
			<div style={{borderStyle: "solid", borderColor: getShade(0), borderWidth: 4, borderRadius: 4}}>
				<input type="text" value={passcode} onChange={e => setPasscode(e.target.value)} style={{fontSize: "large", borderStyle: "none", padding: "10pt", color: Constants.textColor, backgroundColor: getShade(0)}}/>
			</div>
		</div>
	}
}