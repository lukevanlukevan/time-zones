"use client"

import { useState } from "react"

const TIMEZONE_OPTIONS = [
	{ value: "PST", label: "Pacific Time (PT/PST)", zone: "America/Los_Angeles" },
	{ value: "MST", label: "Mountain Time (MT/MST)", zone: "America/Denver" },
	{ value: "CST", label: "Central Time (CT/CST)", zone: "America/Chicago" },
	{ value: "EST", label: "Eastern Time (ET/EST)", zone: "America/New_York" },
	{ value: "GMT", label: "Greenwich Mean Time (GMT)", zone: "GMT" },
	{ value: "BST", label: "British Time (BST)", zone: "Europe/London" },
	{ value: "CET", label: "Central European Time (CET)", zone: "Europe/Paris" },
	{ value: "IST", label: "India Standard Time (IST)", zone: "Asia/Kolkata" },
	{ value: "JST", label: "Japan Standard Time (JST)", zone: "Asia/Tokyo" },
	{ value: "AEST", label: "Australian Eastern Time (AEST)", zone: "Australia/Sydney" },
	{ value: "NZST", label: "New Zealand Time (NZST)", zone: "Pacific/Auckland" },
]

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
	const [timeInput, setTimeInput] = useState("")
	const [selectedZone, setSelectedZone] = useState(TIMEZONE_OPTIONS[0].value)
	const [timeInfo, setTimeInfo] = useState(null)

	const handleSubmit = (e) => {
		e.preventDefault()

		// Parse 24-hour format HH:mm
		const match = timeInput.match(/^([0-9]{1,2}):?([0-9]{2})?$/)
		if (!match) return

		const [_, hours, minutes = "00"] = match
		const targetDate = new Date()
		targetDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)

		const timezone = TIMEZONE_OPTIONS.find((tz) => tz.value === selectedZone)
		const targetTZ = new Date(targetDate.toLocaleString("en-US", { timeZone: timezone.zone }))
		const localTime = new Date()
		const timeDiff = targetTZ - localTime

		setTimeInfo({
			local: localTime.toLocaleTimeString(),
			target: targetTZ.toLocaleTimeString(),
			diff: Math.round(timeDiff / (1000 * 60)),
			inputTime: `${hours}:${minutes} ${selectedZone}`,
		})
	}

	return (
		<div className="min-h-screen p-8 flex flex-col items-center gap-8">
			<h1 className="text-2xl font-bold">Timezone Converter</h1>

			<form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
				<div className="flex flex-col gap-1">
					<label htmlFor="time-input" className="text-sm text-gray-600">
						Time (24h format)
					</label>
					<input
						id="time-input"
						type="text"
						value={timeInput}
						onChange={(e) => setTimeInput(e.target.value)}
						placeholder="14:00"
						className="px-4 py-2 border rounded form-input bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>

				<div className="flex flex-col gap-1">
					<label htmlFor="timezone-select" className="text-sm text-gray-600">
						Timezone
					</label>
					<select
						id="timezone-select"
						value={selectedZone}
						onChange={(e) => setSelectedZone(e.target.value)}
						className="px-4 py-2 border rounded form-select bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						{TIMEZONE_OPTIONS.map((tz) => (
							<option key={tz.value} value={tz.value}>
								{tz.label}
							</option>
						))}
					</select>
				</div>

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

