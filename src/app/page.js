"use client"

import { useState } from "react"

function Clock({ label, time }) {
	return (
		<div className="flex flex-col items-center p-4 border rounded-lg">
			<div className="text-sm text-gray-600">{label}</div>
			<div className="text-2xl font-mono">{time}</div>
		</div>
	)
}

function formatTimeDifference(minutes) {
	const absMinutes = Math.abs(minutes)
	const hours = Math.floor(absMinutes / 60)
	const mins = absMinutes % 60

	const timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`

	return minutes < 0 ? `was ${timeStr} ago` : `is in ${timeStr}`
}

export default function Home() {
	const [targetTime, setTargetTime] = useState("")
	const [timeInfo, setTimeInfo] = useState(null)

	const handleSubmit = (e) => {
		e.preventDefault()

		// Simple parsing of format "12PM PST"
		const match = targetTime.match(/(\d+)(AM|PM)\s+(PST|PT|ET|EST|GMT)/i)
		if (!match) return

		const [_, hour, meridiem, timezone] = match
		const timeZones = {
			PST: "America/Los_Angeles",
			EST: "America/New_York",
			ET: "America/New_York",
			PT: "America/Los_Angeles",
			GMT: "GMT",
		}

		const targetDate = new Date()
		let targetHour = parseInt(hour)
		if (meridiem.toUpperCase() === "PM" && targetHour !== 12) targetHour += 12
		if (meridiem.toUpperCase() === "AM" && targetHour === 12) targetHour = 0

		targetDate.setHours(targetHour, 0, 0, 0)

		const targetTZ = new Date(targetDate.toLocaleString("en-US", { timeZone: timeZones[timezone.toUpperCase()] }))
		const localTime = new Date()
		const timeDiff = targetTZ - localTime

		setTimeInfo({
			local: localTime.toLocaleTimeString(),
			target: targetTZ.toLocaleTimeString(),
			diff: Math.round(timeDiff / (1000 * 60)), // in minutes
		})
	}

	return (
		<div className="min-h-screen p-8 flex flex-col items-center gap-8">
			<h1 className="text-2xl font-bold">Timezone Converter</h1>

			<form onSubmit={handleSubmit} className="flex gap-4">
				<input
					type="text"
					value={targetTime}
					onChange={(e) => setTargetTime(e.target.value)}
					placeholder="12PM PST"
					className="px-4 py-2 border rounded form-input placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
				/>
				<button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
					Convert
				</button>
			</form>
			<div>
				{timeInfo && (
					<div className="flex gap-8 flex-wrap justify-center">
						<Clock label="Your Time" time={timeInfo.local} />
						<Clock label="Target Time" time={timeInfo.target} />
						<div className="flex flex-col items-center p-4 border rounded-lg">
							<div className="text-sm text-gray-600">Time Difference</div>
							<div className="text-2xl font-mono">
								{Math.floor(Math.abs(timeInfo.diff) / 60)}h {Math.abs(timeInfo.diff) % 60}m
							</div>
						</div>
					</div>
				)}
			</div>

			{timeInfo && <Clock label="Target Time" time={formatTimeDifference(timeInfo.diff)} />}
		</div>
	)
}

