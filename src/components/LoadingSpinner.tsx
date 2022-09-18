import { useEffect, useRef } from "react"
import { option } from "ts-option"

interface Props {
	color: string,
	lineWidth: number
}

const defaultProps = {
	color: "white",
	lineWidth: 2
}

function LoadingSpinner(props: Props) {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const frameRequestRef = useRef<number>()
	const startTimeRef = useRef<number>(new Date().getTime() / 1000)

	function refresh() {
		const t = (new Date().getTime()/1000 - startTimeRef.current)

		if (option(canvasRef.current).isDefined) {
			const canvasWidth = option(canvasRef.current).get.width
			const canvasHeight = option(canvasRef.current).get.height
			
			const canvasContext = option(option(canvasRef.current).get.getContext("2d")).get
			canvasContext.clearRect(0, 0, canvasWidth, canvasHeight)
			canvasContext.lineWidth = props.lineWidth
			canvasContext.strokeStyle = props.color
	
			const startAngle = 2 * Math.PI * ((t*1.5) % 1)
			const endAngle = 2 * Math.PI * ((t*1.5 + 0.5) % 1)
	
			canvasContext.beginPath()
			canvasContext.arc(canvasWidth/2, canvasHeight/2, (Math.min(canvasWidth, canvasHeight) - props.lineWidth)/2, startAngle, endAngle)
			canvasContext.stroke()
		}

		frameRequestRef.current = window.requestAnimationFrame(refresh)
	}

	useEffect(() => {
		option(canvasRef.current).get.width = option(canvasRef.current).get.clientWidth
		option(canvasRef.current).get.height = option(canvasRef.current).get.clientHeight

		frameRequestRef.current = window.requestAnimationFrame(refresh)
		return (() => window.cancelAnimationFrame(option(frameRequestRef.current).get))
	}, [])

	return <canvas ref={canvasRef} style={{width: "100%", height: "100%"}}/>
}

LoadingSpinner.defaultProps = defaultProps

export default LoadingSpinner
